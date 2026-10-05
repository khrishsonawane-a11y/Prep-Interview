import { mockStore } from './utils/memoryStore.js';
import { evaluateCodingSubmission } from './services/aiService.js';
import { submitCode } from './controllers/codingController.js';

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
    console.log('🧪 TESTING SIMPLIFIED C++ CODING ROUND SUBMIT & EVALUATION FLOW');
    console.log('===============================================================\n');

    const qTwoSum = mockStore.codingQuestions.find(q => q.id === 'code-1');
    const qKadane = mockStore.codingQuestions.find(q => q.id === 'code-5');
    const qBinarySearch = mockStore.codingQuestions.find(q => q.id === 'code-7');
    const qValidParentheses = mockStore.codingQuestions.find(q => q.id === 'code-2');

    // -------------------------------------------------------------
    // Test 1: Clearly CORRECT C++ Solution (Two Sum with unordered_map)
    // -------------------------------------------------------------
    console.log('--- TEST 1: Clearly CORRECT C++ Solution ---');
    const correctTwoSumCpp = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`;

    const res1 = await evaluateCodingSubmission({
        problem: qTwoSum,
        code: correctTwoSumCpp,
        language: 'cpp'
    });

    console.log('Test 1 Output:', {
        is_correct: res1.is_correct,
        status: res1.status,
        verdict_title: res1.verdict_title,
        score: res1.score,
        time_complexity: res1.time_complexity,
        space_complexity: res1.space_complexity
    });

    assert(res1.is_correct === true, 'Test 1 is_correct is TRUE');
    assert(res1.status === 'Correct', 'Test 1 status is Correct');
    assert(res1.verdict_title === '✅ Your code is correct.', 'Test 1 verdict title is "✅ Your code is correct."');
    assert(res1.score >= 90, 'Test 1 score is >= 90');
    assert(res1.why_it_is_correct && res1.why_it_is_correct.length > 10, 'Test 1 provides why_it_is_correct');
    assert(res1.correct_approach && res1.correct_approach.length > 5, 'Test 1 provides correct_approach');

    // -------------------------------------------------------------
    // Test 2: Intentionally INCORRECT C++ Solution (Self-pairing bug)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Intentionally INCORRECT C++ Solution (Self-pairing) ---');
    const incorrectTwoSumCpp = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < (int)nums.size(); i++) {
            if (nums[i] + nums[i] == target) {
                return {i, i}; // Wrong: cannot use the same element twice
            }
        }
        return {};
    }
};`;

    const res2 = await evaluateCodingSubmission({
        problem: qTwoSum,
        code: incorrectTwoSumCpp,
        language: 'cpp'
    });

    console.log('Test 2 Output:', {
        is_correct: res2.is_correct,
        status: res2.status,
        verdict_title: res2.verdict_title,
        score: res2.score,
        problem_identified: res2.problem_identified,
        hint: res2.hint
    });

    assert(res2.is_correct === false, 'Test 2 is_correct is FALSE');
    assert(res2.status === 'Incorrect', 'Test 2 status is Incorrect');
    assert(res2.verdict_title === '❌ Your code is incorrect.', 'Test 2 verdict title is "❌ Your code is incorrect."');
    assert(res2.score <= 35, 'Test 2 score is capped <= 35');
    assert(res2.problem_identified.includes('Self-pairing') || res2.problem_identified.includes('twice'), 'Test 2 explains exact self-pairing problem');
    assert(res2.why_it_is_wrong && res2.why_it_is_wrong.length > 10, 'Test 2 explains why it is wrong');
    assert(res2.hint && res2.hint.length > 5, 'Test 2 provides actionable hint');
    assert(res2.correct_approach && res2.correct_approach.length > 5, 'Test 2 provides correct approach');
    assert(res2.reference_solution && res2.reference_solution.includes('Solution'), 'Test 2 provides full C++ reference solution');

    // -------------------------------------------------------------
    // Test 3: Partially Correct C++ Solution (Kadane max=0 bug)
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Partially Correct C++ Solution (Kadane max=0 on negative arrays) ---');
    const partialKadaneCpp = `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = 0; // Bug: fails for all-negative arrays
        int currSum = 0;
        for (int x : nums) {
            currSum += x;
            if (currSum > maxSum) maxSum = currSum;
            if (currSum < 0) currSum = 0;
        }
        return maxSum;
    }
};`;

    const res3 = await evaluateCodingSubmission({
        problem: qKadane,
        code: partialKadaneCpp,
        language: 'cpp'
    });

    console.log('Test 3 Output:', {
        is_correct: res3.is_correct,
        status: res3.status,
        verdict_title: res3.verdict_title,
        problem_identified: res3.problem_identified,
        why_it_is_wrong: res3.why_it_is_wrong
    });

    assert(res3.is_correct === false, 'Test 3 is_correct is FALSE');
    assert(res3.status === 'Incorrect', 'Test 3 status is Incorrect');
    assert(res3.verdict_title === '❌ Your code is incorrect.', 'Test 3 verdict title is "❌ Your code is incorrect."');
    assert(res3.problem_identified.includes('negative') || res3.problem_identified.includes('0'), 'Test 3 identifies negative array initialization bug');
    assert(res3.hint && res3.hint.length > 5, 'Test 3 provides hint on initializing to nums[0]');

    // -------------------------------------------------------------
    // Test 4: Solution with Logical / Edge-Case Error (Binary Search missing halving)
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Logical / Edge-Case Error (Binary Search dummy/incomplete) ---');
    const dummyBinarySearchCpp = `class Solution {
public:
    int search(vector<int>& nums, int target) {
        for (int i = 0; i < (int)nums.size(); i++) {
            int temp = i;
        }
        return -1; // Dummy return
    }
};`;

    const res4 = await evaluateCodingSubmission({
        problem: qBinarySearch,
        code: dummyBinarySearchCpp,
        language: 'cpp'
    });

    console.log('Test 4 Output:', {
        is_correct: res4.is_correct,
        status: res4.status,
        verdict_title: res4.verdict_title,
        problem_identified: res4.problem_identified
    });

    assert(res4.is_correct === false, 'Test 4 is_correct is FALSE');
    assert(res4.status === 'Incorrect', 'Test 4 status is Incorrect');
    assert(res4.verdict_title === '❌ Your code is incorrect.', 'Test 4 verdict title is "❌ Your code is incorrect."');
    assert(res4.problem_identified.includes('Binary search') || res4.problem_identified.includes('divide-and-conquer'), 'Test 4 identifies missing divide-and-conquer logic');

    // -------------------------------------------------------------
    // Test 5: Controller submitCode Integration
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Controller submitCode integration ---');
    const fakeReq = {
        body: {
            interviewId: 'test-int-cpp-1',
            problem: qTwoSum,
            code: correctTwoSumCpp,
            language: 'cpp'
        }
    };
    let jsonResult = null;
    const fakeRes = {
        json: (data) => { jsonResult = data; return data; },
        status: () => fakeRes
    };
    await submitCode(fakeReq, fakeRes, (err) => { throw err; });

    assert(jsonResult && jsonResult.success === true, 'submitCode returns success: true');
    assert(jsonResult.evaluation.is_correct === true, 'submitCode evaluation is_correct is true');
    assert(jsonResult.answer.code_language === 'cpp', 'submitCode answer record stores code_language as cpp');

    console.log('\n===============================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} SIMPLIFIED C++ CODING ROUND TESTS PASSED!`);
    console.log('===============================================================\n');
}

runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
