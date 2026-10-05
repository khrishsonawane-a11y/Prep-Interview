/**
 * Coding / DSA Round Controller (C++ ONLY)
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let problems = [];
let currentIndex = 0;
let userCode = {}; // { [index]: string }
let submissions = {}; // { [index]: { evaluation } }
let skippedProblems = {}; // { [index]: boolean }
let viewedSolutions = {}; // { [index]: boolean }
let visitedProblems = { 0: true };
const currentLanguage = 'cpp'; // C++ ONLY
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
    await loadProblems();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
});

function setupToolbarButtons() {
    const resetBtn = document.getElementById('reset-code-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const p = problems[currentIndex];
            if (!p) return;
            const starter = p.starter_code?.cpp || getDefaultCppStarter();
            document.getElementById('code-editor-textarea').value = starter;
            userCode[currentIndex] = starter;
            window.Toast.info('Editor reset to clean C++ template.');
        });
    }

    const skipBtn = document.getElementById('skip-code-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', async () => {
            saveCurrentCodeDraft();
            stopQuestionSpeech();
            const p = problems[currentIndex];

            skippedProblems[currentIndex] = true;
            delete submissions[currentIndex];
            renderPalette();

            try {
                skipBtn.disabled = true;
                await window.API.submitCode({
                    interviewId,
                    problem: p,
                    code: '// [SKIPPED]',
                    language: 'cpp',
                    is_skipped: true,
                    viewed_answer: !!viewedSolutions[currentIndex]
                });
                window.Toast.info(`Problem ${currentIndex + 1} marked as skipped.`);
            } catch (e) {
                console.warn('Skip code warning:', e);
            } finally {
                skipBtn.disabled = false;
            }

            if (currentIndex < problems.length - 1) {
                renderProblem(currentIndex + 1);
                renderPalette();
            } else {
                finishCodingRound();
            }
        });
    }

    const submitBtn = document.getElementById('submit-code-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            saveCurrentCodeDraft();
            stopQuestionSpeech();
            const code = document.getElementById('code-editor-textarea').value;
            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your C++ solution before submitting.');
                return;
            }

            const p = problems[currentIndex];

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Analyzing C++ Solution...';

                const res = await window.API.submitCode({
                    interviewId,
                    problem: p,
                    code,
                    language: 'cpp',
                    viewed_answer: !!viewedSolutions[currentIndex]
                });

                if (res.success) {
                    submissions[currentIndex] = { evaluation: res.evaluation };
                    delete skippedProblems[currentIndex];
                    renderPalette();
                    displayAIReviewModal(res.evaluation, p);
                }
            } catch (err) {
                console.error('Submit code error:', err);
                window.Toast.error(err.message || 'Submission failed.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Solution';
            }
        });
    }

    const prevNavBtn = document.getElementById('prev-code-nav-btn');
    if (prevNavBtn) {
        prevNavBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                renderProblem(currentIndex - 1);
                renderPalette();
            }
        });
    }

    const nextNavBtn = document.getElementById('next-code-nav-btn');
    if (nextNavBtn) {
        nextNavBtn.addEventListener('click', () => {
            if (currentIndex < problems.length - 1) {
                renderProblem(currentIndex + 1);
                renderPalette();
            } else {
                finishCodingRound();
            }
        });
    }
}

function getDefaultCppStarter() {
    return '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your C++ code here\n        return 0;\n    }\n};';
}

function saveCurrentCodeDraft() {
    const textarea = document.getElementById('code-editor-textarea');
    if (textarea && problems[currentIndex]) {
        userCode[currentIndex] = textarea.value;
    }
}

function restoreEditorCode() {
    const textarea = document.getElementById('code-editor-textarea');
    if (!textarea || !problems[currentIndex]) return;

    const p = problems[currentIndex];
    const saved = userCode[currentIndex];
    if (saved !== undefined) {
        textarea.value = saved;
    } else if (p.starter_code && p.starter_code.cpp) {
        textarea.value = p.starter_code.cpp;
    } else {
        textarea.value = getDefaultCppStarter();
    }
}

function setupSolutionModal() {
    const viewBtn = document.getElementById('view-solution-btn');
    const modal = document.getElementById('solution-modal');
    const closeBtn = document.getElementById('close-solution-btn');
    const copyBtn = document.getElementById('copy-solution-btn');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            viewedSolutions[currentIndex] = true;
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
            userCode[currentIndex] = sol;
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
            renderProblem(0);
            renderPalette();
        } else {
            window.Toast.error('Could not load coding problem pool.');
        }
    } catch (err) {
        console.error('Failed to load coding problems:', err);
        window.Toast.error('Could not load coding problems.');
    }
}

function renderProblem(index) {
    saveCurrentCodeDraft();
    stopQuestionSpeech();

    currentIndex = index;
    visitedProblems[index] = true;
    const p = problems[index];
    if (!p) return;

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

    // Editor code
    restoreEditorCode();

    // Navigation buttons
    const prevNavBtn = document.getElementById('prev-code-nav-btn');
    const nextNavBtn = document.getElementById('next-code-nav-btn');
    if (prevNavBtn) prevNavBtn.disabled = currentIndex === 0;
    if (nextNavBtn) {
        if (currentIndex === problems.length - 1) {
            nextNavBtn.textContent = 'Proceed to HR Round →';
        } else {
            nextNavBtn.textContent = 'Next Problem →';
        }
    }
}

function renderPalette() {
    const palette = document.getElementById('palette-container');
    if (!palette) return;

    let solvedCount = 0;
    palette.innerHTML = problems.map((p, i) => {
        const isSolved = submissions[i] !== undefined;
        if (isSolved) solvedCount++;
        const isSkipped = skippedProblems[i] === true;
        const isVisited = !!visitedProblems[i];
        const isViewed = !!viewedSolutions[i];
        const isCurrent = i === currentIndex;

        let statusClass = '';
        let statusTitle = `Problem ${i + 1}: ${p.title}`;
        if (isCurrent) {
            statusClass += ' current';
            statusTitle += ' (Current)';
        }
        if (isSolved) {
            statusClass += ' answered';
            statusTitle += ' - Solved';
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
        progressBadge.textContent = `${solvedCount}/${problems.length} Solved`;
    }

    palette.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            renderProblem(idx);
            renderPalette();
        });
    });
}

function displayAIReviewModal(evaluation, problem) {
    const modal = document.getElementById('ai-review-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    const isCorrect = evaluation.is_correct === true || (evaluation.score >= 75 && evaluation.status === 'Correct');
    const titleEl = document.getElementById('code-review-main-title');
    const subtitleEl = document.getElementById('code-review-subtitle');
    const scoreEl = document.getElementById('code-eval-score');
    const timeCompEl = document.getElementById('code-time-comp');
    const spaceCompEl = document.getElementById('code-space-comp');
    const qualityEl = document.getElementById('code-quality-badge');

    const correctContainer = document.getElementById('correct-details-container');
    const incorrectContainer = document.getElementById('incorrect-details-container');

    const score = evaluation.score !== undefined ? Number(evaluation.score) : (isCorrect ? 95 : 20);

    if (scoreEl) {
        scoreEl.textContent = `${score}/100`;
        scoreEl.style.color = isCorrect ? '#10b981' : '#ef4444';
    }

    if (timeCompEl) timeCompEl.textContent = evaluation.time_complexity || problem?.time_complexity || 'O(N)';
    if (spaceCompEl) spaceCompEl.textContent = evaluation.space_complexity || problem?.space_complexity || 'O(1)';
    if (qualityEl) {
        qualityEl.textContent = evaluation.code_quality || (isCorrect ? 'Clean Code' : 'Needs Optimization');
        qualityEl.style.color = isCorrect ? '#10b981' : '#ef4444';
    }

    if (isCorrect) {
        // ✅ CORRECT FLOW
        if (titleEl) {
            titleEl.textContent = '✅ Your code is correct.';
            titleEl.style.color = '#10b981';
        }
        if (subtitleEl) subtitleEl.textContent = 'Optimal C++ logic and algorithmic structure verified.';

        if (correctContainer) correctContainer.style.display = 'flex';
        if (incorrectContainer) incorrectContainer.style.display = 'none';

        const whyText = document.getElementById('correct-why-text');
        if (whyText) {
            whyText.textContent = evaluation.why_it_is_correct || evaluation.feedback || 'Your algorithm correctly solves the problem requirements with optimal boundary and edge-case handling.';
        }

        const approachText = document.getElementById('correct-approach-text');
        if (approachText) {
            approachText.textContent = evaluation.correct_approach || problem?.algorithm_explanation || problem?.approach || 'Standard optimal DSA strategy.';
        }
    } else {
        // ❌ INCORRECT FLOW
        if (titleEl) {
            titleEl.textContent = '❌ Your code is incorrect.';
            titleEl.style.color = '#ef4444';
        }
        if (subtitleEl) subtitleEl.textContent = 'Logical errors or missing problem invariants detected in C++ implementation.';

        if (correctContainer) correctContainer.style.display = 'none';
        if (incorrectContainer) incorrectContainer.style.display = 'flex';

        const probText = document.getElementById('incorrect-problem-text');
        if (probText) {
            probText.textContent = evaluation.problem_identified || (evaluation.mistakes && evaluation.mistakes[0]) || 'Logical flaw or incorrect output for problem requirements.';
        }

        const whyText = document.getElementById('incorrect-why-text');
        if (whyText) {
            whyText.textContent = evaluation.why_it_is_wrong || evaluation.feedback || 'The submitted C++ code does not satisfy the algorithmic invariants or produces wrong answers on edge cases.';
        }

        const hintText = document.getElementById('incorrect-hint-text');
        if (hintText) {
            hintText.textContent = evaluation.hint || problem?.approach || 'Review boundary conditions and verify how state transitions occur.';
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
                userCode[currentIndex] = refSolution;
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
                renderPalette();
            } else {
                finishCodingRound();
            }
        };
    }
}

async function finishCodingRound() {
    saveCurrentCodeDraft();
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

