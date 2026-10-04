/**
 * Aptitude Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let questions = [];
let currentIndex = 0;
let userAnswers = {}; // { [index]: selectedOptionIndex }
let timerInterval = null;
let secondsRemaining = 1800; // 30 minutes for 30 questions

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
    await loadQuestions();
    setupNavigationButtons();
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

function renderQuestion(index) {
    currentIndex = index;
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

    palette.innerHTML = questions.map((_, i) => {
        const isAnswered = userAnswers[i] !== undefined;
        const isCurrent = i === currentIndex;
        return `
            <button class="palette-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}" data-idx="${i}">
                ${i + 1}
            </button>
        `;
    }).join('');

    palette.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            renderQuestion(parseInt(btn.getAttribute('data-idx'), 10));
        });
    });
}

function setupNavigationButtons() {
    const prevBtn = document.getElementById('prev-q-btn');
    const nextBtn = document.getElementById('next-q-btn');
    const skipBtn = document.getElementById('skip-apt-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) renderQuestion(currentIndex - 1);
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (currentIndex < questions.length - 1) {
                renderQuestion(currentIndex + 1);
            } else {
                finishAptitudeRound();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < questions.length - 1) {
                renderQuestion(currentIndex + 1);
            } else {
                finishAptitudeRound();
            }
        });
    }
}

async function finishAptitudeRound() {
    clearInterval(timerInterval);
    const finishBtn = document.getElementById('next-q-btn');
    if (finishBtn) {
        finishBtn.disabled = true;
        finishBtn.innerHTML = '<span class="spinner"></span> Scoring & Saving Answers...';
    }

    try {
        // Submit all answered questions to backend
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const chosen = userAnswers[i] ?? -1;
            await window.API.submitAptitudeAnswer({
                interviewId,
                questionId: q.id,
                questionText: q.question,
                selectedOptionIndex: chosen,
                correctOptionIndex: q.correct_option,
                explanation: q.explanation,
                timeTakenSeconds: 1800 - secondsRemaining
            });
        }

        window.Toast.success('Aptitude Round completed! Transitioning to Technical Round...');

        // Check next round in interview configuration
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
        }, 1200);

    } catch (err) {
        console.error('Error completing aptitude round:', err);
        window.Toast.error('Could not save answers. Continuing to next round.');
        setTimeout(() => {
            window.location.href = `technical.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
        }, 1500);
    }
}
