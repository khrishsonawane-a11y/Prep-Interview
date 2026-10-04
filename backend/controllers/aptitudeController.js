import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion } from '../services/aiService.js';
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

export const getAptitudeQuestions = async (req, res, next) => {
    try {
        const { count = 5, difficulty = 'Intermediate', topic, dynamicAI = false, role = 'Software Developer' } = req.query;
        const limit = Math.min(35, Math.max(1, parseInt(count, 10) || 5));

        if (dynamicAI === 'true') {
            const aiQ = await generateQuestion({
                round: 'aptitude',
                role,
                difficulty,
                topic
            });
            return res.json({ success: true, questions: [aiQ] });
        }

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('aptitude_questions')
                    .select('*')
                    .limit(100);

                if (topic) query = query.eq('topic', topic);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    const shuffled = shuffleArray(data);
                    return res.json({ success: true, questions: shuffled.slice(0, limit) });
                }
            } catch (supErr) {
                console.warn('Supabase questions fallback:', supErr.message);
            }
        }

        // Mock store fallback with 35+ question pool
        let questions = [...mockStore.aptitudeQuestions];
        if (topic) {
            questions = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
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

export const submitAptitudeAnswer = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'candidate-' + Date.now();
        const { interviewId, questionId, questionText, selectedOptionIndex, correctOptionIndex, explanation, timeTakenSeconds = 0 } = req.body || {};

        const isCorrect = selectedOptionIndex === correctOptionIndex;
        const score = isCorrect ? 100 : 0;

        const answerRecord = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'aptitude',
            question_id: questionId || 'apt-custom',
            question_text: questionText,
            user_answer: `Option index: ${selectedOptionIndex}`,
            is_correct: isCorrect,
            score: score,
            ai_evaluation: {
                correctness: isCorrect ? 'Correct' : 'Incorrect',
                explanation: explanation || 'Standard deduction',
                score: score
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

                    if (!error && data) return res.json({ success: true, isCorrect, score, answer: data });
                }
            } catch (supErr) {
                console.warn('Supabase answer insert fallback:', supErr.message);
            }
        }

        mockStore.answers.set(answerRecord.id, answerRecord);
        return res.json({ success: true, isCorrect, score, answer: answerRecord });
    } catch (err) {
        next(err);
    }
};

export default {
    getAptitudeQuestions,
    submitAptitudeAnswer
};
