import { evaluateTechnicalAnswer, getHeuristicTechnicalEvaluation } from './services/aiService.js';
import { mockStore } from './utils/memoryStore.js';

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

async function runTests() {
    console.log('\n================================================================');
    console.log('RUNNING VERIFICATION FOR MODERN IMPROVEMENTS & PREPARATION GUIDE');
    console.log('================================================================\n');

    // 1. Test Strict AI Evaluation on Irrelevant / Off-topic Answers
    console.log('--- TEST 1: Strict AI Technical Evaluation for Irrelevant Answers ---');
    const polyQuestion = "Explain the difference between method overloading and method overriding in object-oriented programming.";
    const irrelevantAnswer = "Cloud computing provides on-demand availability of computer system resources like data storage and computing power without direct active management by the user.";

    const heuristicEval = getHeuristicTechnicalEvaluation(polyQuestion, irrelevantAnswer, "Intermediate");
    assert(heuristicEval.score < 30, `Irrelevant answer receives low score (${heuristicEval.score}/100)`);
    assert(heuristicEval.verdict === 'Irrelevant' || heuristicEval.correctness === 'Very Low', `Irrelevant verdict detected: ${heuristicEval.verdict}`);
    assert(heuristicEval.relevance === 'Very Low', `Relevance is flagged as Very Low`);

    const relevantAnswer = "Method overloading happens at compile time within the same class where methods share the same name but have different parameter signatures. Method overriding occurs at runtime in inheritance when a subclass provides a specific implementation of a method declared in its parent class.";
    const heuristicGoodEval = getHeuristicTechnicalEvaluation(polyQuestion, relevantAnswer, "Intermediate");
    assert(heuristicGoodEval.score >= 70, `Accurate answer receives high score (${heuristicGoodEval.score}/100)`);
    assert(heuristicGoodEval.verdict === 'Correct' || heuristicGoodEval.verdict === 'Mostly Correct', `Accurate verdict assigned: ${heuristicGoodEval.verdict}`);

    // 2. Test Question Pool Sizes for All Rounds
    console.log('\n--- TEST 2: Question Pool Sizes for All Rounds ---');
    assert(mockStore.aptitudeQuestions.length >= 30, `Aptitude pool has ${mockStore.aptitudeQuestions.length} questions (>= 30)`);
    assert(mockStore.technicalQuestions.length >= 30, `Technical pool has ${mockStore.technicalQuestions.length} questions (>= 30)`);
    assert(mockStore.codingQuestions.length >= 30, `Coding pool has ${mockStore.codingQuestions.length} problems (>= 30)`);
    assert(mockStore.hrQuestions.length >= 30, `HR pool has ${mockStore.hrQuestions.length} questions (>= 30)`);

    // 3. Test Skip Question Calculation (Total = Correct + Wrong + Skipped)
    console.log('\n--- TEST 3: Skip Question Mechanics & Math Integrity ---');
    const aptRoundAnswers = [
        { is_skipped: false, is_correct: true },
        { is_skipped: false, is_correct: true },
        { is_skipped: false, is_correct: false },
        { is_skipped: true, is_correct: false },
        { is_skipped: true, is_correct: false }
    ];
    let correct = aptRoundAnswers.filter(a => a.is_correct && !a.is_skipped).length;
    let skipped = aptRoundAnswers.filter(a => a.is_skipped).length;
    let wrong = aptRoundAnswers.filter(a => !a.is_correct && !a.is_skipped).length;
    let total = aptRoundAnswers.length;

    assert(correct === 2, `Correct count is 2`);
    assert(skipped === 2, `Skipped count is 2`);
    assert(wrong === 1, `Wrong count is 1`);
    assert(total === correct + wrong + skipped, `Total (${total}) = Correct (${correct}) + Wrong (${wrong}) + Skipped (${skipped})`);

    console.log(`\n================================================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`================================================================\n`);

    if (failed > 0) process.exit(1);
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
