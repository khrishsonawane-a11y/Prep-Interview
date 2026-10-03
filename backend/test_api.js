/**
 * Comprehensive Automated End-to-End API Test Suite
 */
import app from './server.js';
import http from 'http';

const TEST_PORT = 5099;
let testServer;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;
const TEST_TOKEN = 'mock_test_candidate_user_123';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

async function runTests() {
    console.log('🧪 Starting AI Interview Preparation System Automated Tests...\n');

    testServer = app.listen(TEST_PORT);
    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
        if (condition) {
            console.log(`  ✅ PASS: ${testName}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${testName}`);
            failed++;
        }
    };

    try {
        // 1. Health Check
        const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
        assert(healthRes.status === 'healthy', 'GET /api/health returns healthy status');

        // 2. Auth Protection Verification
        const unauthRes = await fetch(`${BASE_URL}/interviews`);
        assert(unauthRes.status === 401, 'Protected route /api/interviews rejects unauthenticated request');

        // 3. Create Interview Session
        const createIntRes = await fetch(`${BASE_URL}/interviews`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                role: 'Full Stack Developer',
                difficulty: 'Intermediate',
                rounds: ['aptitude', 'technical', 'coding', 'hr']
            })
        }).then(r => r.json());
        assert(createIntRes.success && createIntRes.interview?.id, 'POST /api/interviews creates new session');
        const interviewId = createIntRes.interview?.id;

        // 4. Aptitude Questions & Scoring
        const aptQRes = await fetch(`${BASE_URL}/aptitude/questions?count=3`, { headers }).then(r => r.json());
        assert(aptQRes.success && aptQRes.questions.length > 0, 'GET /api/aptitude/questions returns question set');

        const aptSubmitRes = await fetch(`${BASE_URL}/aptitude/answers`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                interviewId,
                questionId: aptQRes.questions[0].id,
                questionText: aptQRes.questions[0].question,
                selectedOptionIndex: aptQRes.questions[0].correct_option,
                correctOptionIndex: aptQRes.questions[0].correct_option,
                explanation: 'Sample math deduction'
            })
        }).then(r => r.json());
        assert(aptSubmitRes.success && aptSubmitRes.isCorrect === true, 'POST /api/aptitude/answers scores answer accurately');

        // 5. Technical Question & AI Evaluation
        const techQRes = await fetch(`${BASE_URL}/technical/question`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ role: 'Full Stack Developer', difficulty: 'Intermediate' })
        }).then(r => r.json());
        assert(techQRes.success && techQRes.question?.question, 'POST /api/technical/question generates technical question');

        const techEvalRes = await fetch(`${BASE_URL}/technical/evaluate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                interviewId,
                questionText: techQRes.question.question,
                answerText: 'We manage concurrency using Node.js event loop with promises and async/await. Database transactions with ACID guarantees prevent race conditions.',
                role: 'Full Stack Developer'
            })
        }).then(r => r.json());
        assert(techEvalRes.success && techEvalRes.evaluation?.score > 0, 'POST /api/technical/evaluate generates structured AI evaluation');

        // 6. Coding Round: Problem Fetch, Safe Run & Submission
        const codeQRes = await fetch(`${BASE_URL}/coding/question`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ role: 'Full Stack Developer' })
        }).then(r => r.json());
        assert(codeQRes.success && codeQRes.problem?.starter_code, 'POST /api/coding/question returns coding problem');

        const codeRunRes = await fetch(`${BASE_URL}/coding/run`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                code: 'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const comp = target - nums[i]; if (map.has(comp)) return [map.get(comp), i]; map.set(nums[i], i); } return []; }',
                language: 'javascript',
                testCases: codeQRes.problem.test_cases
            })
        }).then(r => r.json());
        assert(codeRunRes.success && codeRunRes.execution?.success, 'POST /api/coding/run executes code safely in sandbox');

        const codeSubmitRes = await fetch(`${BASE_URL}/coding/submit`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                interviewId,
                problem: codeQRes.problem,
                code: 'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const comp = target - nums[i]; if (map.has(comp)) return [map.get(comp), i]; map.set(nums[i], i); } return []; }',
                language: 'javascript'
            })
        }).then(r => r.json());
        assert(codeSubmitRes.success && codeSubmitRes.evaluation?.score > 0, 'POST /api/coding/submit evaluates submission and complexity');

        // 7. HR Behavioral Question & Voice Metric Evaluation
        const hrQRes = await fetch(`${BASE_URL}/hr/question`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ role: 'Full Stack Developer' })
        }).then(r => r.json());
        assert(hrQRes.success && hrQRes.question?.question, 'POST /api/hr/question returns behavioral scenario');

        const hrEvalRes = await fetch(`${BASE_URL}/hr/evaluate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                interviewId,
                questionText: hrQRes.question.question,
                answerText: 'In my previous project, we had high API latency during peak hours. As the lead developer, I identified N+1 query bottlenecks, implemented Redis caching, and reduced response times by 65%.',
                role: 'Full Stack Developer',
                voiceMetrics: { durationSeconds: 35, wordCount: 45 }
            })
        }).then(r => r.json());
        assert(hrEvalRes.success && hrEvalRes.evaluation?.structure, 'POST /api/hr/evaluate analyzes STAR communication metrics');

        // 8. Finalize Interview & Generate AI Final Report
        const finalizeRes = await fetch(`${BASE_URL}/interviews/${interviewId}/finalize`, {
            method: 'POST',
            headers
        }).then(r => r.json());
        assert(finalizeRes.success && finalizeRes.results?.overall_summary, 'POST /api/interviews/:id/finalize compiles holistic report');

        // 9. Profile & Stats
        const profileRes = await fetch(`${BASE_URL}/profile`, { headers }).then(r => r.json());
        assert(profileRes.success && profileRes.stats?.interviewsCompleted >= 1, 'GET /api/profile aggregates interview metrics');

        console.log(`\n====================================================`);
        console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
        console.log(`====================================================\n`);

    } catch (err) {
        console.error('Test Execution Error:', err);
    } finally {
        testServer.close();
        process.exit(failed > 0 ? 1 : 0);
    }
}

runTests();
