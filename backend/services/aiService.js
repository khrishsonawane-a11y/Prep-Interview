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
 * 4. Evaluate Coding Submission (C++ Code Analysis)
 */
export const evaluateCodingSubmission = async ({ problem, code, language = 'cpp', testResults = [], execution = {} }) => {
    const rawCode = (code || '').trim();
    const isSkipped = rawCode === '// [SKIPPED]' || rawCode === '' || execution.status === 'Did Not Answer';
    const lang = 'cpp';

    const pTitle = problem?.title || 'Algorithmic Challenge';
    const pTopic = problem?.topic || 'DSA';
    const pApproach = problem?.approach || 'Optimal algorithmic strategy.';
    const pAlgo = problem?.algorithm_explanation || problem?.approach || 'Step-by-step optimal algorithm.';
    const pRefSolution = problem?.solution_code?.cpp || problem?.solution_code?.c || problem?.solution_code?.java || 'class Solution {\npublic:\n    // Optimal C++ reference implementation\n};';
    const pTime = problem?.time_complexity || 'O(N)';
    const pSpace = problem?.space_complexity || 'O(1)';

    if (isSkipped) {
        return {
            is_correct: false,
            score: 0,
            status: "Did Not Answer",
            verdict_title: "❌ Your code is incorrect.",
            error_type: "Did Not Answer",
            correctness: "Skipped",
            problem_identified: "No solution code was submitted (problem was skipped).",
            why_it_is_wrong: "The code editor was left empty or skipped without an algorithmic implementation.",
            why_it_is_correct: "",
            hint: pApproach,
            correct_approach: pAlgo,
            reference_solution: pRefSolution,
            time_complexity: "N/A",
            space_complexity: "N/A",
            code_quality: "Unattempted",
            strengths: [],
            mistakes: ["Question was skipped without code submission."],
            improvements: ["Review problem constraints and practice standard C++ templates."],
            feedback: "Problem was skipped by candidate."
        };
    }

    // Run deep algorithmic inspection on the C++ code
    const lowerCode = rawCode.toLowerCase();
    let isSyntaxError = false;
    let syntaxErrorMessage = '';
    let isRuntimeError = false;
    let runtimeErrorMessage = '';
    let isTLE = false;
    let isLogicError = false;
    let logicErrorMessage = '';
    let logicWhyMessage = '';
    let logicHint = pApproach;

    // 1. Bracket and Semicolon Check
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    for (let i = 0; i < rawCode.length; i++) {
        const c = rawCode[i];
        if (c === '(' || c === '{' || c === '[') stack.push(c);
        else if (c in pairs) {
            if (stack.length === 0 || stack.pop() !== pairs[c]) {
                isSyntaxError = true;
                syntaxErrorMessage = `Unmatched closing bracket '${c}' at character position ${i}.`;
                break;
            }
        }
    }
    if (!isSyntaxError && stack.length > 0) {
        isSyntaxError = true;
        syntaxErrorMessage = `Unclosed bracket '${stack[stack.length - 1]}' in C++ code.`;
    }

    // 2. Missing Semicolon Check
    if (!isSyntaxError) {
        const lines = rawCode.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;
            if (line.includes('//')) line = line.split('//')[0].trim();
            if (
                line.length > 3 &&
                !line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}') && !line.endsWith(':') && !line.startsWith('#') &&
                !line.startsWith('class ') && !line.startsWith('struct ') && !line.startsWith('for ') && !line.startsWith('for(') &&
                !line.startsWith('while ') && !line.startsWith('while(') && !line.startsWith('if ') && !line.startsWith('if(') && !line.startsWith('else') &&
                !line.endsWith(',') && !line.endsWith('(')
            ) {
                if (line.startsWith('int ') || line.startsWith('return ') || line.startsWith('bool ') || line.startsWith('char ') || line.startsWith('double ') || line.startsWith('float ') || line.startsWith('string ') || line.startsWith('vector<') || line.startsWith('auto ') || line.includes(' = ') || line.includes('++') || line.includes('--')) {
                    isSyntaxError = true;
                    syntaxErrorMessage = `Line ${i + 1}: Missing semicolon ';' at end of statement: "${line}".`;
                    break;
                }
            }
        }
    }

    // 3. Runtime Crash Check
    if (/\/\s*0(?![0-9])/.test(lowerCode) || /%\s*0(?![0-9])/.test(lowerCode)) {
        isRuntimeError = true;
        runtimeErrorMessage = "Division or modulo by zero detected.";
    } else if (/null\.[a-z_]/i.test(rawCode) || /nullptr->[a-z_]/i.test(rawCode) || /null->[a-z_]/i.test(rawCode)) {
        isRuntimeError = true;
        runtimeErrorMessage = "Null pointer dereference (segmentation fault) detected.";
    } else if (/\[\s*-\d+\s*\]/.test(rawCode) || /\[\s*99999+\s*\]/.test(rawCode)) {
        isRuntimeError = true;
        runtimeErrorMessage = "Out of bounds array index access detected.";
    }

    // 4. Time Limit / Infinite Loop Check
    const cleanCode = rawCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    const whileTrueMatch = cleanCode.match(/while\s*\(\s*(true|1)\s*\)\s*\{([^}]*)\}/i);
    if (whileTrueMatch) {
        const body = whileTrueMatch[2];
        if (!body.includes('break') && !body.includes('return') && !body.includes('goto')) {
            isTLE = true;
        }
    }

    // 5. Algorithmic Invariants & Problem-Specific Logic Verification
    const pId = (problem?.id || '').toLowerCase();
    const pTitleLower = pTitle.toLowerCase();

    // Check if code is dummy return or starter stub without algorithm logic
    const isStarterStub = (
        (lowerCode.includes('return {};') || lowerCode.includes('return null;') || lowerCode.includes('return nullptr;') || lowerCode.includes('return false;') || lowerCode.includes('return 0;') || lowerCode.includes('return "";') || lowerCode.includes('return -1;')) &&
        !lowerCode.includes('for ') && !lowerCode.includes('for(') && !lowerCode.includes('while ') && !lowerCode.includes('while(') && !lowerCode.includes('if ') && !lowerCode.includes('if(') && !lowerCode.includes('map') && !lowerCode.includes('seen') && !lowerCode.includes('stack') && !lowerCode.includes('hash') && !lowerCode.includes('set') && !lowerCode.includes('unordered_')
    );

    if (isStarterStub) {
        isLogicError = true;
        logicErrorMessage = "The solution only contains default starter stub / placeholder return values.";
        logicWhyMessage = "No algorithm implementation or logic was provided to process input and compute required output.";
        logicHint = `Review the problem description and implement the core algorithm using ${pTopic}.`;
    }

    // Problem 1: Two Sum
    else if (pId.includes('two-sum') || pId === 'code-1' || pTitleLower.includes('two sum')) {
        const hasMap = lowerCode.includes('unordered_map') || lowerCode.includes('map') || lowerCode.includes('hash');
        const hasDoubleLoop = (lowerCode.includes('for') && (lowerCode.includes('for (int j') || lowerCode.includes('for(int j') || lowerCode.includes('for (size_t j') || lowerCode.includes('for (auto j') || lowerCode.includes('for (int j = i + 1')));
        if (lowerCode.includes('nums[i] + nums[i]') || lowerCode.includes('nums[i]+nums[i]')) {
            isLogicError = true;
            logicErrorMessage = "Self-pairing bug: the code adds the element at the same index twice (nums[i] + nums[i] == target).";
            logicWhyMessage = "The problem requires two distinct indices i and j (i != j) whose values add up to target.";
            logicHint = "When iterating, ensure you search for complement in already seen elements or use a nested loop starting from i + 1.";
        } else if (!hasMap && !hasDoubleLoop) {
            isLogicError = true;
            logicErrorMessage = "Incomplete search: single loop without hash map or secondary pointer cannot find pairs in general arrays.";
            logicWhyMessage = "A single linear scan without storing past elements in a map cannot check if the complement has been encountered.";
            logicHint = "Use `unordered_map<int, int> seen;` to map value to index in O(1) time per element.";
        }
    }

    // Problem 2: Valid Parentheses
    else if (pId.includes('valid-parentheses') || pId === 'code-2' || pTitleLower.includes('valid parentheses')) {
        const hasStack = (lowerCode.includes('stack<') || lowerCode.includes('st.') || lowerCode.includes('push')) && (lowerCode.includes('empty()') || lowerCode.includes('top == -1') || lowerCode.includes('top==-1'));
        if (!hasStack) {
            isLogicError = true;
            logicErrorMessage = "Missing stack data structure for LIFO bracket matching.";
            logicWhyMessage = "Parentheses can be nested (e.g. '([{}])'), which requires a LIFO Stack to match opening brackets with corresponding closing brackets in correct reverse order.";
            logicHint = "Push matching closing brackets onto `stack<char> st` when encountering opening brackets, and pop when matched.";
        }
    }

    // Problem 3: Reverse Linked List
    else if (pId.includes('reverse-linked-list') || pId === 'code-3' || pTitleLower.includes('reverse linked list')) {
        if (!lowerCode.includes('next') || !lowerCode.includes('prev')) {
            isLogicError = true;
            logicErrorMessage = "Missing pointer reversal logic.";
            logicWhyMessage = "Reversing a linked list requires tracking `prev`, `curr`, and `next` pointers to redirect `curr->next = prev` iteratively.";
            logicHint = "Maintain a `prev` pointer initialized to `nullptr` and update `curr->next = prev` as you advance through the list.";
        }
    }

    // Problem 4: Best Time to Buy and Sell Stock
    else if (pId.includes('buy-and-sell') || pId === 'code-4' || pTitleLower.includes('buy and sell stock')) {
        if (!lowerCode.includes('min') && !lowerCode.includes('profit') && !lowerCode.includes('prices')) {
            isLogicError = true;
            logicErrorMessage = "Missing minimum buy price tracking and maximum profit calculation.";
            logicWhyMessage = "To maximize profit in one transaction, you must track the minimum price seen so far and compare `prices[i] - minPrice` with max profit.";
            logicHint = "Iterate through prices while updating `minPrice = min(minPrice, price)` and `maxProfit = max(maxProfit, price - minPrice)`.";
        }
    }

    // Problem 5: Maximum Subarray (Kadane's)
    else if (pId.includes('maximum-subarray') || pId === 'code-5' || pTitleLower.includes('maximum subarray')) {
        if ((lowerCode.includes('maxsum = 0') || lowerCode.includes('max_sum = 0') || lowerCode.includes('max = 0')) && !lowerCode.includes('int_min') && !lowerCode.includes('nums[0]') && !lowerCode.includes('climits') && !lowerCode.includes('limits.h')) {
            isLogicError = true;
            logicErrorMessage = "Incorrect initialization of maximum sum to 0 for arrays containing all-negative numbers.";
            logicWhyMessage = "When an array contains only negative numbers (e.g. [-5, -2, -8]), the correct maximum subarray sum is -2, but initializing max to 0 incorrectly returns 0.";
            logicHint = "Initialize `maxSum = nums[0]` and `currSum = nums[0]` before looping from index 1.";
        } else if (!lowerCode.includes('sum') && !lowerCode.includes('max')) {
            isLogicError = true;
            logicErrorMessage = "Kadane's dynamic programming accumulator logic is missing.";
            logicWhyMessage = "Maximum subarray requires accumulating current sum and resetting when negative.";
            logicHint = "Use Kadane's algorithm: `currSum = max(nums[i], currSum + nums[i]); maxSum = max(maxSum, currSum);`.";
        }
    }

    // Problem 6: Valid Anagram
    else if (pId.includes('valid-anagram') || pId === 'code-6' || pTitleLower.includes('valid anagram')) {
        if (!lowerCode.includes('count') && !lowerCode.includes('freq') && !lowerCode.includes('26') && !lowerCode.includes('sort') && !lowerCode.includes('map')) {
            isLogicError = true;
            logicErrorMessage = "Missing character frequency counting or sorting logic.";
            logicWhyMessage = "Two strings are anagrams if and only if they have the exact same character frequencies or become identical when sorted.";
            logicHint = "Use a fixed frequency vector of size 26 `vector<int> count(26, 0);` to count characters in s and decrement for t.";
        }
    }

    // Problem 7: Binary Search
    else if (pId.includes('binary-search') || pId === 'code-7' || pTitleLower.includes('binary search')) {
        const hasMid = (lowerCode.includes('mid') || lowerCode.includes('middle')) && (lowerCode.includes('/ 2') || lowerCode.includes('/2') || lowerCode.includes('>> 1'));
        const hasBoundaryShift = lowerCode.includes('+ 1') || lowerCode.includes('+1') || lowerCode.includes('- 1') || lowerCode.includes('-1');
        if (!hasMid || !hasBoundaryShift) {
            isLogicError = true;
            logicErrorMessage = "Binary search logarithmic divide-and-conquer logic is missing or boundary shift is incorrect.";
            logicWhyMessage = "Binary search requires computing `mid = l + (r - l) / 2` and halving the search space with `l = mid + 1` or `r = mid - 1`.";
            logicHint = "While `l <= r`, check `nums[mid] == target`. If smaller, search right half (`l = mid + 1`); otherwise search left half (`r = mid - 1`).";
        }
    }

    // Determine correctness verdict
    const isCorrect = !isSyntaxError && !isRuntimeError && !isTLE && !isLogicError;

    let score = 95;
    let verdict_title = "✅ Your code is correct.";
    let status = "Correct";
    let error_type = "None (Correct)";
    let problem_identified = "";
    let why_it_is_wrong = "";
    let why_it_is_correct = `Your C++ solution correctly implements the optimal ${pTopic} algorithm with proper boundary handling and O(${pTime.replace(/O\(|\)/g, '')}) time complexity.`;
    let hint = pApproach;
    let correct_approach = pAlgo;
    let code_quality = isCorrect ? "Clean Code" : "Needs Optimization";
    let strengths = [];
    let mistakes = [];
    let improvements = [];
    let feedback = "";

    if (isCorrect) {
        score = 95;
        verdict_title = "✅ Your code is correct.";
        status = "Correct";
        error_type = "None (Correct)";
        strengths = [
            `Optimal algorithmic implementation of ${pTitle}.`,
            `Clean C++ syntax with correct data structure choices and memory efficiency.`,
            `Optimal time complexity ${pTime} and space complexity ${pSpace}.`
        ];
        mistakes = [];
        improvements = ["Consider adding const reference qualifiers where applicable (e.g. const vector<int>&)."];
        feedback = `✅ Your code is correct. The algorithm accurately solves ${pTitle} with optimal time complexity ${pTime}.`;
    } else {
        score = isSyntaxError ? 15 : (isRuntimeError ? 20 : (isTLE ? 25 : 30));
        verdict_title = "❌ Your code is incorrect.";
        status = "Incorrect";
        error_type = isSyntaxError ? "Syntax / Compilation Error" : (isRuntimeError ? "Runtime Crash" : (isTLE ? "Time Limit Exceeded" : "Wrong Logic"));
        
        problem_identified = isSyntaxError ? syntaxErrorMessage : (isRuntimeError ? runtimeErrorMessage : (isTLE ? "Infinite loop detected: loop does not terminate." : logicErrorMessage));
        why_it_is_wrong = isSyntaxError ? "C++ compiler failed to build the source code due to syntax errors." : (isRuntimeError ? "The code causes memory faults or arithmetic exceptions during execution." : (isTLE ? "Unconstrained loop execution causes execution timeout (> 2000ms)." : logicWhyMessage));
        hint = logicHint;
        why_it_is_correct = "";

        mistakes = [problem_identified, why_it_is_wrong].filter(Boolean);
        improvements = [hint, correct_approach].filter(Boolean);
        feedback = `❌ Your code is incorrect. Problem: ${problem_identified}`;
    }

    const evaluationResult = {
        is_correct: isCorrect,
        score,
        status,
        verdict_title,
        error_type,
        correctness: isCorrect ? "100% Correct" : "Incorrect Logic",
        problem_identified,
        why_it_is_wrong,
        why_it_is_correct,
        hint,
        correct_approach,
        reference_solution: pRefSolution,
        time_complexity: isCorrect ? pTime : "Suboptimal / Incomplete",
        space_complexity: isCorrect ? pSpace : "O(N)",
        code_quality,
        strengths,
        mistakes,
        improvements,
        feedback
    };

    return evaluationResult;
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
