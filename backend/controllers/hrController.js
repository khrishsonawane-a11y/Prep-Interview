import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateHRAnswer as aiEvalHR } from '../services/aiService.js';
import { randomUUID } from 'crypto';

/**
 * Fisher-Yates shuffle algorithm to ensure uniform random distribution
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

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

        // 1. Try fetching from Supabase Question Bank if configured
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

                    // Exclude already asked questions in this session
                    const unasked = candidates.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
                    const pool = unasked.length > 0 ? unasked : candidates;
                    const shuffled = shuffleArray(pool);
                    return res.json({ success: true, question: shuffled[0] });
                }
            } catch (supErr) {
                console.warn('Supabase HR questions fallback:', supErr.message);
            }
        }

        // 2. Mock Store Fallback with 30+ Questions Pool
        let questions = [...mockStore.hrQuestions];
        if (category) {
            const catFiltered = questions.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
            if (catFiltered.length > 0) questions = catFiltered;
        }

        // Exclude previous questions in the active interview session
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
        const userId = req.user?.id || 'candidate-' + Date.now();
        const {
            interviewId,
            questionText,
            answerText,
            role = 'Software Developer',
            voiceMetrics,
            timeTakenSeconds = 0
        } = req.body || {};

        if (!interviewId || !questionText || !answerText) {
            return res.status(400).json({ success: false, error: 'interviewId, questionText, and answerText are required.' });
        }

        const evaluation = await aiEvalHR({
            question: questionText,
            answer: answerText,
            role,
            voiceMetrics
        });

        const score = evaluation.score || 80;
        const isCorrect = score >= 60;

        const answerRecord = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'hr',
            question_id: 'hr-dyn-' + Date.now(),
            question_text: questionText,
            user_answer: answerText,
            is_correct: isCorrect,
            score: score,
            ai_evaluation: {
                ...evaluation,
                voiceMetrics: voiceMetrics || null
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
                console.warn('Supabase HR evaluate fallback:', supErr.message);
            }
        }

        mockStore.answers.set(answerRecord.id, answerRecord);
        return res.json({ success: true, evaluation, answer: answerRecord });
    } catch (err) {
        next(err);
    }
};

export default {
    getHRQuestion,
    evaluateHRAnswer
};
