import { mockStore } from './utils/memoryStore.js';
import { getAptitudeQuestions } from './controllers/aptitudeController.js';
import { getTechnicalQuestion, evaluateTechnicalAnswer } from './controllers/technicalController.js';
import { getHRQuestion, evaluateHRAnswer } from './controllers/hrController.js';
import { getCodingQuestion, runCode, submitCode } from './controllers/codingController.js';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

async function mockReqRes(body = {}, query = {}, user = { id: 'test-user-123' }) {
    let result = null;
    let statusCode = 200;
    const req = { body, query, user };
    const res = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(data) {
            result = data;
            return this;
        }
    };
    const next = (err) => {
        if (err) throw err;
    };
    return { req, res, next, getResult: () => result, getStatus: () => statusCode };
}

async function runTests() {
    console.log('\n======================================================');
    console.log('AI INTERVIEW PREP - FULL SYSTEM VALIDATION TEST SUITE');
    console.log('======================================================\n');

    // 1. Aptitude Round Pool & Randomization
    console.log('--- TEST 1: Aptitude Question Pool & Sampling ---');
    assert(mockStore.aptitudeQuestions.length >= 30, `Aptitude pool has ${mockStore.aptitudeQuestions.length} questions (>= 30 required)`);

    const aptSessions = [];
    for (let s = 0; s < 5; s++) {
        const { req, res, next, getResult } = await mockReqRes({}, { count: 5 });
        await getAptitudeQuestions(req, res, next);
        const data = getResult();
        assert(data.success && data.questions.length === 5, `Session ${s + 1}: Fetched 5 aptitude questions`);

        // Check for 0 duplicates within single session
        const uniqueIds = new Set(data.questions.map(q => q.id));
        assert(uniqueIds.size === 5, `Session ${s + 1}: No duplicate questions within session (5 unique)`);
        aptSessions.push(data.questions.map(q => q.id).join(','));
    }
    const uniqueAptSessions = new Set(aptSessions);
    assert(uniqueAptSessions.size > 1, `Aptitude sessions receive randomized different selections (${uniqueAptSessions.size} distinct combinations across 5 sessions)`);

    // 2. Technical Round Pool & Randomization
    console.log('\n--- TEST 2: Technical Question Pool & Sampling ---');
    assert(mockStore.technicalQuestions.length >= 30, `Technical pool has ${mockStore.technicalQuestions.length} questions (>= 30 required)`);

    const askedTech = [];
    for (let i = 0; i < 3; i++) {
        const { req, res, next, getResult } = await mockReqRes({
            role: 'Software Developer',
            difficulty: 'Intermediate',
            previousQuestions: askedTech
        });
        await getTechnicalQuestion(req, res, next);
        const data = getResult();
        assert(data.success && data.question && data.question.question, `Technical question ${i + 1} retrieved successfully: "${(data.question.question || '').slice(0, 45)}..."`);
        assert(!askedTech.includes(data.question.question), `Question ${i + 1} is not repeated in previousQuestions list`);
        askedTech.push(data.question.question);
    }
    assert(askedTech.length === 3 && new Set(askedTech).size === 3, 'All 3 technical questions in session are unique');

    // Test Technical Evaluation
    const { req: techEvalReq, res: techEvalRes, next: techEvalNext, getResult: getTechEvalResult } = await mockReqRes({
        interviewId: 'int-tech-01',
        questionText: askedTech[0],
        answerText: 'OOP uses encapsulation to bundle data and methods, abstraction to hide internal details, inheritance to reuse code, and polymorphism to allow interchangeable interfaces.',
        role: 'Software Developer'
    });
    await evaluateTechnicalAnswer(techEvalReq, techEvalRes, techEvalNext);
    const techEvalData = getTechEvalResult();
    assert(techEvalData.success && techEvalData.evaluation && techEvalData.evaluation.score > 0, `Technical answer evaluation succeeded with score ${techEvalData?.evaluation?.score}`);

    // 3. Coding Round Pool & Execution
    console.log('\n--- TEST 3: Coding / DSA Problem Pool & Anti-Cheating ---');
    assert(mockStore.codingQuestions.length >= 30, `Coding problem pool has ${mockStore.codingQuestions.length} problems (>= 30 required)`);

    const askedCoding = [];
    for (let i = 0; i < 3; i++) {
        const { req, res, next, getResult } = await mockReqRes({
            role: 'Software Developer',
            difficulty: 'Intermediate',
            previousQuestions: askedCoding
        });
        await getCodingQuestion(req, res, next);
        const data = getResult();
        assert(data.success && data.problem && data.problem.title, `Coding problem ${i + 1} retrieved: "${data.problem.title}"`);
        assert(!askedCoding.includes(data.problem.title), `Problem "${data.problem.title}" is not repeated in previousProblems`);
        
        // Check hidden test cases are stripped
        const hiddenCases = (data.problem.test_cases || []).filter(tc => tc.is_hidden);
        assert(hiddenCases.length === 0, `Problem "${data.problem.title}" hides server-side test cases from client (Anti-cheating)`);
        askedCoding.push(data.problem.title);
    }

    // Test Code Submission
    const testProblem = mockStore.codingQuestions[0];
    const { req: submitReq, res: submitRes, next: submitNext, getResult: getSubmitResult } = await mockReqRes({
        interviewId: 'int-code-01',
        problem: { id: testProblem.id, title: testProblem.title, description: testProblem.description },
        code: testProblem.starter_code.javascript || 'function solution() { return true; }',
        language: 'javascript'
    });
    await submitCode(submitReq, submitRes, submitNext);
    const submitData = getSubmitResult();
    assert(submitData.success && submitData.evaluation, `Code submission evaluation executed successfully`);

    // 4. HR Round Pool & Randomization
    console.log('\n--- TEST 4: HR / Behavioral Question Pool & Sampling ---');
    assert(mockStore.hrQuestions.length >= 30, `HR question pool has ${mockStore.hrQuestions.length} questions (>= 30 required)`);

    const askedHR = [];
    for (let i = 0; i < 3; i++) {
        const { req, res, next, getResult } = await mockReqRes({
            role: 'Software Developer',
            difficulty: 'Intermediate',
            previousQuestions: askedHR
        });
        await getHRQuestion(req, res, next);
        const data = getResult();
        assert(data.success && data.question && data.question.question, `HR question ${i + 1} retrieved: "${(data.question.question || '').slice(0, 45)}..."`);
        assert(!askedHR.includes(data.question.question), `HR question ${i + 1} is not repeated in previousQuestions list`);
        askedHR.push(data.question.question);
    }
    assert(askedHR.length === 3 && new Set(askedHR).size === 3, 'All 3 HR questions in session are unique');

    // Test HR Evaluation
    const { req: hrEvalReq, res: hrEvalRes, next: hrEvalNext, getResult: getHREvalResult } = await mockReqRes({
        interviewId: 'int-hr-01',
        questionText: askedHR[0],
        answerText: 'In my previous project, we faced a high-latency database bottleneck. I analyzed the slow query log, implemented compound indexing and Redis caching, which reduced p99 latency by 65%.',
        role: 'Software Developer',
        voiceMetrics: { wordsPerMinute: 135, confidenceScore: 92, clarityScore: 90, totalDurationSeconds: 45 }
    });
    await evaluateHRAnswer(hrEvalReq, hrEvalRes, hrEvalNext);
    const hrEvalData = getHREvalResult();
    assert(hrEvalData.success && hrEvalData.evaluation && hrEvalData.evaluation.score > 0, `HR answer evaluation succeeded with score ${hrEvalData?.evaluation?.score}`);

    // 5. Verify Speech Recognition Lifecycle in Frontend Files
    console.log('\n--- TEST 5: SpeechRecognition Lifecycle & Anti-Duplication Check ---');
    const techJs = fs.readFileSync(path.resolve('./frontend/js/technical.js'), 'utf8');
    const hrJs = fs.readFileSync(path.resolve('./frontend/js/hr.js'), 'utf8');

    const techHasBaseSnapshot = techJs.includes('baseTranscript') && techJs.includes('interimTranscript');
    const techNoCumulativeConcat = !techJs.includes('textarea.value += transcript');
    assert(techHasBaseSnapshot && techNoCumulativeConcat, 'technical.js implements clean baseTranscript snapshotting and interim separation');

    const hrHasBaseSnapshot = hrJs.includes('baseTranscript') && hrJs.includes('interimTranscript');
    const hrNoCumulativeConcat = !hrJs.includes('textarea.value += transcript');
    assert(hrHasBaseSnapshot && hrNoCumulativeConcat, 'hr.js implements clean baseTranscript snapshotting and interim separation');

    // 6. Verify SQL Seed Data File
    console.log('\n--- TEST 6: SQL Seed Data File Verification ---');
    const seedSql = fs.readFileSync(path.resolve('./database/seed_data.sql'), 'utf8');
    assert(seedSql.includes('public.aptitude_questions'), 'seed_data.sql contains aptitude_questions insert');
    assert(seedSql.includes('public.technical_questions'), 'seed_data.sql contains technical_questions insert');
    assert(seedSql.includes('public.coding_questions'), 'seed_data.sql contains coding_questions insert');
    assert(seedSql.includes('public.hr_questions'), 'seed_data.sql contains hr_questions insert');

    console.log('\n======================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    if (failed > 0) process.exit(1);
}

runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
