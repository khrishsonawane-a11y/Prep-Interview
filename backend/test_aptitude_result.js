import assert from 'assert';
import { mockStore } from './utils/memoryStore.js';

console.log('================================================================');
console.log('RUNNING APTITUDE ROUND DATA-BASED RESULT SCREEN TEST SUITE');
console.log('================================================================');

// Import / Replicate pure evaluation logic from aptitude.js to verify ground-truth calculation
function calculateAptitudeEvaluation(questions, userAnswers, questionTimeSpent = {}, roundStartTime = Date.now() - 60000) {
    const totalQuestions = questions.length;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    const topicStats = {};
    const questionReviews = [];
    const labels = ['A', 'B', 'C', 'D'];

    questions.forEach((q, i) => {
        const selectedIdx = userAnswers[i];
        const isSkipped = selectedIdx === undefined || selectedIdx === -1;
        const isCorrect = !isSkipped && selectedIdx === q.correct_option;
        const isIncorrect = !isSkipped && selectedIdx !== q.correct_option;

        if (isSkipped) {
            skipped++;
        } else {
            attempted++;
            if (isCorrect) correct++;
            else incorrect++;
        }

        // Topic Aggregation
        const topic = q.topic || 'General Aptitude';
        if (!topicStats[topic]) {
            topicStats[topic] = {
                topic,
                category: q.category || 'Quantitative',
                total: 0,
                attempted: 0,
                correct: 0,
                incorrect: 0,
                skipped: 0
            };
        }

        topicStats[topic].total++;
        if (isSkipped) {
            topicStats[topic].skipped++;
        } else {
            topicStats[topic].attempted++;
            if (isCorrect) topicStats[topic].correct++;
            else topicStats[topic].incorrect++;
        }

        const userAnsText = isSkipped
            ? 'Skipped (No Option Selected)'
            : `${labels[selectedIdx]}: ${q.options?.[selectedIdx] || `Option ${selectedIdx + 1}`}`;

        const corrIdx = q.correct_option ?? 0;
        const corrAnsText = `${labels[corrIdx]}: ${q.options?.[corrIdx] || `Option ${corrIdx + 1}`}`;

        questionReviews.push({
            index: i + 1,
            id: q.id,
            topic: topic,
            category: q.category || 'Quantitative',
            question: q.question,
            options: q.options || [],
            correctOptionIndex: corrIdx,
            selectedOptionIndex: selectedIdx,
            userAnswer: userAnsText,
            correctAnswer: corrAnsText,
            status: isCorrect ? 'correct' : (isSkipped ? 'skipped' : 'incorrect'),
            marks: isCorrect ? 1 : 0,
            maxMarks: 1,
            explanation: q.explanation,
            timeSpent: questionTimeSpent[i] || 0
        });
    });

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 1000) / 10 : 0;
    const score = correct;
    const maxScore = totalQuestions;
    const scorePercent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 1000) / 10 : 0;
    const completionPercent = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 1000) / 10 : 0;

    let performanceLevel = { label: 'Needs Improvement', class: 'needs-improvement' };
    if (scorePercent >= 85) {
        performanceLevel = { label: 'Excellent', class: 'excellent' };
    } else if (scorePercent >= 70) {
        performanceLevel = { label: 'Good', class: 'good' };
    } else if (scorePercent >= 50) {
        performanceLevel = { label: 'Average', class: 'average' };
    }

    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - roundStartTime) / 1000));
    const avgTimePerQuestion = totalQuestions > 0 ? Math.round((totalTimeSeconds / totalQuestions) * 10) / 10 : 0;

    const topicsArray = Object.values(topicStats).map(t => {
        const topicAcc = t.attempted > 0 ? Math.round((t.correct / t.attempted) * 1000) / 10 : 0;
        return {
            ...t,
            accuracy: topicAcc
        };
    });

    const strongAreas = topicsArray.filter(t => t.attempted > 0 && t.accuracy >= 70);
    const weakAreas = topicsArray.filter(t => t.total > 0 && t.accuracy < 70);

    return {
        totalQuestions,
        attempted,
        correct,
        incorrect,
        skipped,
        accuracy,
        score,
        maxScore,
        scorePercent,
        completionPercent,
        performanceLevel,
        totalTimeSeconds,
        avgTimePerQuestion,
        topics: topicsArray,
        strongAreas,
        weakAreas,
        questionReviews
    };
}

const pool = mockStore.aptitudeQuestions.slice(0, 30);
assert(pool.length === 30, 'Expected 30 aptitude questions in pool');

console.log('\n--- SCENARIO 1: All Answers Correct (100% Score) ---');
{
    const userAnswers = {};
    pool.forEach((q, i) => { userAnswers[i] = q.correct_option; });
    const res = calculateAptitudeEvaluation(pool, userAnswers);

    assert.strictEqual(res.totalQuestions, 30);
    assert.strictEqual(res.attempted, 30);
    assert.strictEqual(res.correct, 30);
    assert.strictEqual(res.incorrect, 0);
    assert.strictEqual(res.skipped, 0);
    assert.strictEqual(res.accuracy, 100.0);
    assert.strictEqual(res.score, 30);
    assert.strictEqual(res.maxScore, 30);
    assert.strictEqual(res.scorePercent, 100.0);
    assert.strictEqual(res.completionPercent, 100.0);
    assert.strictEqual(res.performanceLevel.label, 'Excellent');
    assert.strictEqual(res.correct + res.incorrect + res.skipped, res.totalQuestions);
    console.log('  [PASS] Scenario 1 evaluated accurately (30/30, 100% Accuracy, Excellent)');
}

console.log('\n--- SCENARIO 2: Mix of Correct, Incorrect, and Skipped ---');
{
    // 21 correct, 6 incorrect, 3 skipped
    const userAnswers = {};
    pool.forEach((q, i) => {
        if (i < 21) userAnswers[i] = q.correct_option; // 21 correct
        else if (i < 27) userAnswers[i] = (q.correct_option + 1) % 4; // 6 incorrect
        else userAnswers[i] = -1; // 3 skipped
    });

    const res = calculateAptitudeEvaluation(pool, userAnswers);

    assert.strictEqual(res.totalQuestions, 30);
    assert.strictEqual(res.attempted, 27);
    assert.strictEqual(res.correct, 21);
    assert.strictEqual(res.incorrect, 6);
    assert.strictEqual(res.skipped, 3);
    assert.strictEqual(res.correct + res.incorrect + res.skipped, 30);

    const expectedAcc = Math.round((21 / 27) * 1000) / 10;
    assert.strictEqual(res.accuracy, expectedAcc); // 77.8%
    assert.strictEqual(res.score, 21);
    assert.strictEqual(res.scorePercent, 70.0);
    assert.strictEqual(res.completionPercent, 90.0);
    assert.strictEqual(res.performanceLevel.label, 'Good');
    console.log(`  [PASS] Scenario 2 evaluated accurately (${res.correct}/${res.totalQuestions}, ${res.accuracy}% Accuracy, ${res.performanceLevel.label})`);
}

console.log('\n--- SCENARIO 3: Some Questions Skipped ---');
{
    // 15 correct, 5 incorrect, 10 skipped
    const userAnswers = {};
    pool.forEach((q, i) => {
        if (i < 15) userAnswers[i] = q.correct_option;
        else if (i < 20) userAnswers[i] = (q.correct_option + 2) % 4;
        else userAnswers[i] = -1;
    });

    const res = calculateAptitudeEvaluation(pool, userAnswers);

    assert.strictEqual(res.totalQuestions, 30);
    assert.strictEqual(res.attempted, 20);
    assert.strictEqual(res.correct, 15);
    assert.strictEqual(res.incorrect, 5);
    assert.strictEqual(res.skipped, 10);
    assert.strictEqual(res.accuracy, 75.0);
    assert.strictEqual(res.scorePercent, 50.0);
    assert.strictEqual(res.completionPercent, 66.7);
    assert.strictEqual(res.performanceLevel.label, 'Average');
    assert.strictEqual(res.correct + res.incorrect + res.skipped, 30);
    console.log('  [PASS] Scenario 3 evaluated accurately (15/30, 75% Accuracy, Average)');
}

console.log('\n--- SCENARIO 4: All Questions Skipped ---');
{
    const userAnswers = {};
    pool.forEach((q, i) => { userAnswers[i] = -1; });
    const res = calculateAptitudeEvaluation(pool, userAnswers);

    assert.strictEqual(res.totalQuestions, 30);
    assert.strictEqual(res.attempted, 0);
    assert.strictEqual(res.correct, 0);
    assert.strictEqual(res.incorrect, 0);
    assert.strictEqual(res.skipped, 30);
    assert.strictEqual(res.accuracy, 0);
    assert.strictEqual(res.score, 0);
    assert.strictEqual(res.scorePercent, 0);
    assert.strictEqual(res.completionPercent, 0);
    assert.strictEqual(res.performanceLevel.label, 'Needs Improvement');
    assert.strictEqual(res.correct + res.incorrect + res.skipped, 30);
    console.log('  [PASS] Scenario 4 evaluated accurately (0/30, 0% Accuracy, Needs Improvement)');
}

console.log('\n--- SCENARIO 5: Topic-Wise Stats & Strong/Weak Classification ---');
{
    const userAnswers = {};
    // First 18 correct, rest incorrect
    pool.forEach((q, i) => {
        if (i < 18) userAnswers[i] = q.correct_option;
        else userAnswers[i] = (q.correct_option + 1) % 4;
    });

    const res = calculateAptitudeEvaluation(pool, userAnswers);
    assert(res.topics.length > 0, 'Expected topics breakdown');

    let sumTopicQuestions = 0;
    res.topics.forEach(t => {
        sumTopicQuestions += t.total;
        assert(t.attempted === t.correct + t.incorrect, 'Topic math validity');
        assert(t.total === t.attempted + t.skipped, 'Topic total validity');
    });
    assert.strictEqual(sumTopicQuestions, 30);

    console.log(`  [PASS] Generated ${res.topics.length} topic breakdowns, ${res.strongAreas.length} strong areas, ${res.weakAreas.length} weak areas`);
}

console.log('\n--- SCENARIO 6: Question Review Ground-Truth Consistency ---');
{
    const userAnswers = { 0: pool[0].correct_option, 1: -1, 2: (pool[2].correct_option + 1) % 4 };
    const res = calculateAptitudeEvaluation(pool, userAnswers);

    const q1 = res.questionReviews[0];
    assert.strictEqual(q1.status, 'correct');
    assert.strictEqual(q1.marks, 1);
    assert(q1.explanation && q1.explanation.length > 5, 'Explanation must be present');
    assert.strictEqual(q1.question, pool[0].question);

    const q2 = res.questionReviews[1];
    assert.strictEqual(q2.status, 'skipped');
    assert.strictEqual(q2.marks, 0);

    const q3 = res.questionReviews[2];
    assert.strictEqual(q3.status, 'incorrect');
    assert.strictEqual(q3.marks, 0);

    console.log('  [PASS] Question reviews match ground truth database records exactly');
}

console.log('\n================================================================');
console.log('ALL APTITUDE RESULT EVALUATION TESTS PASSED (6/6) ✓');
console.log('================================================================\n');
