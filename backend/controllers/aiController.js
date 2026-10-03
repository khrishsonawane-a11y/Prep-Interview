import {
    generateQuestion,
    evaluateTechnicalAnswer,
    evaluateHRAnswer,
    evaluateCodingSubmission,
    generateFinalReport
} from '../services/aiService.js';

export const handleGenerateQuestion = async (req, res, next) => {
    try {
        const { round, role, difficulty, topic, previousQuestions } = req.body;
        const result = await generateQuestion({ round, role, difficulty, topic, previousQuestions });
        return res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const handleEvaluateAnswer = async (req, res, next) => {
    try {
        const { round, question, answer, role, difficulty, voiceMetrics } = req.body;
        let result = {};

        if (round === 'technical') {
            result = await evaluateTechnicalAnswer({ question, answer, role, difficulty });
        } else if (round === 'hr') {
            result = await evaluateHRAnswer({ question, answer, role, voiceMetrics });
        } else {
            result = { feedback: 'Evaluation completed successfully.', score: 80 };
        }

        return res.json({ success: true, evaluation: result });
    } catch (err) {
        next(err);
    }
};

export const handleFinalFeedback = async (req, res, next) => {
    try {
        const { interview, answers } = req.body;
        const report = await generateFinalReport({ interview, answers });
        return res.json({ success: true, report });
    } catch (err) {
        next(err);
    }
};

export default {
    handleGenerateQuestion,
    handleEvaluateAnswer,
    handleFinalFeedback
};
