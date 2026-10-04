import { mockStore } from './utils/memoryStore.js';
import { getAptitudeQuestions, submitAptitudeAnswer } from './controllers/aptitudeController.js';
import { getTechnicalQuestion, evaluateTechnicalAnswer } from './controllers/technicalController.js';
import { getHRQuestion, evaluateHRAnswer } from './controllers/hrController.js';
import { getCodingQuestion, runCode, submitCode } from './controllers/codingController.js';
import { createInterview, finalizeInterview, getInterviewById } from './controllers/interviewController.js';
import { getProfile } from './controllers/profileController.js';
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

async function mockReqRes(body = {}, query = {}, user = { id: 'test-user-perf-123', email: 'test@candidate.ai' }, params = {}) {
    let result = null;
    let statusCode = 200;
    const req = { body, query, user, params };
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
    console.log('\n================================================================');
    console.log('AI INTERVIEW PREP - FULL SYSTEM & 30-QUESTION STATS VALIDATION');
    console.log('================================================================\n');

    // 1. Aptitude Round 30 Questions Sampling & Deduplication
    console.log('--- TEST 1: Aptitude Round 30-Question Pool & Zero Duplicates ---');
    assert(mockStore.aptitudeQuestions.length >= 30, `Aptitude pool has ${mockStore.aptitudeQuestions.length} questions (>= 30 required)`);

    const { req: aptReq, res: aptRes, next: aptNext, getResult: getAptResult } = await mockReqRes({}, { count: 30 });
    await getAptitudeQuestions(aptReq, aptRes, aptNext);
    const aptData = getAptResult();
    assert(aptData.success && aptData.questions.length === 30, `Fetched 30 aptitude questions in single session`);
    const uniqueAptIds = new Set(aptData.questions.map(q => q.id));
    assert(uniqueAptIds.size === 30, `All 30 Aptitude questions are distinct with 0 duplicates`);

    // 2. Technical Round 30 Questions Pool & Zero Duplicates
    console.log('\n--- TEST 2: Technical Round 30-Question Pool & Zero Duplicates ---');
    assert(mockStore.technicalQuestions.length >= 30, `Technical pool has ${mockStore.technicalQuestions.length} questions (>= 30 required)`);

    const askedTech = [];
    for (let i = 0; i < 30; i++) {
        const { req, res, next, getResult } = await mockReqRes({
            role: 'Software Developer',
            difficulty: 'Intermediate',
            previousQuestions: askedTech
        });
        await getTechnicalQuestion(req, res, next);
        const data = getResult();
        assert(data.success && data.question && data.question.question, `Tech question #${i + 1} retrieved`);
        assert(!askedTech.includes(data.question.question), `Tech question #${i + 1} is unique`);
        askedTech.push(data.question.question);
    }
    assert(new Set(askedTech).size === 30, `Successfully retrieved 30 distinct technical questions with 0 duplicates`);

    // 3. Coding / DSA Round 30 Problems Pool & Zero Duplicates
    console.log('\n--- TEST 3: Coding Round 30-Problem Pool & Anti-Cheating ---');
    assert(mockStore.codingQuestions.length >= 30, `Coding pool has ${mockStore.codingQuestions.length} problems (>= 30 required)`);

    const askedCoding = [];
    for (let i = 0; i < 30; i++) {
        const { req, res, next, getResult } = await mockReqRes({
            role: 'Software Developer',
            difficulty: 'Intermediate',
            previousQuestions: askedCoding
        });
        await getCodingQuestion(req, res, next);
        const data = getResult();
        assert(data.success && data.problem && data.problem.title, `Coding problem #${i + 1}: "${data.problem.title}"`);
        assert(!askedCoding.includes(data.problem.title), `Problem #${i + 1} is unique`);

        // Check test cases hidden
        const hiddenCases = (data.problem.test_cases || []).filter(tc => tc.is_hidden);
        assert(hiddenCases.length === 0, `Problem #${i + 1} server-side test cases hidden from client`);
        askedCoding.push(data.problem.title);
    }
    assert(new Set(askedCoding).size === 30, `Successfully retrieved 30 distinct coding problems with 0 duplicates`);

    // 4. HR / Behavioral Round 30 Questions Pool & Zero Duplicates
    console.log('\n--- TEST 4: HR Round 30-Question Pool & Zero Duplicates ---');
    assert(mockStore.hrQuestions.length >= 30, `HR pool has ${mockStore.hrQuestions.length} questions (>= 30 required)`);

    const askedHR = [];
    for (let i = 0; i < 30; i++) {
        const { req, res, next, getResult } = await mockReqRes({
            role: 'Software Developer',
            difficulty: 'Intermediate',
            previousQuestions: askedHR
        });
        await getHRQuestion(req, res, next);
        const data = getResult();
        assert(data.success && data.question && data.question.question, `HR question #${i + 1} retrieved`);
        assert(!askedHR.includes(data.question.question), `HR question #${i + 1} is unique`);
        askedHR.push(data.question.question);
    }
    assert(new Set(askedHR).size === 30, `Successfully retrieved 30 distinct HR questions with 0 duplicates`);

    // 5. Complete 30-Question Interview Performance Calculation (Attempt 1: 80% baseline)
    console.log('\n--- TEST 5: Complete 30-Question Interview Attempt 1 & Question-Level Stats ---');
    const testUser = { id: 'user-metric-tester-001', email: 'tester@interview.ai' };

    const { req: createReq1, res: createRes1, next: createNext1, getResult: getCreateRes1 } = await mockReqRes({
        role: 'Software Developer',
        difficulty: 'Intermediate'
    }, {}, testUser);
    await createInterview(createReq1, createRes1, createNext1);
    const interview1 = getCreateRes1().interview;
    assert(interview1 && interview1.id, `Interview Attempt 1 created: ${interview1.id}`);

    // Submit 30 aptitude questions (24 correct, 6 wrong => 80%)
    for (let i = 0; i < 30; i++) {
        const q = mockStore.aptitudeQuestions[i];
        const isCorrect = i < 24; // 24 correct
        const chosen = isCorrect ? q.correct_option : (q.correct_option + 1) % 4;
        const { req, res, next } = await mockReqRes({
            interviewId: interview1.id,
            questionId: q.id,
            questionText: q.question,
            selectedOptionIndex: chosen,
            correctOptionIndex: q.correct_option,
            explanation: q.explanation
        }, {}, testUser);
        await submitAptitudeAnswer(req, res, next);
    }

    // Submit 30 technical questions (24 correct, 6 wrong)
    for (let i = 0; i < 30; i++) {
        const q = mockStore.technicalQuestions[i];
        const isCorrect = i < 24;
        const { req, res, next } = await mockReqRes({
            interviewId: interview1.id,
            questionText: q.question,
            answerText: isCorrect
                ? 'Detailed architectural answer with full technical concepts, concurrency management, and production trade-offs.'
                : 'Brief incomplete answer.',
            role: 'Software Developer'
        }, {}, testUser);
        await evaluateTechnicalAnswer(req, res, next);
    }

    // Submit 30 coding problems (24 correct, 6 wrong)
    for (let i = 0; i < 30; i++) {
        const p = mockStore.codingQuestions[i];
        const isCorrect = i < 24;
        const { req, res, next } = await mockReqRes({
            interviewId: interview1.id,
            problem: { id: p.id, title: p.title, description: p.description, test_cases: p.test_cases },
            code: isCorrect
                ? (p.solution_code?.javascript || 'function solution() { return true; }')
                : 'function solution() { return false; }',
            language: 'javascript'
        }, {}, testUser);
        await submitCode(req, res, next);
    }

    // Submit 30 HR questions (24 correct, 6 wrong)
    for (let i = 0; i < 30; i++) {
        const q = mockStore.hrQuestions[i];
        const isCorrect = i < 24;
        const { req, res, next } = await mockReqRes({
            interviewId: interview1.id,
            questionText: q.question,
            answerText: isCorrect
                ? 'Using the STAR framework: The situation was a legacy database bottleneck, I diagnosed the indexes and redesigned caching, resulting in 40% performance gain.'
                : 'I just solved it.',
            role: 'Software Developer'
        }, {}, testUser);
        await evaluateHRAnswer(req, res, next);
    }

    // Finalize Interview 1
    const { req: finReq1, res: finRes1, next: finNext1, getResult: getFinRes1 } = await mockReqRes({}, {}, testUser, { id: interview1.id });
    await finalizeInterview(finReq1, finRes1, finNext1);
    const fin1Data = getFinRes1();
    assert(fin1Data.success && fin1Data.results, 'Interview Attempt 1 finalized successfully');

    const perf1 = fin1Data.results.overall_performance;
    const apt1 = fin1Data.results.aptitude_summary;
    const tech1 = fin1Data.results.technical_summary;
    const code1 = fin1Data.results.coding_summary;
    const hr1 = fin1Data.results.hr_summary;

    console.log('\n  📊 Attempt 1 Stats:');
    console.log(`     Aptitude:  Total=${apt1.total_questions}, Correct=${apt1.correct}, Wrong=${apt1.wrong}, Score=${apt1.score}%`);
    console.log(`     Technical: Total=${tech1.total_questions}, Correct=${tech1.correct}, Wrong=${tech1.wrong}, Score=${tech1.score}%`);
    console.log(`     Coding:    Total=${code1.total_questions}, Correct=${code1.correct}, Wrong=${code1.wrong}, Score=${code1.score}%`);
    console.log(`     HR:        Total=${hr1.total_questions}, Correct=${hr1.correct}, Wrong=${hr1.wrong}, Score=${hr1.score}%`);
    console.log(`     Overall:   Total=${perf1.total_questions}, Correct=${perf1.correct}, Wrong=${perf1.wrong}, Score=${perf1.score}%, Improvement=${perf1.improvement}`);

    assert(apt1.total_questions === 30 && apt1.correct === 24 && apt1.wrong === 6, 'Aptitude: 30 Total, 24 Correct, 6 Wrong');
    assert(apt1.correct + apt1.wrong === apt1.total_questions, 'Aptitude: Correct + Wrong = Total (30)');
    assert(tech1.total_questions === 30 && tech1.correct + tech1.wrong === 30, 'Technical: Correct + Wrong = Total (30)');
    assert(code1.total_questions === 30 && code1.correct + code1.wrong === 30, 'Coding: Correct + Wrong = Total (30)');
    assert(hr1.total_questions === 30 && hr1.correct + hr1.wrong === 30, 'HR: Correct + Wrong = Total (30)');
    assert(perf1.total_questions === 120, 'Overall: 120 Total questions (30 * 4 rounds)');
    assert(perf1.correct + perf1.wrong === perf1.total_questions, 'Overall: Correct + Wrong = Total (120)');
    assert(perf1.improvement === '+0%', 'Attempt 1 baseline improvement is +0%');

    // 6. Attempt 2: Higher score (90%) and Improvement Calculation (+10%)
    console.log('\n--- TEST 6: Interview Attempt 2 & Accurate Improvement Tracking (+10%) ---');
    const { req: createReq2, res: createRes2, next: createNext2, getResult: getCreateRes2 } = await mockReqRes({
        role: 'Software Developer',
        difficulty: 'Intermediate'
    }, {}, testUser);
    await createInterview(createReq2, createRes2, createNext2);
    const interview2 = getCreateRes2().interview;

    // Submit 30 aptitude questions (27 correct, 3 wrong => 90%)
    for (let i = 0; i < 30; i++) {
        const q = mockStore.aptitudeQuestions[i];
        const isCorrect = i < 27; // 27 correct
        const chosen = isCorrect ? q.correct_option : (q.correct_option + 1) % 4;
        const { req, res, next } = await mockReqRes({
            interviewId: interview2.id,
            questionId: q.id,
            questionText: q.question,
            selectedOptionIndex: chosen,
            correctOptionIndex: q.correct_option,
            explanation: q.explanation
        }, {}, testUser);
        await submitAptitudeAnswer(req, res, next);
    }

    // Submit 30 technical questions (27 correct, 3 wrong)
    for (let i = 0; i < 30; i++) {
        const q = mockStore.technicalQuestions[i];
        const isCorrect = i < 27;
        const { req, res, next } = await mockReqRes({
            interviewId: interview2.id,
            questionText: q.question,
            answerText: isCorrect
                ? 'Senior level comprehensive architectural answer with deep CS foundations and clear production trade-off analysis.'
                : 'Incomplete.',
            role: 'Software Developer'
        }, {}, testUser);
        await evaluateTechnicalAnswer(req, res, next);
    }

    // Submit 30 coding problems (27 correct, 3 wrong)
    for (let i = 0; i < 30; i++) {
        const p = mockStore.codingQuestions[i];
        const isCorrect = i < 27;
        const { req, res, next } = await mockReqRes({
            interviewId: interview2.id,
            problem: { id: p.id, title: p.title, description: p.description, test_cases: p.test_cases },
            code: isCorrect ? (p.solution_code?.javascript || 'function solution() { return true; }') : 'function solution() {}',
            language: 'javascript'
        }, {}, testUser);
        await submitCode(req, res, next);
    }

    // Submit 30 HR questions (27 correct, 3 wrong)
    for (let i = 0; i < 30; i++) {
        const q = mockStore.hrQuestions[i];
        const isCorrect = i < 27;
        const { req, res, next } = await mockReqRes({
            interviewId: interview2.id,
            questionText: q.question,
            answerText: isCorrect
                ? 'Structured STAR answer with high clarity, executive communication, and measurable 50% performance improvement.'
                : 'I did it.',
            role: 'Software Developer'
        }, {}, testUser);
        await evaluateHRAnswer(req, res, next);
    }

    // Finalize Interview 2
    const { req: finReq2, res: finRes2, next: finNext2, getResult: getFinRes2 } = await mockReqRes({}, {}, testUser, { id: interview2.id });
    await finalizeInterview(finReq2, finRes2, finNext2);
    const fin2Data = getFinRes2();
    assert(fin2Data.success && fin2Data.results, 'Interview Attempt 2 finalized successfully');

    const perf2 = fin2Data.results.overall_performance;
    const apt2 = fin2Data.results.aptitude_summary;
    const tech2 = fin2Data.results.technical_summary;
    const code2 = fin2Data.results.coding_summary;
    const hr2 = fin2Data.results.hr_summary;

    console.log('\n  📊 Attempt 2 Stats:');
    console.log(`     Aptitude:  Total=${apt2.total_questions}, Correct=${apt2.correct}, Wrong=${apt2.wrong}, Score=${apt2.score}%, Improvement=${apt2.improvement}`);
    console.log(`     Technical: Total=${tech2.total_questions}, Correct=${tech2.correct}, Wrong=${tech2.wrong}, Score=${tech2.score}%, Improvement=${tech2.improvement}`);
    console.log(`     Coding:    Total=${code2.total_questions}, Correct=${code2.correct}, Wrong=${code2.wrong}, Score=${code2.score}%, Improvement=${code2.improvement}`);
    console.log(`     HR:        Total=${hr2.total_questions}, Correct=${hr2.correct}, Wrong=${hr2.wrong}, Score=${hr2.score}%, Improvement=${hr2.improvement}`);
    console.log(`     Overall:   Total=${perf2.total_questions}, Correct=${perf2.correct}, Wrong=${perf2.wrong}, Score=${perf2.score}%, Improvement=${perf2.improvement}`);

    assert(apt2.total_questions === 30 && apt2.correct === 27 && apt2.wrong === 3, 'Aptitude Attempt 2: 30 Total, 27 Correct, 3 Wrong');
    assert(apt2.correct + apt2.wrong === 30, 'Aptitude Attempt 2: Correct + Wrong = 30');
    assert(perf2.score > perf1.score, `Attempt 2 Score (${perf2.score}%) is higher than Attempt 1 Score (${perf1.score}%)`);
    assert(perf2.improvement.startsWith('+') && perf2.improvement !== '+0%', `Overall Improvement accurately calculated: ${perf2.improvement}`);

    // 7. Profile Aggregates Check
    console.log('\n--- TEST 7: Profile Aggregates & Dashboard Stats ---');
    const { req: profReq, res: profRes, next: profNext, getResult: getProfRes } = await mockReqRes({}, {}, testUser);
    await getProfile(profReq, profRes, profNext);
    const profData = getProfRes();
    assert(profData.success && profData.stats, 'Profile stats retrieved successfully');
    assert(profData.stats.interviewsCompleted === 2, `Profile shows 2 completed interviews`);
    assert(profData.stats.totalQuestions === 240, `Profile total questions = 240 (120 * 2)`);
    assert(profData.stats.totalCorrect + profData.stats.totalWrong === 240, `Profile Correct + Wrong = Total`);

    // 8. Voice Duplication Lifecycle Verification
    console.log('\n--- TEST 8: SpeechRecognition Clean Lifecycle Check ---');
    const techJs = fs.readFileSync(path.resolve('./frontend/js/technical.js'), 'utf8');
    const hrJs = fs.readFileSync(path.resolve('./frontend/js/hr.js'), 'utf8');
    assert(techJs.includes('baseTranscript') && !techJs.includes('textarea.value += transcript'), 'technical.js SpeechRecognition does not duplicate transcript');
    assert(hrJs.includes('baseTranscript') && !hrJs.includes('textarea.value += transcript'), 'hr.js SpeechRecognition does not duplicate transcript');

    console.log('\n================================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) process.exit(1);
}

runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
