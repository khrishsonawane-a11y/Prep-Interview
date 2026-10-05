/**
 * Final AI Report & Interview Feedback Controller
 */
let interviewId = null;
let candidateName = 'Candidate';
let interviewRole = 'Software Developer';
let allQuestionReviews = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    const user = window.authManager.getUser();
    candidateName = user?.full_name || user?.email?.split('@')[0] || 'Candidate';

    const params = new URLSearchParams(window.location.search);
    interviewId = params.get('id');

    if (!interviewId) {
        window.Toast.error('Interview ID missing.');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }

    setupPdfExportButtons();
    setupFilterButtons();
    await loadReport();
});

function setupPdfExportButtons() {
    const topBtn = document.getElementById('download-pdf-btn');
    const bottomBtn = document.getElementById('download-pdf-btn-bottom');

    const handleDownload = () => {
        exportPdf();
    };

    if (topBtn) topBtn.addEventListener('click', handleDownload);
    if (bottomBtn) bottomBtn.addEventListener('click', handleDownload);
}

function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.review-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderFilteredQuestions();
        });
    });
}

function exportPdf() {
    const element = document.getElementById('report-document');
    if (!element) return;

    window.Toast.info('Generating PDF Report... Please wait.');

    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#0f172a' : '#ffffff';

    const opt = {
        margin: [8, 8, 8, 8],
        filename: `Interview_Report_${interviewRole.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: bgColor },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save().then(() => {
            window.Toast.success('PDF Report downloaded successfully!');
        }).catch(err => {
            console.error('PDF generation error:', err);
            window.print();
        });
    } else {
        window.print();
    }
}

async function loadReport() {
    try {
        const res = await window.API.getInterviewById(interviewId);
        if (!res.success || !res.interview) {
            window.Toast.error('Interview data could not be retrieved.');
            return;
        }

        const interview = res.interview;
        const results = res.results || {};
        const answers = res.answers || [];
        interviewRole = interview.role || 'Software Developer';

        renderReportHeader(interview, results);
        renderHistoryComparison(results.previous_attempt_comparison);
        renderRoundsBreakdown(results, interview);
        prepareQuestionReviews(results, answers);
        renderAnalyticalInsights(results);
        renderRecommendedPreparation(results?.recommended_topics || []);
    } catch (err) {
        console.error('Error loading report:', err);
        window.Toast.error('Failed to load final report.');
    }
}

function renderReportHeader(interview, results) {
    const nameElem = document.getElementById('report-candidate-name');
    if (nameElem) nameElem.textContent = `${candidateName} — Interview Appraisal`;

    const roleElem = document.getElementById('report-role');
    if (roleElem) roleElem.textContent = interview.role || 'Software Developer';

    const diffElem = document.getElementById('report-difficulty');
    if (diffElem) diffElem.textContent = interview.difficulty || 'Intermediate';

    const idElem = document.getElementById('report-interview-id');
    if (idElem) idElem.textContent = interview.id || interviewId;

    const dateStr = new Date(interview.completed_at || interview.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const dateElem = document.getElementById('report-date');
    if (dateElem) dateElem.textContent = dateStr;

    // Overall Score & Badges
    const overallScore = results?.overall_score ?? interview.overall_score ?? 75;
    const scoreDisplay = document.getElementById('overall-score-display');
    if (scoreDisplay) scoreDisplay.textContent = Math.round(overallScore);

    const ratingElem = document.getElementById('readiness-rating-badge');
    const rating = results?.readiness_rating || (overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Nearly Ready' : 'Developing');
    if (ratingElem) {
        ratingElem.textContent = rating;
        ratingElem.className = `badge ${overallScore >= 80 ? 'badge-success' : overallScore >= 65 ? 'badge-primary' : 'badge-warning'}`;
    }

    const perfLevelElem = document.getElementById('performance-level-badge');
    const perfLevel = results?.performance_level || (overallScore >= 85 ? 'Strong Candidate' : overallScore >= 70 ? 'Competent' : overallScore >= 50 ? 'Developing' : 'Needs Preparation');
    if (perfLevelElem) {
        perfLevelElem.textContent = perfLevel;
        perfLevelElem.className = `badge ${overallScore >= 80 ? 'badge-success' : overallScore >= 65 ? 'badge-primary' : 'badge-warning'}`;
    }

    // Summary Text
    const summaryElem = document.getElementById('overall-summary-text');
    if (summaryElem) {
        summaryElem.textContent = results?.overall_summary ||
            'The candidate completed the multi-round interview assessment. Evaluation reflects quantitative accuracy, technical domain depth, algorithmic efficiency in Java/C/C++, and behavioral structured communication.';
    }

    // Populate 10 Overall Metrics Grid
    const overallPerf = results?.overall_performance || {};
    const totalQ = results?.total_questions ?? overallPerf.total_questions ?? 0;
    const attemptedQ = results?.attempted ?? overallPerf.attempted ?? 0;
    const correctQ = results?.correct ?? overallPerf.correct ?? 0;
    const wrongQ = results?.wrong ?? overallPerf.wrong ?? 0;
    const skippedQ = results?.skipped ?? overallPerf.skipped ?? 0;
    const accuracy = results?.accuracy ?? (attemptedQ > 0 ? Math.round((correctQ / attemptedQ) * 100) : 0);
    const completion = results?.completion_percentage ?? 100;
    const improvement = results?.improvement_from_last ?? overallPerf.improvement ?? '+0%';

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setVal('perf-score', `${Math.round(overallScore)}%`);
    setVal('perf-accuracy', `${accuracy}%`);
    setVal('perf-total', totalQ);
    setVal('perf-attempted', attemptedQ);
    setVal('perf-correct', correctQ);
    setVal('perf-wrong', wrongQ);
    setVal('perf-skipped', skippedQ);
    setVal('perf-completion', `${completion}%`);
    setVal('perf-improvement', improvement);
}

function renderHistoryComparison(comparison) {
    const card = document.getElementById('history-comparison-card');
    if (!card) return;

    if (!comparison || !comparison.has_previous) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'block';
    const summaryElem = document.getElementById('history-comparison-summary');
    if (summaryElem) {
        const delta = comparison.score_delta || 0;
        if (delta > 0) {
            summaryElem.textContent = `Excellent progress! Overall score improved by ${delta}% compared with your prior attempt.`;
        } else if (delta < 0) {
            summaryElem.textContent = `Overall score declined by ${Math.abs(delta)}% compared with your prior attempt. Review identified gap areas below.`;
        } else {
            summaryElem.textContent = `Consistent performance matching your previous attempt. Focus on weak topics below to break through.`;
        }
    }

    const scoreDeltaElem = document.getElementById('history-score-delta');
    if (scoreDeltaElem) {
        const delta = comparison.score_delta || 0;
        scoreDeltaElem.textContent = `${delta >= 0 ? '+' : ''}${delta}%`;
        scoreDeltaElem.style.color = delta >= 0 ? '#34d399' : '#f87171';
    }

    const accDeltaElem = document.getElementById('history-accuracy-delta');
    if (accDeltaElem) {
        const delta = comparison.accuracy_delta || 0;
        accDeltaElem.textContent = `${delta >= 0 ? '+' : ''}${delta}%`;
        accDeltaElem.style.color = delta >= 0 ? '#38bdf8' : '#f87171';
    }
}

function renderRoundsBreakdown(results, interview) {
    const container = document.getElementById('rounds-breakdown-container');
    if (!container) return;

    const roundDataConfigs = [
        { key: 'aptitude', name: 'Aptitude Round', icon: '🧮', summary: results?.aptitude_summary },
        { key: 'technical', name: 'Technical Round', icon: '💻', summary: results?.technical_summary },
        { key: 'coding', name: 'Coding & DSA Round', icon: '⚡', summary: results?.coding_summary },
        { key: 'hr', name: 'HR & Behavioral Round', icon: '🤝', summary: results?.hr_summary }
    ];

    const selectedRounds = Array.isArray(interview?.rounds) ? interview.rounds.map(r => r.toLowerCase()) : ['aptitude', 'technical', 'coding', 'hr'];

    let html = '';
    for (const r of roundDataConfigs) {
        // Only show if the round was selected or has data
        if (!selectedRounds.includes(r.key) && !r.summary) continue;

        const summary = r.summary || {
            score: 0,
            accuracy: 0,
            total_questions: 0,
            correct: 0,
            wrong: 0,
            skipped: 0,
            improvement: '+0%',
            strengths: ['Standard performance'],
            improvements: ['Continue regular practice']
        };

        const score = Math.round(summary.score || 0);
        const accuracy = summary.accuracy ?? (summary.total_questions > 0 ? Math.round((summary.correct / (summary.correct + summary.wrong || 1)) * 100) : 0);

        html += `
            <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <div style="font-weight: 700; color: var(--text-main); font-size: 1rem;">
                        ${r.icon} ${r.name}
                    </div>
                    <span class="badge ${score >= 75 ? 'badge-success' : score >= 50 ? 'badge-primary' : 'badge-warning'}">
                        ${score}% Score
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; text-align: center; margin-bottom: 0.85rem; background: var(--bg-card); padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                    <div>
                        <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Total</div>
                        <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${summary.total_questions || 0}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.7rem; color: #34d399; text-transform: uppercase;">Correct</div>
                        <div style="font-weight: 700; color: #34d399; font-size: 0.95rem;">${summary.correct || 0}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.7rem; color: #f87171; text-transform: uppercase;">Wrong</div>
                        <div style="font-weight: 700; color: #f87171; font-size: 0.95rem;">${summary.wrong || 0}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Skipped</div>
                        <div style="font-weight: 700; color: var(--text-dim); font-size: 0.95rem;">${summary.skipped || 0}</div>
                    </div>
                </div>

                <div style="font-size: 0.82rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Accuracy: <strong style="color: var(--text-main);">${accuracy}%</strong></span>
                    <span style="color: var(--text-muted);">Trend: <strong style="color: #38bdf8;">${summary.improvement || '+0%'}</strong></span>
                </div>

                <div style="font-size: 0.8rem; border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; margin-top: 0.6rem;">
                    <div style="color: #34d399; font-weight: 600; margin-bottom: 0.25rem;">Key Strengths:</div>
                    <ul style="list-style: none; padding-left: 0; margin-bottom: 0.5rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.2rem;">
                        ${(summary.strengths || ['Good foundational knowledge']).map(s => `<li>✓ ${escapeHtml(s)}</li>`).join('')}
                    </ul>
                    <div style="color: #f87171; font-weight: 600; margin-bottom: 0.25rem;">Areas for Growth:</div>
                    <ul style="list-style: none; padding-left: 0; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.2rem;">
                        ${(summary.improvements || ['Review edge cases']).map(i => `<li>• ${escapeHtml(i)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function prepareQuestionReviews(results, rawAnswers) {
    allQuestionReviews = [];

    // Prioritize structured question_reviews from results if generated by aiService
    if (Array.isArray(results?.question_reviews) && results.question_reviews.length > 0) {
        allQuestionReviews = results.question_reviews;
    } else if (Array.isArray(rawAnswers) && rawAnswers.length > 0) {
        // Fallback: construct review objects from raw answer records
        allQuestionReviews = rawAnswers.map((ans, idx) => {
            const isSkipped = ans.is_skipped || ans.evaluation?.is_skipped || !ans.user_answer;
            const isCorrect = !isSkipped && (ans.evaluation?.is_correct === true || (ans.score || ans.evaluation?.score || 0) >= 70);
            const score = isSkipped ? 0 : (ans.score || ans.evaluation?.score || (isCorrect ? 100 : 0));

            return {
                round: ans.round_type || 'Interview',
                question_index: idx + 1,
                question_text: ans.question_text || `Question #${idx + 1}`,
                topic: ans.topic || ans.evaluation?.topic || 'Core Concept',
                user_answer: ans.user_answer || '(Skipped)',
                reference_answer: ans.reference_answer || ans.evaluation?.reference_answer || 'Expected comprehensive response covering key architectural/algorithmic criteria.',
                is_correct: isCorrect,
                is_skipped: isSkipped,
                score: score,
                error_type: isSkipped ? 'Did Not Answer' : (isCorrect ? 'None (Correct)' : (ans.evaluation?.error_type || 'Concept Missing')),
                missing_concepts: ans.evaluation?.missing_concepts || [],
                explanation: ans.evaluation?.explanation || ans.evaluation?.feedback || (isCorrect ? 'Accurate response.' : 'Response requires deeper coverage.'),
                suggested_improvement: ans.evaluation?.suggested_improvement || 'Practice foundational principles.',
                viewed_answer: ans.viewed_answer || false
            };
        });
    }

    // Update filter count badges
    const total = allQuestionReviews.length;
    const correct = allQuestionReviews.filter(q => q.is_correct && !q.is_skipped).length;
    const skipped = allQuestionReviews.filter(q => q.is_skipped).length;
    const incorrect = allQuestionReviews.filter(q => !q.is_correct && !q.is_skipped).length;

    const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
    };
    setTxt('count-all', total);
    setTxt('count-correct', correct);
    setTxt('count-incorrect', incorrect);
    setTxt('count-skipped', skipped);

    renderFilteredQuestions();
}

function renderFilteredQuestions() {
    const container = document.getElementById('question-reviews-list');
    if (!container) return;

    let list = allQuestionReviews;
    if (currentFilter === 'correct') {
        list = allQuestionReviews.filter(q => q.is_correct && !q.is_skipped);
    } else if (currentFilter === 'incorrect') {
        list = allQuestionReviews.filter(q => !q.is_correct && !q.is_skipped);
    } else if (currentFilter === 'skipped') {
        list = allQuestionReviews.filter(q => q.is_skipped);
    }

    if (list.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-dim); background: var(--bg-primary); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
                No questions found under the "<strong>${escapeHtml(currentFilter)}</strong>" filter.
            </div>
        `;
        return;
    }

    container.innerHTML = list.map((q, idx) => {
        const statusLabel = q.is_skipped ? 'Skipped' : (q.is_correct ? 'Correct' : 'Incorrect');
        const statusBadgeClass = q.is_skipped ? 'badge-secondary' : (q.is_correct ? 'badge-success' : 'badge-danger');
        const statusIcon = q.is_skipped ? '↷' : (q.is_correct ? '✓' : '✕');
        const errorType = q.error_type || (q.is_skipped ? 'Did Not Answer' : (q.is_correct ? 'None (Correct)' : 'Concept Missing'));

        const missingHtml = Array.isArray(q.missing_concepts) && q.missing_concepts.length > 0
            ? `<div style="margin-top: 0.4rem; font-size: 0.8rem; color: #f87171;">
                <strong>Missing Concepts:</strong> ${q.missing_concepts.map(c => `<span class="badge badge-danger" style="margin-left: 0.25rem; font-size: 0.72rem;">${escapeHtml(c)}</span>`).join('')}
               </div>`
            : '';

        return `
            <div class="question-review-card" data-status="${statusLabel.toLowerCase()}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.4rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span class="badge badge-primary" style="text-transform: capitalize;">${escapeHtml(q.round || 'Round')}</span>
                        <span style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">Q${q.question_index || (idx + 1)}. ${escapeHtml(q.topic || 'General')}</span>
                        ${q.viewed_answer ? '<span class="badge badge-warning" style="font-size: 0.7rem;">💡 Viewed Answer</span>' : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <span class="badge ${statusBadgeClass}">${statusIcon} ${statusLabel}</span>
                        ${errorType !== 'None (Correct)' ? `<span class="badge badge-danger" style="font-size: 0.75rem;">${escapeHtml(errorType)}</span>` : ''}
                        <span class="badge ${q.score >= 70 ? 'badge-success' : 'badge-secondary'}" style="font-size: 0.75rem;">${Math.round(q.score || 0)} pts</span>
                    </div>
                </div>

                <div style="font-weight: 600; color: var(--text-main); font-size: 0.92rem; margin-bottom: 0.75rem; line-height: 1.5;">
                    ${escapeHtml(q.question_text || '')}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem;">
                    <div style="background: var(--bg-card); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.3rem; font-weight: 600;">Your Response</div>
                        <div style="font-size: 0.85rem; color: var(--text-main); white-space: pre-wrap; font-family: ${q.round === 'coding' ? 'var(--font-mono)' : 'inherit'}; max-height: 200px; overflow-y: auto;">
                            ${escapeHtml(q.user_answer || '(No answer provided)')}
                        </div>
                    </div>
                    <div style="background: var(--bg-card); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: #38bdf8; margin-bottom: 0.3rem; font-weight: 600;">Reference / Optimal Answer</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); white-space: pre-wrap; font-family: ${q.round === 'coding' ? 'var(--font-mono)' : 'inherit'}; max-height: 200px; overflow-y: auto;">
                            ${escapeHtml(q.reference_answer || 'Expected optimal solution.')}
                        </div>
                    </div>
                </div>

                <div style="background: rgba(56, 189, 248, 0.04); border-left: 3px solid #38bdf8; padding: 0.6rem 0.75rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.83rem;">
                    <div style="color: var(--text-main); margin-bottom: 0.2rem;">
                        <strong>Feedback:</strong> ${escapeHtml(q.explanation || 'Evaluated against core evaluation criteria.')}
                    </div>
                    ${missingHtml}
                    ${q.suggested_improvement ? `
                        <div style="color: var(--text-muted); margin-top: 0.3rem;">
                            <strong>Suggested Improvement:</strong> ${escapeHtml(q.suggested_improvement)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderAnalyticalInsights(results) {
    // 1. Weak Topics Ranked
    const weakList = document.getElementById('weak-topics-list');
    if (weakList) {
        const weakTopics = results?.weak_topics_ranked || results?.weak_areas || [];
        if (weakTopics.length > 0) {
            weakList.innerHTML = weakTopics.map((item, idx) => {
                const topicName = typeof item === 'string' ? item : (item.topic || 'Concept');
                const avgScore = item.avg_score != null ? `(${item.avg_score}%)` : '';
                const err = item.error_type ? `— <em>${escapeHtml(item.error_type)}</em>` : '';
                return `<li><span style="color:#f87171; font-weight:600;">#${idx + 1}</span> ${escapeHtml(topicName)} ${avgScore} ${err}</li>`;
            }).join('');
        } else {
            weakList.innerHTML = `<li style="color: #34d399;">✓ No severe weaknesses detected. Great job across all rounds!</li>`;
        }
    }

    // 2. Strong Competencies
    const strongList = document.getElementById('strong-topics-list');
    if (strongList) {
        const strongTopics = results?.strong_competencies || results?.strong_areas || [];
        if (strongTopics.length > 0) {
            strongList.innerHTML = strongTopics.map(item => {
                const topicName = typeof item === 'string' ? item : (item.topic || 'Concept');
                const score = item.score != null ? `(${item.score}%)` : '';
                return `<li>✓ <strong>${escapeHtml(topicName)}</strong> ${score}</li>`;
            }).join('');
        } else {
            strongList.innerHTML = `<li>Foundational competencies demonstrated. Continue deep practice.</li>`;
        }
    }

    // 3. Top 3 Priorities
    const prioritiesList = document.getElementById('top-priorities-list');
    if (prioritiesList) {
        const priorities = results?.top_3_priorities || [
            'System Architecture & Low-Level Design trade-offs',
            'Algorithmic edge case handling and time complexity reduction in Java/C/C++',
            'Structured behavioral STAR communication with quantifiable impact metrics'
        ];
        prioritiesList.innerHTML = priorities.map(p => `<li>${escapeHtml(p)}</li>`).join('');
    }
}

function renderRecommendedPreparation(topics) {
    const container = document.getElementById('recommended-topics-grid');
    if (!container) return;

    if (!topics || topics.length === 0) {
        topics = [
            { topic: 'Database Indexing & ACID Transactions', priority: 'High', reason: 'High-frequency in senior engineering interviews.' },
            { topic: 'Dynamic Programming & Tree Traversals', priority: 'High', reason: 'Crucial for coding and DSA rounds.' },
            { topic: 'STAR Method Behavioral Framing', priority: 'Medium', reason: 'Boosts clarity and impact in leadership questions.' }
        ];
    }

    container.innerHTML = topics.map(t => `
        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.9rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-weight: 600; color: var(--text-main); font-size: 0.9rem;">${escapeHtml(t.topic)}</span>
                <span class="badge ${t.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${escapeHtml(t.priority)}</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">${escapeHtml(t.reason)}</p>
        </div>
    `).join('');
}

function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
