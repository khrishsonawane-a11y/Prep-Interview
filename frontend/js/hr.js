/**
 * HR / Behavioral Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let currentQuestion = null;
let askedQuestions = [];
let questionCount = 0;
const MAX_HR_QUESTIONS = 30;
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

    setupSpeechRecognition();
    setupButtons();
    setupAnswerModal();
    setupSpeechButton();
    await fetchNextHRQuestion();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
    stopRecording();
});

function setupSpeechButton() {
    const speakBtn = document.getElementById('speak-question-btn');
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
        const btn = document.getElementById('speak-question-btn');
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
    const btn = document.getElementById('speak-question-btn');
    if (btn) {
        btn.innerHTML = '🔊 Read Question Aloud';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
    }
}

function setupAnswerModal() {
    const viewBtn = document.getElementById('view-hr-answer-btn');
    const modal = document.getElementById('hr-answer-modal');
    const closeBtn = document.getElementById('close-hr-modal-btn');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            if (!currentQuestion) return;
            hasViewedCurrentAnswer = true;

            const refText = document.getElementById('hr-reference-answer-text');
            if (refText) {
                refText.textContent = currentQuestion.reference_answer || `Situation: During a critical project milestone, our engineering team faced sudden scope expansion.\nTask: I was assigned to coordinate with stakeholders and prioritize high-value core features.\nAction: I created a transparent roadmap, resolved dependency bottlenecks, and held daily standups.\nResult: We launched on time with 99.9% uptime and praised cross-functional alignment.`;
            }

            const pointsList = document.getElementById('hr-points-list');
            if (pointsList && currentQuestion.key_evaluation_points) {
                pointsList.innerHTML = currentQuestion.key_evaluation_points.map(p => `<li>✓ <strong style="color:var(--text-main);">${p}</strong></li>`).join('');
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

async function fetchNextHRQuestion() {
    stopQuestionSpeech();
    stopRecording();
    hasViewedCurrentAnswer = false;
    baseManualText = '';
    committedVoiceChunks = [];

    const loadingState = document.getElementById('hr-loading-state');
    const container = document.getElementById('hr-question-container');
    const evalPanel = document.getElementById('hr-eval-panel');
    const transcriptInput = document.getElementById('hr-transcript-input');

    if (evalPanel) evalPanel.style.display = 'none';
    if (transcriptInput) transcriptInput.value = '';
    if (loadingState) loadingState.style.display = 'block';
    if (container) container.style.display = 'none';

    try {
        const res = await window.API.getHRQuestion({
            role: currentRole,
            difficulty: currentDifficulty,
            previousQuestions: askedQuestions
        });

        if (res.success && res.question) {
            currentQuestion = res.question;
            askedQuestions.push(currentQuestion.question);
            questionCount++;

            document.getElementById('hr-q-counter').textContent = `Question ${questionCount} of ${MAX_HR_QUESTIONS}`;
            document.getElementById('hr-q-category').textContent = currentQuestion.category || 'Behavioral';
            document.getElementById('hr-question-text').textContent = currentQuestion.question;

            if (loadingState) loadingState.style.display = 'none';
            if (container) container.style.display = 'block';
        }
    } catch (err) {
        console.error('Failed to get HR question:', err);
        window.Toast.error('Could not generate HR scenario.');
    }
}

function setupSpeechRecognition() {
    const micBtn = document.getElementById('mic-record-btn');
    if (!micBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        micBtn.style.display = 'none';
        const indicator = document.getElementById('voice-status-indicator');
        if (indicator) indicator.textContent = 'Voice dictation unavailable in this browser. Please type your response below.';
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

        const textarea = document.getElementById('hr-transcript-input');
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
        const mic = document.getElementById('mic-record-btn');
        const indicator = document.getElementById('voice-status-indicator');
        if (mic) mic.classList.remove('recording');
        if (indicator) indicator.textContent = 'Click microphone to record your voice answer';
    };

    micBtn.addEventListener('click', () => {
        if (recognitionState === 'listening') {
            stopRecording();
        } else if (recognitionState === 'idle') {
            startRecording();
        }
    });
}

function startRecording() {
    if (!speechRecognition || recognitionState === 'listening') return;

    const textarea = document.getElementById('hr-transcript-input');
    baseManualText = textarea ? textarea.value.trim() : '';
    committedVoiceChunks = [];

    try {
        speechRecognition.start();
        recognitionState = 'listening';
        const mic = document.getElementById('mic-record-btn');
        const indicator = document.getElementById('voice-status-indicator');
        if (mic) mic.classList.add('recording');
        if (indicator) indicator.textContent = '🔴 Listening... Speak clearly (Click to stop)';
        window.Toast.info('Microphone recording active.');
    } catch (e) {
        console.warn('Microphone error:', e);
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

    const textarea = document.getElementById('hr-transcript-input');
    baseManualText = textarea ? textarea.value.trim() : '';
    committedVoiceChunks = [];
}

function setupButtons() {
    const submitBtn = document.getElementById('submit-hr-btn');
    const skipBtn = document.getElementById('skip-hr-btn');
    const nextBtn = document.getElementById('next-hr-btn');

    if (skipBtn) {
        skipBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
            stopRecording();
            const textarea = document.getElementById('hr-transcript-input');
            if (textarea) textarea.value = '';

            try {
                skipBtn.disabled = true;
                await window.API.evaluateHRAnswer({
                    interviewId,
                    questionText: currentQuestion?.question || 'HR Behavioral Question',
                    answerText: '[SKIPPED]',
                    role: currentRole,
                    topic: currentQuestion?.category || 'Behavioral',
                    reference_answer: currentQuestion?.reference_answer || '',
                    is_skipped: true,
                    viewed_answer: hasViewedCurrentAnswer
                });
                window.Toast.info('Behavioral question marked as skipped.');
            } catch (e) {
                console.warn('Skip HR warning:', e);
            } finally {
                skipBtn.disabled = false;
            }

            if (questionCount < MAX_HR_QUESTIONS) {
                await fetchNextHRQuestion();
            } else {
                finishHRRound();
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
            const answer = document.getElementById('hr-transcript-input').value.trim();
            if (answer.length < 15) {
                window.Toast.warning('Please provide a substantive answer (at least a few sentences).');
                return;
            }

            stopRecording();

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> AI Evaluating Response...';

                const res = await window.API.evaluateHRAnswer({
                    interviewId,
                    questionText: currentQuestion.question,
                    answerText: answer,
                    role: currentRole,
                    topic: currentQuestion.category || 'Behavioral',
                    reference_answer: currentQuestion.reference_answer || '',
                    viewed_answer: hasViewedCurrentAnswer
                });

                if (res.success && res.evaluation) {
                    displayEvaluation(res.evaluation);
                    window.Toast.success('Evaluation completed!');
                }
            } catch (err) {
                console.error('HR evaluation failed:', err);
                window.Toast.error(err.message || 'Failed to evaluate answer.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit & Review Answer 🎯';
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
            const textarea = document.getElementById('hr-transcript-input');
            if (textarea) textarea.value = '';

            if (questionCount < MAX_HR_QUESTIONS) {
                await fetchNextHRQuestion();
            } else {
                finishHRRound();
            }
        });
    }
}

function displayEvaluation(evalData) {
    const panel = document.getElementById('hr-eval-panel');
    if (!panel) return;

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('hr-eval-score').textContent = `${evalData.score || 80}/100`;
    document.getElementById('hr-eval-clarity').textContent = evalData.clarity || 'High';
    document.getElementById('hr-eval-structure').textContent = evalData.structure || 'Structured';
    document.getElementById('hr-eval-feedback').textContent = evalData.feedback || 'Good articulation and communication.';

    const errorBadge = document.getElementById('hr-eval-error-badge');
    if (errorBadge) {
        errorBadge.textContent = evalData.error_type || (evalData.score >= 70 ? 'None (Strong Communication)' : 'STAR Structure Incomplete');
        errorBadge.className = `badge ${evalData.score >= 70 ? 'badge-success' : 'badge-primary'}`;
    }

    const strengthsWrap = document.getElementById('hr-eval-strengths');
    if (strengthsWrap && evalData.strengths) {
        strengthsWrap.innerHTML = evalData.strengths.map(s => `<li>✓ ${s}</li>`).join('');
    }

    const nextBtn = document.getElementById('next-hr-btn');
    if (nextBtn) {
        nextBtn.textContent = questionCount < MAX_HR_QUESTIONS ? 'Next Behavioral Question →' : 'Generate Final Appraisal Report 🏆';
    }
}

async function finishHRRound() {
    stopQuestionSpeech();
    window.Toast.success('Interview Rounds complete! Compiling Final AI Appraisal...');

    try {
        await window.API.updateInterviewProgress(interviewId, { status: 'completed' });
        await window.API.finalizeInterview(interviewId);
        setTimeout(() => {
            window.location.href = `report.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
        }, 1200);
    } catch {
        window.location.href = `report.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
    }
}
