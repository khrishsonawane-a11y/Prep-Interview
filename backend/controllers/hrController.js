import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateHRAnswer as aiEvalHR } from '../services/aiService.js';
import { randomUUID } from 'crypto';

const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const getHRQuestions = async (req, res, next) => {
    try {
        const { count = 30, role = 'Software Developer', difficulty = 'Intermediate', category } = { ...req.query, ...req.body };
        const limit = Math.min(35, Math.max(1, parseInt(count, 10) || 30));

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('hr_questions')
                    .select('*')
                    .limit(100);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    let candidates = data;
                    if (category) {
                        const catMatches = candidates.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
                        if (catMatches.length > 0) candidates = catMatches;
                    }
                    const shuffled = shuffleArray(candidates);
                    return res.json({ success: true, questions: shuffled.slice(0, limit) });
                }
                if (error) {
                    console.warn('[Supabase Notice] hr_questions query:', error.message);
                }
            } catch (supErr) {
                console.warn('[Supabase Exception] hr_questions:', supErr.message);
            }
        }

        let questions = [...mockStore.hrQuestions];
        if (category) {
            const catFiltered = questions.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
            if (catFiltered.length > 0) questions = catFiltered;
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

export const getHRQuestion = async (req, res, next) => {
    try {
        const { role = 'Software Developer', difficulty = 'Intermediate', category, previousQuestions = [], dynamicAI = false } = req.body || {};

        if (dynamicAI === true || dynamicAI === 'true') {
            const aiQ = await generateQuestion({
                round: 'hr',
                role,
                difficulty,
                topic: category,
                previousQuestions
            });
            return res.json({ success: true, question: aiQ });
        }

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('hr_questions')
                    .select('*')
                    .limit(100);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    let candidates = data;
                    if (category) {
                        const catMatches = candidates.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
                        if (catMatches.length > 0) candidates = catMatches;
                    }

                    const unasked = candidates.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
                    const pool = unasked.length > 0 ? unasked : candidates;
                    const shuffled = shuffleArray(pool);
                    return res.json({ success: true, question: shuffled[0] });
                }
                if (error) {
                    console.warn('[Supabase Notice] single hr_question query:', error.message);
                }
            } catch (supErr) {
                console.warn('[Supabase Exception] single hr_question:', supErr.message);
            }
        }

        let questions = [...mockStore.hrQuestions];
        if (category) {
            const catFiltered = questions.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
            if (catFiltered.length > 0) questions = catFiltered;
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

export const evaluateHRAnswer = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
        const {
            interviewId,
            questionText,
            answerText,
            role = 'Software Developer',
            topic = 'Behavioral',
            reference_answer = '',
            is_skipped = false,
            viewed_answer = false,
            voiceMetrics,
            timeTakenSeconds = 0
        } = req.body || {};

        if (!interviewId || !questionText || !answerText) {
            return res.status(400).json({ success: false, error: 'interviewId, questionText, and answerText are required.' });
        }

        const isSkipped = is_skipped === true || answerText.trim() === '[SKIPPED]';

        const evaluation = await aiEvalHR({
            question: questionText,
            answer: answerText,
            role,
            voiceMetrics
        });

        const score = isSkipped ? 0 : (evaluation.score || 80);
        const isCorrect = !isSkipped && score >= 60;
        const errorType = isSkipped ? 'Did Not Answer' : (evaluation.error_type || (score >= 80 ? 'None (Strong Communication)' : 'Incomplete Answer'));

        const dbAnswer = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'hr',
            question_id: 'hr-' + Date.now(),
            question_text: questionText,
            user_answer: answerText,
            code_language: null,
            is_correct: isCorrect,
            score: score,
            ai_evaluation: {
                ...evaluation,
                topic: topic || 'Behavioral',
                reference_answer: reference_answer || 'STAR structured response emphasizing Situation, Task, Action, and Result.',
                is_skipped: isSkipped,
                viewed_answer: Boolean(viewed_answer),
                score: score,
                error_type: errorType,
                voiceMetrics: voiceMetrics || null
            },
            time_taken_seconds: Number(timeTakenSeconds) || 0,
            created_at: new Date().toISOString()
        };

        if (!isMock && isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('interview_answers')
                    .insert([dbAnswer])
                    .select()
                    .single();

                if (error) {
                    console.error('[Supabase Error] evaluateHRAnswer insert:', error.message);
                    return res.status(500).json({ success: false, error: 'Failed to record HR evaluation in database: ' + error.message });
                }

                return res.json({ success: true, evaluation, answer: data });
            } catch (supErr) {
                console.error('[Supabase Exception] evaluateHRAnswer:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database exception during HR evaluation.' });
            }
        }

        mockStore.answers.set(dbAnswer.id, dbAnswer);
        return res.json({ success: true, evaluation, answer: dbAnswer });
    } catch (err) {
        next(err);
    }
};

export default {
    getHRQuestion,
    getHRQuestions,
    evaluateHRAnswer
};
