/**
 * Aptitude Round Controller with Data-Based Result Screen
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let questions = [];
let currentIndex = 0;
let userAnswers = {}; // { [index]: selectedOptionIndex }
let viewedAnswers = {}; // { [index]: boolean }
let visitedQuestions = { 0: true };
let questionStartTimestamp = Date.now();
let questionTimeSpent = {}; // { [index]: seconds }
let roundStartTime = Date.now();
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

    roundStartTime = Date.now();
    questionStartTimestamp = Date.now();

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
    if (timerInterval) clearInterval(timerInterval);
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

function recordQuestionTime(idx) {
    const elapsed = Math.round((Date.now() - questionStartTimestamp) / 1000);
    questionTimeSpent[idx] = (questionTimeSpent[idx] || 0) + Math.max(1, elapsed);
    questionStartTimestamp = Date.now();
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
            currentIndex = 0;
            userAnswers = {};
            viewedAnswers = {};
            visitedQuestions = { 0: true };
            questionTimeSpent = {};
            questionStartTimestamp = Date.now();
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
    recordQuestionTime(currentIndex);
    stopQuestionSpeech();
    currentIndex = index;
    visitedQuestions[index] = true;
    questionStartTimestamp = Date.now();

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

/**
 * Calculate Ground-Truth Data Evaluation from Actual User Responses
 */
function calculateAptitudeEvaluation() {
    recordQuestionTime(currentIndex);
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

        // Question review item
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
            explanation: q.explanation || 'Derivation follows standard deductive principles.',
            timeSpent: questionTimeSpent[i] || 0,
            viewedSolution: Boolean(viewedAnswers[i])
        });
    });

    // Accuracy & Completion calculations
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 1000) / 10 : 0;
    const score = correct;
    const maxScore = totalQuestions;
    const scorePercent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 1000) / 10 : 0;
    const completionPercent = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 1000) / 10 : 0;

    // Performance Level Classification (Strict Rule-Based)
    let performanceLevel = { label: 'Needs Improvement', class: 'needs-improvement', badge: '⚠️ Needs Improvement', desc: 'Core quantitative and reasoning fundamentals require structured revision.' };
    if (scorePercent >= 85) {
        performanceLevel = { label: 'Excellent', class: 'excellent', badge: '🏆 Excellent', desc: 'Outstanding speed, precision, and conceptual accuracy across all aptitude topics!' };
    } else if (scorePercent >= 70) {
        performanceLevel = { label: 'Good', class: 'good', badge: '✨ Good', desc: 'Strong grasp of core aptitude problem solving with good consistency.' };
    } else if (scorePercent >= 50) {
        performanceLevel = { label: 'Average', class: 'average', badge: '📈 Average', desc: 'Fair foundation. Focusing on tricky topic shortcuts and time allocation will elevate score.' };
    }

    // Time calculations
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - roundStartTime) / 1000));
    const avgTimePerQuestion = totalQuestions > 0 ? Math.round((totalTimeSeconds / totalQuestions) * 10) / 10 : 0;

    // Process Topic Stats
    const topicsArray = Object.values(topicStats).map(t => {
        const topicAcc = t.attempted > 0 ? Math.round((t.correct / t.attempted) * 1000) / 10 : 0;
        return {
            ...t,
            accuracy: topicAcc
        };
    });

    // Determine Strong and Weak Topics
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

/**
 * Render the Complete Data-Based Result Screen
 */
function renderAptitudeResultScreen(evalData) {
    const workbench = document.getElementById('aptitude-workbench');
    const resultContainer = document.getElementById('aptitude-result-container');

    if (workbench) workbench.style.display = 'none';
    if (!resultContainer) return;

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    const resultHtml = `
    <div class="aptitude-result-screen">
      <!-- 1. Hero Performance Banner -->
      <div class="result-hero-banner">
        <div class="result-hero-left">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
            <span class="badge badge-primary">Round 1 Result: Aptitude</span>
            <span class="perf-badge ${evalData.performanceLevel.class}">${evalData.performanceLevel.badge}</span>
            <span class="badge badge-purple">${currentRole}</span>
          </div>
          <h1>Aptitude & Logic Performance Scorecard</h1>
          <p>${evalData.performanceLevel.desc}</p>
        </div>

        <div class="result-hero-score-badge">
          <div class="score-display-huge">${evalData.score}/${evalData.maxScore}</div>
          <div class="score-percent-label">${evalData.scorePercent}% Overall Score</div>
        </div>
      </div>

      <!-- 2. Actual Numerical Results Summary Grid -->
      <div class="result-summary-grid">
        <div class="result-metric-card">
          <div class="metric-card-title">Total Questions</div>
          <div class="metric-card-val">${evalData.totalQuestions}</div>
          <div class="metric-card-sub">In question pool</div>
        </div>

        <div class="result-metric-card">
          <div class="metric-card-title">Attempted</div>
          <div class="metric-card-val val-blue">${evalData.attempted}</div>
          <div class="metric-card-sub">${evalData.completionPercent}% completion</div>
        </div>

        <div class="result-metric-card">
          <div class="metric-card-title">Correct</div>
          <div class="metric-card-val val-emerald">${evalData.correct}</div>
          <div class="metric-card-sub">+${evalData.correct} marks</div>
        </div>

        <div class="result-metric-card">
          <div class="metric-card-title">Incorrect</div>
          <div class="metric-card-val val-rose">${evalData.incorrect}</div>
          <div class="metric-card-sub">0 marks</div>
        </div>

        <div class="result-metric-card">
          <div class="metric-card-title">Skipped</div>
          <div class="metric-card-val val-amber">${evalData.skipped}</div>
          <div class="metric-card-sub">Unanswered</div>
        </div>

        <div class="result-metric-card">
          <div class="metric-card-title">Accuracy</div>
          <div class="metric-card-val val-emerald">${evalData.accuracy}%</div>
          <div class="metric-card-sub">On attempted questions</div>
        </div>
      </div>

      <!-- 3. Time Analysis Box -->
      <div class="time-analysis-box">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">⏱️</span>
          <div>
            <strong style="color: var(--text-main); font-size: 1rem;">Time & Pacing Analysis</strong>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Real timing telemetry tracked during the interview</div>
          </div>
        </div>

        <div class="time-items-group">
          <div class="time-item">
            <span class="time-label">Total Time Taken</span>
            <span class="time-value">${formatTime(evalData.totalTimeSeconds)}</span>
          </div>
          <div class="time-item">
            <span class="time-label">Avg Time / Question</span>
            <span class="time-value">${evalData.avgTimePerQuestion}s</span>
          </div>
          <div class="time-item">
            <span class="time-label">Allocated Time</span>
            <span class="time-value">30m 00s</span>
          </div>
        </div>
      </div>

      <!-- 4. Topic-Wise Performance Section -->
      <div class="result-section-card">
        <div class="section-header-row">
          <h3>📊 Topic-Wise Performance Breakdown</h3>
          <span class="badge badge-primary">${evalData.topics.length} Categories</span>
        </div>

        <div style="overflow-x: auto;">
          <table class="topic-table">
            <thead>
              <tr>
                <th>Topic / Category</th>
                <th style="text-align: center;">Total</th>
                <th style="text-align: center;">Attempted</th>
                <th style="text-align: center;">Correct</th>
                <th style="text-align: center;">Incorrect</th>
                <th style="text-align: center;">Skipped</th>
                <th>Accuracy & Progress</th>
              </tr>
            </thead>
            <tbody>
              ${evalData.topics.map(t => {
                let fillClass = 'low';
                if (t.accuracy >= 70) fillClass = 'high';
                else if (t.accuracy >= 50) fillClass = 'medium';

                return `
                  <tr>
                    <td><strong>${t.topic}</strong></td>
                    <td style="text-align: center;">${t.total}</td>
                    <td style="text-align: center; color: var(--accent-blue); font-weight: 600;">${t.attempted}</td>
                    <td style="text-align: center; color: var(--accent-emerald); font-weight: 600;">${t.correct}</td>
                    <td style="text-align: center; color: var(--accent-rose); font-weight: 600;">${t.incorrect}</td>
                    <td style="text-align: center; color: var(--accent-amber); font-weight: 600;">${t.skipped}</td>
                    <td>
                      <div class="accuracy-bar-track">
                        <div class="accuracy-bar-fill ${fillClass}" style="width: ${t.accuracy}%;"></div>
                      </div>
                      <span style="font-weight: 600; font-family: var(--font-mono); font-size: 0.85rem;">${t.accuracy}%</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Strengths and Weaknesses -->
      <div class="strengths-weaknesses-grid">
        <div class="strength-card">
          <div class="insight-card-title">
            <span>✅</span>
            <span>Strong Areas (Accuracy ≥ 70%)</span>
          </div>
          <div class="topic-pills-list">
            ${evalData.strongAreas.length > 0 ? evalData.strongAreas.map(t => `
              <div class="topic-pill-row">
                <strong>${t.topic}</strong>
                <span class="badge badge-success">${t.accuracy}% Accuracy (${t.correct}/${t.total})</span>
              </div>
            `).join('') : `
              <div style="color: var(--text-muted); font-size: 0.88rem;">No topic achieved ≥ 70% accuracy. Focus on fundamentals across all categories.</div>
            `}
          </div>
        </div>

        <div class="weakness-card">
          <div class="insight-card-title">
            <span>🎯</span>
            <span>Needs Improvement (Accuracy &lt; 70%)</span>
          </div>
          <div class="topic-pills-list">
            ${evalData.weakAreas.length > 0 ? evalData.weakAreas.map(t => `
              <div class="topic-pill-row">
                <strong>${t.topic}</strong>
                <span class="badge ${t.attempted === 0 ? 'badge-warning' : 'badge-danger'}">
                  ${t.attempted === 0 ? 'Unattempted' : `${t.accuracy}% Accuracy (${t.correct}/${t.total})`}
                </span>
              </div>
            `).join('') : `
              <div style="color: var(--accent-emerald); font-size: 0.88rem; font-weight: 600;">Excellent work! You achieved high accuracy across all tested topics.</div>
            `}
          </div>
        </div>
      </div>

      <!-- 6. AI Strategic Insights & Recommendations (Supporting Section) -->
      <div class="ai-insights-card">
        <div class="section-header-row">
          <h3>💡 AI Insights & Strategic Preparation Plan</h3>
          <span class="badge badge-primary">Factual Synthesis</span>
        </div>

        <ul class="ai-insights-list">
          <li class="ai-insight-item">
            <span style="font-size: 1.2rem;">⏱️</span>
            <div>
              <strong>Time Allocation Efficiency:</strong>
              <div>You averaged ${evalData.avgTimePerQuestion} seconds per question. Ideal interview pace is 45-60 seconds for intermediate aptitude questions.</div>
            </div>
          </li>
          ${evalData.weakAreas.length > 0 ? `
            <li class="ai-insight-item">
              <span style="font-size: 1.2rem;">🎯</span>
              <div>
                <strong>High-Priority Focus Topics:</strong>
                <div>Prioritize revising formulas and shortcut techniques for: <strong>${evalData.weakAreas.map(w => w.topic).join(', ')}</strong> before taking full technical screenings.</div>
              </div>
            </li>
          ` : ''}
          <li class="ai-insight-item">
            <span style="font-size: 1.2rem;">📝</span>
            <div>
              <strong>Question Strategy & Accuracy:</strong>
              <div>You skipped ${evalData.skipped} questions and answered ${evalData.correct} correctly out of ${evalData.attempted} attempted. Review the detailed derivations below to fix calculation and conceptual traps.</div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 7. Interactive Question-Wise Review Section -->
      <div class="result-section-card" id="question-review-section">
        <div class="review-header-bar">
          <div>
            <h3 style="margin-bottom: 0.2rem;">🔍 Question-Wise Detailed Review</h3>
            <span style="color: var(--text-dim); font-size: 0.82rem;">Step-by-step verification of your actual answers vs verified solutions</span>
          </div>

          <div class="review-filter-buttons">
            <button class="review-filter-btn active" data-filter="all">All (${evalData.totalQuestions})</button>
            <button class="review-filter-btn" data-filter="correct">Correct (${evalData.correct})</button>
            <button class="review-filter-btn" data-filter="incorrect">Incorrect (${evalData.incorrect})</button>
            <button class="review-filter-btn" data-filter="skipped">Skipped (${evalData.skipped})</button>
          </div>
        </div>

        <div class="review-cards-list" id="review-cards-list">
          ${evalData.questionReviews.map(q => {
            const labels = ['A', 'B', 'C', 'D'];
            let statusBadge = '<span class="badge badge-success">✓ Correct (+1 Mark)</span>';
            if (q.status === 'incorrect') statusBadge = '<span class="badge badge-danger">✕ Incorrect (0 Marks)</span>';
            else if (q.status === 'skipped') statusBadge = '<span class="badge badge-warning">↷ Skipped (0 Marks)</span>';

            return `
              <div class="review-q-card status-${q.status}" data-status="${q.status}">
                <div class="review-q-topbar">
                  <div class="review-q-meta">
                    <span class="badge badge-primary">Question ${q.index}</span>
                    <span class="badge badge-purple">${q.topic}</span>
                    ${q.timeSpent > 0 ? `<span style="font-size: 0.78rem; color: var(--text-dim);">⏱️ ${q.timeSpent}s</span>` : ''}
                  </div>
                  <div>${statusBadge}</div>
                </div>

                <div class="review-q-text">${q.question}</div>

                <div class="review-options-grid">
                  ${q.options.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === q.correctOptionIndex;
                    const isUserSelected = optIdx === q.selectedOptionIndex;
                    let optClass = '';
                    let optTag = '';

                    if (isCorrectOpt) {
                      optClass = 'opt-correct';
                      optTag = '<span style="margin-left: auto; color: var(--accent-emerald); font-weight: 700;">✓ Correct Answer</span>';
                    } else if (isUserSelected && !isCorrectOpt) {
                      optClass = 'opt-user-wrong';
                      optTag = '<span style="margin-left: auto; color: var(--accent-rose); font-weight: 700;">✕ Your Answer</span>';
                    }

                    return `
                      <div class="review-option ${optClass}">
                        <span style="width: 24px; height: 24px; border-radius: 50%; background: var(--bg-card); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; border: 1px solid var(--border-subtle); flex-shrink: 0;">${labels[optIdx]}</span>
                        <span>${opt}</span>
                        ${optTag}
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="review-explanation-box">
                  <strong>💡 Mathematical & Deductive Explanation:</strong>
                  <div style="white-space: pre-line;">${q.explanation}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 8. Action Navigation Bar -->
      <div class="result-actions-bar">
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button id="res-scroll-review-btn" class="btn btn-secondary">🔍 Review Answers</button>
          <button id="res-retake-btn" class="btn btn-secondary">🔄 Retake Aptitude Round</button>
          <button id="res-dashboard-btn" class="btn btn-secondary">📊 Back to Dashboard</button>
        </div>

        <button id="res-next-round-btn" class="btn btn-primary btn-lg">Continue to Next Round →</button>
      </div>
    </div>
    `;

    resultContainer.innerHTML = resultHtml;
    resultContainer.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Setup Review Filters
    const filterBtns = resultContainer.querySelectorAll('.review-filter-btn');
    const qCards = resultContainer.querySelectorAll('.review-q-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            qCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-status') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Button Actions
    const scrollReviewBtn = document.getElementById('res-scroll-review-btn');
    if (scrollReviewBtn) {
        scrollReviewBtn.addEventListener('click', () => {
            document.getElementById('question-review-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const retakeBtn = document.getElementById('res-retake-btn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            retakeAptitudeRound();
        });
    }

    const dashboardBtn = document.getElementById('res-dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    const nextRoundBtn = document.getElementById('res-next-round-btn');
    if (nextRoundBtn) {
        nextRoundBtn.addEventListener('click', async () => {
            nextRoundBtn.disabled = true;
            nextRoundBtn.textContent = 'Advancing to Next Round...';
            try {
                const intRes = await window.API.getInterviewById(interviewId);
                let nextRound = 'technical';
                if (intRes.success && intRes.interview) {
                    const rounds = intRes.interview.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
                    const nextIdx = (intRes.interview.current_round_index || 0) + 1;
                    if (nextIdx < rounds.length) {
                        await window.API.updateInterviewProgress(interviewId, { roundIndex: nextIdx });
                        nextRound = rounds[nextIdx] || 'technical';
                        window.location.href = `${nextRound}.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
                    } else {
                        // All rounds completed
                        await window.API.finalizeInterview(interviewId);
                        window.location.href = `report.html?id=${interviewId}`;
                    }
                } else {
                    window.location.href = `technical.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
                }
            } catch (err) {
                console.error('Error advancing round:', err);
                window.location.href = `technical.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
            }
        });
    }
}

function retakeAptitudeRound() {
    stopQuestionSpeech();
    userAnswers = {};
    viewedAnswers = {};
    visitedQuestions = { 0: true };
    questionTimeSpent = {};
    currentIndex = 0;
    secondsRemaining = 1800;
    roundStartTime = Date.now();
    questionStartTimestamp = Date.now();

    const resultContainer = document.getElementById('aptitude-result-container');
    const workbench = document.getElementById('aptitude-workbench');

    if (resultContainer) resultContainer.style.display = 'none';
    if (workbench) workbench.style.display = 'block';

    window.Toast.info('Reloading fresh aptitude questions set...');
    startTimer();
    loadQuestions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function finishAptitudeRound() {
    stopQuestionSpeech();
    if (timerInterval) clearInterval(timerInterval);

    // Calculate factual evaluation immediately
    const evaluation = calculateAptitudeEvaluation();

    // Render result screen immediately
    renderAptitudeResultScreen(evaluation);
    window.Toast.success('Aptitude Round completed! Results calculated successfully.');

    // Save actual answer records in backend
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
                viewed_answer: Boolean(viewedAnswers[i]),
                timeTakenSeconds: questionTimeSpent[i] || 0
            });
        });

        await Promise.all(submitPromises);
    } catch (err) {
        console.error('Background submit error:', err);
    }
}
