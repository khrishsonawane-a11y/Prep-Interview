import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateQuestion, evaluateCodingSubmission as aiEvalCode } from '../services/aiService.js';
import { executeCode as runCodeService, submitCode as submitCodeService } from '../services/codeExecutionService.js';
import { randomUUID } from 'crypto';

export const getCodingQuestion = async (req, res, next) => {
    try {
        const { role = 'Software Developer', difficulty = 'Intermediate', topic = 'Arrays & Hash Maps' } = req.body;

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('coding_questions')
                    .select('id, title, role, topic, difficulty, description, examples, constraints, starter_code, solution_code, test_cases')
                    .limit(1);

                if (!error && data && data.length > 0) {
                    const p = data[0];
                    const visibleCases = (p.test_cases || []).filter(tc => !tc.is_hidden);
                    return res.json({
                        success: true,
                        problem: {
                            ...p,
                            test_cases: visibleCases
                        }
                    });
                }
            } catch (supErr) {}
        }

        // Return from mock problems
        const mockP = mockStore.codingQuestions[0];
        return res.json({
            success: true,
            problem: {
                ...mockP,
                test_cases: mockP.test_cases.filter(tc => !tc.is_hidden)
            }
        });
    } catch (err) {
        next(err);
    }
};

export const runCode = async (req, res, next) => {
    try {
        const { code, language = 'javascript', testCases = [], problemId } = req.body;

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
        const userId = req.user.id;
        const {
            interviewId,
            problem,
            code,
            language = 'javascript',
            timeTakenSeconds = 0
        } = req.body;

        if (!interviewId || !problem || !code) {
            return res.status(400).json({ success: false, error: 'interviewId, problem, and code are required.' });
        }

        let fullTestCases = problem.test_cases || [];
        if (fullTestCases.length === 0) {
            const matching = mockStore.codingQuestions.find(q => q.title === problem.title) || mockStore.codingQuestions[0];
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
                const { data, error } = await supabaseAdmin
                    .from('interview_answers')
                    .insert([answerRecord])
                    .select()
                    .single();

                if (!error && data) {
                    return res.json({ success: true, evaluation: aiReview, execution: executionResult, answer: data });
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
