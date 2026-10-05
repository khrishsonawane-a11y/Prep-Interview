/**
 * Coding / DSA Round Controller (Java, C, C++)
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let currentProblem = null;
let currentLanguage = 'java'; // Default language is Java
let askedProblems = [];
let problemCount = 0;
const MAX_CODING_QUESTIONS = 30;
let hasViewedCurrentAnswer = false;
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
    await loadProblem();
});

// Stop any active TTS when leaving page
window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
});

function setupLanguageSelector() {
    const selector = document.getElementById('code-language-select');
    if (!selector) return;

    selector.value = currentLanguage;
    selector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateEditorStarterCode();
        updateSolutionModalContent();
    });

    const resetBtn = document.getElementById('reset-code-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            updateEditorStarterCode();
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

function updateEditorStarterCode() {
    const textarea = document.getElementById('code-editor-textarea');
    if (!textarea || !currentProblem) return;

    if (currentProblem.starter_code && currentProblem.starter_code[currentLanguage]) {
        textarea.value = currentProblem.starter_code[currentLanguage];
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
            hasViewedCurrentAnswer = true;
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
            modal.style.display = 'none';
            window.Toast.success(`Copied ${getLanguageName(currentLanguage)} reference solution to editor!`);
        });
    }
}

function updateSolutionModalContent() {
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

async function loadProblem() {
    stopQuestionSpeech();
    hasViewedCurrentAnswer = false;

    try {
        const res = await window.API.getCodingQuestion({
            role: currentRole,
            difficulty: currentDifficulty,
            previousQuestions: askedProblems
        });

        if (res.success && res.problem) {
            currentProblem = res.problem;
            askedProblems.push(currentProblem.title);
            problemCount++;

            const counterElem = document.getElementById('coding-q-counter');
            if (counterElem) {
                counterElem.textContent = `Problem ${problemCount} of ${MAX_CODING_QUESTIONS}`;
            }

            const consoleOutput = document.getElementById('console-output-pane');
            if (consoleOutput) {
                consoleOutput.innerHTML = '<span style="color: var(--text-dim);">Click \'Run Tests\' to compile and test against sample test cases.</span>';
            }

            renderProblemDetails(currentProblem);
        }
    } catch (err) {
        console.error('Failed to load coding problem:', err);
        window.Toast.error('Could not load coding problem.');
    }
}

function renderProblemDetails(problem) {
    document.getElementById('problem-title-display').textContent = problem.title;
    document.getElementById('problem-diff-badge').textContent = problem.difficulty || 'Beginner';
    document.getElementById('problem-topic-badge').textContent = problem.topic || 'DSA';
    document.getElementById('problem-desc-content').innerHTML = (problem.description || '').replace(/\n/g, '<br>');

    // Examples
    const examplesWrap = document.getElementById('examples-wrap');
    if (examplesWrap && problem.examples) {
        examplesWrap.innerHTML = problem.examples.map((ex, i) => `
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
    if (constraintsWrap && problem.constraints) {
        constraintsWrap.innerHTML = problem.constraints.map(c => `<li>• ${c}</li>`).join('');
    }

    // Set starter code
    updateEditorStarterCode();
}

function setupExecutionButtons() {
    const runBtn = document.getElementById('run-code-btn');
    const submitBtn = document.getElementById('submit-code-btn');

    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            const code = document.getElementById('code-editor-textarea').value;
            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your solution code before running tests.');
                return;
            }

            try {
                runBtn.disabled = true;
                runBtn.innerHTML = '<span class="spinner"></span> Compiling & Testing...';

                const res = await window.API.runCode({
                    code,
                    language: currentLanguage,
                    testCases: currentProblem?.test_cases || [],
                    problemId: currentProblem?.id
                });

                if (res.success && res.execution) {
                    displayExecutionConsole(res.execution);
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

    const skipBtn = document.getElementById('skip-code-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
            try {
                skipBtn.disabled = true;
                await window.API.submitCode({
                    interviewId,
                    problem: currentProblem,
                    code: '// [SKIPPED]',
                    language: currentLanguage,
                    is_skipped: true,
                    viewed_answer: hasViewedCurrentAnswer
                });
                window.Toast.info('Coding problem skipped.');
            } catch (e) {
                console.warn('Skip code warning:', e);
            } finally {
                skipBtn.disabled = false;
            }

            if (problemCount < MAX_CODING_QUESTIONS) {
                await loadProblem();
            } else {
                finishCodingRound();
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            stopQuestionSpeech();
            const code = document.getElementById('code-editor-textarea').value;
            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your solution code before submitting.');
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> AI Evaluating Code...';

                const res = await window.API.submitCode({
                    interviewId,
                    problem: currentProblem,
                    code,
                    language: currentLanguage,
                    viewed_answer: hasViewedCurrentAnswer
                });

                if (res.success) {
                    displayExecutionConsole(res.execution);
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
}

function displayExecutionConsole(execution) {
    const consoleOutput = document.getElementById('console-output-pane');
    if (!consoleOutput) return;

    let html = `<div style="margin-bottom:0.6rem; color:var(--text-main); font-weight:600; font-size:0.85rem;">
        ${execution.passedCount || 0} / ${execution.totalCount || 0} Test Cases Passed (${execution.executionTimeMs || 0}ms) — Language: ${getLanguageName(currentLanguage)}
    </div>`;

    if (execution.error) {
        html += `<div style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid #ef4444; padding: 0.6rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 0.5rem; white-space: pre-wrap;">${execution.error}</div>`;
    }

    (execution.results || []).forEach(r => {
        const passBadge = r.passed ? '<span class="test-badge-pass">✓ PASSED</span>' : '<span class="test-badge-fail">✕ FAILED</span>';
        html += `
            <div style="background:var(--bg-primary); padding:0.5rem 0.75rem; border-radius:4px; margin-bottom:0.4rem; border:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.15rem; font-size:0.8rem;">
                    <span>Test Case #${r.testCaseNumber} ${r.is_hidden ? '(Hidden)' : ''}</span>
                    ${passBadge}
                </div>
                ${!r.is_hidden ? `
                    <div style="font-size:0.75rem; color:var(--text-dim);">Input: ${r.input}</div>
                    <div style="font-size:0.75rem; color:var(--text-dim);">Expected: ${r.expected}</div>
                    <div style="font-size:0.75rem; color:var(--text-main);">Output: ${r.actual}</div>
                ` : ''}
            </div>
        `;
    });

    consoleOutput.innerHTML = html;
}

function displayAIReviewModal(evaluation) {
    const modal = document.getElementById('ai-review-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    document.getElementById('code-eval-score').textContent = `${evaluation.score || 85}/100`;
    document.getElementById('code-time-comp').textContent = evaluation.time_complexity || 'O(N)';
    document.getElementById('code-space-comp').textContent = evaluation.space_complexity || 'O(1)';
    document.getElementById('code-quality-badge').textContent = evaluation.code_quality || 'Clean Code';
    document.getElementById('code-feedback-text').textContent = evaluation.feedback || 'Good algorithmic logic.';

    const nextBtn = document.getElementById('proceed-to-hr-btn');
    if (nextBtn) {
        nextBtn.textContent = problemCount < MAX_CODING_QUESTIONS ? 'Next Coding Problem →' : 'Proceed to HR Round →';
        nextBtn.onclick = async () => {
            modal.style.display = 'none';
            if (problemCount < MAX_CODING_QUESTIONS) {
                await loadProblem();
            } else {
                finishCodingRound();
            }
        };
    }
}

async function finishCodingRound() {
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
