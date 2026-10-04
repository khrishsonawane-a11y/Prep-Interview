/**
 * HR / Behavioral & Voice Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let currentQuestion = null;
let askedQuestions = [];
let questionCount = 0;
const MAX_HR_QUESTIONS = 30; // 30 HR / Behavioral questions per session

let speechRecognition = null;
let isRecording = false;
let recordStartTime = null;

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
    setupTextToSpeech();
    setupButtons();
    await fetchNextHRQuestion();
});

async function fetchNextHRQuestion() {
    stopVoiceRecording();
    baseTranscript = '';

    const loading = document.getElementById('hr-loading-state');
    const questionCard = document.getElementById('hr-question-container');
    const evalPanel = document.getElementById('hr-eval-panel');
    const answerInput = document.getElementById('hr-transcript-input');

    if (evalPanel) evalPanel.style.display = 'none';
    if (answerInput) answerInput.value = '';
    if (loading) loading.style.display = 'block';
    if (questionCard) questionCard.style.display = 'none';

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

            if (loading) loading.style.display = 'none';
            if (questionCard) questionCard.style.display = 'block';

            // Optional auto-speak
            speakQuestion(currentQuestion.question);
        }
    } catch (err) {
        console.error('Failed to get HR question:', err);
        window.Toast.error('Could not load HR question.');
    }
}

function setupTextToSpeech() {
    const speakBtn = document.getElementById('speak-question-btn');
    if (speakBtn) {
        speakBtn.addEventListener('click', () => {
            if (currentQuestion) speakQuestion(currentQuestion.question);
        });
    }
}

function speakQuestion(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

let baseTranscript = '';

function setupSpeechRecognition() {
    const micBtn = document.getElementById('mic-record-btn');
    const statusText = document.getElementById('voice-status-indicator');
    if (!micBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (statusText) statusText.textContent = 'Voice API not supported in this browser. You can type your answer below.';
        micBtn.style.display = 'none';
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

        const textarea = document.getElementById('hr-transcript-input');
        if (textarea) {
            textarea.value = fullText;
            textarea.dispatchEvent(new Event('input'));
        }
    };

    speechRecognition.onerror = (e) => {
        console.warn('Speech error:', e.error);
        stopVoiceRecording();
    };

    speechRecognition.onend = () => {
        stopVoiceRecording();
    };

    micBtn.addEventListener('click', () => {
        if (isRecording) {
            stopVoiceRecording();
        } else {
            startVoiceRecording();
        }
    });
}

function startVoiceRecording() {
    if (!speechRecognition || isRecording) return;
    const textarea = document.getElementById('hr-transcript-input');
    baseTranscript = textarea ? textarea.value.trim() : '';

    try {
        speechRecognition.start();
        isRecording = true;
        recordStartTime = Date.now();
        const micBtn = document.getElementById('mic-record-btn');
        const statusText = document.getElementById('voice-status-indicator');

        if (micBtn) micBtn.classList.add('recording');
        if (statusText) {
            statusText.textContent = 'Listening to your response... Click mic to stop.';
            statusText.classList.add('active');
        }
        window.Toast.info('Microphone recording active. Speak clearly.');
    } catch (e) {
        console.warn('Speech start error:', e);
    }
}

function stopVoiceRecording() {
    if (!speechRecognition) return;
    if (isRecording) {
        try {
            speechRecognition.stop();
        } catch (e) {}
    }
    isRecording = false;
    const textarea = document.getElementById('hr-transcript-input');
    baseTranscript = textarea ? textarea.value.trim() : '';

    const micBtn = document.getElementById('mic-record-btn');
    const statusText = document.getElementById('voice-status-indicator');

    if (micBtn) micBtn.classList.remove('recording');
    if (statusText) {
        statusText.textContent = 'Click microphone to record your voice answer';
        statusText.classList.remove('active');
    }
}

function setupButtons() {
    const submitBtn = document.getElementById('submit-hr-btn');
    const nextBtn = document.getElementById('next-hr-stage-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const answer = document.getElementById('hr-transcript-input').value.trim();
            if (answer.length < 15) {
                window.Toast.warning('Please provide a meaningful answer to the behavioral question.');
                return;
            }

            stopVoiceRecording();

            const durationSecs = recordStartTime ? Math.round((Date.now() - recordStartTime) / 1000) : 0;
            const wordCount = answer.split(/\s+/).length;

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> AI Evaluating Behavioral Response...';

                const res = await window.API.evaluateHRAnswer({
                    interviewId,
                    questionText: currentQuestion.question,
                    answerText: answer,
                    role: currentRole,
                    voiceMetrics: {
                        durationSeconds: durationSecs,
                        wordCount: wordCount
                    }
                });

                if (res.success && res.evaluation) {
                    displayHREvaluation(res.evaluation);
                    window.Toast.success('Evaluation complete!');
                }
            } catch (err) {
                console.error('HR Evaluation error:', err);
                window.Toast.error(err.message || 'Failed to evaluate answer.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit & Review Answer 🎯';
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            if (questionCount < MAX_HR_QUESTIONS) {
                await fetchNextHRQuestion();
            } else {
                finalizeFullInterview();
            }
        });
    }
}

function displayHREvaluation(evalData) {
    const panel = document.getElementById('hr-eval-panel');
    if (!panel) return;

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('hr-eval-score').textContent = `${evalData.score || 80}/100`;
    document.getElementById('hr-eval-clarity').textContent = evalData.clarity || 'High';
    document.getElementById('hr-eval-structure').textContent = evalData.structure || 'Good STAR Flow';
    document.getElementById('hr-eval-feedback').textContent = evalData.feedback || 'Great storytelling.';
    document.getElementById('hr-eval-improvement').textContent = evalData.improvement || 'Add quantifiable outcomes.';

    const nextBtn = document.getElementById('next-hr-stage-btn');
    if (nextBtn) {
        nextBtn.textContent = questionCount < MAX_HR_QUESTIONS ? 'Next HR Question →' : 'Complete Interview & View Final Report 🏆';
    }
}

async function finalizeFullInterview() {
    const nextBtn = document.getElementById('next-hr-stage-btn');
    if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '<span class="spinner"></span> Synthesizing Consolidated AI Report...';
    }

    try {
        const res = await window.API.finalizeInterview(interviewId);
        if (res.success) {
            window.Toast.success('Interview finalized! Generating your comprehensive feedback report...');
            setTimeout(() => {
                window.location.href = `report.html?id=${interviewId}`;
            }, 1000);
        }
    } catch (err) {
        console.error('Finalize error:', err);
        window.Toast.error('Could not finalize interview. Redirecting to report.');
        setTimeout(() => {
            window.location.href = `report.html?id=${interviewId}`;
        }, 1500);
    }
}
