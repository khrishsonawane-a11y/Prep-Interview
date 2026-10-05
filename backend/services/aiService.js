import dotenv from 'dotenv';
import { mockStore } from '../utils/memoryStore.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Low-level caller to LLM endpoint with safety fallback
 */
async function callLLM({ systemPrompt, userPrompt, temperature = 0.3 }) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
        return null; // Fallback to heuristic
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
                ],
                generationConfig: {
                    temperature,
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!response.ok) {
            console.warn(`Gemini API returned status ${response.status}`);
            return null;
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
    } catch (err) {
        console.warn('Gemini API fetch error:', err.message);
        return null;
    }
}

function safeParseJSON(raw, fallback) {
    if (!raw) return fallback;
    try {
        const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        return JSON.parse(cleaned);
    } catch (e) {
        console.warn('JSON Parse failed on LLM output, using fallback:', e.message);
        return fallback;
    }
}

/**
 * 1. Generate Interview Question Dynamically
 */
export const generateQuestion = async ({ round, role = 'Software Developer', difficulty = 'Intermediate', topic, previousQuestions = [] }) => {
    const systemPrompt = `You are a Principal Engineering Interviewer for a tier-1 technology company. Generate a single realistic, practical, and highly relevant ${round} question for a ${role} position (${difficulty} level).`;
    const userPrompt = `Target Round: ${round}
Target Job Role: ${role}
Difficulty Level: ${difficulty}
Specific Topic Focus: ${topic || 'Core CS / Engineering Fundamentals'}
Previously Asked Questions to Avoid (Do NOT repeat): ${JSON.stringify(previousQuestions.slice(-10))}

Return ONLY a valid JSON object matching the standard schema for ${round}.`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.5 });
    return safeParseJSON(raw, getHeuristicQuestion(round, role, difficulty, topic, previousQuestions));
};

/**
 * 2. Evaluate Technical Answer Against Structured Expected Answer
 */
export const evaluateTechnicalAnswer = async (arg1, arg2, arg3) => {
    let question = '', answer = '', role = 'Software Developer', difficulty = 'Intermediate', topic = '', reference_answer = '', expected_concepts = [];
    if (typeof arg1 === 'object' && arg1 !== null && !arg2) {
        question = arg1.question || arg1.question_text || '';
        answer = arg1.answer || arg1.answerText || '';
        role = arg1.role || 'Software Developer';
        difficulty = arg1.difficulty || 'Intermediate';
        topic = arg1.topic || '';
        reference_answer = arg1.reference_answer || arg1.sample_answer || '';
        expected_concepts = arg1.expected_concepts || arg1.required_concepts || arg1.key_points || [];
    } else {
        question = (typeof arg1 === 'object' && arg1 !== null) ? (arg1.question_text || arg1.question || '') : (arg1 || '');
        answer = arg2 || '';
        role = (typeof arg3 === 'object' && arg3 !== null) ? (arg3.role || 'Software Developer') : (typeof arg3 === 'string' ? arg3 : 'Software Developer');
        difficulty = (typeof arg3 === 'object' && arg3 !== null) ? (arg3.difficulty || 'Intermediate') : 'Intermediate';
        if (typeof arg1 === 'object' && arg1 !== null) {
            expected_concepts = arg1.expected_concepts || arg1.required_concepts || arg1.key_points || [];
            reference_answer = arg1.reference_answer || arg1.sample_answer || '';
            topic = arg1.topic || '';
        }
    }

    // Lookup question in mockStore if expected_concepts or reference_answer are empty
    if ((!expected_concepts || expected_concepts.length === 0 || !reference_answer) && question) {
        const found = mockStore.technicalQuestions.find(q =>
            (q.question && (q.question.toLowerCase() === question.toLowerCase() || question.toLowerCase().includes(q.question.toLowerCase()) || q.question.toLowerCase().includes(question.toLowerCase()))) ||
            (q.id && q.id === arg1?.question_id)
        );
        if (found) {
            if (!expected_concepts || expected_concepts.length === 0) expected_concepts = found.expected_concepts || [];
            if (!reference_answer) reference_answer = found.sample_answer || '';
            if (!topic) topic = found.topic || '';
        }
    }

    if (!expected_concepts || expected_concepts.length === 0) {
        if (question.toLowerCase().includes('overloading') && question.toLowerCase().includes('overriding')) {
            expected_concepts = ['Method Overloading (Compile-time)', 'Method Overriding (Runtime & Inheritance)', 'Parameter signatures vs Implementation replacement'];
        } else if (question.toLowerCase().includes('acid')) {
            expected_concepts = ['Atomicity', 'Consistency', 'Isolation', 'Durability'];
        } else {
            expected_concepts = ['Core Definition & Principle', 'Mechanism & Implementation Details', 'Trade-offs & Real-World Application'];
        }
    }

    const rawAnswer = (answer || '').trim();
    if (!rawAnswer || rawAnswer === '[SKIPPED]' || rawAnswer.length < 5) {
        return getHeuristicTechnicalEvaluation(question, answer, { role, difficulty, topic, reference_answer, expected_concepts });
    }

    const systemPrompt = `You are a strict, objective Principal Engineering Interviewer evaluating a technical interview response for a ${role} candidate (${difficulty} level).
CRITICAL EVALUATION INSTRUCTIONS:
1. EVALUATE AGAINST THE STRUCTURED EXPECTED ANSWER AND REQUIRED CONCEPTS.
2. DO NOT GIVE A GENERIC OPINION. Compare the candidate's actual statements against each required concept.
3. CONCEPTS STATUS: For each required concept in the list, evaluate if it is:
   - "covered": Candidate correctly explained or utilized the concept (accept equivalent phrasing and valid alternative examples).
   - "missing": Candidate omitted the concept completely.
   - "incorrect": Candidate made a factually wrong or confused technical claim about this concept.
4. WHAT YOU GOT RIGHT (correct_points): List explicit, accurate statements/concepts from the candidate's answer. Do NOT use generic praise.
5. WHAT IS MISSING (missing_concepts): Explicitly state which required concepts or architectural points were missing.
6. TECHNICAL ISSUES / MISTAKES (technical_mistakes): Explicitly identify any factually incorrect statements, misconceptions, or misleading technical claims made by the candidate. If none, return [].
7. REAL SCORE OUT OF 10 (score_out_of_10):
   - 9-10: Excellent — accurate, complete, covers all major concepts with solid technical explanation.
   - 7-8: Good — mostly correct, covers core concepts, minor details missing.
   - 5-6: Partially Correct — demonstrates basic understanding but important concepts missing or explanation is shallow.
   - 3-4: Weak — limited grasp, major concepts missing, or significant confusion/errors.
   - 1-2: Very Weak — mostly incorrect, confused, or minimal.
   - 0: Completely incorrect, irrelevant, or non-technical gibberish.
8. CLASSIFICATION: Strictly one of: "Correct" | "Mostly Correct" | "Partially Correct" | "Incomplete" | "Incorrect" | "Irrelevant / Did Not Answer".
9. ACTIONABLE IMPROVEMENT: Specific advice on how to improve this exact answer based on missing concepts and mistakes.`;

    const userPrompt = `Question: "${question}"
Candidate Answer: "${answer}"
Target Role: ${role}
Difficulty: ${difficulty}
Topic: ${topic || 'Engineering Architecture'}
Reference Answer: "${reference_answer}"
Required Concepts to Verify: ${JSON.stringify(expected_concepts)}

Return ONLY a valid JSON object matching this schema:
{
  "score_out_of_10": 8,
  "score": 80,
  "classification": "Correct | Mostly Correct | Partially Correct | Incomplete | Incorrect | Irrelevant / Did Not Answer",
  "verdict": "Correct | Mostly Correct | Partially Correct | Incomplete | Incorrect | Irrelevant / Did Not Answer",
  "error_type": "None (Correct) | Concept Missing | Concept Incorrect | Incomplete Answer | Wrong Logic | Syntax/Implementation Error | Poor Explanation | Did Not Answer | Irrelevant Answer",
  "correctness": "High | Moderate | Low | Very Low",
  "relevance": "High | Moderate | Low | Very Low",
  "correct_points": ["Specific statement 1 that candidate got right", "Specific statement 2..."],
  "missing_concepts": ["Did not mention concept X", "Did not explain mechanism Y..."],
  "technical_mistakes": ["Explicit misconception if any..."],
  "concept_coverage": {
    "covered_count": 3,
    "total_count": 4,
    "percentage": 75,
    "concepts": [
      { "name": "Concept A", "status": "covered" },
      { "name": "Concept B", "status": "missing" }
    ]
  },
  "feedback": "Concise evaluation summary.",
  "improvement": "Step-by-step guidance on what to add/fix in this answer.",
  "reference_answer": "${reference_answer.replace(/"/g, '\\"')}"
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.15 });
    const fallback = getHeuristicTechnicalEvaluation(question, answer, { role, difficulty, topic, reference_answer, expected_concepts });
    const parsed = safeParseJSON(raw, fallback);

    if (parsed.score_out_of_10 === undefined && parsed.score !== undefined) {
        parsed.score_out_of_10 = Math.round((parsed.score / 10) * 10) / 10;
    } else if (parsed.score === undefined && parsed.score_out_of_10 !== undefined) {
        parsed.score = Math.round(parsed.score_out_of_10 * 10);
    }
    if (!parsed.classification) parsed.classification = parsed.verdict || 'Partially Correct';
    if (!parsed.verdict) parsed.verdict = parsed.classification;
    if (!parsed.correct_points) parsed.correct_points = parsed.strengths || [];
    if (!parsed.missing_concepts) parsed.missing_concepts = parsed.missing_points || [];
    if (!parsed.technical_mistakes) parsed.technical_mistakes = [];
    if (!parsed.reference_answer) parsed.reference_answer = reference_answer;

    return parsed;
};

/**
 * 3. Evaluate HR Answer
 */
export const evaluateHRAnswer = async (arg1, arg2, arg3) => {
    let question, answer, role = 'Software Developer';
    if (typeof arg1 === 'object' && arg1 !== null && !arg2) {
        question = arg1.question || arg1.question_text || '';
        answer = arg1.answer || '';
        role = arg1.role || 'Software Developer';
    } else {
        question = (typeof arg1 === 'object' && arg1 !== null) ? (arg1.question_text || arg1.question || '') : (arg1 || '');
        answer = arg2 || '';
        role = (typeof arg3 === 'object' && arg3 !== null) ? (arg3.role || 'Software Developer') : (arg3 || 'Software Developer');
    }

    if (!answer || answer.trim().length < 5 || answer.trim() === '[SKIPPED]') {
        return getHeuristicHREvaluation(question, answer);
    }

    const systemPrompt = `You are an HR Executive Director evaluating candidate behavioral communication and STAR structure for a ${role} role.`;
    const userPrompt = `Question: "${question}"
Candidate Answer: "${answer}"
Role: ${role}

Return ONLY a valid JSON object:
{
  "score": 80,
  "error_type": "None (Strong Communication) | Incomplete Answer | Poor Explanation | Did Not Answer | Irrelevant Answer",
  "relevance": "High | Moderate | Low",
  "clarity": "High | Moderate | Low",
  "structure": "Strong STAR adherence | Moderately structured | Unstructured",
  "star_breakdown": {
    "situation": "Identified context",
    "task": "Identified objective",
    "action": "Identified specific action",
    "result": "Identified measurable outcome"
  },
  "strengths": ["Clear context", "Authentic communication"],
  "missing_concepts": ["Could emphasize quantifiable metric"],
  "feedback": "Behavioral feedback.",
  "improvement": "Refinement recommendation."
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.3 });
    const parsed = safeParseJSON(raw, getHeuristicHREvaluation(question, answer));
    if (!parsed.missing_concepts) parsed.missing_concepts = parsed.missing_points || [];
    if (!parsed.star_breakdown) parsed.star_breakdown = { situation: true, task: true, action: true, result: true };
    return parsed;
};

/**
 * 4. Evaluate Coding Submission
 */
export const evaluateCodingSubmission = async ({ problem, code, language = 'java', testResults = [], execution = {} }) => {
    const passedCount = execution.passedCount !== undefined ? execution.passedCount : testResults.filter(t => t.passed).length;
    const totalCount = execution.totalCount || testResults.length || 1;
    const isSkipped = code.trim() === '// [SKIPPED]' || execution.status === 'Did Not Answer';
    const execStatus = execution.status || (passedCount === totalCount && totalCount > 0 ? 'Accepted' : 'Wrong Answer');
    const isAccepted = execStatus === 'Accepted' && passedCount === totalCount;
    const isCompilationError = execStatus === 'Compilation Error' || Boolean(execution.error && execution.error.includes('Compilation'));
    const isRuntimeError = execStatus === 'Runtime Error' || Boolean(execution.error && execution.error.includes('Runtime'));
    const isTLE = execStatus === 'Time Limit Exceeded' || Boolean(execution.error && execution.error.includes('Time Limit'));

    if (isSkipped) {
        return {
            score: 0,
            status: "Did Not Answer",
            error_type: "Did Not Answer",
            correctness: "Skipped",
            time_complexity: "N/A",
            space_complexity: "N/A",
            code_quality: "Unattempted",
            strengths: [],
            mistakes: ["Question was skipped without code submission."],
            improvements: ["Practice standard algorithmic templates in " + (language.toUpperCase())],
            feedback: "Problem was skipped by candidate."
        };
    }

    // Determine deterministic fallback review based on real execution results
    let score = 0;
    let error_type = 'None (Correct)';
    let correctness = `${passedCount}/${totalCount} Passed`;
    let code_quality = 'Clean Code';
    let strengths = [];
    let mistakes = [];
    let improvements = [];
    let feedback = '';

    if (isAccepted) {
        score = 95;
        error_type = 'None (Correct)';
        correctness = 'All Test Cases Passed';
        code_quality = 'Clean Code';
        strengths = [
            'Optimal algorithmic approach passing all functional and boundary test cases.',
            'Clean control flow and memory management in ' + language.toUpperCase() + '.'
        ];
        mistakes = [];
        improvements = ['Consider minor micro-optimizations or concise inline helper structures.'];
        feedback = `Excellent solution! All ${totalCount} test cases passed cleanly with optimal time and space complexity.`;
    } else if (isCompilationError) {
        score = 15;
        error_type = 'Syntax/Implementation Error';
        correctness = 'Compilation Failed';
        code_quality = 'Syntax Errors';
        strengths = ['Attempted solution structure in ' + language.toUpperCase()];
        mistakes = [execution.error || 'Syntax error encountered during compilation.'];
        improvements = ['Check syntax, matching brackets, type declarations, and required semicolons.'];
        feedback = `Code failed to compile: ${execution.error || 'Syntax errors detected'}. Fix syntax errors before execution.`;
    } else if (isRuntimeError) {
        score = 25;
        error_type = 'Runtime Crash';
        correctness = 'Runtime Crash';
        code_quality = 'Needs Optimization';
        strengths = ['Code compiled successfully'];
        mistakes = [execution.error || 'Encountered runtime exception or segmentation fault.'];
        improvements = ['Add boundary checks for null pointers, array index boundaries, and division by zero.'];
        feedback = `Program crashed during test execution: ${execution.error || 'Exception thrown'}. Ensure safe array indexing and pointer checks.`;
    } else if (isTLE) {
        score = 35;
        error_type = 'Time Limit Exceeded';
        correctness = 'Time Limit Exceeded';
        code_quality = 'Needs Optimization';
        strengths = ['Correct algorithmic direction'];
        mistakes = ['Execution exceeded 2000ms limit due to infinite loop or exponential O(2^N) complexity.'];
        improvements = ['Ensure loop termination conditions are met and optimize algorithm from exponential to polynomial time (e.g. O(N) or O(N log N)).'];
    } else {
        // Wrong Answer score calculation: strictly capped at <= 35
        score = totalCount > 0 ? Math.round((passedCount / totalCount) * 30) + 5 : 10;
        error_type = passedCount > 0 ? 'Edge Case Missed' : 'Wrong Logic';
        correctness = `${passedCount}/${totalCount} Test Cases Passed`;
        code_quality = 'Needs Optimization';
        strengths = passedCount > 0 ? [`Passed ${passedCount} test case(s).`] : ['Code compiled and executed.'];
        
        const firstFailed = (execution.results || testResults).find(r => !r.passed);
        if (firstFailed) {
            mistakes = [`Failed Test Case #${firstFailed.testCaseNumber} (Input: ${firstFailed.input}). Expected output was ${firstFailed.expected}, but received ${firstFailed.actual}.`];
        } else {
            mistakes = ['One or more test cases produced incorrect output.'];
        }
        improvements = [
            problem.approach ? `Recommended Approach: ${problem.approach}` : 'Trace code step-by-step against failing test cases.',
            'Address edge cases and verify algorithm invariants.'
        ];
        feedback = `Code is Incorrect: ${passedCount}/${totalCount} test cases passed. Algorithm produced output mismatch.`;
    }

    const fallbackReview = {
        score,
        status: execStatus,
        error_type,
        correctness,
        time_complexity: isAccepted ? (problem.time_complexity || 'O(N)') : 'Suboptimal / Incomplete',
        space_complexity: isAccepted ? (problem.space_complexity || 'O(1)') : 'O(N)',
        code_quality,
        strengths,
        mistakes,
        improvements,
        feedback,
        hint: problem.approach || 'Verify constraints and edge cases.',
        correct_approach: problem.algorithm_explanation || problem.approach || 'Optimal approach.',
        reference_solution: problem.solution_code?.[language] || problem.approach || 'Reference solution'
    };

    const systemPrompt = `You are a strict Principal Software Engineer reviewing a candidate code submission in ${language.toUpperCase()}.
CRITICAL RULES:
1. FUNCTIONAL CORRECTNESS IS DETERMINED ENTIRELY BY ACTUAL TEST EXECUTION:
   - Status: ${execStatus}
   - Passed: ${passedCount}/${totalCount} test cases
   - Errors: ${execution.error || 'None'}
2. If the solution failed test cases (Status: ${execStatus}), YOU MUST NEVER CALL IT CORRECT OR ACCURATE.
3. Diagnose the exact bug based on the failed test case outputs and candidate code.
4. If the solution passed all test cases, verify if time complexity and space complexity are optimal.`;

    const userPrompt = `Problem: ${problem.title}
Language: ${language}
Execution Status: ${execStatus}
Test Results: ${passedCount}/${totalCount} test cases passed
Error message: ${execution.error || 'None'}
Submitted Code:
${code}

Return ONLY a valid JSON object matching this schema:
{
  "score": ${score},
  "status": "${execStatus}",
  "error_type": "${error_type}",
  "correctness": "${correctness}",
  "time_complexity": "${fallbackReview.time_complexity}",
  "space_complexity": "${fallbackReview.space_complexity}",
  "code_quality": "${code_quality}",
  "strengths": ${JSON.stringify(strengths)},
  "mistakes": ${JSON.stringify(mistakes)},
  "improvements": ${JSON.stringify(improvements)},
  "feedback": "${feedback.replace(/"/g, '\\"')}"
}`;

    const raw = await callLLM({ systemPrompt, userPrompt, temperature: 0.2 });
    const parsed = safeParseJSON(raw, fallbackReview);

    // Enforce consistency: AI cannot overturn actual execution status
    parsed.status = execStatus;
    if (!isAccepted) {
        parsed.error_type = error_type;
        parsed.score = Math.min(35, Number(parsed.score) || score);
    } else {
        parsed.error_type = 'None (Correct)';
        parsed.score = Math.max(90, Number(parsed.score) || 95);
    }
    if (!parsed.mistakes || parsed.mistakes.length === 0) parsed.mistakes = mistakes;
    if (!parsed.improvements || parsed.improvements.length === 0) parsed.improvements = improvements;

    return parsed;
};

/**
 * 5. Generate Comprehensive Final Report
 */
export const generateFinalReport = async (arg1, arg2 = []) => {
    let interview = arg1;
    let answers = arg2;
    if (arg1 && arg1.interview) {
        interview = arg1.interview;
        answers = arg1.answers || [];
    }
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

    return getHeuristicFinalReport(interview, overallScore, aptAvg, techAvg, codeAvg, hrAvg, answers);
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

export function getHeuristicTechnicalEvaluation(question, answer, options = {}) {
    const rawAnswer = (answer || '').trim();
    const lowerAns = rawAnswer.toLowerCase();
    const lowerQ = (question || '').toLowerCase();
    const optObj = typeof options === 'string' ? { difficulty: options } : (options || {});
    let { role = 'Software Developer', difficulty = 'Intermediate', topic = '', reference_answer = '', expected_concepts = [] } = optObj;

    if (!expected_concepts || expected_concepts.length === 0) {
        expected_concepts = optObj.key_points || optObj.required_concepts || [];
    }

    // Lookup in mockStore if not provided
    if ((!expected_concepts || expected_concepts.length === 0 || !reference_answer) && question) {
        const found = mockStore.technicalQuestions.find(q =>
            (q.question && (q.question.toLowerCase() === lowerQ || lowerQ.includes(q.question.toLowerCase()) || q.question.toLowerCase().includes(lowerQ))) ||
            (q.id && q.id === optObj.question_id)
        );
        if (found) {
            if (!expected_concepts || expected_concepts.length === 0) expected_concepts = found.expected_concepts || [];
            if (!reference_answer) reference_answer = found.sample_answer || '';
            if (!topic) topic = found.topic || '';
        }
    }

    if (!expected_concepts || expected_concepts.length === 0) {
        if (lowerQ.includes('overloading') && lowerQ.includes('overriding')) {
            expected_concepts = ['Method Overloading (Compile-time)', 'Method Overriding (Runtime & Inheritance)', 'Signatures vs Implementations'];
        } else if (lowerQ.includes('acid')) {
            expected_concepts = ['Atomicity', 'Consistency', 'Isolation', 'Durability'];
        } else {
            expected_concepts = ['Core Definition & Principle', 'Mechanism & Implementation Details', 'Trade-offs & Practical Application'];
        }
    }

    // 1. Empty / Skipped
    if (!rawAnswer || rawAnswer === '[SKIPPED]') {
        return {
            score_out_of_10: 0,
            score: 0,
            classification: 'Irrelevant / Did Not Answer',
            verdict: 'Did Not Answer',
            error_type: 'Did Not Answer',
            correctness: 'Very Low',
            relevance: 'Very Low',
            correct_points: [],
            missing_concepts: expected_concepts.map(c => `Did not mention or cover: ${c}`),
            technical_mistakes: [],
            concept_coverage: {
                covered_count: 0,
                total_count: expected_concepts.length,
                percentage: 0,
                concepts: expected_concepts.map(c => ({ name: c, status: 'missing' }))
            },
            feedback: 'The question was skipped without an answer.',
            improvement: 'Review core definitions and concepts for this topic to prepare for technical screenings.',
            reference_answer: reference_answer || 'Expected architectural explanation covering core mechanisms and principles.'
        };
    }

    // 2. Extract keywords to detect off-topic/irrelevant text
    const stopWords = new Set([
        'explain', 'difference', 'differences', 'between', 'what', 'which', 'when', 'where', 'how', 'why',
        'is', 'are', 'was', 'were', 'the', 'and', 'for', 'with', 'from', 'into', 'about', 'your', 'you',
        'does', 'do', 'did', 'have', 'has', 'having', 'used', 'use', 'using', 'can', 'could', 'should',
        'would', 'role', 'roles', 'concept', 'concepts', 'give', 'detail', 'details', 'example', 'examples'
    ]);

    const qWords = lowerQ
        .replace(/[^a-z0-9_]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    let matchedKeywords = 0;
    for (const kw of qWords) {
        if (lowerAns.includes(kw) || (kw.length > 4 && lowerAns.includes(kw.substring(0, kw.length - 2)))) {
            matchedKeywords++;
        }
    }

    const isObviousOffTopic = (qWords.length >= 2 && matchedKeywords === 0 && rawAnswer.length > 15) ||
                              (lowerQ.includes('polymorphism') && lowerAns.includes('cloud computing') && !lowerAns.includes('poly') && !lowerAns.includes('class') && !lowerAns.includes('object')) ||
                              (lowerQ.includes('index') && lowerAns.includes('css') && !lowerAns.includes('query') && !lowerAns.includes('table'));

    if (isObviousOffTopic) {
        return {
            score_out_of_10: 0,
            score: 0,
            classification: 'Irrelevant / Did Not Answer',
            verdict: 'Irrelevant',
            error_type: 'Irrelevant Answer',
            correctness: 'Very Low',
            relevance: 'Very Low',
            correct_points: [],
            missing_concepts: expected_concepts.map(c => `Missing core concept: ${c}`),
            technical_mistakes: ['The submitted answer discusses an unrelated topic and does not address the technical subject matter of the question.'],
            concept_coverage: {
                covered_count: 0,
                total_count: expected_concepts.length,
                percentage: 0,
                concepts: expected_concepts.map(c => ({ name: c, status: 'missing' }))
            },
            feedback: 'The response does not address the technical subject matter of the question.',
            improvement: 'Focus directly on the architectural definitions and concepts required by the question prompt.',
            reference_answer: reference_answer || 'Expected technical explanation addressing core mechanisms.'
        };
    }

    // 3. Detect known technical misconceptions / mistakes
    const technical_mistakes = [];
    if (lowerAns.includes('multiple inheritance') && (lowerAns.includes('class ') || lowerAns.includes('classes')) && (lowerQ.includes('java') || lowerAns.includes('java')) && !lowerAns.includes('not support') && !lowerAns.includes("doesn't") && !lowerAns.includes('interface')) {
        technical_mistakes.push("Stated that Java supports multiple inheritance through classes. Java does not support multiple inheritance with classes (to prevent ambiguity like the diamond problem); multiple inheritance of type is achieved using interfaces.");
    }
    if (lowerAns.includes('tcp is connectionless') || lowerAns.includes('udp is connection-oriented') || lowerAns.includes('udp is connection oriented')) {
        technical_mistakes.push("Incorrectly swapped connection protocols: TCP is connection-oriented with 3-way handshakes; UDP is connectionless and lightweight.");
    }
    if (lowerAns.includes('primary key can be null') || lowerAns.includes('primary key allows null')) {
        technical_mistakes.push("Claimed primary keys allow NULL values. Primary keys strictly enforce uniqueness and NOT NULL constraints.");
    }
    if (lowerAns.includes('const prevents') && (lowerAns.includes('mutation') || lowerAns.includes('mutating')) && lowerAns.includes('object')) {
        technical_mistakes.push("Claimed const prevents object mutation. In JavaScript, const prevents identifier reassignment, but properties within an object can still be mutated.");
    }

    // 4. Evaluate Concept Coverage
    const conceptsStatus = [];
    const correct_points = [];
    const missing_concepts = [];

    for (const concept of expected_concepts) {
        const lowerC = concept.toLowerCase().trim();
        const cWords = lowerC.replace(/[^a-z0-9_]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

        let isCovered = false;
        if (lowerAns.includes(lowerC)) {
            isCovered = true;
        } else if (cWords.length > 0) {
            let matchCount = 0;
            for (const cw of cWords) {
                if (lowerAns.includes(cw)) {
                    matchCount++;
                    continue;
                }
                const stem = cw.length >= 6 ? cw.substring(0, cw.length - 2) : (cw.length >= 4 ? cw.substring(0, cw.length - 1) : cw);
                if (stem.length >= 3 && lowerAns.includes(stem)) {
                    matchCount++;
                    continue;
                }
                if (cw.startsWith('ack') && (lowerAns.includes('ack') || lowerAns.includes('acknowledg'))) {
                    matchCount++;
                    continue;
                }
                if (cw.startsWith('reliab') && (lowerAns.includes('reliab') || lowerAns.includes('guarantee'))) {
                    matchCount++;
                    continue;
                }
                if (cw.startsWith('order') && (lowerAns.includes('order') || lowerAns.includes('sequence') || lowerAns.includes('ordered'))) {
                    matchCount++;
                    continue;
                }
            }

            if (matchCount >= Math.ceil(cWords.length * 0.4)) {
                isCovered = true;
            }
        }

        // Specific concept synonym mapping
        if (!isCovered) {
            if (lowerC.includes('encapsulation') && (lowerAns.includes('private') || lowerAns.includes('getter') || lowerAns.includes('setter') || lowerAns.includes('data hiding') || lowerAns.includes('bundle state') || lowerAns.includes('bundling'))) isCovered = true;
            else if (lowerC.includes('abstraction') && (lowerAns.includes('interface') || lowerAns.includes('abstract class') || lowerAns.includes('hiding detail') || lowerAns.includes('hide implementation') || lowerAns.includes('hiding complexity'))) isCovered = true;
            else if (lowerC.includes('inheritance') && (lowerAns.includes('extends') || lowerAns.includes('parent') || lowerAns.includes('child') || lowerAns.includes('subclass') || lowerAns.includes('super') || lowerAns.includes('reuse') || lowerAns.includes('reusability'))) isCovered = true;
            else if (lowerC.includes('polymorphism') && (lowerAns.includes('override') || lowerAns.includes('overload') || lowerAns.includes('overriding') || lowerAns.includes('overloading') || lowerAns.includes('many forms') || lowerAns.includes('multiple forms'))) isCovered = true;
            else if (lowerC.includes('acid') && (lowerAns.includes('atomicity') || lowerAns.includes('consistency') || lowerAns.includes('isolation') || lowerAns.includes('durability'))) isCovered = true;
            else if ((lowerC.includes('latency') || lowerC.includes('use case')) && (lowerAns.includes('latency') || lowerAns.includes('streaming') || lowerAns.includes('real-time') || lowerAns.includes('gaming') || lowerAns.includes('trade-off') || lowerAns.includes('tradeoff'))) isCovered = true;
        }

        if (isCovered) {
            conceptsStatus.push({ name: concept, status: 'covered' });
            correct_points.push(`✓ Correctly explained and applied the concept of ${concept}.`);
        } else {
            conceptsStatus.push({ name: concept, status: 'missing' });
            missing_concepts.push(`✗ Did not mention or adequately explain ${concept}.`);
        }
    }

    const coveredCount = conceptsStatus.filter(c => c.status === 'covered').length;
    const totalCount = conceptsStatus.length;
    const coveragePercent = totalCount > 0 ? Math.round((coveredCount / totalCount) * 1000) / 10 : 0;

    // 5. Calculate Score out of 10
    let scoreOutOf10 = 0;
    if (totalCount > 0) {
        if (coveredCount === totalCount) {
            scoreOutOf10 = 9.5;
        } else if (coveragePercent >= 75) {
            scoreOutOf10 = 8.5;
        } else if (coveragePercent >= 60) {
            scoreOutOf10 = 7.5;
        } else if (coveragePercent >= 40) {
            scoreOutOf10 = 5.5;
        } else if (coveredCount > 0) {
            scoreOutOf10 = 4.0;
        } else {
            scoreOutOf10 = 2.0;
        }
    }

    // Length and depth refinement
    if (rawAnswer.length < 30 && scoreOutOf10 > 5) {
        scoreOutOf10 = Math.max(4.0, scoreOutOf10 - 2.0);
    }
    if (technical_mistakes.length > 0) {
        scoreOutOf10 = Math.max(1.0, scoreOutOf10 - (technical_mistakes.length * 2.5));
    }

    scoreOutOf10 = Math.min(10, Math.max(0, Math.round(scoreOutOf10 * 10) / 10));
    const score = Math.round(scoreOutOf10 * 10);

    // 6. Classification
    let classification = 'Partially Correct';
    if (scoreOutOf10 >= 9.0) classification = 'Correct';
    else if (scoreOutOf10 >= 7.0) classification = 'Mostly Correct';
    else if (scoreOutOf10 >= 5.0) classification = 'Partially Correct';
    else if (scoreOutOf10 >= 3.0) classification = 'Incomplete';
    else classification = 'Incorrect';

    const error_type = technical_mistakes.length > 0 ? 'Concept Incorrect' : (missing_concepts.length > 0 ? 'Concept Missing' : 'None (Correct)');

    // 7. Improvement text
    let improvementText = 'Your answer covers the essential principles well.';
    if (missing_concepts.length > 0 || technical_mistakes.length > 0) {
        const missingList = conceptsStatus.filter(c => c.status === 'missing').map(c => c.name).join(', ');
        improvementText = `To improve this answer, provide a concise definition, explicitly discuss ${missingList || 'implementation trade-offs'}, and include a concrete production code example.`;
    }

    return {
        score_out_of_10: scoreOutOf10,
        score,
        classification,
        verdict: classification,
        error_type,
        correctness: score >= 75 ? 'High' : score >= 50 ? 'Moderate' : score >= 25 ? 'Low' : 'Very Low',
        relevance: isObviousOffTopic ? 'Very Low' : 'High',
        correct_points,
        missing_concepts,
        technical_mistakes,
        concept_coverage: {
            covered_count: coveredCount,
            total_count: totalCount,
            percentage: coveragePercent,
            concepts: conceptsStatus
        },
        feedback: classification === 'Correct'
            ? 'Excellent, complete technical explanation demonstrating solid engineering rigor.'
            : (classification === 'Mostly Correct'
                ? 'Strong answer covering core mechanisms with minor concept omissions.'
                : 'Partially correct explanation. Review the missing concepts to strengthen conceptual depth.'),
        improvement: improvementText,
        reference_answer: reference_answer || 'Expected technical answer with core mechanisms and trade-offs.'
    };
}

function getHeuristicHREvaluation(question, answer) {
    const rawAnswer = (answer || '').trim();
    if (!rawAnswer || rawAnswer === '[SKIPPED]') {
        return {
            score: 0,
            error_type: 'Did Not Answer',
            relevance: 'Low',
            clarity: 'Low',
            structure: 'Unstructured',
            strengths: [],
            missing_points: ['Question was skipped.'],
            feedback: 'Behavioral scenario skipped.',
            improvement: 'Prepare STAR stories for this scenario.'
        };
    }

    const len = rawAnswer.length;
    let score = 45;
    if (len >= 120) score = 90;
    else if (len >= 80) score = 82;
    else if (len >= 50) score = 74;
    else if (len >= 25) score = 64;
    else score = Math.max(35, Math.round(25 + len));

    const error_type = score >= 80 ? 'None (Strong Communication)' : score >= 65 ? 'Poor Explanation' : 'Incomplete Answer';

    return {
        score,
        error_type,
        relevance: score >= 60 ? 'High' : 'Moderate',
        clarity: score >= 70 ? 'High' : 'Moderate',
        structure: len >= 80 ? 'Strong STAR adherence' : 'Moderately structured',
        strengths: ['Authentic communication and tone', 'Clear explanation of personal contribution'],
        missing_points: ['Could emphasize quantifiable metrics and business impact'],
        feedback: 'Solid delivery. Incorporate measurable KPIs and outcomes to strengthen executive presence.',
        improvement: 'Practice framing answers with the STAR method (Situation, Task, Action, Result).'
    };
}

function getHeuristicFinalReport(interview, overallScore, aptAvg, techAvg, codeAvg, hrAvg, answers = []) {
    // Exact counts and arithmetic identity calculations
    const totalQuestions = answers.length;
    let correct = 0;
    let skipped = 0;
    let wrong = 0;

    for (const a of answers) {
        const isSkip = a.is_skipped === true || a.user_answer === '[SKIPPED]' || !a.user_answer;
        if (isSkip) {
            skipped++;
        } else {
            const isCorr = a.round_type === 'coding' 
                ? (a.is_correct === true && Number(a.score) >= 75)
                : (a.is_correct === true || (a.evaluation && a.evaluation.is_correct === true) || (Number(a.score) >= 70));
            if (isCorr) correct++;
            else wrong++;
        }
    }

    const attempted = totalQuestions - skipped;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const completionPercentage = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 100) : 100;

    // Topic performance analysis based on actual answers
    const topicScores = {};
    for (const a of answers) {
        const topic = a.topic || (a.round_type === 'aptitude' ? 'Quantitative' : a.round_type === 'technical' ? 'Architecture' : a.round_type === 'coding' ? 'Algorithms' : 'Behavioral');
        if (!topicScores[topic]) {
            topicScores[topic] = { totalScore: 0, count: 0, correct: 0 };
        }
        topicScores[topic].totalScore += Number(a.score) || 0;
        topicScores[topic].count += 1;
        if (a.is_correct) topicScores[topic].correct += 1;
    }

    const topicList = Object.keys(topicScores).map(t => {
        const avg = Math.round(topicScores[t].totalScore / topicScores[t].count);
        return { topic: t, score: avg, avg_score: avg, count: topicScores[t].count };
    });

    const sortedByScore = [...topicList].sort((a, b) => a.score - b.score);
    const weakTopics = sortedByScore.filter(t => t.score < 75);
    const strongTopics = sortedByScore.filter(t => t.score >= 75);

    const performanceLevel = overallScore >= 90 ? 'Exceptional Readiness'
        : overallScore >= 80 ? 'Strong Candidate'
        : overallScore >= 70 ? 'Proficient'
        : overallScore >= 60 ? 'Developing Foundations'
        : 'Needs Intensive Preparation';

    // Map question reviews
    const questionReviews = answers.map((a, idx) => {
        const isSkip = a.is_skipped === true || a.user_answer === '[SKIPPED]' || !a.user_answer;
        const isCorr = a.round_type === 'coding'
            ? (a.is_correct === true && Number(a.score) >= 75)
            : (!isSkip && (a.is_correct === true || (a.evaluation && a.evaluation.is_correct === true) || (Number(a.score) >= 70)));
        return {
            round: a.round_type || 'Interview',
            question_index: idx + 1,
            question_text: a.question_text || `Question #${idx + 1}`,
            topic: a.topic || 'Core Concept',
            user_answer: isSkip ? '(Skipped)' : a.user_answer,
            reference_answer: a.reference_answer || 'Optimal reference response.',
            is_correct: isCorr,
            is_skipped: isSkip,
            score: Number(a.score) || 0,
            error_type: a.error_type || a.evaluation?.error_type || (isSkip ? 'Did Not Answer' : (isCorr ? 'None (Correct)' : (a.round_type === 'coding' ? 'Wrong Answer' : 'Concept Missing'))),
            missing_concepts: a.evaluation?.missing_concepts || a.missing_concepts || [],
            explanation: a.evaluation?.explanation || a.evaluation?.feedback || (isCorr ? 'Accurate answer.' : (a.round_type === 'coding' ? 'Code is Incorrect / Failed Test Cases' : 'Concept needs refinement.')),
            suggested_improvement: a.evaluation?.suggested_improvement || a.ai_evaluation?.hint || a.ai_evaluation?.correct_approach || 'Practice foundational principles and trace test cases.',
            viewed_answer: Boolean(a.viewed_answer)
        };
    });

    const topPriorities = [
        'Master boundary conditions and edge cases in algorithmic code submissions.',
        'Deepen database indexing, transaction isolation levels, and caching strategies for system design.',
        'Incorporate quantifiable metrics and measurable outcomes into STAR behavioral answers.'
    ];

    return {
        overall_score: overallScore,
        total_questions: totalQuestions,
        attempted,
        correct,
        wrong,
        skipped,
        accuracy,
        completion_percentage: completionPercentage,
        performance_level: performanceLevel,
        readiness_rating: overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Nearly Ready' : 'Developing',
        overall_summary: `The candidate completed an extensive multi-round evaluation for the ${interview.role || 'Software Engineer'} position (${interview.difficulty || 'Intermediate'} level). Across quantitative reasoning, technical architecture discussions, sandboxed coding in Java/C/C++, and behavioral scenarios, the candidate achieved an overall score of ${overallScore}%. Performance reflects ${performanceLevel.toLowerCase()} with clear technical strengths and focused growth priorities.`,
        aptitude_summary: {
            score: aptAvg,
            strengths: ['Quantitative reasoning deductions', 'Analytical pattern recognition'],
            improvements: ['Speed calculation shortcuts for complex probability and time/work questions']
        },
        technical_summary: {
            score: techAvg,
            strengths: ['Core computer science comprehension', 'Clear architectural terminology'],
            improvements: ['Articulate production trade-offs, scaling limits, and failure modes']
        },
        coding_summary: {
            score: codeAvg,
            strengths: ['Algorithmic problem-solving logic', 'Clean implementation structure'],
            improvements: ['Thoroughly test boundary edge cases (null inputs, empty collections, negative numbers)']
        },
        hr_summary: {
            score: hrAvg,
            strengths: ['Professional delivery', 'Collaborative engineering mindset'],
            improvements: ['Quantify business results and engineering impact within the STAR framework']
        },
        weak_topics: weakTopics.length > 0 ? weakTopics : [{ topic: 'Edge Case Validation', score: 65, count: 1 }],
        weak_topics_ranked: weakTopics.length > 0 ? weakTopics : [{ topic: 'Edge Case Validation', score: 65, count: 1 }],
        strong_topics: strongTopics.length > 0 ? strongTopics : [{ topic: 'Core Problem Solving', score: 85, count: 1 }],
        strong_competencies: strongTopics.length > 0 ? strongTopics : [{ topic: 'Core Problem Solving', score: 85, count: 1 }],
        top_priorities: topPriorities,
        top_3_priorities: topPriorities,
        question_reviews: questionReviews,
        recommended_topics: [
            { topic: 'Database Indexing & Isolation Levels', priority: 'High', reason: 'Essential for backend & full stack interview rounds.' },
            { topic: 'Dynamic Programming & Tree Traversals', priority: 'High', reason: 'Crucial for passing coding rounds.' },
            { topic: 'STAR Behavioral Storytelling', priority: 'Medium', reason: 'Boosts clarity, impact, and executive presence in leadership rounds.' }
        ]
    };
}

export const aiService = {
    generateQuestion,
    evaluateTechnicalAnswer,
    evaluateHRAnswer,
    evaluateCodingSubmission,
    generateFinalReport,
    getHeuristicTechnicalEvaluation
};

export default aiService;
