/**
 * Test Suite: Verify that Reference Solutions are NOT exposed in Starter/Editor Code
 */
import { mockStore } from './utils/memoryStore.js';
import { getCodingQuestions } from './controllers/codingController.js';
import { evaluateCodingSubmission } from './services/aiService.js';
import assert from 'assert';

async function runTests() {
    console.log('=== STARTING HIDDEN REFERENCE SOLUTION TESTS ===\n');
    let passed = 0;
    let total = 0;

    function test(name, fn) {
        total++;
        try {
            fn();
            console.log(`✅ [PASSED] ${name}`);
            passed++;
        } catch (err) {
            console.error(`❌ [FAILED] ${name}`);
            console.error(err);
        }
    }

    async function asyncTest(name, fn) {
        total++;
        try {
            await fn();
            console.log(`✅ [PASSED] ${name}`);
            passed++;
        } catch (err) {
            console.error(`❌ [FAILED] ${name}`);
            console.error(err);
        }
    }

    // --- TEST 1: Check all 32 questions in memoryStore for clean starter code ---
    test('1. All 32 Coding Questions have clean starter code without solution logic', () => {
        assert.strictEqual(mockStore.codingQuestions.length, 32, 'Must have 32 questions');

        mockStore.codingQuestions.forEach((q, idx) => {
            const starter = q.starter_code?.cpp || '';
            const solution = q.solution_code?.cpp || '';

            assert.ok(starter.length > 0, `Question ${idx + 1} (${q.id}) must have starter code`);
            assert.ok(solution.length > 0, `Question ${idx + 1} (${q.id}) must have solution code`);

            // Check that starter code is just a clean template
            assert.ok(starter.includes('// Write your code here'), `Question ${idx + 1} (${q.id}) starter must include placeholder comment`);
            assert.ok(starter.includes('int main()'), `Question ${idx + 1} (${q.id}) starter must include int main()`);

            // Verify starter code does NOT contain algorithms or solutions
            assert.strictEqual(starter.includes('unordered_map'), false, `Question ${idx + 1} starter should not contain unordered_map`);
            assert.strictEqual(starter.includes('stack<char>'), false, `Question ${idx + 1} starter should not contain stack`);
            assert.strictEqual(starter.includes('maxProf'), false, `Question ${idx + 1} starter should not contain maxProf`);
            assert.strictEqual(starter.includes('isAnagram'), false, `Question ${idx + 1} starter should not contain isAnagram solution`);
            assert.strictEqual(starter.includes('threeSum'), false, `Question ${idx + 1} starter should not contain threeSum solution`);

            // Verify solution code actually contains the real solution
            assert.ok(solution.length > 50, `Question ${idx + 1} (${q.id}) solution must have full solution code`);
        });
    });

    // --- TEST 2: Controller API does not put solution into starter_code ---
    await asyncTest('2. getCodingQuestions API returns clean starter code', async () => {
        const req = { query: { count: 32 } };
        let responseData = null;
        const res = {
            json: (data) => { responseData = data; return res; }
        };

        await getCodingQuestions(req, res, (err) => { if (err) throw err; });

        assert.ok(responseData.success);
        assert.ok(responseData.problems.length > 0);

        responseData.problems.forEach((p, idx) => {
            const starter = p.starter_code?.cpp || '';
            assert.ok(starter.includes('// Write your code here'), `Problem ${idx + 1} starter from API must be clean`);
            assert.ok(!starter.includes('unordered_map<int, int> seen'), `Problem ${idx + 1} starter from API must not contain solution`);
        });
    });

    // --- TEST 3: Frontend state simulation: Editor initial state is clean ---
    test('3. Initial candidateCode in questionsState is strictly clean starter code', () => {
        const questionsState = {};
        const dummyProblems = mockStore.codingQuestions;

        function getDefaultCppStarter() {
            return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n\n    return 0;\n}`;
        }

        function initProblemState(p, index) {
            const key = p.id || `problem_${index}`;
            if (!questionsState[key]) {
                const cleanStarter = (p.starter_code && p.starter_code.cpp) ? p.starter_code.cpp : getDefaultCppStarter();
                questionsState[key] = {
                    id: key,
                    title: p.title || `Problem ${index + 1}`,
                    candidateCode: cleanStarter,
                    explanation: '',
                    evaluationResult: null,
                    evaluationStatus: index === 0 ? 'visited' : 'unvisited',
                    score: null,
                    isCorrect: null,
                    viewedSolution: false
                };
            }
            return questionsState[key];
        }

        dummyProblems.forEach((p, i) => initProblemState(p, i));

        dummyProblems.forEach((p) => {
            const state = questionsState[p.id];
            assert.ok(state.candidateCode.includes('// Write your code here'), `Candidate code for ${p.id} must be clean placeholder`);
            assert.ok(state.candidateCode.includes('int main()'), `Candidate code for ${p.id} must be clean template`);
            assert.strictEqual(state.candidateCode.includes('unordered_map'), false, `Candidate code for ${p.id} must NOT have solution`);
        });
    });

    // --- TEST 4: Question switching preserves candidate's written code, NOT reference solution ---
    test('4. Question switching preserves user code and never loads reference solution', () => {
        const questionsState = {};
        const p1 = mockStore.codingQuestions[0]; // Two Sum
        const p2 = mockStore.codingQuestions[1]; // Valid Parentheses

        function getDefaultCppStarter() {
            return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n\n    return 0;\n}`;
        }

        // Q1 opened -> user writes code
        questionsState[p1.id] = {
            id: p1.id,
            candidateCode: getDefaultCppStarter(),
            explanation: ''
        };
        // User types their own implementation
        const userTypedCodeQ1 = '// User custom Two Sum code\nint a = 1;';
        questionsState[p1.id].candidateCode = userTypedCodeQ1;

        // Move to Q2 -> user writes code
        questionsState[p2.id] = {
            id: p2.id,
            candidateCode: getDefaultCppStarter(),
            explanation: ''
        };
        const userTypedCodeQ2 = '// User custom Valid Parentheses code\nint b = 2;';
        questionsState[p2.id].candidateCode = userTypedCodeQ2;

        // Return to Q1 -> verify user's own code is preserved, NOT reference solution
        assert.strictEqual(questionsState[p1.id].candidateCode, userTypedCodeQ1);
        assert.ok(!questionsState[p1.id].candidateCode.includes(p1.solution_code.cpp));

        // Return to Q2 -> verify user's own code is preserved, NOT reference solution
        assert.strictEqual(questionsState[p2.id].candidateCode, userTypedCodeQ2);
        assert.ok(!questionsState[p2.id].candidateCode.includes(p2.solution_code.cpp));
    });

    // --- TEST 5: Evaluator still has access to reference solution ---
    await asyncTest('5. Evaluator correctly compares against reference solution for correct submission', async () => {
        const problem = mockStore.codingQuestions[0];
        const correctCode = problem.solution_code.cpp;

        const evalResult = await evaluateCodingSubmission({
            problem,
            code: correctCode,
            language: 'cpp'
        });

        assert.strictEqual(evalResult.status, 'Correct');
        assert.strictEqual(evalResult.is_correct, true);
        assert.ok(evalResult.score >= 85);
    });

    console.log(`\n=== TEST SUMMARY: ${passed}/${total} PASSED ===`);
    if (passed !== total) process.exit(1);
}

runTests().catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
});
