import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion } from '../services/aiService.js';
import { randomUUID } from 'crypto';

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
        const { count = 30, difficulty = 'Intermediate', topic, dynamicAI = false, role = 'Software Developer' } = req.query;
        const limit = Math.min(35, Math.max(1, parseInt(count, 10) || 30));

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
        const {
            interviewId,
            questionId,
            questionText,
            selectedOptionIndex,
            correctOptionIndex,
            explanation,
            reference_answer,
            topic = 'Quantitative',
            is_skipped = false,
            viewed_answer = false,
            timeTakenSeconds = 0
        } = req.body || {};

        const isSkipped = is_skipped === true || selectedOptionIndex === -1 || selectedOptionIndex === undefined;
        const isCorrect = !isSkipped && selectedOptionIndex === correctOptionIndex;
        const score = isSkipped ? 0 : (isCorrect ? 100 : 0);

        const errorType = isSkipped ? 'Did Not Answer' : (isCorrect ? 'None (Correct)' : 'Calculation / Logic Mistake');

        const answerRecord = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'aptitude',
            question_id: questionId || 'apt-' + Date.now(),
            question_text: questionText,
            topic: topic || 'Quantitative',
            user_answer: isSkipped ? '[SKIPPED]' : `Option ${selectedOptionIndex + 1}`,
            reference_answer: reference_answer || `Option ${correctOptionIndex + 1}: ${explanation || ''}`,
            is_correct: isCorrect,
            is_skipped: isSkipped,
            viewed_answer: Boolean(viewed_answer),
            score: score,
            error_type: errorType,
            ai_evaluation: {
                correctness: isSkipped ? 'Skipped' : (isCorrect ? 'Correct' : 'Incorrect'),
                error_type: errorType,
                explanation: explanation || 'Standard deductive calculation',
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
