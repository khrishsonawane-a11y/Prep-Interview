import { mockStore } from './utils/memoryStore.js';
import {
    codeExecutionService,
    SUPPORTED_LANGUAGES,
    normalizeLanguage,
    normalizeOutput,
    checkLanguageSyntax,
    checkRuntimeErrors,
    checkTimeLimitExceeded,
    executeCode,
    submitCode
} from './services/codeExecutionService.js';
import { evaluateCodingSubmission } from './services/aiService.js';

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

async function runMultiLanguageTests() {
    console.log('===============================================================');
    console.log('🧪 RUNNING CODING/DSA MULTI-LANGUAGE VALIDATION TEST MATRIX');
    console.log('===============================================================\n');

    // 1. Verify 4 Supported Languages and Normalization
    assert(SUPPORTED_LANGUAGES.java && SUPPORTED_LANGUAGES.c && SUPPORTED_LANGUAGES.cpp && SUPPORTED_LANGUAGES.python, 'All 4 languages defined in SUPPORTED_LANGUAGES');
    assert(normalizeLanguage('Python') === 'python', 'normalizeLanguage("Python") returns python');
    assert(normalizeLanguage('py') === 'python', 'normalizeLanguage("py") returns python');
    assert(normalizeLanguage('python3') === 'python', 'normalizeLanguage("python3") returns python');
    assert(normalizeLanguage('C++') === 'cpp', 'normalizeLanguage("C++") returns cpp');
    assert(normalizeLanguage('c') === 'c', 'normalizeLanguage("c") returns c');
    assert(normalizeLanguage('java') === 'java', 'normalizeLanguage("java") returns java');

    // 2. Verify all 32 coding questions have starter and solution codes for all 4 languages
    console.log('\n--- Checking 32 Coding Questions in memoryStore ---');
    assert(mockStore.codingQuestions.length >= 30, `Found ${mockStore.codingQuestions.length} coding questions (expected >= 30)`);
    for (const q of mockStore.codingQuestions) {
        assert(q.starter_code.java && q.starter_code.java.length > 5, `Q (${q.id}) has Java starter code`);
        assert(q.starter_code.c && q.starter_code.c.length > 5, `Q (${q.id}) has C starter code`);
        assert(q.starter_code.cpp && q.starter_code.cpp.length > 5, `Q (${q.id}) has C++ starter code`);
        assert(q.starter_code.python && q.starter_code.python.length > 5, `Q (${q.id}) has Python starter code`);

        assert(q.solution_code.java && q.solution_code.java.length > 10, `Q (${q.id}) has Java solution code`);
        assert(q.solution_code.c && q.solution_code.c.length > 10, `Q (${q.id}) has C solution code`);
        assert(q.solution_code.cpp && q.solution_code.cpp.length > 10, `Q (${q.id}) has C++ solution code`);
        assert(q.solution_code.python && q.solution_code.python.length > 10, `Q (${q.id}) has Python solution code`);
    }

    // 3. Test Optimal Solutions Across All 4 Languages
    console.log('\n--- Testing Correct Solutions Across 4 Languages ---');
    const q1 = mockStore.codingQuestions[0]; // Two Sum

    const javaRes = await executeCode({ code: q1.solution_code.java, language: 'java', testCases: q1.test_cases, problemId: q1.id });
    assert(javaRes.success === true && javaRes.status === 'Accepted' && javaRes.passedCount === q1.test_cases.length, 'Java optimal code is Accepted');

    const cRes = await executeCode({ code: q1.solution_code.c, language: 'c', testCases: q1.test_cases, problemId: q1.id });
    assert(cRes.success === true && cRes.status === 'Accepted' && cRes.passedCount === q1.test_cases.length, 'C optimal code is Accepted');

    const cppRes = await executeCode({ code: q1.solution_code.cpp, language: 'cpp', testCases: q1.test_cases, problemId: q1.id });
    assert(cppRes.success === true && cppRes.status === 'Accepted' && cppRes.passedCount === q1.test_cases.length, 'C++ optimal code is Accepted');

    const pyRes = await executeCode({ code: q1.solution_code.python, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyRes.success === true && pyRes.status === 'Accepted' && pyRes.passedCount === q1.test_cases.length, 'Python optimal code is Accepted');

    // 4. Test Incomplete Starter Stubs (Must be Rejected)
    console.log('\n--- Testing Incomplete Starter Stubs (Must be Wrong Answer) ---');
    const pyStubRes = await executeCode({ code: q1.starter_code.python, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyStubRes.success === false && pyStubRes.status === 'Wrong Answer', 'Python starter stub is rejected as Wrong Answer');

    const javaStubRes = await executeCode({ code: q1.starter_code.java, language: 'java', testCases: q1.test_cases, problemId: q1.id });
    assert(javaStubRes.success === false && javaStubRes.status === 'Wrong Answer', 'Java starter stub is rejected as Wrong Answer');

    // 5. Test Logic Bugs Across Languages
    console.log('\n--- Testing Algorithmic Logic Bugs (Must be Wrong Answer) ---');
    const buggyPyTwoSum = `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            if nums[i] + nums[i] == target:
                return [i, i]
        return []`;
    const pyBugRes = await executeCode({ code: buggyPyTwoSum, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyBugRes.success === false && pyBugRes.status === 'Wrong Answer', 'Python Two Sum self-pairing bug rejected as Wrong Answer');

    // 6. Test Syntax Error Detection Across 4 Languages
    console.log('\n--- Testing Syntax Error Detection Across 4 Languages ---');
    // Python missing colon
    const pyMissingColon = `class Solution:
    def twoSum(self, nums, target)
        return []`;
    const pySynRes = await executeCode({ code: pyMissingColon, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pySynRes.status === 'Compilation Error' && pySynRes.error.includes('Missing colon'), 'Python missing colon is flagged as Compilation Error');

    // Python foreign JS keyword
    const pyForeignKw = `function solve(nums) {
        return nums;
    }`;
    const pyKwRes = await executeCode({ code: pyForeignKw, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyKwRes.status === 'Compilation Error' && pyKwRes.error.includes('Illegal language keyword'), 'Python foreign JS keyword flagged as Compilation Error');

    // Java missing semicolon
    const javaMissingSemicolon = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        int x = 5
        return new int[]{};
    }
}`;
    const javaSynRes = await executeCode({ code: javaMissingSemicolon, language: 'java', testCases: q1.test_cases, problemId: q1.id });
    assert(javaSynRes.status === 'Compilation Error' && javaSynRes.error.includes('Missing semicolon'), 'Java missing semicolon flagged as Compilation Error');

    // C unclosed bracket
    const cUnclosed = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
        int arr[5 = {1,2,3,4,5};
        return NULL;
    }`;
    const cSynRes = await executeCode({ code: cUnclosed, language: 'c', testCases: q1.test_cases, problemId: q1.id });
    assert(cSynRes.status === 'Compilation Error' && cSynRes.error.includes('bracket'), 'C unclosed bracket flagged as Compilation Error');

    // 7. Test Runtime Error Detection Across 4 Languages
    console.log('\n--- Testing Runtime Error Detection Across 4 Languages ---');
    // Python ZeroDivisionError
    const pyDivZero = `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        x = 10 / 0
        return []`;
    const pyDivRes = await executeCode({ code: pyDivZero, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyDivRes.status === 'Runtime Error' && pyDivRes.error.includes('ZeroDivisionError'), 'Python division by zero detected as Runtime Error (ZeroDivisionError)');

    // Python None AttributeError
    const pyNoneAttr = `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        x = None.some_method()
        return []`;
    const pyNoneRes = await executeCode({ code: pyNoneAttr, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyNoneRes.status === 'Runtime Error' && pyNoneRes.error.includes('AttributeError'), 'Python None dereference detected as Runtime Error (AttributeError)');

    // Java Division by Zero
    const javaDivZero = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        int x = 10 / 0;
        return new int[]{};
    }
}`;
    const javaDivRes = await executeCode({ code: javaDivZero, language: 'java', testCases: q1.test_cases, problemId: q1.id });
    assert(javaDivRes.status === 'Runtime Error' && javaDivRes.error.includes('ArithmeticException'), 'Java division by zero detected as Runtime Error');

    // C Segmentation fault
    const cSegfault = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
        int *ptr = 0;
        *ptr = 0;
        return NULL;
    }`;
    const cSegRes = await executeCode({ code: cSegfault, language: 'c', testCases: q1.test_cases, problemId: q1.id });
    assert(cSegRes.status === 'Runtime Error' && cSegRes.error.includes('Segmentation fault'), 'C segfault detected as Runtime Error');

    // 8. Test Time Limit Exceeded Across Languages
    console.log('\n--- Testing Time Limit Exceeded Detection ---');
    const pyTLE = `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        while True:
            pass`;
    const pyTleRes = await executeCode({ code: pyTLE, language: 'python', testCases: q1.test_cases, problemId: q1.id });
    assert(pyTleRes.status === 'Time Limit Exceeded', 'Python infinite while True flagged as Time Limit Exceeded');

    const javaTLE = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        while (true) {
            int x = 1;
        }
    }
}`;
    const javaTleRes = await executeCode({ code: javaTLE, language: 'java', testCases: q1.test_cases, problemId: q1.id });
    assert(javaTleRes.status === 'Time Limit Exceeded', 'Java infinite while(true) flagged as Time Limit Exceeded');

    // 9. Test AI Review Generation with Python and Test Cases
    console.log('\n--- Testing AI Review Generation for Python ---');
    const review = await evaluateCodingSubmission({
        problem: q1,
        code: q1.solution_code.python,
        language: 'python',
        testResults: pyRes.results,
        execution: pyRes
    });
    assert(review.score >= 90 && review.status === 'Accepted' && review.error_type === 'None (Correct)', 'AI review for optimal Python submission scores >= 90 with Accepted status');

    const buggyReview = await evaluateCodingSubmission({
        problem: q1,
        code: buggyPyTwoSum,
        language: 'python',
        testResults: pyBugRes.results,
        execution: pyBugRes
    });
    assert(buggyReview.score < 90 && buggyReview.error_type !== 'None (Correct)' && buggyReview.mistakes.length > 0, 'AI review for buggy Python correctly identifies error type and mistakes');

    console.log('\n===============================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} MULTI-LANGUAGE TESTS PASSED SUCCESSFULLY!`);
    console.log('===============================================================\n');
}

runMultiLanguageTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
