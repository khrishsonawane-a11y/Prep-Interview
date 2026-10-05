/**
 * Technical Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let currentQuestion = null;
let askedQuestions = [];
let questionCount = 0;
const MAX_QUESTIONS = 30;
let hasViewedCurrentAnswer = false;

// Controlled Speech Recognition State Machine
let recognitionState = 'idle'; // 'idle' | 'listening' | 'stopping' | 'stopped'
let speechRecognition = null;
let baseManualText = '';
let committedVoiceChunks = [];
let isSpeakingQuestion = false;

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
    setupAnswerModal();
    setupSpeechButton();
    await fetchNextTechnicalQuestion();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
    stopRecording();
});

function setupSpeechButton() {
    const speakBtn = document.getElementById('speak-tech-btn');
    if (!speakBtn) return;

    speakBtn.addEventListener('click', () => {
        if (isSpeakingQuestion) {
            stopQuestionSpeech();
        } else {
            startQuestionSpeech();
        }
    });
}

function startQuestionSpeech() {
    if (!('speechSynthesis' in window) || !currentQuestion) {
        window.Toast.info('Speech synthesis is not supported on this browser.');
        return;
    }

    stopQuestionSpeech();

    const textToRead = currentQuestion.question || '';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        isSpeakingQuestion = true;
        const btn = document.getElementById('speak-tech-btn');
        if (btn) {
            btn.innerHTML = '⏹ Stop Reading';
            btn.classList.add('btn-danger');
            btn.classList.remove('btn-secondary');
        }
    };

    utterance.onend = () => {
        stopQuestionSpeech();
    };

    utterance.onerror = () => {
        stopQuestionSpeech();
    };

    window.speechSynthesis.speak(utterance);
}

function stopQuestionSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    isSpeakingQuestion = false;
    const btn = document.getElementById('speak-tech-btn');
    if (btn) {
        btn.innerHTML = '🔊 Read Question Aloud';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
    }
}

function setupAnswerModal() {
    const viewBtn = document.getElementById('view-tech-answer-btn');
    const modal = document.getElementById('tech-answer-modal');
    const closeBtn = document.getElementById('close-tech-modal-btn');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            if (!currentQuestion) return;
            hasViewedCurrentAnswer = true;

            const expectedText = document.getElementById('tech-expected-answer-text');
            if (expectedText) {
                expectedText.textContent = currentQuestion.sample_answer || 'Expected architectural explanation covering core mechanisms, trade-offs, and design principles.';
            }

            const conceptsList = document.getElementById('tech-modal-concepts-list');
            if (conceptsList && currentQuestion.expected_concepts) {
                conceptsList.innerHTML = currentQuestion.expected_concepts.map(c => `<li>✓ <strong style="color:var(--text-main);">${c}</strong></li>`).join('');
            }

            modal.style.display = 'flex';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

async function fetchNextTechnicalQuestion() {
    stopQuestionSpeech();
    stopRecording();
    hasViewedCurrentAnswer = false;
    baseManualText = '';
    committedVoiceChunks = [];

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
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            const transcript = res[0].transcript.trim();
            if (res.isFinal) {
                if (transcript) {
                    committedVoiceChunks.push(transcript);
                }
            } else {
                interimText = interimText ? `${interimText} ${transcript}` : transcript;
            }
        }

        const fullVoice = [...committedVoiceChunks, interimText].filter(Boolean).join(' ');
        const baseTranscript = baseManualText;
        const fullContent = [baseTranscript, fullVoice].filter(Boolean).join(' ');

        const textarea = document.getElementById('tech-answer-input');
        if (textarea) {
            textarea.value = fullContent;
            textarea.dispatchEvent(new Event('input'));
        }
    };

    speechRecognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        stopRecording();
    };

    speechRecognition.onend = () => {
        recognitionState = 'idle';
        const btn = document.getElementById('voice-dictate-btn');
        if (btn) {
            btn.classList.remove('recording');
            btn.innerHTML = '🎙️ Dictate with Voice';
        }
    };

    voiceBtn.addEventListener('click', () => {
        if (recognitionState === 'listening') {
            stopRecording();
        } else if (recognitionState === 'idle') {
            startRecording();
        }
    });
}

function startRecording() {
    if (!speechRecognition || recognitionState === 'listening') return;

    const textarea = document.getElementById('tech-answer-input');
    baseManualText = textarea ? textarea.value.trim() : '';
    committedVoiceChunks = [];

    try {
        speechRecognition.start();
        recognitionState = 'listening';
        const btn = document.getElementById('voice-dictate-btn');
        if (btn) {
            btn.classList.add('recording');
            btn.innerHTML = '🔴 Listening... (Click to stop)';
        }
        window.Toast.info('Microphone active. Speak your technical answer clearly.');
    } catch (e) {
        console.warn('Speech start error:', e);
        recognitionState = 'idle';
    }
}

function stopRecording() {
    if (!speechRecognition) return;

    if (recognitionState === 'listening') {
        recognitionState = 'stopping';
        try {
            speechRecognition.stop();
        } catch (e) {}
    }

    const textarea = document.getElementById('tech-answer-input');
    baseManualText = textarea ? textarea.value.trim() : '';
    committedVoiceChunks = [];
}

function setupButtons() {
    const submitBtn = document.getElementById('submit-answer-btn');
    const skipBtn = document.getElementById('skip-question-btn');
    const nextBtn = document.getElementById('next-stage-btn');

    if (skipBtn) {
        skipBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
            stopRecording();
            const textarea = document.getElementById('tech-answer-input');
            if (textarea) textarea.value = '';

            try {
                skipBtn.disabled = true;
                await window.API.evaluateTechnicalAnswer({
                    interviewId,
                    questionText: currentQuestion?.question || 'Technical Question',
                    answerText: '[SKIPPED]',
                    role: currentRole,
                    difficulty: currentDifficulty,
                    topic: currentQuestion?.topic || 'Architecture',
                    reference_answer: currentQuestion?.sample_answer || '',
                    is_skipped: true,
                    viewed_answer: hasViewedCurrentAnswer
                });
                window.Toast.info('Question marked as skipped.');
            } catch (e) {
                console.warn('Skip record warning:', e);
            } finally {
                skipBtn.disabled = false;
            }

            if (questionCount < MAX_QUESTIONS) {
                await fetchNextTechnicalQuestion();
            } else {
                finishTechnicalRound();
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
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
                    difficulty: currentDifficulty,
                    topic: currentQuestion.topic || 'Engineering Architecture',
                    reference_answer: currentQuestion.sample_answer || '',
                    viewed_answer: hasViewedCurrentAnswer
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
            stopQuestionSpeech();
            const textarea = document.getElementById('tech-answer-input');
            if (textarea) textarea.value = '';

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

    const errorBadge = document.getElementById('eval-error-type-badge');
    if (errorBadge) {
        errorBadge.textContent = evalData.error_type || (evalData.score >= 70 ? 'None (Correct)' : 'Concept Incomplete');
        errorBadge.className = `badge ${evalData.score >= 70 ? 'badge-success' : 'badge-warning'}`;
    }

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
    stopQuestionSpeech();
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
