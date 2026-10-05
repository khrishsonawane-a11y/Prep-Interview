/**
 * Coding / DSA Round Controller (Java, C, C++)
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let problems = [];
let currentIndex = 0;
let userCode = {}; // { [index]: { java: '...', c: '...', cpp: '...' } }
let userLanguages = {}; // { [index]: 'java' | 'c' | 'cpp' }
let consoleOutputs = {}; // { [index]: string }
let submissions = {}; // { [index]: { execution, evaluation } }
let skippedProblems = {}; // { [index]: boolean }
let viewedSolutions = {}; // { [index]: boolean }
let visitedProblems = { 0: true };
let currentLanguage = 'java'; // Default language
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

    setupLanguageSelector();
    setupExecutionButtons();
    setupSolutionModal();
    setupSpeechButton();
    await loadProblems();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
});

function setupLanguageSelector() {
    const selector = document.getElementById('code-language-select');
    if (!selector) return;

    selector.addEventListener('change', (e) => {
        saveCurrentCodeDraft();
        currentLanguage = e.target.value;
        userLanguages[currentIndex] = currentLanguage;
        restoreEditorCode();
        updateSolutionModalContent();
    });

    const resetBtn = document.getElementById('reset-code-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const p = problems[currentIndex];
            if (!p) return;
            const starter = p.starter_code?.[currentLanguage] || getDefaultStarter(currentLanguage);
            document.getElementById('code-editor-textarea').value = starter;
            if (!userCode[currentIndex]) userCode[currentIndex] = {};
            userCode[currentIndex][currentLanguage] = starter;
            window.Toast.info(`Editor reset to clean ${getLanguageName(currentLanguage)} template.`);
        });
    }
}

function getLanguageName(lang) {
    if (lang === 'c') return 'C';
    if (lang === 'cpp') return 'C++';
    return 'Java';
}

function getDefaultStarter(lang) {
    if (lang === 'c') {
        return '#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint solve() {\n    // Write your code here\n    return 0;\n}';
    }
    if (lang === 'cpp') {
        return '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your code here\n        return 0;\n    }\n};';
    }
    return 'class Solution {\n    public int solve() {\n        // Write your code in Java here\n        return 0;\n    }\n}';
}

function saveCurrentCodeDraft() {
    const textarea = document.getElementById('code-editor-textarea');
    if (textarea && problems[currentIndex]) {
        if (!userCode[currentIndex]) userCode[currentIndex] = {};
        userCode[currentIndex][currentLanguage] = textarea.value;
    }
}

function restoreEditorCode() {
    const textarea = document.getElementById('code-editor-textarea');
    if (!textarea || !problems[currentIndex]) return;

    const p = problems[currentIndex];
    const saved = userCode[currentIndex]?.[currentLanguage];
    if (saved !== undefined) {
        textarea.value = saved;
    } else if (p.starter_code && p.starter_code[currentLanguage]) {
        textarea.value = p.starter_code[currentLanguage];
    } else {
        textarea.value = getDefaultStarter(currentLanguage);
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
            if (!userCode[currentIndex]) userCode[currentIndex] = {};
            userCode[currentIndex][currentLanguage] = sol;
            modal.style.display = 'none';
            window.Toast.success(`Copied ${getLanguageName(currentLanguage)} reference solution to editor!`);
        });
    }
}

function updateSolutionModalContent() {
    const currentProblem = problems[currentIndex];
    if (!currentProblem) return;

    const langLabel = document.getElementById('solution-lang-label');
    if (langLabel) langLabel.textContent = getLanguageName(currentLanguage);

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
        const sol = currentProblem.solution_code?.[currentLanguage] || getDefaultStarter(currentLanguage);
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

    // Set language
    currentLanguage = userLanguages[index] || 'java';
    const langSelect = document.getElementById('code-language-select');
    if (langSelect) langSelect.value = currentLanguage;

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

    // Console output
    const consoleOutput = document.getElementById('console-output-pane');
    if (consoleOutput) {
        if (consoleOutputs[index]) {
            consoleOutput.innerHTML = consoleOutputs[index];
        } else {
            consoleOutput.innerHTML = '<span style="color: var(--text-dim);">Click \'Run Tests\' to compile and test against sample test cases.</span>';
        }
    }

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

function setupExecutionButtons() {
    const runBtn = document.getElementById('run-code-btn');
    const submitBtn = document.getElementById('submit-code-btn');
    const skipBtn = document.getElementById('skip-code-btn');
    const prevNavBtn = document.getElementById('prev-code-nav-btn');
    const nextNavBtn = document.getElementById('next-code-nav-btn');

    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            saveCurrentCodeDraft();
            const code = document.getElementById('code-editor-textarea').value;
            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your solution code before running tests.');
                return;
            }

            const p = problems[currentIndex];

            try {
                runBtn.disabled = true;
                runBtn.innerHTML = '<span class="spinner"></span> Compiling & Testing...';

                const res = await window.API.runCode({
                    code,
                    language: currentLanguage,
                    testCases: p?.test_cases || [],
                    problemId: p?.id
                });

                if (res.success && res.execution) {
                    displayExecutionConsole(res.execution, true);
                }
            } catch (err) {
                console.error('Run code error:', err);
                window.Toast.error(err.message || 'Execution failed.');
            } finally {
                runBtn.disabled = false;
                runBtn.innerHTML = '▶ Run Tests';
            }
        });
    }

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
                    language: currentLanguage,
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

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            saveCurrentCodeDraft();
            stopQuestionSpeech();
            const code = document.getElementById('code-editor-textarea').value;
            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your solution code before submitting.');
                return;
            }

            const p = problems[currentIndex];

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> AI Evaluating Code...';

                const res = await window.API.submitCode({
                    interviewId,
                    problem: p,
                    code,
                    language: currentLanguage,
                    viewed_answer: !!viewedSolutions[currentIndex]
                });

                if (res.success) {
                    submissions[currentIndex] = { execution: res.execution, evaluation: res.evaluation };
                    delete skippedProblems[currentIndex];
                    renderPalette();
                    displayExecutionConsole(res.execution, false);
                    displayAIReviewModal(res.evaluation);
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

    if (prevNavBtn) {
        prevNavBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                renderProblem(currentIndex - 1);
                renderPalette();
            }
        });
    }

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

function displayExecutionConsole(execution, isRun = true) {
    const consoleOutput = document.getElementById('console-output-pane');
    if (!consoleOutput) return;

    const status = execution.status || (execution.passedCount === execution.totalCount && execution.totalCount > 0 ? 'Accepted' : 'Wrong Answer');
    const passedCount = execution.passedCount || 0;
    const totalCount = execution.totalCount || 0;
    const isAccepted = status === 'Accepted';
    const isCompError = status === 'Compilation Error';
    const isRuntimeError = status === 'Runtime Error';
    const isTLE = status === 'Time Limit Exceeded';

    let bannerClass = 'exec-banner-wrong';
    let bannerTitle = `✗ ${isRun ? 'Run Results' : 'Submission'}: WRONG ANSWER`;
    if (isAccepted) {
        bannerClass = 'exec-banner-accepted';
        bannerTitle = `✓ ${isRun ? 'Run Results' : 'Submission'}: ACCEPTED`;
    } else if (isCompError) {
        bannerClass = 'exec-banner-error';
        bannerTitle = `✕ COMPILATION ERROR`;
    } else if (isRuntimeError) {
        bannerClass = 'exec-banner-error';
        bannerTitle = `✕ RUNTIME ERROR`;
    } else if (isTLE) {
        bannerClass = 'exec-banner-error';
        bannerTitle = `⏱ TIME LIMIT EXCEEDED`;
    }

    let html = `
        <div class="exec-banner ${bannerClass}">
            <span>${bannerTitle}</span>
            <span>${isCompError ? 'Build Failed' : `${passedCount} / ${totalCount} Test Cases Passed`} (${execution.executionTimeMs || 15}ms)</span>
        </div>
    `;

    if (execution.error) {
        html += `<div style="background: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.75rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 0.65rem; white-space: pre-wrap;">${execution.error}</div>`;
    }

    if (execution.results && execution.results.length > 0) {
        execution.results.forEach(r => {
            const passBadge = r.passed 
                ? '<span class="test-badge-pass">✓ PASSED</span>' 
                : '<span class="test-badge-fail">✕ FAILED</span>';
            
            html += `
                <div class="testcase-card">
                    <div class="testcase-header">
                        <span>Test Case #${r.testCaseNumber} ${r.is_hidden ? '(Hidden)' : ''}</span>
                        ${passBadge}
                    </div>
                    ${!r.is_hidden ? `
                        <div class="testcase-body">
                            <div><span style="color:var(--text-dim); font-weight:600;">Input:</span> <code style="color:var(--text-main);">${r.input}</code></div>
                            <div><span style="color:var(--text-dim); font-weight:600;">Expected:</span> <code style="color:#10b981;">${r.expected}</code></div>
                            <div><span style="color:var(--text-dim); font-weight:600;">Actual:</span> <code style="color:${r.passed ? '#10b981' : '#ef4444'};">${r.actual}</code></div>
                        </div>
                    ` : `
                        <div style="font-size:0.75rem; color:var(--text-dim);">Hidden evaluation test case</div>
                    `}
                </div>
            `;
        });
    }

    consoleOutput.innerHTML = html;
    consoleOutputs[currentIndex] = html;
}

function displayAIReviewModal(evaluation) {
    const modal = document.getElementById('ai-review-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    const status = evaluation.status || 'Accepted';
    const statusBadge = document.getElementById('code-status-badge');
    if (statusBadge) {
        statusBadge.textContent = status;
        if (status === 'Accepted') {
            statusBadge.className = 'badge badge-success';
        } else if (status === 'Wrong Answer') {
            statusBadge.className = 'badge badge-warning';
        } else {
            statusBadge.className = 'badge badge-danger';
        }
    }

    const perfBadge = document.getElementById('code-perf-badge');
    if (perfBadge) {
        perfBadge.textContent = evaluation.correctness || `${evaluation.passedCount || 0} / ${evaluation.totalCount || 0} Passed`;
    }

    const scoreEl = document.getElementById('code-eval-score');
    if (scoreEl) {
        scoreEl.textContent = `${evaluation.score !== undefined ? evaluation.score : 80}/100`;
        scoreEl.style.color = evaluation.score >= 70 ? '#10b981' : (evaluation.score >= 40 ? '#f59e0b' : '#ef4444');
    }

    document.getElementById('code-time-comp').textContent = evaluation.time_complexity || 'O(N)';
    document.getElementById('code-space-comp').textContent = evaluation.space_complexity || 'O(1)';
    
    const qualEl = document.getElementById('code-quality-badge');
    if (qualEl) {
        qualEl.textContent = evaluation.code_quality || 'Clean Code';
        qualEl.style.color = evaluation.code_quality === 'Clean Code' ? '#10b981' : (evaluation.code_quality === 'Needs Optimization' ? '#f59e0b' : '#ef4444');
    }

    // Strengths
    const strengthsList = document.getElementById('code-strengths-list');
    const strengthsBox = document.getElementById('code-strengths-box');
    const strengths = evaluation.strengths || [];
    if (strengthsList) {
        if (strengths.length > 0) {
            strengthsList.innerHTML = strengths.map(s => `<li>✓ ${s}</li>`).join('');
            if (strengthsBox) strengthsBox.style.display = 'block';
        } else {
            strengthsList.innerHTML = `<li>No algorithmic strengths recorded.</li>`;
        }
    }

    // Mistakes / Issues
    const mistakesList = document.getElementById('code-mistakes-list');
    const mistakesBox = document.getElementById('code-mistakes-box');
    const mistakes = evaluation.mistakes || [];
    if (mistakesList) {
        if (mistakes.length > 0) {
            mistakesList.innerHTML = mistakes.map(m => `<li>❌ ${m}</li>`).join('');
            if (mistakesBox) mistakesBox.style.display = 'block';
        } else {
            if (mistakesBox) mistakesBox.style.display = 'none';
        }
    }

    // Improvements
    const improveList = document.getElementById('code-improvements-list');
    const improveBox = document.getElementById('code-improvements-box');
    const improvements = evaluation.improvements || [];
    if (improveList) {
        if (improvements.length > 0) {
            improveList.innerHTML = improvements.map(i => `<li>💡 ${i}</li>`).join('');
            if (improveBox) improveBox.style.display = 'block';
        } else {
            if (improveBox) improveBox.style.display = 'none';
        }
    }

    document.getElementById('code-feedback-text').textContent = evaluation.feedback || 'Algorithmic review completed.';

    // Close button
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
