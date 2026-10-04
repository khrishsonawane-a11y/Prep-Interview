/**
 * Technical Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let currentQuestion = null;
let askedQuestions = [];
let questionCount = 0;
const MAX_QUESTIONS = 30; // 30 technical questions per session
let isRecording = false;
let speechRecognition = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    const params = new URLSearchParams(window.location.search);
    interviewId = params.get('id');
    currentRole = params.get('role') || 'Software Developer';
    currentDifficulty = params.get('difficulty') || 'Intermediate';

    if (!interviewId) {
        window.Toast.error('Active interview session missing.');
        setTimeout(() => window.location.href = 'interview.html', 1500);
        return;
    }

    document.getElementById('display-role')?.replaceChildren(document.createTextNode(currentRole));
    document.getElementById('display-diff')?.replaceChildren(document.createTextNode(currentDifficulty));

    setupSpeechRecognition();
    setupCharCounter();
    setupButtons();
    await fetchNextTechnicalQuestion();
});

async function fetchNextTechnicalQuestion() {
    stopRecording();
    baseTranscript = '';

    const questionCard = document.getElementById('ai-question-card');
    const loadingState = document.getElementById('question-loading-state');
    const evalPanel = document.getElementById('ai-eval-panel');
    const answerInput = document.getElementById('tech-answer-input');

    if (evalPanel) evalPanel.style.display = 'none';
    if (answerInput) answerInput.value = '';
    if (loadingState) loadingState.style.display = 'block';
    if (questionCard) questionCard.style.display = 'none';

    try {
        const res = await window.API.getTechnicalQuestion({
            role: currentRole,
            difficulty: currentDifficulty,
            previousQuestions: askedQuestions
        });

        if (res.success && res.question) {
            currentQuestion = res.question;
            askedQuestions.push(currentQuestion.question);
            questionCount++;

            document.getElementById('tech-q-counter').textContent = `Question ${questionCount} of ${MAX_QUESTIONS}`;
            document.getElementById('tech-q-topic').textContent = currentQuestion.topic || 'Engineering Architecture';
            document.getElementById('tech-question-text').textContent = currentQuestion.question;

            // Render expected concepts badges
            const conceptsWrap = document.getElementById('expected-concepts-wrap');
            if (conceptsWrap && currentQuestion.expected_concepts) {
                conceptsWrap.innerHTML = currentQuestion.expected_concepts.map(c => `
                    <span class="badge badge-primary">${c}</span>
                `).join('');
            }

            if (loadingState) loadingState.style.display = 'none';
            if (questionCard) questionCard.style.display = 'flex';
        }
    } catch (err) {
        console.error('Failed to get technical question:', err);
        window.Toast.error('Could not generate technical question.');
    }
}

function setupCharCounter() {
    const textarea = document.getElementById('tech-answer-input');
    const counter = document.getElementById('char-count-display');
    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
        const chars = textarea.value.length;
        const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
        counter.textContent = `${words} words (${chars} chars)`;
    });
}

let baseTranscript = '';

function setupSpeechRecognition() {
    const voiceBtn = document.getElementById('voice-dictate-btn');
    if (!voiceBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none';
        return;
    }

    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-US';

    speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        let sessionFinalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i];
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

        const fullText = baseTranscript
            ? (currentSessionText ? `${baseTranscript} ${currentSessionText}` : baseTranscript)
            : currentSessionText;

        const textarea = document.getElementById('tech-answer-input');
        if (textarea) {
            textarea.value = fullText;
            textarea.dispatchEvent(new Event('input'));
        }
    };

    speechRecognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        stopRecording();
    };

    speechRecognition.onend = () => {
        stopRecording();
    };

    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });
}

function startRecording() {
    if (!speechRecognition || isRecording) return;
    const textarea = document.getElementById('tech-answer-input');
    baseTranscript = textarea ? textarea.value.trim() : '';

    try {
        speechRecognition.start();
        isRecording = true;
        const btn = document.getElementById('voice-dictate-btn');
        if (btn) {
            btn.classList.add('recording');
            btn.innerHTML = '🔴 Listening... (Click to stop)';
        }
        window.Toast.info('Microphone active. Speak your answer clearly.');
    } catch (e) {
        console.warn('Speech start error:', e);
    }
}

function stopRecording() {
    if (!speechRecognition) return;
    if (isRecording) {
        try {
            speechRecognition.stop();
        } catch (e) {}
    }
    isRecording = false;
    const textarea = document.getElementById('tech-answer-input');
    baseTranscript = textarea ? textarea.value.trim() : '';

    const btn = document.getElementById('voice-dictate-btn');
    if (btn) {
        btn.classList.remove('recording');
        btn.innerHTML = '🎙️ Dictate with Voice';
    }
}

function setupButtons() {
    const submitBtn = document.getElementById('submit-answer-btn');
    const nextBtn = document.getElementById('next-stage-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const answer = document.getElementById('tech-answer-input').value.trim();
            if (answer.length < 15) {
                window.Toast.warning('Please provide a substantive technical answer (at least a couple of sentences).');
                return;
            }

            stopRecording();

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> AI Evaluating Response...';

                const res = await window.API.evaluateTechnicalAnswer({
                    interviewId,
                    questionText: currentQuestion.question,
                    answerText: answer,
                    role: currentRole,
                    difficulty: currentDifficulty
                });

                if (res.success && res.evaluation) {
                    displayEvaluation(res.evaluation);
                    window.Toast.success('Evaluation completed!');
                }
            } catch (err) {
                console.error('Evaluation failed:', err);
                window.Toast.error(err.message || 'Failed to evaluate answer.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Answer & Evaluate 🤖';
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            if (questionCount < MAX_QUESTIONS) {
                await fetchNextTechnicalQuestion();
            } else {
                finishTechnicalRound();
            }
        });
    }
}

function displayEvaluation(evalData) {
    const panel = document.getElementById('ai-eval-panel');
    if (!panel) return;

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('eval-score').textContent = `${evalData.score || 80}/100`;
    document.getElementById('eval-correctness').textContent = evalData.correctness || 'High';
    document.getElementById('eval-relevance').textContent = evalData.relevance || 'High';
    document.getElementById('eval-feedback-text').textContent = evalData.feedback || 'Good explanation.';
    document.getElementById('eval-improvement-text').textContent = evalData.improvement || 'Deepen production trade-offs.';

    // Missing Points
    const missingWrap = document.getElementById('eval-missing-points');
    if (missingWrap && evalData.missing_points) {
        missingWrap.innerHTML = evalData.missing_points.map(p => `<li>⚠️ ${p}</li>`).join('');
    }

    // Strengths
    const strengthsWrap = document.getElementById('eval-strengths');
    if (strengthsWrap && evalData.strengths) {
        strengthsWrap.innerHTML = evalData.strengths.map(s => `<li>✓ ${s}</li>`).join('');
    }

    const nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) {
        nextBtn.textContent = questionCount < MAX_QUESTIONS ? 'Next Technical Question →' : 'Proceed to Coding Round ⚡';
    }
}

async function finishTechnicalRound() {
    window.Toast.success('Technical Round complete! Advancing to Coding / DSA Round...');

    try {
        const intRes = await window.API.getInterviewById(interviewId);
        let nextRound = 'coding';
        if (intRes.success && intRes.interview) {
            const rounds = intRes.interview.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
            const nextIdx = (intRes.interview.current_round_index || 1) + 1;
            await window.API.updateInterviewProgress(interviewId, { roundIndex: nextIdx });
            nextRound = rounds[nextIdx] || 'coding';
        }

        setTimeout(() => {
            window.location.href = `${nextRound}.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
        }, 1200);
    } catch {
        window.location.href = `coding.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
    }
}
