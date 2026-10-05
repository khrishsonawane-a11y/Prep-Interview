import { codeExecutionService } from './services/codeExecutionService.js';
import { evaluateCodingSubmission } from './services/aiService.js';
import { mockStore } from './utils/memoryStore.js';
import assert from 'assert';

async function runCodingTests() {
    console.log('=== STARTING CODING & DSA EXECUTION TEST SUITE ===\n');

    const twoSumProblem = mockStore.codingQuestions.find(q => q.id === 'code-1' || q.title.includes('Two Sum'));
    const testCases = twoSumProblem.test_cases;

    // CASE 1: Completely Correct Solutions in Java, C, and C++
    console.log('--- CASE 1: Completely Correct Solutions in Java, C, and C++ ---');
    
    // 1a. Java Correct Solution
    const javaCorrect = twoSumProblem.solution_code.java;
    const javaResult = await codeExecutionService.executeCode({
        code: javaCorrect,
        language: 'java',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('Java Result:', { status: javaResult.status, passed: `${javaResult.passedCount}/${javaResult.totalCount}` });
    assert.strictEqual(javaResult.status, 'Accepted', 'Java correct code must be Accepted');
    assert.strictEqual(javaResult.success, true, 'Java correct code success must be true');
    assert.strictEqual(javaResult.passedCount, testCases.length, 'All test cases must pass');

    const javaReview = await evaluateCodingSubmission({
        problem: twoSumProblem,
        code: javaCorrect,
        language: 'java',
        testResults: javaResult.results,
        execution: javaResult
    });
    assert.strictEqual(javaReview.status, 'Accepted', 'AI review must report status Accepted');
    assert(javaReview.score >= 90, 'Accepted solution score must be >= 90');
    console.log('✓ Case 1a (Java Correct) Passed\n');

    // 1b. C Correct Solution
    const cCorrect = twoSumProblem.solution_code.c;
    const cResult = await codeExecutionService.executeCode({
        code: cCorrect,
        language: 'c',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('C Result:', { status: cResult.status, passed: `${cResult.passedCount}/${cResult.totalCount}` });
    assert.strictEqual(cResult.status, 'Accepted', 'C correct code must be Accepted');
    assert.strictEqual(cResult.success, true, 'C correct code success must be true');
    console.log('✓ Case 1b (C Correct) Passed\n');

    // 1c. C++ Correct Solution
    const cppCorrect = twoSumProblem.solution_code.cpp;
    const cppResult = await codeExecutionService.executeCode({
        code: cppCorrect,
        language: 'cpp',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('C++ Result:', { status: cppResult.status, passed: `${cppResult.passedCount}/${cppResult.totalCount}` });
    assert.strictEqual(cppResult.status, 'Accepted', 'C++ correct code must be Accepted');
    assert.strictEqual(cppResult.success, true, 'C++ correct code success must be true');
    console.log('✓ Case 1c (C++ Correct) Passed\n');

    // CASE 2: Syntax / Compilation Error
    console.log('--- CASE 2: Syntax Error / Compilation Failure ---');
    const javaSyntaxError = `
    class Solution {
        public int[] twoSum(int[] nums, int target) {
            int a = 5 // Missing semicolon
            return new int[]{0, 1};
        }
    }`;
    const syntaxResult = await codeExecutionService.executeCode({
        code: javaSyntaxError,
        language: 'java',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('Syntax Error Result:', { status: syntaxResult.status, error: syntaxResult.error });
    assert.strictEqual(syntaxResult.status, 'Compilation Error', 'Must identify Compilation Error');
    assert.strictEqual(syntaxResult.success, false, 'Success must be false on compilation error');
    assert(syntaxResult.error.includes('Missing semicolon'), 'Error must detail missing semicolon');

    const syntaxReview = await evaluateCodingSubmission({
        problem: twoSumProblem,
        code: javaSyntaxError,
        language: 'java',
        testResults: syntaxResult.results,
        execution: syntaxResult
    });
    assert.strictEqual(syntaxReview.status, 'Compilation Error', 'AI review must maintain Compilation Error status');
    assert(syntaxReview.score <= 25, 'Compilation error score must be low');
    assert.strictEqual(syntaxReview.error_type, 'Syntax/Implementation Error');
    console.log('✓ Case 2 (Compilation Error) Passed\n');

    // CASE 3: Wrong Algorithm (Intentionally Wrong Logic)
    console.log('--- CASE 3: Wrong Algorithm Logic ---');
    const javaWrongAlgo = `
    class Solution {
        public int[] twoSum(int[] nums, int target) {
            // Wrong algorithm pairing element with itself
            for (int i = 0; i < nums.length; i++) {
                if (nums[i] + nums[i] == target) {
                    return new int[]{i, i};
                }
            }
            return new int[]{};
        }
    }`;
    const wrongAlgoResult = await codeExecutionService.executeCode({
        code: javaWrongAlgo,
        language: 'java',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('Wrong Algorithm Result:', {
        status: wrongAlgoResult.status,
        passed: `${wrongAlgoResult.passedCount}/${wrongAlgoResult.totalCount}`,
        failedCase: wrongAlgoResult.results.find(r => !r.passed)
    });
    assert.strictEqual(wrongAlgoResult.status, 'Wrong Answer', 'Wrong algorithm must yield Wrong Answer');
    assert.strictEqual(wrongAlgoResult.success, false, 'Wrong algorithm success must be false');
    assert(wrongAlgoResult.passedCount < wrongAlgoResult.totalCount, 'Cannot pass all test cases');

    const wrongAlgoReview = await evaluateCodingSubmission({
        problem: twoSumProblem,
        code: javaWrongAlgo,
        language: 'java',
        testResults: wrongAlgoResult.results,
        execution: wrongAlgoResult
    });
    assert.strictEqual(wrongAlgoReview.status, 'Wrong Answer', 'AI review must report Wrong Answer');
    assert.notStrictEqual(wrongAlgoReview.error_type, 'None (Correct)', 'Error type must not be None (Correct)');
    assert(wrongAlgoReview.score < 75, 'Wrong answer score must not receive high marks');
    console.log('✓ Case 3 (Wrong Algorithm) Passed\n');

    // CASE 4: Runtime Crash (Division by Zero / Null Dereference)
    console.log('--- CASE 4: Runtime Crash ---');
    const javaCrash = `
    class Solution {
        public int[] twoSum(int[] nums, int target) {
            int x = 10 / 0; // Division by zero crash
            return new int[]{0, 1};
        }
    }`;
    const crashResult = await codeExecutionService.executeCode({
        code: javaCrash,
        language: 'java',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('Runtime Crash Result:', { status: crashResult.status, error: crashResult.error });
    assert.strictEqual(crashResult.status, 'Runtime Error', 'Must detect Runtime Error');
    assert.strictEqual(crashResult.success, false, 'Runtime error success must be false');
    assert(crashResult.error.includes('by zero'), 'Error must identify division by zero');

    const crashReview = await evaluateCodingSubmission({
        problem: twoSumProblem,
        code: javaCrash,
        language: 'java',
        testResults: crashResult.results,
        execution: crashResult
    });
    assert.strictEqual(crashReview.status, 'Runtime Error');
    assert.strictEqual(crashReview.error_type, 'Runtime Crash');
    console.log('✓ Case 4 (Runtime Error) Passed\n');

    // CASE 5: Edge-case Failure (Stub / Incomplete logic)
    console.log('--- CASE 5: Edge-Case Failure / Stub Logic ---');
    const stubCode = twoSumProblem.starter_code.java; // returns new int[]{}
    const stubResult = await codeExecutionService.executeCode({
        code: stubCode,
        language: 'java',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('Stub Code Result:', { status: stubResult.status, passed: `${stubResult.passedCount}/${stubResult.totalCount}` });
    assert.strictEqual(stubResult.status, 'Wrong Answer', 'Stub return must yield Wrong Answer');
    assert.strictEqual(stubResult.success, false, 'Stub code must not pass');

    const stubReview = await evaluateCodingSubmission({
        problem: twoSumProblem,
        code: stubCode,
        language: 'java',
        testResults: stubResult.results,
        execution: stubResult
    });
    assert.strictEqual(stubReview.status, 'Wrong Answer');
    console.log('✓ Case 5 (Edge-Case Failure / Stub) Passed\n');

    // CASE 6: Slow Solution / Time Limit Exceeded (TLE)
    console.log('--- CASE 6: Infinite Loop / Time Limit Exceeded ---');
    const tleCode = `
    class Solution {
        public int[] twoSum(int[] nums, int target) {
            while (true) {
                // Infinite loop without break
            }
        }
    }`;
    const tleResult = await codeExecutionService.executeCode({
        code: tleCode,
        language: 'java',
        testCases,
        problemId: twoSumProblem.id
    });
    console.log('TLE Result:', { status: tleResult.status, error: tleResult.error });
    assert.strictEqual(tleResult.status, 'Time Limit Exceeded', 'Must detect Time Limit Exceeded');
    assert.strictEqual(tleResult.success, false);

    const tleReview = await evaluateCodingSubmission({
        problem: twoSumProblem,
        code: tleCode,
        language: 'java',
        testResults: tleResult.results,
        execution: tleResult
    });
    assert.strictEqual(tleReview.status, 'Time Limit Exceeded');
    assert.strictEqual(tleReview.error_type, 'Time Limit Exceeded');
    console.log('✓ Case 6 (Time Limit Exceeded) Passed\n');

    console.log('ALL 6 MANDATORY CODING EXECUTION TEST CASES PASSED SUCCESSFULLY! 🚀');
}

runCodingTests().catch(err => {
    console.error('Coding test suite failed:', err);
    process.exit(1);
});
