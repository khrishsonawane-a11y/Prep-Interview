/**
 * Technical Round Controller
 */
let interviewId = null;
let currentRole = 'Software Developer';
let currentDifficulty = 'Intermediate';
let questions = [];
let currentIndex = 0;
let draftAnswers = {}; // { [index]: string }
let evaluations = {}; // { [index]: evalData }
let skippedQuestions = {}; // { [index]: boolean }
let viewedAnswers = {}; // { [index]: boolean }
let visitedQuestions = { 0: true };
const MAX_QUESTIONS = 30;

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

    document.getElementById('display-role')?.replaceChildren(document.createTextNode(currentRole));
    document.getElementById('display-diff')?.replaceChildren(document.createTextNode(currentDifficulty));

    setupSpeechRecognition();
    setupCharCounter();
    setupButtons();
    setupAnswerModal();
    setupSpeechButton();
    await loadQuestions();
});

window.addEventListener('beforeunload', () => {
    stopQuestionSpeech();
    stopRecording();
});

function setupSpeechButton() {
    const speakBtn = document.getElementById('speak-tech-btn');
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

    const textToRead = q.question || '';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        isSpeakingQuestion = true;
        const btn = document.getElementById('speak-tech-btn');
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
    const btn = document.getElementById('speak-tech-btn');
    if (btn) {
        btn.innerHTML = '🔊 Read Question Aloud';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
    }
}

function setupAnswerModal() {
    const viewBtn = document.getElementById('view-tech-answer-btn');
    const modal = document.getElementById('tech-answer-modal');
    const closeBtn = document.getElementById('close-tech-modal-btn');

    if (viewBtn && modal) {
        viewBtn.addEventListener('click', () => {
            const q = questions[currentIndex];
            if (!q) return;

            viewedAnswers[currentIndex] = true;
            renderPalette();

            const expectedText = document.getElementById('tech-expected-answer-text');
            if (expectedText) {
                expectedText.textContent = q.sample_answer || 'Expected architectural explanation covering core mechanisms, trade-offs, and design principles.';
            }

            const conceptsList = document.getElementById('tech-modal-concepts-list');
            if (conceptsList && q.expected_concepts) {
                conceptsList.innerHTML = q.expected_concepts.map(c => `<li>✓ <strong style="color:var(--text-main);">${c}</strong></li>`).join('');
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

async function loadQuestions() {
    const loadingState = document.getElementById('question-loading-state');
    const questionCard = document.getElementById('ai-question-card');
    if (loadingState) loadingState.style.display = 'block';
    if (questionCard) questionCard.style.display = 'none';

    try {
        const res = await window.API.getTechnicalQuestions({
            count: MAX_QUESTIONS,
            role: currentRole,
            difficulty: currentDifficulty
        });

        if (res.success && res.questions && res.questions.length > 0) {
            questions = res.questions;
            renderQuestion(0);
            renderPalette();
        } else {
            window.Toast.error('Could not load technical question pool.');
        }
    } catch (err) {
        console.error('Failed to get technical questions:', err);
        window.Toast.error('Could not load technical questions.');
    }
}

function saveCurrentDraft() {
    const textarea = document.getElementById('tech-answer-input');
    if (textarea) {
        draftAnswers[currentIndex] = textarea.value;
    }
}

function renderQuestion(index) {
    saveCurrentDraft();
    stopQuestionSpeech();
    stopRecording();

    currentIndex = index;
    visitedQuestions[index] = true;
    const q = questions[index];
    if (!q) return;

    const loadingState = document.getElementById('question-loading-state');
    const questionCard = document.getElementById('ai-question-card');
    const evalPanel = document.getElementById('ai-eval-panel');
    const answerInput = document.getElementById('tech-answer-input');
    const charCounter = document.getElementById('char-count-display');

    if (loadingState) loadingState.style.display = 'none';
    if (questionCard) questionCard.style.display = 'flex';

    document.getElementById('tech-q-counter').textContent = `Question ${index + 1} of ${questions.length}`;
    document.getElementById('tech-q-topic').textContent = q.topic || 'Engineering Architecture';
    document.getElementById('tech-question-text').textContent = q.question;

    const conceptsWrap = document.getElementById('expected-concepts-wrap');
    if (conceptsWrap && q.expected_concepts) {
        conceptsWrap.innerHTML = q.expected_concepts.map(c => `
            <span class="badge badge-primary">${c}</span>
        `).join('');
    }

    // Restore draft answer
    const currentText = draftAnswers[index] !== undefined ? draftAnswers[index] : '';
    if (answerInput) {
        answerInput.value = currentText;
        if (charCounter) {
            const chars = currentText.length;
            const words = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
            charCounter.textContent = `${words} words (${chars} chars)`;
        }
    }

    // Restore evaluation if available
    if (evaluations[index]) {
        displayEvaluation(evaluations[index], false);
    } else if (evalPanel) {
        evalPanel.style.display = 'none';
    }

    // Update Navigation buttons
    const prevBtn = document.getElementById('prev-tech-btn');
    const nextBtn = document.getElementById('next-stage-btn');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) {
        if (currentIndex === questions.length - 1) {
            nextBtn.textContent = 'Proceed to Coding Round ⚡';
        } else {
            nextBtn.textContent = 'Next Technical Question →';
        }
    }
}

function renderPalette() {
    const palette = document.getElementById('palette-container');
    if (!palette) return;

    let answeredCount = 0;
    palette.innerHTML = questions.map((q, i) => {
        const isAnswered = evaluations[i] !== undefined;
        if (isAnswered) answeredCount++;
        const isSkipped = skippedQuestions[i] === true;
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

function setupCharCounter() {
    const textarea = document.getElementById('tech-answer-input');
    const counter = document.getElementById('char-count-display');
    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
        draftAnswers[currentIndex] = textarea.value;
        const chars = textarea.value.length;
        const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
        counter.textContent = `${words} words (${chars} chars)`;
    });
}

function setupSpeechRecognition() {
    const voiceBtn = document.getElementById('voice-dictate-btn');
    if (!voiceBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none';
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

        const textarea = document.getElementById('tech-answer-input');
        if (textarea) {
            textarea.value = fullContent;
            draftAnswers[currentIndex] = fullContent;
            textarea.dispatchEvent(new Event('input'));
        }
    };

    speechRecognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        stopRecording();
    };

    speechRecognition.onend = () => {
        recognitionState = 'idle';
        const btn = document.getElementById('voice-dictate-btn');
        if (btn) {
            btn.classList.remove('recording');
            btn.innerHTML = '🎙️ Dictate with Voice';
        }
    };

    voiceBtn.addEventListener('click', () => {
        if (recognitionState === 'listening') {
            stopRecording();
        } else if (recognitionState === 'idle') {
            startRecording();
        }
    });
}

function startRecording() {
    if (!speechRecognition || recognitionState === 'listening') return;

    const textarea = document.getElementById('tech-answer-input');
    baseManualText = textarea ? textarea.value.trim() : '';
    committedVoiceChunks = [];

    try {
        speechRecognition.start();
        recognitionState = 'listening';
        const btn = document.getElementById('voice-dictate-btn');
        if (btn) {
            btn.classList.add('recording');
            btn.innerHTML = '🔴 Listening... (Click to stop)';
        }
        window.Toast.info('Microphone active. Speak your technical answer clearly.');
    } catch (e) {
        console.warn('Speech start error:', e);
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

    const textarea = document.getElementById('tech-answer-input');
    baseManualText = textarea ? textarea.value.trim() : '';
    committedVoiceChunks = [];
}

function setupButtons() {
    const prevBtn = document.getElementById('prev-tech-btn');
    const submitBtn = document.getElementById('submit-answer-btn');
    const skipBtn = document.getElementById('skip-question-btn');
    const nextBtn = document.getElementById('next-stage-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                renderQuestion(currentIndex - 1);
                renderPalette();
            }
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', async () => {
            saveCurrentDraft();
            stopQuestionSpeech();
            stopRecording();

            const q = questions[currentIndex];
            skippedQuestions[currentIndex] = true;
            delete evaluations[currentIndex];
            draftAnswers[currentIndex] = '[SKIPPED]';
            renderPalette();

            try {
                skipBtn.disabled = true;
                await window.API.evaluateTechnicalAnswer({
                    interviewId,
                    questionText: q?.question || 'Technical Question',
                    answerText: '[SKIPPED]',
                    role: currentRole,
                    difficulty: currentDifficulty,
                    topic: q?.topic || 'Architecture',
                    reference_answer: q?.sample_answer || '',
                    is_skipped: true,
                    viewed_answer: !!viewedAnswers[currentIndex]
                });
                window.Toast.info(`Question ${currentIndex + 1} marked as skipped.`);
            } catch (e) {
                console.warn('Skip record warning:', e);
            } finally {
                skipBtn.disabled = false;
            }

            if (currentIndex < questions.length - 1) {
                renderQuestion(currentIndex + 1);
                renderPalette();
            } else {
                finishTechnicalRound();
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            saveCurrentDraft();
            stopQuestionSpeech();
            const answer = (draftAnswers[currentIndex] || '').trim();
            if (answer.length < 15) {
                window.Toast.warning('Please provide a substantive technical answer (at least a couple of sentences).');
                return;
            }

            stopRecording();
            const q = questions[currentIndex];

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> AI Evaluating Response...';

                const res = await window.API.evaluateTechnicalAnswer({
                    interviewId,
                    questionText: q.question,
                    answerText: answer,
                    role: currentRole,
                    difficulty: currentDifficulty,
                    topic: q.topic || 'Engineering Architecture',
                    reference_answer: q.sample_answer || '',
                    expected_concepts: q.expected_concepts || [],
                    viewed_answer: !!viewedAnswers[currentIndex]
                });

                if (res.success && res.evaluation) {
                    evaluations[currentIndex] = res.evaluation;
                    delete skippedQuestions[currentIndex];
                    renderPalette();
                    displayEvaluation(res.evaluation, true);
                    window.Toast.success('Evaluation completed!');
                }
            } catch (err) {
                console.error('Evaluation failed:', err);
                window.Toast.error(err.message || 'Failed to evaluate answer.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Answer & Evaluate 🤖';
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            saveCurrentDraft();
            stopQuestionSpeech();

            if (currentIndex < questions.length - 1) {
                renderQuestion(currentIndex + 1);
                renderPalette();
            } else {
                finishTechnicalRound();
            }
        });
    }
}

function displayEvaluation(evalData, scroll = true) {
    const panel = document.getElementById('ai-eval-panel');
    if (!panel) return;

    panel.style.display = 'block';
    if (scroll) {
        panel.scrollIntoView({ behavior: 'smooth' });
    }

    const q = questions[currentIndex] || {};

    // 1. Scores & Classification
    const scoreOutOf10 = evalData.score_out_of_10 !== undefined 
        ? Number(evalData.score_out_of_10).toFixed(1) 
        : (evalData.score !== undefined ? (evalData.score / 10).toFixed(1) : '7.5');
    const scorePct = evalData.score !== undefined ? Math.round(evalData.score) : Math.round(Number(scoreOutOf10) * 10);
    const classification = evalData.classification || evalData.verdict || (scorePct >= 75 ? 'Mostly Correct' : (scorePct >= 50 ? 'Partially Correct' : 'Incomplete'));

    const scoreEl = document.getElementById('eval-score');
    if (scoreEl) scoreEl.textContent = `${scoreOutOf10} / 10`;

    const scorePctEl = document.getElementById('eval-score-pct');
    if (scorePctEl) scorePctEl.textContent = `${scorePct}% Technical Score`;

    const classBadge = document.getElementById('eval-classification-badge');
    if (classBadge) {
        classBadge.textContent = classification;
        if (classification.includes('Correct') && !classification.includes('Partially')) {
            classBadge.className = 'badge badge-success';
        } else if (classification.includes('Partially') || classification.includes('Incomplete')) {
            classBadge.className = 'badge badge-warning';
        } else if (classification.includes('Incorrect') || classification.includes('Irrelevant')) {
            classBadge.className = 'badge badge-danger';
        } else {
            classBadge.className = 'badge badge-primary';
        }
    }

    // 2. Metrics (Correctness, Error Type, Coverage)
    const correctnessEl = document.getElementById('eval-correctness');
    if (correctnessEl) correctnessEl.textContent = evalData.correctness || (scorePct >= 80 ? 'High' : (scorePct >= 50 ? 'Moderate' : 'Low'));

    const errorTypeEl = document.getElementById('eval-error-type');
    if (errorTypeEl) {
        errorTypeEl.textContent = evalData.error_type || (scorePct >= 80 ? 'None (Correct)' : 'Concept Missing');
    }

    // 3. Concept Coverage Breakdown
    const coverageObj = evalData.concept_coverage || {};
    let conceptsList = coverageObj.concepts || [];
    if (!conceptsList || conceptsList.length === 0) {
        const expected = q.expected_concepts || ['Core Concept', 'Implementation Detail', 'Trade-offs'];
        conceptsList = expected.map(c => ({
            name: c,
            status: scorePct >= 70 ? 'covered' : (scorePct >= 40 ? 'missing' : 'missing')
        }));
    }

    const coveredCount = coverageObj.covered_count !== undefined 
        ? coverageObj.covered_count 
        : conceptsList.filter(c => c.status === 'covered').length;
    const totalCount = coverageObj.total_count !== undefined 
        ? coverageObj.total_count 
        : conceptsList.length;
    const coveragePct = coverageObj.percentage !== undefined 
        ? coverageObj.percentage 
        : (totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0);

    const covValEl = document.getElementById('eval-concept-coverage-val');
    if (covValEl) covValEl.textContent = `${coveredCount} / ${totalCount} (${coveragePct}%)`;

    const covPillEl = document.getElementById('eval-coverage-pill');
    if (covPillEl) covPillEl.textContent = `Coverage: ${coveragePct}%`;

    const conceptsGridEl = document.getElementById('eval-concepts-list');
    if (conceptsGridEl) {
        conceptsGridEl.innerHTML = conceptsList.map(item => {
            const status = (item.status || 'covered').toLowerCase();
            const icon = status === 'covered' ? '✓' : (status === 'incorrect' ? '❌' : '✗');
            const label = status === 'covered' ? 'Covered' : (status === 'incorrect' ? 'Incorrect' : 'Missing');
            return `
                <div class="concept-pill ${status}">
                    <span>${icon}</span>
                    <span><strong>${item.name}</strong> (${label})</span>
                </div>
            `;
        }).join('');
    }

    // 4. What You Got Right (Strengths)
    const strengths = evalData.correct_points || evalData.strengths || [];
    const strengthsBox = document.getElementById('eval-strengths-box');
    const strengthsList = document.getElementById('eval-strengths');
    if (strengthsList) {
        if (strengths.length > 0) {
            strengthsList.innerHTML = strengths.map(s => `<li>✓ ${s}</li>`).join('');
            if (strengthsBox) strengthsBox.style.display = 'block';
        } else {
            strengthsList.innerHTML = `<li>No specific accurate technical statements detected in response.</li>`;
        }
    }

    // 5. What Is Missing
    const missing = evalData.missing_concepts || evalData.missing_points || [];
    const missingBox = document.getElementById('eval-missing-box');
    const missingList = document.getElementById('eval-missing-points');
    if (missingList) {
        if (missing.length > 0) {
            missingList.innerHTML = missing.map(m => `<li>⚠️ ${m}</li>`).join('');
            if (missingBox) missingBox.style.display = 'block';
        } else {
            missingList.innerHTML = `<li>All expected core concepts and architectural criteria were addressed.</li>`;
        }
    }

    // 6. Technical Issues / Mistakes
    const mistakes = evalData.technical_mistakes || evalData.mistakes || [];
    const mistakesBox = document.getElementById('eval-mistakes-box');
    const mistakesList = document.getElementById('eval-mistakes-list');
    if (mistakesBox && mistakesList) {
        if (mistakes && mistakes.length > 0) {
            mistakesList.innerHTML = mistakes.map(m => `<li>❌ ${m}</li>`).join('');
            mistakesBox.style.display = 'block';
        } else {
            mistakesBox.style.display = 'none';
        }
    }

    // 7. How to Improve This Answer
    const improveEl = document.getElementById('eval-improvement-text');
    if (improveEl) {
        improveEl.textContent = evalData.improvement || 'Deepen technical precision with specific runtime mechanisms, complexity constraints, and production trade-offs.';
    }

    // 8. Expected Technical Reference Answer
    const refTextEl = document.getElementById('eval-reference-text');
    if (refTextEl) {
        const refAnswer = evalData.reference_answer || q.sample_answer || 'Expected comprehensive technical explanation covering key principles, runtime architecture, and edge-case management.';
        refTextEl.innerHTML = `
            <p style="margin-bottom: 0.5rem; font-weight: 600; color: var(--text-main);">Reference Architectural Blueprint:</p>
            <p style="color: var(--text-muted); line-height: 1.6;">${refAnswer}</p>
        `;
    }

    const nextBtn = document.getElementById('next-stage-btn');
    if (nextBtn) {
        nextBtn.textContent = currentIndex < questions.length - 1 ? 'Next Technical Question →' : 'Proceed to Coding Round ⚡';
    }
}

async function finishTechnicalRound() {
    saveCurrentDraft();
    stopQuestionSpeech();
    window.Toast.success('Technical Round complete! Advancing to Coding / DSA Round...');

    try {
        const intRes = await window.API.getInterviewById(interviewId);
        let nextRound = 'coding';
        if (intRes.success && intRes.interview) {
            const rounds = intRes.interview.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
            const nextIdx = (intRes.interview.current_round_index || 1) + 1;
            await window.API.updateInterviewProgress(interviewId, { roundIndex: nextIdx });
            nextRound = rounds[nextIdx] || 'coding';
        }

        setTimeout(() => {
            window.location.href = `${nextRound}.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
        }, 1200);
    } catch {
        window.location.href = `coding.html?id=${interviewId}&role=${encodeURIComponent(currentRole)}&difficulty=${currentDifficulty}`;
    }
}
