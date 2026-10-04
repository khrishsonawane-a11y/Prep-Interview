import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { mockStore } from '../utils/memoryStore.js';

dotenv.config();

// 1. Google Gemini API Configuration
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const geminiClient = geminiApiKey && geminiApiKey.trim() !== '' && !geminiApiKey.includes('your_')
    ? new GoogleGenAI({ apiKey: geminiApiKey })
    : null;

// 2. Groq API Configuration
const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const groqClient = groqApiKey && groqApiKey.trim() !== '' && !groqApiKey.includes('your_')
    ? new Groq({ apiKey: groqApiKey })
    : null;

/**
 * Universal LLM Completion Helper
 */
async function callLLM({ systemPrompt, userPrompt, temperature = 0.4 }) {
    // 1. Google Gemini API
    if (geminiClient) {
        const candidateModels = [geminiModel, 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
        for (const model of candidateModels) {
            try {
                const response = await geminiClient.models.generateContent({
                    model: model,
                    contents: userPrompt,
                    config: {
                        systemInstruction: systemPrompt,
                        responseMimeType: 'application/json',
                        temperature: temperature
                    }
                });
                if (response?.text) return response.text;
            } catch (geminiErr) {
                // Try next model if 404
                if (!geminiErr.message?.includes('404')) {
                    console.error(`Google Gemini API (${model}) Error:`, geminiErr.message);
                }
            }
        }
    }

    // 2. Groq API Fallback
    if (groqClient) {
        const groqModels = [groqModel, 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'mixtral-8x7b-32768'];
        for (const model of groqModels) {
            try {
                const response = await groqClient.chat.completions.create({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: temperature,
                    response_format: { type: 'json_object' }
                });
                const content = response.choices[0]?.message?.content;
                if (content) return content;
            } catch (groqErr) {
                if (!groqErr.message?.includes('404')) {
                    console.error(`Groq AI API (${model}) Error:`, groqErr.message);
                }
            }
        }
    }

    return null;
}

/**
 * Safe JSON parser for LLM outputs
 */
const safeParseJSON = (text, fallback) => {
    if (!text) return fallback;
    try {
        const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
        return JSON.parse(cleaned);
    } catch (err) {
        try {
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                return JSON.parse(text.substring(firstBrace, lastBrace + 1));
            }
        } catch (subErr) {
            console.warn('JSON parsing fallback used');
        }
        return fallback;
    }
};

/**
 * 1. Generate Interview Question
 */
export const generateQuestion = async ({ round, role = 'Software Developer', difficulty = 'Intermediate', topic, previousQuestions = [] }) => {
    const prevList = previousQuestions.slice(-5).map(q => `- ${q}`).join('\n');
    let systemPrompt = `You are a Principal Tech Lead conducting an interview for the role of ${role} (${difficulty} level).`;
    let userPrompt = '';

    if (round === 'aptitude') {
        userPrompt = `Generate an Aptitude question for a ${difficulty} level candidate applying for ${role}.
Topic: ${topic || 'Quantitative'}.
Previous questions (DO NOT REPEAT): ${prevList || 'None'}

Return ONLY a valid JSON object:
{
  "category": "Quantitative" | "Logical Reasoning",
  "topic": "${topic || 'Quantitative'}",
  "difficulty": "${difficulty}",
  "question": "Clear problem statement.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_option": 0,
  "explanation": "Step-by-step solution."
}`;
    } else if (round === 'technical') {
        userPrompt = `Generate a practical Technical Interview question for a ${role} (${difficulty} level).
Focus on: ${topic || 'System Architecture, Core CS, Language Internals'}.
Previous questions: ${prevList || 'None'}

Return ONLY a valid JSON object:
{
  "role": "${role}",
  "topic": "${topic || 'Core Engineering'}",
  "difficulty": "${difficulty}",
  "question": "Practical technical interview question testing engineering depth.",
  "expected_concepts": ["Concept 1", "Concept 2", "Concept 3"],
  "sample_answer": "Model answer."
}`;
    } else if (round === 'coding') {
        userPrompt = `Generate a Coding / DSA problem for a ${role} (${difficulty} level).
Return ONLY a valid JSON object:
{
  "title": "Problem Title",
  "role": "${role}",
  "topic": "${topic || 'Data Structures'}",
  "difficulty": "${difficulty}",
  "description": "Problem statement.",
  "examples": [{ "input": "...", "output": "...", "explanation": "..." }],
  "constraints": ["1 <= n <= 10^5"],
  "starter_code": {
    "javascript": "function solution(input) {\\n    // Write your solution here\\n}",
    "python": "def solution(input):\\n    # Write your solution here\\n    pass"
  },
  "solution_code": {
    "javascript": "function solution(input) {\\n    // Complete model solution\\n}",
    "python": "def solution(input):\\n    # Complete model solution\\n    pass"
  },
  "test_cases": [
    { "input": "sample 1", "expected_output": "out 1", "is_hidden": false },
    { "input": "sample 2", "expected_output": "out 2", "is_hidden": false },
    { "input": "edge case", "expected_output": "out 3", "is_hidden": true }
  ]
}`;
    } else {
        userPrompt = `Generate a Behavioral / HR Interview question for a ${role} candidate (${difficulty} level).
Return ONLY a valid JSON object:
{
  "category": "Behavioral",
  "question": "Behavioral question tailored to engineering culture.",
  "key_evaluation_points": ["Point 1", "Point 2", "Point 3"]
}`;
    }

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.6 });
    return safeParseJSON(raw, getHeuristicQuestion(round, role, difficulty, topic, previousQuestions));
};

/**
 * 2. Evaluate Technical Answer
 */
export const evaluateTechnicalAnswer = async ({ question, answer, role = 'Software Developer', difficulty = 'Intermediate' }) => {
    if (!answer || answer.trim().length < 5) {
        return getHeuristicTechnicalEvaluation(question, answer);
    }

    const systemPrompt = `You are a Senior Engineering Hiring Manager evaluating a candidate's answer for a ${role} position.`;
    const userPrompt = `Question: "${question}"\nAnswer: "${answer}"\nRole: ${role}\nDifficulty: ${difficulty}

Return ONLY a valid JSON object:
{
  "score": 85,
  "correctness": "High | Moderate | Low",
  "relevance": "High | Moderate | Low",
  "missing_points": ["Omission 1", "Omission 2"],
  "strengths": ["Strength 1", "Strength 2"],
  "feedback": "Constructive analysis of candidate answer.",
  "improvement": "Actionable next steps."
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.3 });
    return safeParseJSON(raw, getHeuristicTechnicalEvaluation(question, answer));
};

/**
 * 3. Evaluate HR Answer
 */
export const evaluateHRAnswer = async ({ question, answer, role = 'Software Developer', voiceMetrics = null }) => {
    if (!answer || answer.trim().length < 5) {
        return getHeuristicHREvaluation(question, answer);
    }

    const systemPrompt = `You are an HR Director evaluating candidate communication and STAR structure for a ${role} role.`;
    const userPrompt = `Question: "${question}"\nAnswer: "${answer}"\nRole: ${role}

Return ONLY a valid JSON object:
{
  "score": 80,
  "relevance": "High | Moderate | Low",
  "clarity": "High | Moderate | Low",
  "structure": "Strong STAR adherence | Moderately structured | Unstructured",
  "strengths": ["Clear context", "Authentic communication"],
  "missing_points": ["Could emphasize quantifiable metric"],
  "feedback": "Behavioral feedback.",
  "improvement": "Refinement recommendation."
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.3 });
    return safeParseJSON(raw, getHeuristicHREvaluation(question, answer));
};

/**
 * 4. Evaluate Coding Submission
 */
export const evaluateCodingSubmission = async ({ problem, code, language = 'javascript', testResults = [] }) => {
    const passedCount = testResults.filter(t => t.passed).length;
    const totalCount = testResults.length || 1;

    const systemPrompt = `You are a Principal Software Engineer reviewing a candidate code submission.`;
    const userPrompt = `Problem: ${problem.title}\nLanguage: ${language}\nCode:\n${code}\nPassed: ${passedCount}/${totalCount} test cases.

Return ONLY a valid JSON object:
{
  "score": ${Math.round((passedCount / totalCount) * 75 + (code.length > 30 ? 20 : 10))},
  "correctness": "${passedCount === totalCount ? 'All Test Cases Passed' : 'Partial Pass'}",
  "time_complexity": "O(N) with explanation",
  "space_complexity": "O(1) with explanation",
  "code_quality": "Clean Code",
  "strengths": ["Optimal algorithmic approach"],
  "improvements": ["Boundary case handling"],
  "feedback": "Code review summary."
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.3 });
    return safeParseJSON(raw, getHeuristicCodingEvaluation(problem, code, language, testResults));
};

/**
 * 5. Generate Final Report
 */
export const generateFinalReport = async ({ interview, answers = [] }) => {
    const aptitudeAnswers = answers.filter(a => a.round_type === 'aptitude');
    const technicalAnswers = answers.filter(a => a.round_type === 'technical');
    const codingAnswers = answers.filter(a => a.round_type === 'coding');
    const hrAnswers = answers.filter(a => a.round_type === 'hr');

    const calcAvg = (items) => items.length ? Math.round(items.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / items.length) : 0;

    const aptAvg = calcAvg(aptitudeAnswers);
    const techAvg = calcAvg(technicalAnswers);
    const codeAvg = calcAvg(codingAnswers);
    const hrAvg = calcAvg(hrAnswers);

    const activeRounds = [
        aptitudeAnswers.length > 0 ? aptAvg : null,
        technicalAnswers.length > 0 ? techAvg : null,
        codingAnswers.length > 0 ? codeAvg : null,
        hrAnswers.length > 0 ? hrAvg : null
    ].filter(x => x !== null);

    const overallScore = activeRounds.length > 0
        ? Math.round(activeRounds.reduce((a, b) => a + b, 0) / activeRounds.length)
        : 80;

    const systemPrompt = `You are a Principal Technical Interview Panel Chair summarizing candidate performance for a ${interview.role} role.`;
    const userPrompt = `Interview: ${interview.role} (${interview.difficulty})
Overall Score: ${overallScore}/100
Aptitude: ${aptAvg}% | Technical: ${techAvg}% | Coding: ${codeAvg}% | HR: ${hrAvg}%

Return ONLY a valid JSON object:
{
  "overall_score": ${overallScore},
  "readiness_rating": "${overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Nearly Ready' : 'Developing'}",
  "overall_summary": "Comprehensive 2-3 paragraph performance assessment detailing technical readiness, problem solving strengths, and growth recommendations.",
  "aptitude_summary": {
    "score": ${aptAvg},
    "strengths": ["Quantitative accuracy", "Pattern deduction"],
    "improvements": ["Speed calculations"]
  },
  "technical_summary": {
    "score": ${techAvg},
    "strengths": ["Core architectural grasp", "System terminology"],
    "improvements": ["Deepen production trade-offs"]
  },
  "coding_summary": {
    "score": ${codeAvg},
    "strengths": ["Clean logic structure", "Optimal complexity"],
    "improvements": ["Boundary case validation"]
  },
  "hr_summary": {
    "score": ${hrAvg},
    "strengths": ["Clear articulate communication", "Structured narrative"],
    "improvements": ["Incorporate quantifiable outcomes into STAR format"]
  },
  "recommended_topics": [
    { "topic": "Database Indexing & Isolation Levels", "priority": "High", "reason": "Crucial for backend and full stack interview rounds." },
    { "topic": "Dynamic Programming & Tree Traversals", "priority": "Medium", "reason": "Core requirement for algorithmic technical screens." },
    { "topic": "STAR Method Behavioral Framing", "priority": "Medium", "reason": "Increases executive presence and storytelling impact." }
  ]
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.3 });
    return safeParseJSON(raw, getHeuristicFinalReport(interview, overallScore, aptAvg, techAvg, codeAvg, hrAvg, answers));
};

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getHeuristicQuestion(round, role, difficulty, topic, previousQuestions = []) {
    if (round === 'aptitude') {
        const pool = mockStore.aptitudeQuestions.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
        const list = pool.length > 0 ? pool : mockStore.aptitudeQuestions;
        return shuffleArray(list)[0];
    } else if (round === 'technical') {
        const pool = mockStore.technicalQuestions.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
        const list = pool.length > 0 ? pool : mockStore.technicalQuestions;
        return shuffleArray(list)[0];
    } else if (round === 'coding') {
        const pool = mockStore.codingQuestions.filter(q => !previousQuestions.includes(q.title) && !previousQuestions.includes(q.id));
        const list = pool.length > 0 ? pool : mockStore.codingQuestions;
        return shuffleArray(list)[0];
    } else {
        const pool = mockStore.hrQuestions.filter(q => !previousQuestions.includes(q.question) && !previousQuestions.includes(q.id));
        const list = pool.length > 0 ? pool : mockStore.hrQuestions;
        return shuffleArray(list)[0];
    }
}

function getHeuristicTechnicalEvaluation(question, answer) {
    const len = (answer || '').trim().length;
    const score = Math.min(95, Math.max(40, Math.round(40 + (len / 14))));
    return {
        score,
        correctness: len > 80 ? 'High' : len > 30 ? 'Moderate' : 'Low',
        relevance: len > 40 ? 'High' : 'Moderate',
        missing_points: ['Production trade-offs and bottleneck considerations', 'Memory overhead versus compute efficiency'],
        strengths: ['Clear explanation of core technical mechanism', 'Practical perspective'],
        feedback: 'Good response demonstrating foundational engineering understanding.',
        improvement: 'Structure future answers by highlighting production trade-offs and performance boundaries.'
    };
}

function getHeuristicHREvaluation(question, answer) {
    const len = (answer || '').trim().length;
    const score = Math.min(92, Math.max(45, Math.round(50 + (len / 12))));
    return {
        score,
        relevance: 'High',
        clarity: len > 60 ? 'High' : 'Moderate',
        structure: len > 100 ? 'Strong STAR adherence' : 'Moderately structured',
        strengths: ['Authentic communication', 'Clear situational context'],
        missing_points: ['Include quantifiable metrics (e.g., % latency reduced, team hours saved)'],
        feedback: 'The response demonstrates professional maturity and clear articulation.',
        improvement: 'Apply the STAR technique explicitly to highlight quantifiable business impact.'
    };
}

function getHeuristicCodingEvaluation(problem, code, language, testResults) {
    const passed = testResults.filter(t => t.passed).length;
    const total = testResults.length || 1;
    const score = Math.round((passed / total) * 80 + (code.length > 25 ? 15 : 5));

    return {
        score,
        correctness: passed === total ? 'All test cases passed' : `${passed}/${total} test cases passed`,
        time_complexity: 'O(N) - Linear time complexity',
        space_complexity: 'O(N) - Linear space storage',
        code_quality: 'Clean Code',
        strengths: ['Algorithmic approach is sound and readable'],
        improvements: ['Ensure boundary cases like empty or single-item inputs are guarded'],
        feedback: 'Good implementation with clean code structure.'
    };
}

function getHeuristicFinalReport(interview, overallScore, aptAvg, techAvg, codeAvg, hrAvg, answers) {
    return {
        overall_score: overallScore,
        readiness_rating: overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Nearly Ready' : 'Developing',
        overall_summary: `The candidate completed a comprehensive multi-round evaluation for the ${interview.role} position (${interview.difficulty} level). Performance across quantitative reasoning, technical architecture discussions, algorithmic coding, and behavioral communication was solid, demonstrating strong software engineering foundations.`,
        aptitude_summary: {
            score: aptAvg,
            strengths: ['Logical reasoning deductions', 'Quantitative problem solving'],
            improvements: ['Work on speed math shortcuts for time and work problems']
        },
        technical_summary: {
            score: techAvg,
            strengths: ['Grasp of core CS fundamentals', 'Clear architectural terminology'],
            improvements: ['Discuss production trade-offs and scaling bottlenecks in more detail']
        },
        coding_summary: {
            score: codeAvg,
            strengths: ['Clean code structure', 'Optimal time complexity in algorithm'],
            improvements: ['Verify edge cases (empty collections, boundary constraints) before submission']
        },
        hr_summary: {
            score: hrAvg,
            strengths: ['Professional articulation', 'Collaborative team orientation'],
            improvements: ['Incorporate quantifiable metrics and business results into the STAR framework']
        },
        recommended_topics: [
            { topic: 'Database Indexing & Isolation Levels', priority: 'High', reason: 'Essential for backend & full stack interview rounds.' },
            { topic: 'Dynamic Programming & Tree Traversals', priority: 'High', reason: 'High-frequency topic in coding assessments.' },
            { topic: 'STAR Behavioral Storytelling', priority: 'Medium', reason: 'Maximizes clarity and executive presence in leadership rounds.' }
        ]
    };
}

export default {
    generateQuestion,
    evaluateTechnicalAnswer,
    evaluateHRAnswer,
    evaluateCodingSubmission,
    generateFinalReport
};
