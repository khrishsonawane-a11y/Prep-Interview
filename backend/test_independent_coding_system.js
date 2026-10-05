/**
 * Test Suite: Independent Question State, C++-Only Evaluation, 3-State Verdicts, and Approach Explanation
 */
import { evaluateCodingSubmission } from './services/aiService.js';
import { submitCode, getCodingQuestions } from './controllers/codingController.js';
import { finalizeInterview } from './controllers/interviewController.js';
import { mockStore } from './utils/memoryStore.js';
import assert from 'assert';

async function runTests() {
    console.log('=== STARTING INDEPENDENT CODING SYSTEM TESTS ===\n');
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

    // --- TEST 1: Question State Isolation & Preservation ---
    test('1. Independent Question State & Answer Preservation Logic', () => {
        const questionsState = {};
        const dummyProblems = [
            { id: 'code-1', title: 'Two Sum' },
            { id: 'code-2', title: 'Valid Parentheses' },
            { id: 'code-3', title: 'Reverse Linked List' }
        ];

        // Simulate user typing on Q1
        questionsState['code-1'] = {
            id: 'code-1',
            candidateCode: 'class Solution { // Code A for Two Sum };',
            explanation: 'Hash map approach O(N) time',
            evaluationStatus: 'visited'
        };

        // Simulate user moving to Q2 and typing
        questionsState['code-2'] = {
            id: 'code-2',
            candidateCode: 'class Solution { // Code B for Valid Parentheses };',
            explanation: 'LIFO Stack approach O(N) time',
            evaluationStatus: 'visited'
        };

        // Simulate user moving to Q3 and typing
        questionsState['code-3'] = {
            id: 'code-3',
            candidateCode: 'class Solution { // Code C for Reverse Linked List };',
            explanation: 'Iterative 3 pointers approach O(N) time',
            evaluationStatus: 'visited'
        };

        // Verify state is stored independently per questionId
        assert.strictEqual(questionsState['code-1'].candidateCode, 'class Solution { // Code A for Two Sum };');
        assert.strictEqual(questionsState['code-1'].explanation, 'Hash map approach O(N) time');

        assert.strictEqual(questionsState['code-2'].candidateCode, 'class Solution { // Code B for Valid Parentheses };');
        assert.strictEqual(questionsState['code-2'].explanation, 'LIFO Stack approach O(N) time');

        assert.strictEqual(questionsState['code-3'].candidateCode, 'class Solution { // Code C for Reverse Linked List };');
        assert.strictEqual(questionsState['code-3'].explanation, 'Iterative 3 pointers approach O(N) time');
    });

    // --- TEST 2: Fully Correct C++ Submission ---
    await asyncTest('2. Fully Correct C++ Submission Evaluation (Two Sum Optimal Hash Map + Good Explanation)', async () => {
        const problem = mockStore.codingQuestions.find(q => q.id === 'code-1');
        const code = `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
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
        const explanation = 'We maintain an unordered_map to store the seen value to index mapping. In a single loop iteration over the array, we calculate the complement = target - nums[i]. If complement is in the map, return indices. Time complexity is O(N) and space complexity is O(N).';

        const result = await evaluateCodingSubmission({
            problem,
            code,
            explanation,
            language: 'cpp'
        });

        assert.strictEqual(result.status, 'Correct');
        assert.strictEqual(result.is_correct, true);
        assert.ok(result.score >= 85, `Expected score >= 85, got ${result.score}`);
        assert.strictEqual(result.verdict_title, '✅ Your code is correct.');
        assert.strictEqual(result.explanation_rating, 'Good');
        assert.ok(result.why_it_is_correct.length > 0);
    });

    // --- TEST 3: Partially Correct C++ Submission (Edge Case Flaw) ---
    await asyncTest('3. Partially Correct C++ Submission Evaluation (Kadane max=0 failing on negative arrays)', async () => {
        const problem = mockStore.codingQuestions.find(q => q.id === 'code-5');
        const code = `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = 0; // BUG on all-negative array
        int currSum = 0;
        for (int x : nums) {
            currSum += x;
            if (currSum > maxSum) maxSum = currSum;
            if (currSum < 0) currSum = 0;
        }
        return maxSum;
    }
};`;
        const explanation = 'Using Kadane algorithm accumulating currSum and updating maxSum. Resets when negative.';

        const result = await evaluateCodingSubmission({
            problem,
            code,
            explanation,
            language: 'cpp'
        });

        assert.strictEqual(result.status, 'Partially Correct');
        assert.strictEqual(result.is_correct, false);
        assert.ok(result.score >= 45 && result.score <= 65, `Expected score in 45-65, got ${result.score}`);
        assert.strictEqual(result.verdict_title, '🟡 Your code is partially correct.');
        assert.ok(result.what_is_correct.length > 0);
        assert.ok(result.problem_identified.includes('all-negative') || result.problem_identified.includes('0'));
        assert.ok(result.why_it_is_wrong.length > 0);
        assert.ok(result.hint.length > 0);
    });

    // --- TEST 4: Partially Correct C++ Submission (Suboptimal Brute Force Nested Loops) ---
    await asyncTest('4. Partially Correct C++ Submission (Two Sum Brute Force O(N^2))', async () => {
        const problem = mockStore.codingQuestions.find(q => q.id === 'code-1');
        const code = `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < (int)nums.size(); i++) {
            for (int j = i + 1; j < (int)nums.size(); j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`;
        const explanation = 'Checked all pairs with double for loop.';

        const result = await evaluateCodingSubmission({
            problem,
            code,
            explanation,
            language: 'cpp'
        });

        assert.strictEqual(result.status, 'Partially Correct');
        assert.strictEqual(result.is_correct, false);
        assert.ok(result.problem_identified.includes('O(N^2)') || result.problem_identified.includes('Suboptimal'));
    });

    // --- TEST 5: Incorrect C++ Submission (Self-Pairing Bug) ---
    await asyncTest('5. Incorrect C++ Submission Evaluation (Two Sum Self-Pairing Bug)', async () => {
        const problem = mockStore.codingQuestions.find(q => q.id === 'code-1');
        const code = `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < (int)nums.size(); i++) {
            if (nums[i] + nums[i] == target) {
                return {i, i};
            }
        }
        return {};
    }
};`;

        const result = await evaluateCodingSubmission({
            problem,
            code,
            language: 'cpp'
        });

        assert.strictEqual(result.status, 'Incorrect');
        assert.strictEqual(result.is_correct, false);
        assert.ok(result.score <= 35, `Expected score <= 35, got ${result.score}`);
        assert.strictEqual(result.verdict_title, '❌ Your code is incorrect.');
        assert.ok(result.problem_identified.includes('Self-pairing'));
        assert.ok(result.reference_solution.length > 0);
    });

    // --- TEST 6: Incorrect C++ Submission (Missing Stack in Valid Parentheses) ---
    await asyncTest('6. Incorrect C++ Submission (Missing Stack in Valid Parentheses)', async () => {
        const problem = mockStore.codingQuestions.find(q => q.id === 'code-2');
        const code = `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        return s.length() % 2 == 0;
    }
};`;

        const result = await evaluateCodingSubmission({
            problem,
            code,
            language: 'cpp'
        });

        assert.strictEqual(result.status, 'Incorrect');
        assert.strictEqual(result.is_correct, false);
        assert.ok(result.problem_identified.includes('stack') || result.problem_identified.includes('LIFO'));
    });

    // --- TEST 7: Controller Integration (Submit Answer & Store Record) ---
    await asyncTest('7. submitCode Controller Integration with Approach Explanation', async () => {
        const interviewId = 'int-test-123';
        const problem = mockStore.codingQuestions[0];
        const code = `#include <vector>\n#include <unordered_map>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`;
        const explanation = 'Hash map lookup in O(N) time and O(N) space complexity.';

        const req = {
            user: { id: 'test-user-1' },
            body: {
                interviewId,
                problem,
                code,
                explanation,
                language: 'cpp'
            }
        };

        let responseData = null;
        const res = {
            json: (data) => { responseData = data; return res; },
            status: (code) => res
        };

        await submitCode(req, res, (err) => { if (err) throw err; });

        assert.ok(responseData.success);
        assert.strictEqual(responseData.evaluation.status, 'Correct');
        assert.strictEqual(responseData.answer.code_language, 'cpp');
        assert.strictEqual(responseData.answer.user_explanation, explanation);
    });

    // --- TEST 8: Final Report Generation With 3-State Coding Results ---
    await asyncTest('8. Final Report Calculation With 3-State Coding Results', async () => {
        const interviewId = 'int-report-test-1';
        mockStore.interviews.set(interviewId, {
            id: interviewId,
            user_id: 'test-user-1',
            role: 'Software Developer',
            difficulty: 'Intermediate',
            status: 'completed',
            rounds_config: ['coding']
        });

        mockStore.answers.set('ans-1', {
            id: 'ans-1',
            interview_id: interviewId,
            round_type: 'coding',
            question_text: 'Two Sum',
            topic: 'Arrays & Hash Maps',
            user_answer: 'correct code',
            user_explanation: 'hash map explanation',
            code_language: 'cpp',
            is_correct: true,
            is_partially_correct: false,
            score: 95,
            ai_evaluation: {
                status: 'Correct',
                why_it_is_correct: 'Optimal O(N) hash map solution.'
            }
        });

        mockStore.answers.set('ans-2', {
            id: 'ans-2',
            interview_id: interviewId,
            round_type: 'coding',
            question_text: 'Maximum Subarray',
            topic: 'Dynamic Programming',
            user_answer: 'partially correct code',
            user_explanation: 'Kadane algorithm',
            code_language: 'cpp',
            is_correct: false,
            is_partially_correct: true,
            score: 55,
            ai_evaluation: {
                status: 'Partially Correct',
                why_it_is_wrong: 'Fails for all-negative arrays.'
            }
        });

        mockStore.answers.set('ans-3', {
            id: 'ans-3',
            interview_id: interviewId,
            round_type: 'coding',
            question_text: 'Valid Parentheses',
            topic: 'Stack',
            user_answer: '// [SKIPPED]',
            code_language: 'cpp',
            is_skipped: true,
            is_correct: false,
            is_partially_correct: false,
            score: 0
        });

        const req = {
            user: { id: 'test-user-1' },
            params: { id: interviewId }
        };

        let finalizeData = null;
        const res = {
            json: (data) => { finalizeData = data; return res; },
            status: (code) => res
        };

        await finalizeInterview(req, res, (err) => { if (err) throw err; });

        assert.ok(finalizeData.success);
        assert.ok(finalizeData.results.coding_summary);
        assert.strictEqual(finalizeData.results.coding_summary.total_questions, 3);
        assert.strictEqual(finalizeData.results.coding_summary.attempted, 2);
        assert.strictEqual(finalizeData.results.coding_summary.correct, 1);
        assert.strictEqual(finalizeData.results.coding_summary.skipped, 1);
    });

    console.log(`\n=== TEST SUMMARY: ${passed}/${total} PASSED ===`);
    if (passed !== total) process.exit(1);
}

runTests().catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
});
