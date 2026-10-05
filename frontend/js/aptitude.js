/**
 * Aptitude Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let questions = [];
let currentIndex = 0;
let userAnswers = {}; // { [index]: selectedOptionIndex }
let viewedAnswers = {}; // { [index]: boolean }
let timerInterval = null;
let secondsRemaining = 1800; // 30 minutes
let isSpeakingQuestion = false;

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    const params = new URLSearchParams(window.location.search);
    interviewId = params.get('id');
    currentRole = params.get('role') || 'Software Developer';
    currentDifficulty = params.get('difficulty') || 'Intermediate';

    if (!interviewId) {
        window.Toast.error('No active interview session found.');
        setTimeout(() => window.location.href = 'interview.html', 1500);
        return;
    }

    document.getElementById('display-role')?.replaceChildren(document.createTextNode(currentRole));
    document.getElementById('display-diff')?.replaceChildren(document.createTextNode(currentDifficulty));

    startTimer();
    setupNavigationButtons();
    setupAnswerModal();
    setupSpeechButton();
    await loadQuestions();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
});

function startTimer() {
    const timerElem = document.getElementById('aptitude-timer');
    timerInterval = setInterval(() => {
        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            window.Toast.warning('Time limit reached! Auto-submitting aptitude round...');
            finishAptitudeRound();
            return;
        }
        secondsRemaining--;
        const mins = Math.floor(secondsRemaining / 60);
        const secs = secondsRemaining % 60;
        if (timerElem) {
            timerElem.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }, 1000);
}

function setupSpeechButton() {
    const speakBtn = document.getElementById('speak-apt-btn');
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
    const q = questions[currentIndex];
    if (!('speechSynthesis' in window) || !q) {
        window.Toast.info('Speech synthesis is not supported on this browser.');
        return;
    }

    stopQuestionSpeech();

    const textToRead = `${q.question}. Options are: ${q.options ? q.options.join(', ') : ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        isSpeakingQuestion = true;
        const btn = document.getElementById('speak-apt-btn');
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
    const btn = document.getElementById('speak-apt-btn');
    if (btn) {
        btn.innerHTML = '🔊 Read Question Aloud';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
    }
}

function setupAnswerModal() {
    const viewBtn = document.getElementById('view-apt-answer-btn');
    const modal = document.getElementById('apt-answer-modal');
    const closeBtn = document.getElementById('close-apt-modal-btn');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            const q = questions[currentIndex];
            if (!q) return;

            viewedAnswers[currentIndex] = true;
            renderPalette();
            const labels = ['A', 'B', 'C', 'D'];
            const corrIdx = q.correct_option ?? 0;
            const corrText = q.options ? `${labels[corrIdx]}: ${q.options[corrIdx]}` : `Option ${corrIdx + 1}`;

            document.getElementById('apt-correct-answer-text').textContent = corrText;
            document.getElementById('apt-explanation-text').textContent = q.explanation || 'Calculated using standard mathematical derivation.';
            modal.style.display = 'flex';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

async function loadQuestions() {
    try {
        const res = await window.API.getAptitudeQuestions({ count: 30, difficulty: currentDifficulty });
        if (res.success && res.questions && res.questions.length > 0) {
            questions = res.questions;
            renderQuestion(0);
            renderPalette();
        } else {
            window.Toast.error('Could not load questions.');
        }
    } catch (err) {
        console.error('Error fetching questions:', err);
        window.Toast.error('Failed to load aptitude questions.');
    }
}

let visitedQuestions = { 0: true };

function renderQuestion(index) {
    stopQuestionSpeech();
    currentIndex = index;
    visitedQuestions[index] = true;
    const q = questions[index];
    if (!q) return;

    document.getElementById('question-number-display').textContent = `Question ${index + 1} of ${questions.length}`;
    document.getElementById('question-topic-badge').textContent = q.topic || 'Quantitative';
    document.getElementById('question-text').textContent = q.question;

    const optionsContainer = document.getElementById('options-container');
    const labels = ['A', 'B', 'C', 'D'];

    optionsContainer.innerHTML = (q.options || []).map((opt, i) => {
        const isSelected = userAnswers[index] === i;
        return `
            <div class="option-btn ${isSelected ? 'selected' : ''}" data-index="${i}">
                <div class="option-index">${labels[i]}</div>
                <div style="flex:1;">${opt}</div>
            </div>
        `;
    }).join('');

    optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedIdx = parseInt(btn.getAttribute('data-index'), 10);
            userAnswers[currentIndex] = selectedIdx;
            optionsContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            renderPalette();
        });
    });

    // Update button states
    const prevBtn = document.getElementById('prev-q-btn');
    const nextBtn = document.getElementById('next-q-btn');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) {
        if (currentIndex === questions.length - 1) {
            nextBtn.textContent = 'Finish Aptitude Round ✓';
            nextBtn.classList.remove('btn-secondary');
            nextBtn.classList.add('btn-accent');
        } else {
            nextBtn.textContent = 'Next Question →';
            nextBtn.classList.remove('btn-accent');
            nextBtn.classList.add('btn-secondary');
        }
    }
}

function renderPalette() {
    const palette = document.getElementById('palette-container');
    if (!palette) return;

    let answeredCount = 0;
    palette.innerHTML = questions.map((q, i) => {
        const isAnswered = userAnswers[i] !== undefined && userAnswers[i] !== -1;
        if (isAnswered) answeredCount++;
        const isSkipped = userAnswers[i] === -1;
        const isVisited = !!visitedQuestions[i];
        const isViewed = !!viewedAnswers[i];
        const isCurrent = i === currentIndex;

        let statusClass = '';
        let statusTitle = `Question ${i + 1}`;
        if (isCurrent) {
            statusClass += ' current';
            statusTitle += ' (Current)';
        }
        if (isAnswered) {
            statusClass += ' answered';
            statusTitle += ' - Answered';
        } else if (isSkipped) {
            statusClass += ' skipped';
            statusTitle += ' - Skipped';
        } else if (isVisited) {
            statusClass += ' visited';
            statusTitle += ' - Visited';
        }
        if (isViewed) {
            statusClass += ' viewed';
            statusTitle += ' (Solution Viewed)';
        }

        return `
            <button class="palette-btn ${statusClass.trim()}" data-index="${i}" title="${statusTitle}" aria-label="${statusTitle}">
                ${i + 1}
            </button>
        `;
    }).join('');

    const progressBadge = document.getElementById('palette-progress-badge');
    if (progressBadge) {
        progressBadge.textContent = `${answeredCount}/${questions.length} Answered`;
    }

    palette.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            renderQuestion(idx);
            renderPalette();
        });
    });
}

function setupNavigationButtons() {
    const prevBtn = document.getElementById('prev-q-btn');
    const nextBtn = document.getElementById('next-q-btn');
    const skipBtn = document.getElementById('skip-apt-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                renderQuestion(currentIndex - 1);
                renderPalette();
            }
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            userAnswers[currentIndex] = -1; // Flag as skipped
            renderPalette();
            window.Toast.info(`Question ${currentIndex + 1} marked as skipped.`);

            if (currentIndex < questions.length - 1) {
                renderQuestion(currentIndex + 1);
                renderPalette();
            } else {
                finishAptitudeRound();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < questions.length - 1) {
                renderQuestion(currentIndex + 1);
                renderPalette();
            } else {
                finishAptitudeRound();
            }
        });
    }
}

async function finishAptitudeRound() {
    stopQuestionSpeech();
    if (timerInterval) clearInterval(timerInterval);

    window.Toast.info('Submitting Aptitude evaluation...');

    try {
        const submitPromises = questions.map((q, i) => {
            const selectedIdx = userAnswers[i];
            const isSkipped = selectedIdx === undefined || selectedIdx === -1;
            const labels = ['A', 'B', 'C', 'D'];
            const corrIdx = q.correct_option ?? 0;
            const refAns = q.options ? `${labels[corrIdx]}: ${q.options[corrIdx]}` : `Option ${corrIdx}`;

            return window.API.submitAptitudeAnswer({
                interviewId,
                questionId: q.id,
                questionText: q.question,
                selectedOptionIndex: isSkipped ? -1 : selectedIdx,
                correctOptionIndex: q.correct_option,
                explanation: q.explanation,
                reference_answer: refAns,
                topic: q.topic || 'Quantitative',
                is_skipped: isSkipped,
                viewed_answer: Boolean(viewedAnswers[i])
            });
        });

        await Promise.all(submitPromises);
        window.Toast.success('Aptitude Round completed! Advancing to Technical Round...');

        const intRes = await window.API.getInterviewById(interviewId);
        let nextRound = 'technical';
        if (intRes.success && intRes.interview) {
            const rounds = intRes.interview.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
            const nextIdx = (intRes.interview.current_round_index || 0) + 1;
            await window.API.updateInterviewProgress(interviewId, { roundIndex: nextIdx });
            nextRound = rounds[nextIdx] || 'technical';
        }

        setTimeout(() => {
            window.location.href = `${nextRound}.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
        }, 1000);
    } catch (err) {
        console.error('Error submitting aptitude round:', err);
        window.location.href = `technical.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
    }
}
