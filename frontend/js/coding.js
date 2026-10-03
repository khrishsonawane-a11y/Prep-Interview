/**
 * Coding / DSA Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let currentProblem = null;
let currentLanguage = 'javascript';

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
    await loadProblem();
});

function setupLanguageSelector() {
    const selector = document.getElementById('code-language-select');
    if (!selector) return;

    selector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        if (currentProblem && currentProblem.starter_code) {
            const starter = currentProblem.starter_code[currentLanguage] || getDefaultStarter(currentLanguage);
            document.getElementById('code-editor-textarea').value = starter;
        }
    });

    const resetBtn = document.getElementById('reset-code-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (currentProblem && currentProblem.starter_code) {
                document.getElementById('code-editor-textarea').value = currentProblem.starter_code[currentLanguage] || getDefaultStarter(currentLanguage);
                window.Toast.info('Editor reset to clean starter template.');
            }
        });
    }
}

function getDefaultStarter(lang) {
    if (lang === 'python') {
        return 'def solution(input_data):\n    # Write your solution here\n    pass';
    }
    return 'function solution(inputData) {\n    // Write your solution here\n    \n}';
}

function setupSolutionModal() {
    const viewBtn = document.getElementById('view-solution-btn');
    const modal = document.getElementById('solution-modal');
    const closeBtn = document.getElementById('close-solution-btn');
    const copyBtn = document.getElementById('copy-solution-btn');
    const codeView = document.getElementById('solution-code-view');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            const sol = currentProblem?.solution_code?.[currentLanguage] || 
                (currentLanguage === 'python'
                    ? '# Model Solution\ndef two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        if target - num in lookup:\n            return [lookup[target - num], i]\n        lookup[num] = i\n    return []'
                    : '// Model Solution\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}');
            if (codeView) codeView.textContent = sol;
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
            const sol = codeView?.textContent || '';
            document.getElementById('code-editor-textarea').value = sol;
            modal.style.display = 'none';
            window.Toast.success('Solution copied to editor!');
        });
    }
}

async function loadProblem() {
    try {
        const res = await window.API.getCodingQuestion({
            role: currentRole,
            difficulty: currentDifficulty
        });

        if (res.success && res.problem) {
            currentProblem = res.problem;
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
    document.getElementById('problem-desc-content').innerHTML = problem.description.replace(/\n/g, '<br>');

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

    // Starter code (SKELETON ONLY - No pre-filled solutions)
    const textarea = document.getElementById('code-editor-textarea');
    if (textarea && problem.starter_code) {
        textarea.value = problem.starter_code[currentLanguage] || getDefaultStarter(currentLanguage);
    }
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
                runBtn.innerHTML = '<span class="spinner"></span> Testing...';

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

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const code = document.getElementById('code-editor-textarea').value;
            if (!code || code.trim().length < 5) {
                window.Toast.warning('Please write your solution code before submitting.');
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

                const res = await window.API.submitCode({
                    interviewId,
                    problem: currentProblem,
                    code,
                    language: currentLanguage
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
        ${execution.passedCount} / ${execution.totalCount} Test Cases Passed (${execution.executionTimeMs}ms)
    </div>`;

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
        nextBtn.onclick = () => finishCodingRound();
    }
}

async function finishCodingRound() {
    window.Toast.success('Coding Round submitted! Advancing to HR Round...');

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
