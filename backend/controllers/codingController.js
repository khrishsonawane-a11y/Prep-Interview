import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateCodingSubmission as aiEvalCode } from '../services/aiService.js';
import { executeCode as runCodeService, submitCode as submitCodeService } from '../services/codeExecutionService.js';
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

        // 1. Try fetching from Supabase Question Bank if configured
        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
                    .from('coding_questions')
                    .select('id, title, role, topic, difficulty, description, examples, constraints, starter_code, solution_code, test_cases')
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
            } catch (supErr) {
                console.warn('Supabase coding questions fallback:', supErr.message);
            }
        }

        // 2. Mock Store Fallback with 30+ Coding Problems Pool
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
    try {
        const { code, language = 'javascript', testCases = [], problemId } = req.body || {};

        const runResult = await runCodeService({
            code,
            language,
            testCases,
            problemId
        });

        return res.json({ success: true, execution: runResult });
    } catch (err) {
        next(err);
    }
};

export const submitCode = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'candidate-' + Date.now();
        const {
            interviewId,
            problem,
            code,
            language = 'javascript',
            timeTakenSeconds = 0
        } = req.body || {};

        if (!interviewId || !problem || !code) {
            return res.status(400).json({ success: false, error: 'interviewId, problem, and code are required.' });
        }

        // Find complete problem including hidden test cases
        let fullTestCases = problem.test_cases || [];
        const matching = mockStore.codingQuestions.find(q => q.id === problem.id || q.title === problem.title);
        if (matching && matching.test_cases && matching.test_cases.length > 0) {
            fullTestCases = matching.test_cases;
        }

        const executionResult = await submitCodeService({
            code,
            language,
            testCases: fullTestCases,
            problemId: problem.id
        });

        const aiReview = await aiEvalCode({
            problem,
            code,
            language,
            testResults: executionResult.results || []
        });

        const answerRecord = {
            id: randomUUID(),
            interview_id: interviewId,
            user_id: userId,
            round_type: 'coding',
            question_id: problem.id || 'code-1',
            question_text: `${problem.title}: ${(problem.description || '').slice(0, 100)}...`,
            user_answer: code,
            code_language: language,
            is_correct: executionResult.isComplete,
            score: aiReview.score || (executionResult.isComplete ? 95 : 60),
            ai_evaluation: {
                ...aiReview,
                execution: executionResult
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

                    if (!error && data) {
                        return res.json({ success: true, evaluation: aiReview, execution: executionResult, answer: data });
                    }
                }
            } catch (supErr) {
                console.warn('Supabase code submit fallback:', supErr.message);
            }
        }

        mockStore.answers.set(answerRecord.id, answerRecord);
        return res.json({ success: true, evaluation: aiReview, execution: executionResult, answer: answerRecord });
    } catch (err) {
        next(err);
    }
};

export default {
    getCodingQuestion,
    runCode,
    submitCode
};
