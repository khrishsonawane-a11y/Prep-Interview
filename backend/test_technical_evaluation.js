import { evaluateTechnicalAnswer } from './services/aiService.js';
import assert from 'assert';

async function runTests() {
    console.log('=== STARTING TECHNICAL EVALUATION TEST SUITE ===\n');

    const question = 'Explain the difference between TCP and UDP protocols and when to use each in distributed system design.';
    const sample_answer = 'TCP is connection-oriented with 3-way handshake, guaranteed ordered delivery via sequence numbers and ACK/retransmission, and flow control. UDP is connectionless, unordered, best-effort without handshake or retransmission overhead, providing low latency for gaming/streaming.';
    const expected_concepts = ['Connection-Oriented vs Connectionless', 'Reliability & Acknowledgments', 'Ordering & Flow Control', 'Use Cases & Latency Trade-offs'];

    // 1. Completely Correct Answer
    console.log('Test 1: Completely Correct Technical Answer');
    const res1 = await evaluateTechnicalAnswer({
        question,
        answer: 'TCP is a connection-oriented protocol that establishes connections using a 3-way handshake (SYN, SYN-ACK, ACK). It guarantees reliable ordered packet delivery with sequence numbers, ACKs, retransmissions, and flow/congestion control mechanisms (sliding window). In contrast, UDP is connectionless and sends datagrams without handshakes or guarantees, resulting in lower latency and no head-of-line blocking. TCP is used for HTTP, databases, and financial transactions where data integrity is paramount, whereas UDP is preferred for live video streaming, DNS, and real-time multiplayer games where speed matters more than occasional lost packets.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });

    console.log('Test 1 Result:', {
        score_out_of_10: res1.score_out_of_10,
        score: res1.score,
        classification: res1.classification,
        concept_coverage: res1.concept_coverage,
        correct_points_count: res1.correct_points?.length,
        missing_count: res1.missing_concepts?.length,
        mistakes_count: res1.technical_mistakes?.length
    });

    assert(res1.score_out_of_10 >= 8.5, 'Score out of 10 should be >= 8.5 for completely correct answer');
    assert(res1.classification === 'Correct' || res1.classification === 'Mostly Correct', 'Classification should be Correct or Mostly Correct');
    assert(res1.concept_coverage.covered_count >= 3, 'Covered count should be >= 3');
    assert.strictEqual(res1.technical_mistakes?.length || 0, 0, 'Should have no technical mistakes');
    console.log('✓ Test 1 Passed\n');

    // 2. Short Correct Answer
    console.log('Test 2: Short Correct Technical Answer');
    const res2 = await evaluateTechnicalAnswer({
        question,
        answer: 'TCP is reliable, connection-oriented and guarantees ordered delivery with handshakes. UDP is connectionless and fast with no delivery guarantees. Use TCP for data accuracy and UDP for low latency real-time streaming.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 2 Result:', {
        score_out_of_10: res2.score_out_of_10,
        score: res2.score,
        classification: res2.classification,
        concept_coverage: res2.concept_coverage
    });
    assert(res2.score_out_of_10 >= 7.0, 'Short correct answer should score >= 7.0');
    assert(res2.concept_coverage.covered_count >= 2, 'Should cover core concepts');
    console.log('✓ Test 2 Passed\n');

    // 3. Partially Correct Answer
    console.log('Test 3: Partially Correct Answer');
    const res3 = await evaluateTechnicalAnswer({
        question,
        answer: 'TCP is used for web traffic and ensures packets arrive. UDP is faster for media streaming.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 3 Result:', {
        score_out_of_10: res3.score_out_of_10,
        score: res3.score,
        classification: res3.classification,
        missing_concepts: res3.missing_concepts
    });
    assert(res3.score_out_of_10 >= 4.0 && res3.score_out_of_10 <= 7.0, 'Partially correct answer score should be between 4 and 7');
    assert(res3.missing_concepts?.length > 0, 'Should identify missing concepts');
    console.log('✓ Test 3 Passed\n');

    // 4. Answer Missing Specific Key Concept
    console.log('Test 4: Answer Missing Specific Key Concept');
    const res4 = await evaluateTechnicalAnswer({
        question,
        answer: 'TCP connects via handshake and makes sure packets are delivered in order with retransmission. UDP sends packets without handshakes.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 4 Result:', {
        score_out_of_10: res4.score_out_of_10,
        missing_concepts: res4.missing_concepts,
        classification: res4.classification
    });
    assert(res4.missing_concepts?.length > 0, 'Should flag missing use cases / latency trade-offs');
    console.log('✓ Test 4 Passed\n');

    // 5. Answer with Technical Misconception / Mistake
    console.log('Test 5: Answer with Explicit Misconception');
    const res5 = await evaluateTechnicalAnswer({
        question,
        answer: 'UDP is a connection-oriented reliable protocol that guarantees packet ordering, while TCP is connectionless and faster without handshakes.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 5 Result:', {
        score_out_of_10: res5.score_out_of_10,
        classification: res5.classification,
        technical_mistakes: res5.technical_mistakes
    });
    assert(res5.technical_mistakes?.length > 0, 'Should detect TCP/UDP inversion mistake');
    assert(res5.score_out_of_10 <= 4.0, 'Score should be penalized for misconception');
    console.log('✓ Test 5 Passed\n');

    // 6. Completely Incorrect Answer
    console.log('Test 6: Completely Incorrect Answer');
    const res6 = await evaluateTechnicalAnswer({
        question,
        answer: 'TCP is a relational database query language and UDP is a CSS styling framework for web pages.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 6 Result:', {
        score_out_of_10: res6.score_out_of_10,
        classification: res6.classification,
        error_type: res6.error_type
    });
    assert(res6.score_out_of_10 <= 2.0, 'Completely incorrect score should be <= 2.0');
    assert(res6.classification === 'Incorrect' || res6.classification === 'Irrelevant / Did Not Answer', 'Should classify as Incorrect or Irrelevant');
    console.log('✓ Test 6 Passed\n');

    // 7. Irrelevant Answer
    console.log('Test 7: Irrelevant Answer');
    const res7 = await evaluateTechnicalAnswer({
        question,
        answer: 'I like drinking coffee in the morning and going for a long walk in the park.',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 7 Result:', {
        score_out_of_10: res7.score_out_of_10,
        classification: res7.classification
    });
    assert(res7.score_out_of_10 === 0 || res7.score_out_of_10 <= 1.0, 'Irrelevant answer score should be near 0');
    assert(res7.classification === 'Irrelevant / Did Not Answer' || res7.classification === 'Incorrect', 'Should classify as Irrelevant / Did Not Answer');
    console.log('✓ Test 7 Passed\n');

    // 8. Skipped Answer
    console.log('Test 8: Skipped Answer');
    const res8 = await evaluateTechnicalAnswer({
        question,
        answer: '[SKIPPED]',
        role: 'Backend Engineer',
        difficulty: 'Intermediate',
        topic: 'Computer Networks',
        reference_answer: sample_answer,
        expected_concepts
    });
    console.log('Test 8 Result:', {
        score_out_of_10: res8.score_out_of_10,
        score: res8.score,
        classification: res8.classification,
        error_type: res8.error_type
    });
    assert.strictEqual(res8.score_out_of_10, 0, 'Skipped score_out_of_10 should be 0');
    assert.strictEqual(res8.score, 0, 'Skipped score should be 0');
    assert.strictEqual(res8.classification, 'Irrelevant / Did Not Answer', 'Skipped classification should be Irrelevant / Did Not Answer');
    assert.strictEqual(res8.error_type, 'Did Not Answer', 'Skipped error_type should be Did Not Answer');
    console.log('✓ Test 8 Passed\n');

    console.log('ALL 8 TECHNICAL EVALUATION TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
});
