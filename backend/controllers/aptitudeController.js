import { getDbClient, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion } from '../services/aiService.js';
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

        if (isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (db) {
                try {
                    let query = db
                        .from('aptitude_questions')
                        .select('*')
                        .limit(100);

                    if (topic) query = query.eq('topic', topic);

                    const { data, error } = await query;
                    if (!error && data && data.length > 0) {
                        const shuffled = shuffleArray(data);
                        return res.json({ success: true, questions: shuffled.slice(0, limit) });
                    }
                    if (error) {
                        console.warn('[Supabase Notice] aptitude_questions query:', error.message);
                    }
                } catch (supErr) {
                    console.warn('[Supabase Exception] aptitude_questions:', supErr.message);
                }
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
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
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

        if (!interviewId || !questionText) {
            return res.status(400).json({ success: false, error: 'interviewId and questionText are required.' });
        }

        const isSkipped = is_skipped === true || selectedOptionIndex === -1 || selectedOptionIndex === undefined;
        const isCorrect = !isSkipped && selectedOptionIndex === correctOptionIndex;
        const score = isSkipped ? 0 : (isCorrect ? 100 : 0);
        const errorType = isSkipped ? 'Did Not Answer' : (isCorrect ? 'None (Correct)' : 'Calculation / Logic Mistake');

        const dbAnswer = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'aptitude',
            question_id: questionId || 'apt-' + Date.now(),
            question_text: questionText,
            user_answer: isSkipped ? '[SKIPPED]' : `Option ${selectedOptionIndex + 1}`,
            code_language: null,
            is_correct: isCorrect,
            score: score,
            ai_evaluation: {
                topic: topic || 'Quantitative',
                selectedOptionIndex,
                correctOptionIndex,
                is_skipped: isSkipped,
                viewed_answer: Boolean(viewed_answer),
                reference_answer: reference_answer || `Option ${correctOptionIndex + 1}: ${explanation || ''}`,
                correctness: isSkipped ? 'Skipped' : (isCorrect ? 'Correct' : 'Incorrect'),
                error_type: errorType,
                explanation: explanation || 'Standard deductive calculation',
                score: score
            },
            time_taken_seconds: Number(timeTakenSeconds) || 0,
            created_at: new Date().toISOString()
        };

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                const { data, error } = await db
                    .from('interview_answers')
                    .insert([dbAnswer])
                    .select()
                    .single();

                if (error) {
                    console.error('[Supabase Error] submitAptitudeAnswer insert:', error.message);
                    return res.status(500).json({ success: false, error: 'Failed to save answer to database: ' + error.message });
                }

                return res.json({ success: true, isCorrect, score, answer: data });
            } catch (supErr) {
                console.error('[Supabase Exception] submitAptitudeAnswer:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database exception while saving answer: ' + supErr.message });
            }
        }

        mockStore.answers.set(dbAnswer.id, dbAnswer);
        return res.json({ success: true, isCorrect, score, answer: dbAnswer });
    } catch (err) {
        next(err);
    }
};

export default {
    getAptitudeQuestions,
    submitAptitudeAnswer
};
