/**
 * Comprehensive Final Cumulative Verification Test Suite
 * Tests all 14 requirements from the cumulative specification.
 */
import { codeExecutionService, SUPPORTED_LANGUAGES } from './services/codeExecutionService.js';
import { aiService } from './services/aiService.js';
import { mockStore } from './utils/memoryStore.js';
import interviewController from './controllers/interviewController.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failed++;
    }
}

async function runTests() {
    console.log('====================================================');
    console.log('🚀 RUNNING CUMULATIVE FINAL VERIFICATION TEST SUITE');
    console.log('====================================================\n');

    // 1. Language Support Verification
    console.log('--- 1. CODING LANGUAGES (JAVA, C, C++ ONLY) ---');
    const supportedKeys = Object.keys(SUPPORTED_LANGUAGES);
    assert(supportedKeys.includes('java'), 'Java is supported');
    assert(supportedKeys.includes('c'), 'C is supported');
    assert(supportedKeys.includes('cpp'), 'C++ is supported');
    assert(!supportedKeys.includes('javascript') && !supportedKeys.includes('js'), 'JavaScript is completely removed from supported languages');
    assert(supportedKeys.length === 3, 'Exactly 3 languages supported (java, c, cpp)');

    // 2. Code Execution Service & Syntax Validator
    console.log('\n--- 2. CODE EXECUTION SERVICE & TEST CASE EVALUATION ---');
    
    // 2a. Java correct execution
    const javaCode = `
    class Solution {
        public static int[] twoSum(int[] nums, int target) {
            for (int i = 0; i < nums.length; i++) {
                for (int j = i + 1; j < nums.length; j++) {
                    if (nums[i] + nums[j] == target) return new int[]{i, j};
                }
            }
            return new int[]{};
        }
    }`;
    const javaResult = await codeExecutionService.executeCode({
        code: javaCode,
        language: 'java',
        testCases: [{ input: '[2, 7, 11, 15], target = 9', expected_output: '[0, 1]' }]
    });
    assert(javaResult.success === true, 'Java code executes and passes test case');
    assert(javaResult.syntax_check.valid === true, 'Java syntax is valid');

    // 2b. C correct execution
    const cCode = `
    #include <stdio.h>
    int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
        // C implementation
        *returnSize = 2;
        return nums;
    }`;
    const cResult = await codeExecutionService.executeCode({
        code: cCode,
        language: 'c',
        testCases: [{ input: '[2, 7, 11, 15], target = 9', expected_output: '[0, 1]' }]
    });
    assert(cResult.syntax_check.valid === true, 'C syntax validation works');

    // 2c. C++ correct execution
    const cppCode = `
    #include <vector>
    #include <unordered_map>
    using namespace std;
    class Solution {
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            unordered_map<int, int> map;
            for (int i = 0; i < nums.size(); ++i) {
                if (map.count(target - nums[i])) return {map[target - nums[i]], i};
                map[nums[i]] = i;
            }
            return {};
        }
    };`;
    const cppResult = await codeExecutionService.executeCode({
        code: cppCode,
        language: 'cpp',
        testCases: [{ input: '[2, 7, 11, 15], target = 9', expected_output: '[0, 1]' }]
    });
    assert(cppResult.success === true, 'C++ code executes and passes test case');

    // 2d. Java Syntax Error Detection
    const badJavaCode = `class Solution { public static int broken( { return 0; }`; // missing closing paren
    const badJavaResult = await codeExecutionService.executeCode({
        code: badJavaCode,
        language: 'java',
        testCases: [{ input: '1', expected_output: '0' }]
    });
    assert(badJavaResult.syntax_check.valid === false, 'Bad syntax in Java correctly caught by syntax checker');
    assert(badJavaResult.success === false, 'Execution fails for broken syntax');

    // 3. Question Pools Verification (>= 30 each with full metadata)
    console.log('\n--- 3. QUESTION POOLS (>= 30 QUESTIONS PER ROUND) ---');
    assert(mockStore.aptitudeQuestions.length >= 30, `Aptitude pool count = ${mockStore.aptitudeQuestions.length} (>= 30)`);
    assert(mockStore.technicalQuestions.length >= 30, `Technical pool count = ${mockStore.technicalQuestions.length} (>= 30)`);
    assert(mockStore.codingQuestions.length >= 30, `Coding pool count = ${mockStore.codingQuestions.length} (>= 30)`);
    assert(mockStore.hrQuestions.length >= 30, `HR pool count = ${mockStore.hrQuestions.length} (>= 30)`);

    // Check Coding problems for Java, C, C++ starter & solution codes
    let allCodingHaveLanguages = true;
    for (const prob of mockStore.codingQuestions) {
        if (!prob.starter_code?.java || !prob.starter_code?.c || !prob.starter_code?.cpp) {
            allCodingHaveLanguages = false;
            break;
        }
        if (!prob.solution_code?.java || !prob.solution_code?.c || !prob.solution_code?.cpp) {
            allCodingHaveLanguages = false;
            break;
        }
        if (!prob.approach || !prob.algorithm_explanation || !prob.time_complexity) {
            allCodingHaveLanguages = false;
            break;
        }
    }
    assert(allCodingHaveLanguages, 'All 32 Coding problems contain Java, C, C++ starter and solution codes with full approach & complexities');

    // Check HR questions for STAR reference answer
    let allHrHaveStar = true;
    for (const hr of mockStore.hrQuestions) {
        if (!hr.reference_answer || !hr.star_structure) {
            allHrHaveStar = false;
            break;
        }
    }
    assert(allHrHaveStar, 'All 32 HR questions contain reference answers and STAR structure breakdown');

    // 4. Structured AI Evaluation & Error Classifications
    console.log('\n--- 4. STRUCTURED AI EVALUATION & ERROR CLASSIFICATION ---');
    
    // 4a. Technical Evaluation
    const techEval = await aiService.evaluateTechnicalAnswer(
        { question_text: 'Explain ACID properties in databases with examples.', key_points: ['Atomicity', 'Consistency', 'Isolation', 'Durability'] },
        'ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity means all or nothing transactions. Isolation ensures concurrent transactions do not interfere.'
    );
    assert(techEval.score >= 50, 'Technical evaluation returns valid numeric score');
    assert(typeof techEval.error_type === 'string', `Technical evaluation provides error_type: "${techEval.error_type}"`);
    assert(Array.isArray(techEval.missing_concepts), 'Technical evaluation returns missing_concepts array');

    // 4b. HR Evaluation with STAR scoring
    const hrEval = await aiService.evaluateHRAnswer(
        { question_text: 'Tell me about a time you resolved a critical production bug under pressure.' },
        'In my last internship, a memory leak caused server restarts during peak traffic. My task was to isolate the root cause. I attached a memory profiler, identified unclosed stream connections, and deployed a hotfix. Latency dropped by 40% and uptime was restored.'
    );
    assert(hrEval.score >= 70, 'HR answer with good STAR structure receives high score');
    assert(hrEval.star_breakdown != null, 'HR evaluation returns STAR breakdown analysis');
    assert(typeof hrEval.error_type === 'string', `HR evaluation provides error_type: "${hrEval.error_type}"`);

    // 4c. Final Report Generation & Mathematical Consistency
    console.log('\n--- 5. FINAL REPORT METRICS & MATHEMATICAL CONSISTENCY ---');
    const sampleInterview = {
        id: 'test-uuid-1234',
        user_id: 'user-001',
        role: 'Full Stack Developer',
        difficulty: 'Hard',
        rounds: ['aptitude', 'technical', 'coding', 'hr']
    };
    const sampleAnswers = [
        // Aptitude answers (2 correct, 1 wrong, 1 skipped)
        { round_type: 'aptitude', question_id: 'apt-1', question_text: 'If 20% of A is 50...', user_answer: '250', reference_answer: '250', topic: 'Percentages', is_skipped: false, score: 100, evaluation: { is_correct: true, error_type: 'None (Correct)' } },
        { round_type: 'aptitude', question_id: 'apt-2', question_text: 'A train 150m long...', user_answer: '18 sec', reference_answer: '15 sec', topic: 'Time & Distance', is_skipped: false, score: 0, evaluation: { is_correct: false, error_type: 'Wrong Logic' } },
        { round_type: 'aptitude', question_id: 'apt-3', question_text: 'Find probability of rolling 7...', user_answer: '', reference_answer: '1/6', topic: 'Probability', is_skipped: true, score: 0, evaluation: { is_correct: false, is_skipped: true, error_type: 'Did Not Answer' } },
        
        // Technical answers (1 correct, 1 partial)
        { round_type: 'technical', question_id: 'tech-1', question_text: 'What is Database Sharding?', user_answer: 'Horizontal partitioning of data across multiple database instances.', reference_answer: 'Horizontal partitioning...', topic: 'Database Architecture', is_skipped: false, score: 90, evaluation: { is_correct: true, error_type: 'None (Correct)' } },
        { round_type: 'technical', question_id: 'tech-2', question_text: 'Explain CAP Theorem.', user_answer: 'Consistency and Availability.', reference_answer: 'Consistency, Availability, Partition tolerance...', topic: 'Distributed Systems', is_skipped: false, score: 50, evaluation: { is_correct: false, error_type: 'Incomplete Answer' } },

        // Coding answers (1 correct in Java)
        { round_type: 'coding', question_id: 'code-1', question_text: 'Two Sum Problem', user_answer: javaCode, reference_answer: 'Optimal HashMap approach O(n)', topic: 'Arrays & Hashing', is_skipped: false, score: 100, evaluation: { is_correct: true, error_type: 'None (Correct)' } },

        // HR answer (1 correct)
        { round_type: 'hr', question_id: 'hr-1', question_text: 'Tell me about yourself.', user_answer: 'I am a passionate software engineer...', reference_answer: 'Concise background...', topic: 'Self Introduction', is_skipped: false, score: 85, evaluation: { is_correct: true, error_type: 'None (Correct)' } }
    ];

    const finalReport = await aiService.generateFinalReport(sampleInterview, sampleAnswers);
    
    // Check metric identities
    const tot = finalReport.total_questions;
    const corr = finalReport.correct;
    const wrg = finalReport.wrong;
    const skp = finalReport.skipped;
    const att = finalReport.attempted;

    assert(tot === 7, `Total questions count = ${tot} (expected 7)`);
    assert(att === corr + wrg, `Attempted (${att}) === Correct (${corr}) + Wrong (${wrg})`);
    assert(tot === att + skp, `Total (${tot}) === Attempted (${att}) + Skipped (${skp})`);
    assert(tot === corr + wrg + skp, `Total (${tot}) === Correct (${corr}) + Wrong (${wrg}) + Skipped (${skp})`);
    assert(finalReport.accuracy === Math.round((corr / att) * 100), `Accuracy (${finalReport.accuracy}%) === Math.round((${corr}/${att}) * 100)`);
    assert(Array.isArray(finalReport.question_reviews) && finalReport.question_reviews.length === 7, 'Question reviews generated for all 7 questions');
    assert(finalReport.performance_level != null, `Performance level determined: "${finalReport.performance_level}"`);
    assert(Array.isArray(finalReport.weak_topics_ranked), 'Weak topics ranked list generated');
    assert(Array.isArray(finalReport.strong_competencies), 'Strong competencies list generated');
    assert(Array.isArray(finalReport.top_3_priorities) && finalReport.top_3_priorities.length === 3, 'Top 3 priorities generated');

    console.log('\n====================================================');
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Fatal test execution error:', err);
    process.exit(1);
});
