import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateCodingSubmission as aiEvalCode } from '../services/aiService.js';
import { randomUUID } from 'crypto';

const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
}

export const getCodingQuestions = async (req, res, next) => {
    try {
        const { count = 30, role = 'Software Developer', difficulty = 'Intermediate', topic } = { ...req.query, ...req.body };
        const limit = Math.min(35, Math.max(1, parseInt(count, 10) || 30));

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('coding_questions')
                    .select('id, title, role, topic, difficulty, description, examples, constraints, starter_code, test_cases, created_at')
                    .limit(100);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    let candidates = data.map(chosen => ({
                        ...chosen,
                        test_cases: (chosen.test_cases || []).filter(tc => !tc.is_hidden)
                    }));
                    if (topic) {
                        const topicMatches = candidates.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
                        if (topicMatches.length > 0) candidates = topicMatches;
                    }
                    const shuffled = shuffleArray(candidates);
                    return res.json({ success: true, problems: shuffled.slice(0, limit) });
                }
                if (error) {
                    console.warn('[Supabase Notice] coding_questions query:', error.message);
                }
            } catch (supErr) {
                console.warn('[Supabase Exception] coding_questions:', supErr.message);
            }
        }

        let problems = mockStore.codingQuestions.map(mockP => ({
            ...mockP,
            test_cases: (mockP.test_cases || []).filter(tc => !tc.is_hidden)
        }));
        if (topic) {
            const topicMatches = problems.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
            if (topicMatches.length > 0) problems = topicMatches;
        }

        const shuffled = shuffleArray(problems);
        return res.json({
            success: true,
            problems: shuffled.slice(0, limit)
        });
    } catch (err) {
        next(err);
    }
};

export const getCodingQuestion = async (req, res, next) => {
    try {
        const { role = 'Software Developer', difficulty = 'Intermediate', topic, previousQuestions = [], dynamicAI = false } = req.body || {};

        if (dynamicAI === true || dynamicAI === 'true') {
            const aiProblem = await generateQuestion({
                round: 'coding',
                role,
                difficulty,
                topic,
                previousQuestions
            });
            const visibleCases = (aiProblem.test_cases || []).filter(tc => !tc.is_hidden);
            return res.json({
                success: true,
                problem: {
                    ...aiProblem,
                    test_cases: visibleCases
                }
            });
        }

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('coding_questions')
                    .select('id, title, role, topic, difficulty, description, examples, constraints, starter_code, test_cases, created_at')
                    .limit(100);

                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    let candidates = data;
                    if (topic) {
                        const topicMatches = candidates.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
                        if (topicMatches.length > 0) candidates = topicMatches;
                    }

                    const unasked = candidates.filter(q => !previousQuestions.includes(q.title) && !previousQuestions.includes(q.id));
                    const pool = unasked.length > 0 ? unasked : candidates;
                    const shuffled = shuffleArray(pool);
                    const chosen = shuffled[0];

                    const visibleCases = (chosen.test_cases || []).filter(tc => !tc.is_hidden);
                    return res.json({
                        success: true,
                        problem: {
                            ...chosen,
                            test_cases: visibleCases
                        }
                    });
                }
                if (error) {
                    console.warn('[Supabase Notice] single coding_question query:', error.message);
                }
            } catch (supErr) {
                console.warn('[Supabase Exception] single coding_question:', supErr.message);
            }
        }

        let problems = [...mockStore.codingQuestions];
        if (topic) {
            const topicMatches = problems.filter(q => q.topic && q.topic.toLowerCase() === topic.toLowerCase());
            if (topicMatches.length > 0) problems = topicMatches;
        }

        const unasked = problems.filter(q => !previousQuestions.includes(q.title) && !previousQuestions.includes(q.id));
        const pool = unasked.length > 0 ? unasked : problems;
        const shuffled = shuffleArray(pool);
        const mockP = shuffled[0] || mockStore.codingQuestions[0];

        return res.json({
            success: true,
            problem: {
                ...mockP,
                test_cases: (mockP.test_cases || []).filter(tc => !tc.is_hidden)
            }
        });
    } catch (err) {
        next(err);
    }
};

export const runCode = async (req, res, next) => {
    // Retained for API route compatibility
    return res.json({ success: true, message: "Run/Test execution disabled. Submit code directly for evaluation." });
};

export const submitCode = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
        const {
            interviewId,
            problem,
            code,
            explanation = '',
            is_skipped = false,
            viewed_answer = false,
            timeTakenSeconds = 0
        } = req.body || {};

        if (!interviewId || !problem || !code) {
            return res.status(400).json({ success: false, error: 'interviewId, problem, and code are required.' });
        }

        const isSkipped = is_skipped === true || code.trim() === '// [SKIPPED]';
        const lang = 'cpp';

        const matching = mockStore.codingQuestions.find(q => q.id === problem.id || q.title === problem.title);

        const aiReview = await aiEvalCode({
            problem: matching || problem,
            code,
            explanation,
            language: lang
        });

        const isCorrect = isSkipped ? false : (aiReview.status === 'Correct' && aiReview.is_correct === true);
        const isPartiallyCorrect = isSkipped ? false : (aiReview.status === 'Partially Correct');
        const score = isSkipped ? 0 : Number(aiReview.score || (isCorrect ? 95 : (isPartiallyCorrect ? 55 : 20)));
        const errorType = isSkipped ? 'Did Not Answer' : (aiReview.error_type || (isCorrect ? 'None (Correct)' : 'Wrong Logic'));

        const dbAnswer = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'coding',
            question_id: problem.id || 'code-1',
            question_text: `${problem.title}: ${(problem.description || '').slice(0, 120)}...`,
            user_answer: code,
            code_language: 'cpp',
            is_correct: isCorrect,
            score: score,
            ai_evaluation: {
                ...aiReview,
                topic: problem.topic || 'DSA Algorithms',
                user_explanation: explanation || '',
                reference_answer: (matching?.solution_code?.cpp) || matching?.approach || 'Optimal C++ reference implementation',
                is_partially_correct: isPartiallyCorrect,
                is_skipped: isSkipped,
                viewed_answer: Boolean(viewed_answer),
                is_correct: isCorrect,
                score: score,
                status: isSkipped ? 'Did Not Answer' : aiReview.status,
                error_type: errorType,
                hint: aiReview.hint || matching?.approach || 'Check problem constraints and step-by-step logic.',
                correct_approach: aiReview.correct_approach || matching?.algorithm_explanation || matching?.approach || 'Optimal algorithmic approach.'
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
                    console.error('[Supabase Error] submitCode insert failed:', error.message);
                    return res.status(500).json({ success: false, error: 'Failed to record coding evaluation in database: ' + error.message });
                }

                return res.json({ success: true, evaluation: aiReview, answer: data });
            } catch (supErr) {
                console.error('[Supabase Exception] submitCode:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database exception during coding submission.' });
            }
        }

        mockStore.answers.set(dbAnswer.id, dbAnswer);
        return res.json({ success: true, evaluation: aiReview, answer: dbAnswer });
    } catch (err) {
        next(err);
    }
};

export default {
    getCodingQuestion,
    getCodingQuestions,
    runCode,
    submitCode
};
