import { mockStore } from './utils/memoryStore.js';
import { executeCode, submitCode } from './services/codeExecutionService.js';
import { evaluateCodingSubmission, generateFinalReport } from './services/aiService.js';
import { finalizeInterview } from './controllers/interviewController.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        throw new Error(message);
    } else {
        console.log(`✅ PASS: ${message}`);
        passedTests++;
    }
}

async function runTests() {
    console.log('===============================================================');
    console.log('🧪 RUNNING C AND C++ STRICT CODING VALIDATION TEST SUITE');
    console.log('===============================================================\n');

    const q1 = mockStore.codingQuestions[0]; // Two Sum
    const q3 = mockStore.codingQuestions[2]; // Maximum Subarray
    const q7 = mockStore.codingQuestions[6]; // Binary Search

    // ==========================================
    // 1. C LANGUAGE TESTS
    // ==========================================
    console.log('--- 1. C LANGUAGE TESTS ---');

    // 1a. Correct C Solution -> Must be Accepted
    const cCorrectRes = await executeCode({
        code: q1.solution_code.c,
        language: 'c',
        testCases: q1.test_cases,
        problemId: q1.id
    });
    assert(cCorrectRes.success === true && cCorrectRes.status === 'Accepted' && cCorrectRes.passedCount === q1.test_cases.length, 'Correct C solution is Accepted');

    // 1b. Incorrect C Solution (Wrong Logic / Self-pairing bug) -> Must be Wrong Answer
    const cWrongLogic1 = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* res = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] + nums[i] == target) {
            res[0] = i; res[1] = i;
            *returnSize = 2;
            return res;
        }
    }
    *returnSize = 0;
    return NULL;
}`;
    const cWrongRes1 = await executeCode({
        code: cWrongLogic1,
        language: 'c',
        testCases: q1.test_cases,
        problemId: q1.id
    });
    assert(cWrongRes1.success === false && cWrongRes1.status === 'Wrong Answer', 'Incorrect C logic (self-pairing) is rejected as Wrong Answer');

    // 1c. Incorrect C Solution (Dummy return / Incomplete logic) -> Must be Wrong Answer
    const cDummyCode = `int search(int* nums, int numsSize, int target) {
    for (int i = 0; i < numsSize; i++) {
        int temp = 0;
    }
    return 0; // Wrong return value for binary search
}`;
    const cDummyRes = await executeCode({
        code: cDummyCode,
        language: 'c',
        testCases: q7.test_cases,
        problemId: q7.id
    });
    assert(cDummyRes.success === false && cDummyRes.status === 'Wrong Answer', 'Incomplete C logic returning dummy 0 is rejected as Wrong Answer');

    // 1d. C Compilation Error -> Must be Compilation Error
    const cSyntaxError = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int x = 10
    return NULL;
}`;
    const cSynRes = await executeCode({
        code: cSyntaxError,
        language: 'c',
        testCases: q1.test_cases,
        problemId: q1.id
    });
    assert(cSynRes.status === 'Compilation Error', 'C missing semicolon is flagged as Compilation Error');

    // 1e. C Runtime Error -> Must be Runtime Error
    const cCrashCode = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int x = 10 / 0;
    return NULL;
}`;
    const cCrashRes = await executeCode({
        code: cCrashCode,
        language: 'c',
        testCases: q1.test_cases,
        problemId: q1.id
    });
    assert(cCrashRes.status === 'Runtime Error' && cCrashRes.error.includes('Division or modulo by zero'), 'C division by zero is flagged as Runtime Error');

    // ==========================================
    // 2. C++ LANGUAGE TESTS
    // ==========================================
    console.log('\n--- 2. C++ LANGUAGE TESTS ---');

    // 2a. Correct C++ Solution -> Must be Accepted
    const cppCorrectRes = await executeCode({
        code: q1.solution_code.cpp,
        language: 'cpp',
        testCases: q1.test_cases,
        problemId: q1.id
    });
    assert(cppCorrectRes.success === true && cppCorrectRes.status === 'Accepted' && cppCorrectRes.passedCount === q1.test_cases.length, 'Correct C++ solution is Accepted');

    // 2b. Incorrect C++ Solution (Wrong Logic / Kadane's max=0 on negative numbers) -> Must be Wrong Answer
    const cppWrongKadane = `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = 0; // Wrong initialization for all-negative arrays
        int currSum = 0;
        for (int x : nums) {
            currSum += x;
            if (currSum > maxSum) maxSum = currSum;
            if (currSum < 0) currSum = 0;
        }
        return maxSum;
    }
};`;
    const cppWrongRes1 = await executeCode({
        code: cppWrongKadane,
        language: 'cpp',
        testCases: q3.test_cases,
        problemId: q3.id
    });
    assert(cppWrongRes1.success === false && cppWrongRes1.status === 'Wrong Answer', 'Incorrect C++ Kadane logic is rejected as Wrong Answer');

    // 2c. Incorrect C++ Solution (Hardcoded single output e.g. return 4) -> Must be Wrong Answer
    const cppHardcoded = `class Solution {
public:
    int search(vector<int>& nums, int target) {
        return 4; // Only passes 1 testcase, fails others expecting -1 or 0
    }
};`;
    const cppHardcodedRes = await executeCode({
        code: cppHardcoded,
        language: 'cpp',
        testCases: q7.test_cases,
        problemId: q7.id
    });
    assert(cppHardcodedRes.success === false && cppHardcodedRes.status === 'Wrong Answer' && cppHardcodedRes.passedCount < q7.test_cases.length, 'Hardcoded C++ output fails other test cases and is rejected as Wrong Answer');

    // 2d. C++ Compilation Error -> Must be Compilation Error
    const cppSyntaxError = `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int x = 5
        return -1;
    }
};`;
    const cppSynRes = await executeCode({
        code: cppSyntaxError,
        language: 'cpp',
        testCases: q7.test_cases,
        problemId: q7.id
    });
    assert(cppSynRes.status === 'Compilation Error', 'C++ syntax error is flagged as Compilation Error');

    // 2e. C++ Runtime Error -> Must be Runtime Error
    const cppCrashCode = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int div = 100 / 0;
        return {};
    }
};`;
    const cppCrashRes = await executeCode({
        code: cppCrashCode,
        language: 'cpp',
        testCases: q1.test_cases,
        problemId: q1.id
    });
    assert(cppCrashRes.status === 'Runtime Error', 'C++ runtime crash is flagged as Runtime Error');

    // ==========================================
    // 3. AI EVALUATION & PERFORMANCE ANALYSIS HIERARCHY
    // ==========================================
    console.log('\n--- 3. PERFORMANCE ANALYSIS & AI EVALUATION HIERARCHY ---');

    // Test AI Review for Wrong C submission
    const aiReviewWrongC = await evaluateCodingSubmission({
        problem: q1,
        code: cWrongLogic1,
        language: 'c',
        testResults: cWrongRes1.results,
        execution: cWrongRes1
    });
    assert(aiReviewWrongC.status === 'Wrong Answer', 'AI review status matches Wrong Answer');
    assert(aiReviewWrongC.error_type !== 'None (Correct)', 'AI review error_type is NOT None (Correct)');
    assert(aiReviewWrongC.score <= 35, `AI review score for wrong code is capped (${aiReviewWrongC.score} <= 35)`);
    assert(aiReviewWrongC.mistakes.length > 0, 'AI review provides explicit mistake explanations');

    // Test AI Review for Correct C++ submission
    const aiReviewCorrectCpp = await evaluateCodingSubmission({
        problem: q1,
        code: q1.solution_code.cpp,
        language: 'cpp',
        testResults: cppCorrectRes.results,
        execution: cppCorrectRes
    });
    assert(aiReviewCorrectCpp.status === 'Accepted', 'AI review status for correct code is Accepted');
    assert(aiReviewCorrectCpp.error_type === 'None (Correct)', 'AI review error_type is None (Correct)');
    assert(aiReviewCorrectCpp.score >= 90, 'AI review score for correct code is >= 90');

    // Test Final Report Generation with Wrong Coding Submission
    const testInterview = {
        id: 'test-int-c-cpp',
        role: 'Software Developer',
        difficulty: 'Intermediate'
    };
    const testAnswers = [
        {
            id: 'ans-1',
            round_type: 'coding',
            question_text: 'Two Sum',
            topic: 'DSA Algorithms',
            user_answer: cWrongLogic1,
            code_language: 'c',
            is_correct: false,
            score: 25,
            error_type: 'Wrong Logic',
            ai_evaluation: aiReviewWrongC
        }
    ];

    const finalReport = await generateFinalReport(testInterview, testAnswers);
    assert(finalReport.correct === 0, 'Final report marks wrong coding answer as correct = 0');
    assert(finalReport.wrong === 1, 'Final report marks wrong coding answer as wrong = 1');
    assert(finalReport.question_reviews[0].is_correct === false, 'Final report question review is_correct is strictly false');
    assert(finalReport.question_reviews[0].explanation.includes('Incorrect') || finalReport.question_reviews[0].explanation.includes('Failed'), 'Final report explanation clearly states Code is Incorrect');

    console.log('\n===============================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} C/C++ VALIDATION TESTS PASSED SUCCESSFULLY!`);
    console.log('===============================================================\n');
}

runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
