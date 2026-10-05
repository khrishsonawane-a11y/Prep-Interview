/**
 * Coding / DSA Round Controller (C++ ONLY)
 * Independent State Management & Structured AI Evaluation
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let problems = [];
let currentIndex = 0;

// Independent State per question: { [problemId]: { id, title, candidateCode, explanation, evaluationResult, evaluationStatus, score, isCorrect, viewedSolution, submittingToken } }
const questionsState = {};

const MAX_CODING_QUESTIONS = 30;
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

    setupToolbarButtons();
    setupSolutionModal();
    setupSpeechButton();
    setupApproachInputListener();
    await loadProblems();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
});

function getDefaultCppStarter() {
    return '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your C++ solution here\n        return 0;\n    }\n};';
}

function getProblemKey(index) {
    const p = problems[index];
    return p?.id || `problem_${index}`;
}

function initProblemState(p, index) {
    const key = p.id || `problem_${index}`;
    if (!questionsState[key]) {
        questionsState[key] = {
            id: key,
            title: p.title || `Problem ${index + 1}`,
            candidateCode: p.starter_code?.cpp || getDefaultCppStarter(),
            explanation: '',
            evaluationResult: null,
            evaluationStatus: index === 0 ? 'visited' : 'unvisited',
            score: null,
            isCorrect: null,
            viewedSolution: false,
            submittingToken: null
        };
    }
    return questionsState[key];
}

function saveCurrentProblemDraft() {
    const p = problems[currentIndex];
    if (!p) return;
    const key = getProblemKey(currentIndex);
    const codeArea = document.getElementById('code-editor-textarea');
    const explArea = document.getElementById('approach-explanation-textarea');

    if (!questionsState[key]) {
        initProblemState(p, currentIndex);
    }

    if (codeArea) {
        questionsState[key].candidateCode = codeArea.value;
    }
    if (explArea) {
        questionsState[key].explanation = explArea.value;
    }
}

function setupApproachInputListener() {
    const explArea = document.getElementById('approach-explanation-textarea');
    const charCount = document.getElementById('approach-char-count');
    if (explArea && charCount) {
        explArea.addEventListener('input', () => {
            const len = explArea.value.length;
            charCount.textContent = `${len} chars`;
            const key = getProblemKey(currentIndex);
            if (questionsState[key]) {
                questionsState[key].explanation = explArea.value;
            }
        });
    }

    const reopenBtn = document.getElementById('reopen-review-btn');
    if (reopenBtn) {
        reopenBtn.addEventListener('click', () => {
            const p = problems[currentIndex];
            const key = getProblemKey(currentIndex);
            const state = questionsState[key];
            if (state && state.evaluationResult) {
                displayAIReviewModal(state.evaluationResult, p, currentIndex);
            }
        });
    }
}

function setupToolbarButtons() {
    const resetBtn = document.getElementById('reset-code-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const p = problems[currentIndex];
            if (!p) return;
            const key = getProblemKey(currentIndex);
            const starter = p.starter_code?.cpp || getDefaultCppStarter();
            document.getElementById('code-editor-textarea').value = starter;
            if (questionsState[key]) {
                questionsState[key].candidateCode = starter;
            }
            window.Toast.info('Editor reset to clean C++ template.');
        });
    }

    const skipBtn = document.getElementById('skip-code-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', async () => {
            saveCurrentProblemDraft();
            stopQuestionSpeech();
            const p = problems[currentIndex];
            const key = getProblemKey(currentIndex);

            if (questionsState[key]) {
                questionsState[key].evaluationStatus = 'skipped';
                questionsState[key].evaluationResult = null;
                questionsState[key].score = 0;
                questionsState[key].isCorrect = false;
            }

            renderPalette();
            updateInlineEvaluationCard();

            try {
                skipBtn.disabled = true;
                await window.API.submitCode({
                    interviewId,
                    problem: p,
                    code: '// [SKIPPED]',
                    explanation: questionsState[key]?.explanation || '',
                    language: 'cpp',
                    is_skipped: true,
                    viewed_answer: !!questionsState[key]?.viewedSolution
                });
                window.Toast.info(`Problem ${currentIndex + 1} marked as skipped.`);
            } catch (e) {
                console.warn('Skip code warning:', e);
            } finally {
                skipBtn.disabled = false;
            }

            if (currentIndex < problems.length - 1) {
                renderProblem(currentIndex + 1);
            } else {
                finishCodingRound();
            }
        });
    }

    const submitBtn = document.getElementById('submit-code-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            saveCurrentProblemDraft();
            stopQuestionSpeech();
            const p = problems[currentIndex];
            const key = getProblemKey(currentIndex);
            const state = questionsState[key];

            const code = state?.candidateCode || document.getElementById('code-editor-textarea')?.value || '';
            const explanation = state?.explanation || document.getElementById('approach-explanation-textarea')?.value || '';

            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your C++ solution before submitting.');
                return;
            }

            const submissionIndex = currentIndex;
            const submissionToken = Date.now();
            state.submittingToken = submissionToken;

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Evaluating C++ Answer...';

                const res = await window.API.submitCode({
                    interviewId,
                    problem: p,
                    code,
                    explanation,
                    language: 'cpp',
                    viewed_answer: !!state.viewedSolution
                });

                if (res.success && res.evaluation) {
                    state.evaluationResult = res.evaluation;
                    state.evaluationStatus = 'answered';
                    state.score = res.evaluation.score;
                    state.isCorrect = res.evaluation.is_correct ? true : (res.evaluation.status === 'Partially Correct' ? 'partially' : false);

                    renderPalette();

                    // Check race condition: only pop up if user is still on this problem
                    if (currentIndex === submissionIndex) {
                        updateInlineEvaluationCard();
                        displayAIReviewModal(res.evaluation, p, submissionIndex);
                    } else {
                        window.Toast.info(`Problem ${submissionIndex + 1} evaluated: ${res.evaluation.status}`);
                    }
                }
            } catch (err) {
                console.error('Submit code error:', err);
                window.Toast.error(err.message || 'Submission evaluation failed.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Answer';
            }
        });
    }

    const prevNavBtn = document.getElementById('prev-code-nav-btn');
    if (prevNavBtn) {
        prevNavBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                renderProblem(currentIndex - 1);
            }
        });
    }

    const nextNavBtn = document.getElementById('next-code-nav-btn');
    if (nextNavBtn) {
        nextNavBtn.addEventListener('click', () => {
            if (currentIndex < problems.length - 1) {
                renderProblem(currentIndex + 1);
            } else {
                finishCodingRound();
            }
        });
    }
}

function setupSolutionModal() {
    const viewBtn = document.getElementById('view-solution-btn');
    const modal = document.getElementById('solution-modal');
    const closeBtn = document.getElementById('close-solution-btn');
    const copyBtn = document.getElementById('copy-solution-btn');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            const key = getProblemKey(currentIndex);
            if (questionsState[key]) {
                questionsState[key].viewedSolution = true;
            }
            renderPalette();
            updateSolutionModalContent();
            modal.style.display = 'flex';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (copyBtn && modal) {
        copyBtn.addEventListener('click', () => {
            const codeView = document.getElementById('solution-code-view');
            const sol = codeView?.textContent || '';
            document.getElementById('code-editor-textarea').value = sol;
            const key = getProblemKey(currentIndex);
            if (questionsState[key]) {
                questionsState[key].candidateCode = sol;
            }
            modal.style.display = 'none';
            window.Toast.success('Copied C++ reference solution to editor!');
        });
    }
}

function updateSolutionModalContent() {
    const currentProblem = problems[currentIndex];
    if (!currentProblem) return;

    const approachText = document.getElementById('solution-approach-text');
    if (approachText) approachText.textContent = currentProblem.approach || 'Apply optimal algorithmic strategy for minimum time complexity.';

    const algoText = document.getElementById('solution-algorithm-text');
    if (algoText) algoText.textContent = currentProblem.algorithm_explanation || '1. Parse constraints.\n2. Apply algorithmic data structures.\n3. Return result.';

    const timeText = document.getElementById('solution-time-text');
    if (timeText) timeText.textContent = currentProblem.time_complexity || 'O(N)';

    const spaceText = document.getElementById('solution-space-text');
    if (spaceText) spaceText.textContent = currentProblem.space_complexity || 'O(1)';

    const codeView = document.getElementById('solution-code-view');
    if (codeView) {
        const sol = currentProblem.solution_code?.cpp || getDefaultCppStarter();
        codeView.textContent = sol;
    }
}

function setupSpeechButton() {
    const speakBtn = document.getElementById('speak-code-btn');
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
    const currentProblem = problems[currentIndex];
    if (!('speechSynthesis' in window) || !currentProblem) {
        window.Toast.info('Speech synthesis is not supported on this browser.');
        return;
    }

    stopQuestionSpeech();

    const textToRead = `${currentProblem.title}. ${currentProblem.description || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        isSpeakingQuestion = true;
        const btn = document.getElementById('speak-code-btn');
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
    const btn = document.getElementById('speak-code-btn');
    if (btn) {
        btn.innerHTML = '🔊 Read Question Aloud';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
    }
}

async function loadProblems() {
    try {
        const res = await window.API.getCodingQuestions({
            count: MAX_CODING_QUESTIONS,
            role: currentRole,
            difficulty: currentDifficulty
        });

        if (res.success && res.problems && res.problems.length > 0) {
            problems = res.problems;
            // Initialize states for all problems
            problems.forEach((p, i) => initProblemState(p, i));
            renderProblem(0);
        } else {
            window.Toast.error('Could not load coding problem pool.');
        }
    } catch (err) {
        console.error('Failed to load coding problems:', err);
        window.Toast.error('Could not load coding problems.');
    }
}

function renderProblem(index) {
    saveCurrentProblemDraft();
    stopQuestionSpeech();

    // Close any previous evaluation popup
    const modal = document.getElementById('ai-review-modal');
    if (modal) modal.style.display = 'none';

    currentIndex = index;
    const p = problems[index];
    if (!p) return;

    const key = getProblemKey(index);
    const state = initProblemState(p, index);
    if (state.evaluationStatus === 'unvisited') {
        state.evaluationStatus = 'visited';
    }

    // Header badges
    const counterElem = document.getElementById('coding-q-counter');
    if (counterElem) {
        counterElem.textContent = `Problem ${index + 1} of ${problems.length}`;
    }
    document.getElementById('problem-diff-badge').textContent = p.difficulty || 'Beginner';
    document.getElementById('problem-topic-badge').textContent = p.topic || 'DSA';
    document.getElementById('problem-title-display').textContent = p.title;
    document.getElementById('problem-desc-content').innerHTML = (p.description || '').replace(/\n/g, '<br>');

    // Examples
    const examplesWrap = document.getElementById('examples-wrap');
    if (examplesWrap && p.examples) {
        examplesWrap.innerHTML = p.examples.map((ex, i) => `
            <div class="example-box">
                <div style="font-weight:600; color:var(--text-main); margin-bottom:0.25rem;">Example ${i + 1}:</div>
                <div><span style="color:var(--text-dim);">Input:</span> ${ex.input}</div>
                <div><span style="color:var(--text-dim);">Output:</span> ${ex.output}</div>
                ${ex.explanation ? `<div><span style="color:var(--text-dim);">Explanation:</span> ${ex.explanation}</div>` : ''}
            </div>
        `).join('');
    }

    // Constraints
    const constraintsWrap = document.getElementById('constraints-wrap');
    if (constraintsWrap && p.constraints) {
        constraintsWrap.innerHTML = p.constraints.map(c => `<li>• ${c}</li>`).join('');
    }

    // Restore candidate code for THIS specific question
    const codeArea = document.getElementById('code-editor-textarea');
    if (codeArea) {
        codeArea.value = state.candidateCode !== undefined ? state.candidateCode : (p.starter_code?.cpp || getDefaultCppStarter());
    }

    // Restore candidate approach explanation for THIS specific question
    const explArea = document.getElementById('approach-explanation-textarea');
    const charCount = document.getElementById('approach-char-count');
    if (explArea) {
        explArea.value = state.explanation || '';
        if (charCount) charCount.textContent = `${(state.explanation || '').length} chars`;
    }

    // Restore or hide inline evaluation card
    updateInlineEvaluationCard();

    // Navigation buttons
    const prevNavBtn = document.getElementById('prev-code-nav-btn');
    const nextNavBtn = document.getElementById('next-code-nav-btn');
    if (prevNavBtn) prevNavBtn.disabled = currentIndex === 0;
    if (nextNavBtn) {
        nextNavBtn.textContent = currentIndex === problems.length - 1 ? 'Proceed to HR Round →' : 'Next Problem →';
    }

    renderPalette();
}

function updateInlineEvaluationCard() {
    const card = document.getElementById('inline-eval-card');
    if (!card) return;

    const key = getProblemKey(currentIndex);
    const state = questionsState[key];

    if (!state || !state.evaluationResult) {
        card.style.display = 'none';
        return;
    }

    const evalRes = state.evaluationResult;
    card.style.display = 'block';

    const verdictBadge = document.getElementById('inline-verdict-badge');
    const scoreText = document.getElementById('inline-score-text');
    const summaryText = document.getElementById('inline-eval-summary-text');

    if (verdictBadge) {
        if (evalRes.status === 'Correct') {
            verdictBadge.textContent = '✅ Correct';
            verdictBadge.className = 'badge badge-success';
        } else if (evalRes.status === 'Partially Correct') {
            verdictBadge.textContent = '🟡 Partially Correct';
            verdictBadge.className = 'badge badge-warning';
        } else {
            verdictBadge.textContent = '❌ Incorrect';
            verdictBadge.className = 'badge badge-danger';
        }
    }

    if (scoreText) {
        scoreText.textContent = `Score: ${evalRes.score}/100`;
    }

    if (summaryText) {
        summaryText.textContent = evalRes.feedback || evalRes.problem_identified || evalRes.why_it_is_correct || 'C++ submission evaluated.';
    }
}

function renderPalette() {
    const palette = document.getElementById('palette-container');
    if (!palette) return;

    let solvedCount = 0;
    palette.innerHTML = problems.map((p, i) => {
        const key = getProblemKey(i);
        const state = questionsState[key] || { evaluationStatus: 'unvisited' };

        const isAnswered = state.evaluationStatus === 'answered';
        if (isAnswered) solvedCount++;
        const isSkipped = state.evaluationStatus === 'skipped';
        const isVisited = state.evaluationStatus === 'visited';
        const isViewed = !!state.viewedSolution;
        const isCurrent = i === currentIndex;

        let statusClass = '';
        let statusTitle = `Problem ${i + 1}: ${p.title}`;

        if (isCurrent) {
            statusClass += ' current';
            statusTitle += ' (Current)';
        }
        if (isAnswered) {
            statusClass += ' answered';
            statusTitle += ` - ${state.evaluationResult?.status || 'Answered'}`;
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
        progressBadge.textContent = `${solvedCount}/${problems.length} Answered`;
    }

    palette.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            renderProblem(idx);
        });
    });
}

function displayAIReviewModal(evaluation, problem, problemIndex) {
    const modal = document.getElementById('ai-review-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    const status = evaluation.status || (evaluation.is_correct ? 'Correct' : 'Incorrect');
    const isCorrect = status === 'Correct';
    const isPartial = status === 'Partially Correct';

    const titleEl = document.getElementById('code-review-main-title');
    const subtitleEl = document.getElementById('code-review-subtitle');
    const scoreEl = document.getElementById('code-eval-score');
    const timeCompEl = document.getElementById('code-time-comp');
    const spaceCompEl = document.getElementById('code-space-comp');
    const qualityEl = document.getElementById('code-quality-badge');
    const explBadge = document.getElementById('code-expl-badge');
    const explFeedbackText = document.getElementById('code-expl-feedback-text');

    const correctContainer = document.getElementById('correct-details-container');
    const partialContainer = document.getElementById('partial-details-container');
    const incorrectContainer = document.getElementById('incorrect-details-container');

    const score = evaluation.score !== undefined ? Number(evaluation.score) : (isCorrect ? 95 : (isPartial ? 55 : 20));

    if (scoreEl) {
        scoreEl.textContent = `${score}/100`;
        scoreEl.style.color = isCorrect ? '#10b981' : (isPartial ? '#f59e0b' : '#ef4444');
    }

    if (timeCompEl) timeCompEl.textContent = evaluation.time_complexity || problem?.time_complexity || 'O(N)';
    if (spaceCompEl) spaceCompEl.textContent = evaluation.space_complexity || problem?.space_complexity || 'O(1)';
    
    if (qualityEl) {
        qualityEl.textContent = evaluation.code_quality || (isCorrect ? 'Clean Code' : (isPartial ? 'Partially Optimized' : 'Needs Optimization'));
        qualityEl.style.color = isCorrect ? '#10b981' : (isPartial ? '#f59e0b' : '#ef4444');
    }

    if (explBadge) {
        const rating = evaluation.explanation_rating || 'Not Provided';
        explBadge.textContent = rating;
        explBadge.style.color = rating === 'Good' ? '#38bdf8' : (rating === 'Adequate' ? '#f59e0b' : '#94a3b8');
    }

    if (explFeedbackText) {
        explFeedbackText.textContent = evaluation.explanation_feedback || 'No written approach explanation provided.';
    }

    // Toggle 3 distinct verdict views
    if (isCorrect) {
        // ✅ CORRECT FLOW
        if (titleEl) {
            titleEl.textContent = '✅ Your code is correct.';
            titleEl.style.color = '#10b981';
        }
        if (subtitleEl) subtitleEl.textContent = 'Optimal C++ logic and algorithmic invariants verified.';

        if (correctContainer) correctContainer.style.display = 'flex';
        if (partialContainer) partialContainer.style.display = 'none';
        if (incorrectContainer) incorrectContainer.style.display = 'none';

        const whyText = document.getElementById('correct-why-text');
        if (whyText) {
            whyText.textContent = evaluation.why_it_is_correct || evaluation.feedback || 'Your algorithm correctly solves all problem requirements with optimal boundary and edge-case handling.';
        }

        const approachText = document.getElementById('correct-approach-text');
        if (approachText) {
            approachText.textContent = evaluation.correct_approach || problem?.algorithm_explanation || problem?.approach || 'Optimal DSA algorithm.';
        }
    } else if (isPartial) {
        // 🟡 PARTIALLY CORRECT FLOW
        if (titleEl) {
            titleEl.textContent = '🟡 Your code is partially correct.';
            titleEl.style.color = '#f59e0b';
        }
        if (subtitleEl) subtitleEl.textContent = 'Core algorithmic intent is sound, but edge case flaws or suboptimal complexity were detected.';

        if (correctContainer) correctContainer.style.display = 'none';
        if (partialContainer) partialContainer.style.display = 'flex';
        if (incorrectContainer) incorrectContainer.style.display = 'none';

        const whatCorrectText = document.getElementById('partial-what-correct-text');
        if (whatCorrectText) {
            whatCorrectText.textContent = evaluation.what_is_correct || 'Main algorithmic structure and logic loop were implemented correctly.';
        }

        const probText = document.getElementById('partial-problem-text');
        if (probText) {
            probText.textContent = evaluation.problem_identified || 'Missed boundary conditions or suboptimal time complexity.';
        }

        const whyText = document.getElementById('partial-why-text');
        if (whyText) {
            whyText.textContent = evaluation.why_it_is_wrong || 'The implementation fails on edge-case inputs (e.g. negative numbers, empty arrays, single elements).';
        }

        const hintText = document.getElementById('partial-hint-text');
        if (hintText) {
            hintText.textContent = evaluation.hint || problem?.approach || 'Check boundary edge cases and adjust accumulator initialization.';
        }

        const approachText = document.getElementById('partial-approach-text');
        if (approachText) {
            approachText.textContent = evaluation.correct_approach || problem?.algorithm_explanation || problem?.approach || 'Refactor algorithm to satisfy optimal Big-O bounds.';
        }
    } else {
        // ❌ INCORRECT FLOW
        if (titleEl) {
            titleEl.textContent = '❌ Your code is incorrect.';
            titleEl.style.color = '#ef4444';
        }
        if (subtitleEl) subtitleEl.textContent = 'Logical errors or missing problem invariants detected in C++ implementation.';

        if (correctContainer) correctContainer.style.display = 'none';
        if (partialContainer) partialContainer.style.display = 'none';
        if (incorrectContainer) incorrectContainer.style.display = 'flex';

        const probText = document.getElementById('incorrect-problem-text');
        if (probText) {
            probText.textContent = evaluation.problem_identified || (evaluation.mistakes && evaluation.mistakes[0]) || 'Logical flaw or incorrect output for problem requirements.';
        }

        const whyText = document.getElementById('incorrect-why-text');
        if (whyText) {
            whyText.textContent = evaluation.why_it_is_wrong || evaluation.feedback || 'The submitted C++ code does not satisfy the algorithmic invariants or produces wrong answers on test cases.';
        }

        const hintText = document.getElementById('incorrect-hint-text');
        if (hintText) {
            hintText.textContent = evaluation.hint || problem?.approach || 'Review boundary conditions and verify step-by-step state transitions.';
        }

        const approachText = document.getElementById('incorrect-approach-text');
        if (approachText) {
            approachText.textContent = evaluation.correct_approach || problem?.algorithm_explanation || problem?.approach || 'Traverse the complete array and apply standard optimal logic.';
        }

        const refCodeView = document.getElementById('review-solution-code-view');
        const refSolution = evaluation.reference_solution || problem?.solution_code?.cpp || getDefaultCppStarter();
        if (refCodeView) {
            refCodeView.textContent = refSolution;
        }

        const copyReviewSolBtn = document.getElementById('copy-review-solution-btn');
        if (copyReviewSolBtn) {
            copyReviewSolBtn.onclick = () => {
                document.getElementById('code-editor-textarea').value = refSolution;
                const key = getProblemKey(currentIndex);
                if (questionsState[key]) {
                    questionsState[key].candidateCode = refSolution;
                }
                window.Toast.success('Copied corrected C++ solution to editor!');
            };
        }
    }

    const closeBtn = document.getElementById('close-review-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    const nextBtn = document.getElementById('proceed-to-hr-btn');
    if (nextBtn) {
        nextBtn.textContent = currentIndex < problems.length - 1 ? 'Next Coding Problem →' : 'Proceed to HR Round →';
        nextBtn.onclick = () => {
            modal.style.display = 'none';
            if (currentIndex < problems.length - 1) {
                renderProblem(currentIndex + 1);
            } else {
                finishCodingRound();
            }
        };
    }
}

async function finishCodingRound() {
    saveCurrentProblemDraft();
    stopQuestionSpeech();
    window.Toast.success('Coding Round completed! Advancing to HR Round...');

    try {
        const intRes = await window.API.getInterviewById(interviewId);
        let nextRound = 'hr';
        if (intRes.success && intRes.interview) {
            const rounds = intRes.interview.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
            const nextIdx = (intRes.interview.current_round_index || 2) + 1;
            await window.API.updateInterviewProgress(interviewId, { roundIndex: nextIdx });
            nextRound = rounds[nextIdx] || 'hr';
        }

        setTimeout(() => {
            window.location.href = `${nextRound}.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
        }, 1000);
    } catch {
        window.location.href = `hr.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
    }
}
