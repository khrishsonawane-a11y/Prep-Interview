import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateTechnicalAnswer as aiEvalTech } from '../services/aiService.js';
import { randomUUID } from 'crypto';

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const getTechnicalQuestions = async (req, res, next) => {
    try {
        const { count = 30, role = 'Software Developer', difficulty = 'Intermediate', topic } = { ...req.query, ...req.body };
        const limit = Math.min(35, Math.max(1, parseInt(count, 10) || 30));

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('technical_questions')
                    .select('*')
                    .limit(100);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    let candidates = data;
                    if (topic) {
                        const topicMatches = candidates.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
                        if (topicMatches.length > 0) candidates = topicMatches;
                    }
                    const shuffled = shuffleArray(candidates);
                    return res.json({ success: true, questions: shuffled.slice(0, limit) });
                }
            } catch (supErr) {
                console.warn('Supabase technical questions batch fallback:', supErr.message);
            }
        }

        let questions = [...mockStore.technicalQuestions];
        if (topic) {
            const topicFiltered = questions.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
            if (topicFiltered.length > 0) questions = topicFiltered;
        }

        const shuffled = shuffleArray(questions);
        return res.json({
            success: true,
            questions: shuffled.slice(0, limit)
        });
    } catch (err) {
        next(err);
    }
};

export const getTechnicalQuestion = async (req, res, next) => {
    try {
        const { role = 'Software Developer', difficulty = 'Intermediate', topic, previousQuestions = [], dynamicAI = false } = req.body || {};

        if (dynamicAI === true || dynamicAI === 'true') {
            const aiQ = await generateQuestion({
                round: 'technical',
                role,
                difficulty,
                topic,
                previousQuestions
            });
            return res.json({ success: true, question: aiQ });
        }

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('technical_questions')
                    .select('*')
                    .limit(100);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    let candidates = data;
                    if (topic) {
                        const topicMatches = candidates.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
                        if (topicMatches.length > 0) candidates = topicMatches;
                    }

                    const unasked = candidates.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
                    const pool = unasked.length > 0 ? unasked : candidates;
                    const shuffled = shuffleArray(pool);
                    return res.json({ success: true, question: shuffled[0] });
                }
            } catch (supErr) {
                console.warn('Supabase technical questions fallback:', supErr.message);
            }
        }

        let questions = [...mockStore.technicalQuestions];
        if (topic) {
            const topicFiltered = questions.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
            if (topicFiltered.length > 0) questions = topicFiltered;
        }

        const unasked = questions.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
        const pool = unasked.length > 0 ? unasked : questions;
        const shuffled = shuffleArray(pool);

        return res.json({
            success: true,
            question: shuffled[0]
        });
    } catch (err) {
        next(err);
    }
};

export const evaluateTechnicalAnswer = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'candidate-' + Date.now();
        const {
            interviewId,
            questionText,
            answerText,
            role = 'Software Developer',
            difficulty = 'Intermediate',
            topic = 'Engineering Architecture',
            reference_answer = '',
            expected_concepts = [],
            is_skipped = false,
            viewed_answer = false,
            timeTakenSeconds = 0
        } = req.body || {};

        if (!interviewId || !questionText || !answerText) {
            return res.status(400).json({ success: false, error: 'interviewId, questionText, and answerText are required.' });
        }

        const isSkipped = is_skipped === true || answerText.trim() === '[SKIPPED]';

        const evaluation = await aiEvalTech({
            question: questionText,
            answer: answerText,
            role,
            difficulty,
            topic,
            reference_answer: reference_answer || req.body.expected_answer || req.body.sample_answer || '',
            expected_concepts: expected_concepts && expected_concepts.length > 0 ? expected_concepts : (req.body.concepts || [])
        });

        const score = isSkipped ? 0 : (evaluation.score !== undefined ? evaluation.score : 75);
        const isCorrect = !isSkipped && score >= 60;
        const errorType = isSkipped ? 'Did Not Answer' : (evaluation.error_type || (score >= 80 ? 'None (Correct)' : 'Concept Missing'));

        const answerRecord = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'technical',
            question_id: 'tech-' + Date.now(),
            question_text: questionText,
            topic: topic || 'Architecture',
            user_answer: answerText,
            reference_answer: evaluation.reference_answer || reference_answer || 'Key concepts and architectural trade-offs.',
            is_correct: isCorrect,
            is_skipped: isSkipped,
            viewed_answer: Boolean(viewed_answer),
            score: score,
            score_out_of_10: evaluation.score_out_of_10 !== undefined ? evaluation.score_out_of_10 : Math.round((score / 10) * 10) / 10,
            classification: evaluation.classification || (isCorrect ? 'Correct' : 'Partially Correct'),
            error_type: errorType,
            ai_evaluation: {
                ...evaluation,
                score,
                error_type: errorType
            },
            time_taken_seconds: timeTakenSeconds,
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
                if (isUuid) {
                    const { data, error } = await supabaseAdmin
                        .from('interview_answers')
                        .insert([answerRecord])
                        .select()
                        .single();

                    if (!error && data) return res.json({ success: true, evaluation, answer: data });
                }
            } catch (supErr) {
                console.warn('Supabase technical answer fallback:', supErr.message);
            }
        }

        mockStore.answers.set(answerRecord.id, answerRecord);
        return res.json({ success: true, evaluation, answer: answerRecord });
    } catch (err) {
        next(err);
    }
};

export default {
    getTechnicalQuestion,
    evaluateTechnicalAnswer
};
