import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateTechnicalAnswer as aiEvalTech } from '../services/aiService.js';
import { randomUUID } from 'crypto';

export const getTechnicalQuestion = async (req, res, next) => {
    try {
        const { role = 'Software Developer', difficulty = 'Intermediate', topic, previousQuestions = [] } = req.body;

        const question = await generateQuestion({
            round: 'technical',
            role,
            difficulty,
            topic,
            previousQuestions
        });

        return res.json({ success: true, question });
    } catch (err) {
        next(err);
    }
};

export const evaluateTechnicalAnswer = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const {
            interviewId,
            questionText,
            answerText,
            role = 'Software Developer',
            difficulty = 'Intermediate',
            timeTakenSeconds = 0
        } = req.body;

        if (!interviewId || !questionText || !answerText) {
            return res.status(400).json({ success: false, error: 'interviewId, questionText, and answerText are required.' });
        }

        const evaluation = await aiEvalTech({
            question: questionText,
            answer: answerText,
            role,
            difficulty
        });

        const answerRecord = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'technical',
            question_id: 'tech-dyn-' + Date.now(),
            question_text: questionText,
            user_answer: answerText,
            score: evaluation.score || 75,
            ai_evaluation: evaluation,
            time_taken_seconds: timeTakenSeconds,
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('interview_answers')
                    .insert([answerRecord])
                    .select()
                    .single();

                if (!error && data) return res.json({ success: true, evaluation, answer: data });
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
