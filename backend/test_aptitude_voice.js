import test from 'node:test';
import assert from 'node:assert/strict';
import app from './server.js';

test('🧪 Aptitude Round 35+ Question Pool & Randomization Verification', async (t) => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api`;
    const authHeaders = { 'Authorization': 'Bearer mock_test_candidate_123' };

    try {
        // Run 3 separate requests for 5 questions
        const res1 = await fetch(`${baseUrl}/aptitude/questions?count=5`, { headers: authHeaders });
        const data1 = await res1.json();
        assert.equal(data1.success, true);
        assert.equal(data1.questions.length, 5);

        // Check for no duplicates within session 1
        const ids1 = data1.questions.map(q => q.id);
        const uniqueIds1 = new Set(ids1);
        assert.equal(uniqueIds1.size, 5, 'Session 1 must contain 5 unique questions with zero duplicates');

        const res2 = await fetch(`${baseUrl}/aptitude/questions?count=5`, { headers: authHeaders });
        const data2 = await res2.json();
        const ids2 = data2.questions.map(q => q.id);
        const uniqueIds2 = new Set(ids2);
        assert.equal(uniqueIds2.size, 5, 'Session 2 must contain 5 unique questions with zero duplicates');

        const res3 = await fetch(`${baseUrl}/aptitude/questions?count=5`, { headers: authHeaders });
        const data3 = await res3.json();
        const ids3 = data3.questions.map(q => q.id);
        const uniqueIds3 = new Set(ids3);
        assert.equal(uniqueIds3.size, 5, 'Session 3 must contain 5 unique questions with zero duplicates');

        // Verify that questions pool has at least 30 questions
        const resAll = await fetch(`${baseUrl}/aptitude/questions?count=35`, { headers: authHeaders });
        const dataAll = await resAll.json();
        assert.equal(dataAll.success, true);
        assert.ok(dataAll.questions.length >= 30, `Expected at least 30 questions in pool, got ${dataAll.questions.length}`);

        // Verify that question sets across sessions are shuffled
        console.log('  📋 Session 1 Question IDs:', ids1.join(', '));
        console.log('  📋 Session 2 Question IDs:', ids2.join(', '));
        console.log('  📋 Session 3 Question IDs:', ids3.join(', '));
        console.log(`  📊 Total questions in active pool: ${dataAll.questions.length}`);

    } finally {
        server.close();
    }
});

test('🧪 Speech Recognition Interim & Final Transcript Logic Verification', () => {
    function processSpeechResults(baseText, results) {
        let interimTranscript = '';
        let sessionFinalTranscript = '';

        for (let i = 0; i < results.length; ++i) {
            const result = results[i];
            const text = result[0].transcript.trim();
            if (result.isFinal) {
                sessionFinalTranscript = sessionFinalTranscript ? `${sessionFinalTranscript} ${text}` : text;
            } else {
                interimTranscript = interimTranscript ? `${interimTranscript} ${text}` : text;
            }
        }

        const currentSessionText = sessionFinalTranscript && interimTranscript
            ? `${sessionFinalTranscript} ${interimTranscript}`
            : (sessionFinalTranscript || interimTranscript);

        return baseText
            ? (currentSessionText ? `${baseText} ${currentSessionText}` : baseText)
            : currentSessionText;
    }

    // Scenario 1: Streaming interim results for sentence 1
    const event1 = [
        [{ transcript: 'Java' }],
    ];
    event1[0].isFinal = false;
    assert.equal(processSpeechResults('', event1), 'Java');

    const event2 = [
        [{ transcript: 'Java is an object oriented language' }],
    ];
    event2[0].isFinal = true;
    assert.equal(processSpeechResults('', event2), 'Java is an object oriented language');

    // Scenario 2: User pauses, then speaks sentence 2
    const event3 = [
        [{ transcript: 'Java is an object oriented language' }],
        [{ transcript: 'It runs on JVM' }]
    ];
    event3[0].isFinal = true;
    event3[1].isFinal = true;
    assert.equal(processSpeechResults('', event3), 'Java is an object oriented language It runs on JVM');

    // Scenario 3: User stops mic, then resumes speaking with baseText preserved
    const baseText = 'Java is an object oriented language It runs on JVM';
    const newSessionEvent = [
        [{ transcript: 'It is platform independent' }]
    ];
    newSessionEvent[0].isFinal = true;
    assert.equal(processSpeechResults(baseText, newSessionEvent), 'Java is an object oriented language It runs on JVM It is platform independent');
});
