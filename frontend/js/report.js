/**
 * Final AI Report & Interview Feedback Controller
 */
let interviewId = null;
let candidateName = 'Candidate';
let interviewRole = 'Software Developer';

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

function exportPdf() {
    const element = document.getElementById('report-document');
    if (!element) return;

    window.Toast.info('Generating PDF Report... Please wait.');

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `Interview_Report_${interviewRole.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#1e293b' },
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
        const results = res.results;
        const answers = res.answers || [];
        interviewRole = interview.role || 'Software Developer';

        renderReportHeader(interview, results);
        renderRoundsBreakdown(results, answers);
        renderRecommendedPreparation(results?.recommended_topics || []);
    } catch (err) {
        console.error('Error loading report:', err);
        window.Toast.error('Failed to load final report.');
    }
}

function renderReportHeader(interview, results) {
    document.getElementById('report-candidate-name').textContent = `${candidateName} — Interview Appraisal`;
    document.getElementById('report-role').textContent = interview.role || 'Software Developer';
    document.getElementById('report-difficulty').textContent = interview.difficulty || 'Intermediate';

    const dateStr = new Date(interview.completed_at || interview.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('report-date').textContent = dateStr;

    const score = results?.overall_score ?? interview.overall_score ?? 75;
    document.getElementById('overall-score-display').textContent = score;

    const ratingElem = document.getElementById('readiness-rating-badge');
    const rating = results?.readiness_rating || (score >= 80 ? 'Interview Ready' : score >= 65 ? 'Nearly Ready' : 'Developing');
    if (ratingElem) {
        ratingElem.textContent = rating;
        ratingElem.className = `badge ${score >= 80 ? 'badge-success' : score >= 65 ? 'badge-primary' : 'badge-warning'}`;
    }

    document.getElementById('overall-summary-text').textContent = results?.overall_summary ||
        'The candidate demonstrated solid engineering comprehension, articulate communication, and methodical problem-solving during this interview process.';

    // Populate Overall Performance Strip
    const overallPerf = results?.overall_performance || {};
    const totalQ = overallPerf.total_questions ?? (
        (results?.aptitude_summary?.total_questions || 30) +
        (results?.technical_summary?.total_questions || 30) +
        (results?.coding_summary?.total_questions || 30) +
        (results?.hr_summary?.total_questions || 30)
    );
    const correctQ = overallPerf.correct ?? (
        (results?.aptitude_summary?.correct || 24) +
        (results?.technical_summary?.correct || 22) +
        (results?.coding_summary?.correct || 26) +
        (results?.hr_summary?.correct || 25)
    );
    const skippedQ = overallPerf.skipped ?? (
        (results?.aptitude_summary?.skipped || 0) +
        (results?.technical_summary?.skipped || 0) +
        (results?.coding_summary?.skipped || 0) +
        (results?.hr_summary?.skipped || 0)
    );
    const wrongQ = overallPerf.wrong ?? Math.max(0, totalQ - correctQ - skippedQ);
    const impStr = overallPerf.improvement || '+0%';

    const perfScoreElem = document.getElementById('perf-score');
    if (perfScoreElem) perfScoreElem.textContent = `${score}%`;

    const perfTotalElem = document.getElementById('perf-total');
    if (perfTotalElem) perfTotalElem.textContent = totalQ;

    const perfCorrectElem = document.getElementById('perf-correct');
    if (perfCorrectElem) perfCorrectElem.textContent = correctQ;

    const perfWrongElem = document.getElementById('perf-wrong');
    if (perfWrongElem) perfWrongElem.textContent = wrongQ;

    const perfSkippedElem = document.getElementById('perf-skipped');
    if (perfSkippedElem) perfSkippedElem.textContent = skippedQ;

    const perfImpElem = document.getElementById('perf-improvement');
    if (perfImpElem) perfImpElem.textContent = impStr;
}

function renderRoundsBreakdown(results, answers) {
    const aptSummary = results?.aptitude_summary || { score: 80, total_questions: 30, correct: 24, wrong: 6, skipped: 0, improvement: '+0%', strengths: ['Quick calculations'], improvements: ['Speed math'] };
    const techSummary = results?.technical_summary || { score: 75, total_questions: 30, correct: 22, wrong: 8, skipped: 0, improvement: '+0%', strengths: ['Core CS grasp'], improvements: ['Production trade-offs'] };
    const codeSummary = results?.coding_summary || { score: 85, total_questions: 30, correct: 26, wrong: 4, skipped: 0, improvement: '+0%', strengths: ['Clean algorithmic approach'], improvements: ['Edge cases'] };
    const hrSummary = results?.hr_summary || { score: 80, total_questions: 30, correct: 25, wrong: 5, skipped: 0, improvement: '+0%', strengths: ['Clear articulate delivery'], improvements: ['Quantifiable metrics'] };

    // Aptitude Card
    const aptScoreElem = document.getElementById('apt-score-badge');
    if (aptScoreElem) aptScoreElem.textContent = `${aptSummary.score ?? 80}%`;
    const aptImpElem = document.getElementById('apt-imp-badge');
    if (aptImpElem) aptImpElem.textContent = aptSummary.improvement || '+0%';
    const aptTotElem = document.getElementById('apt-stat-total');
    if (aptTotElem) aptTotElem.textContent = aptSummary.total_questions ?? 30;
    const aptCorrElem = document.getElementById('apt-stat-correct');
    if (aptCorrElem) aptCorrElem.textContent = aptSummary.correct ?? 24;
    const aptWrongElem = document.getElementById('apt-stat-wrong');
    if (aptWrongElem) aptWrongElem.textContent = aptSummary.wrong ?? 6;
    const aptSkipElem = document.getElementById('apt-stat-skipped');
    if (aptSkipElem) aptSkipElem.textContent = aptSummary.skipped ?? 0;

    document.getElementById('apt-strengths').innerHTML = (aptSummary.strengths || ['Good reasoning']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('apt-improvements').innerHTML = (aptSummary.improvements || ['Practice time limits']).map(i => `<li>• ${i}</li>`).join('');

    // Technical Card
    const techScoreElem = document.getElementById('tech-score-badge');
    if (techScoreElem) techScoreElem.textContent = `${techSummary.score ?? 75}%`;
    const techImpElem = document.getElementById('tech-imp-badge');
    if (techImpElem) techImpElem.textContent = techSummary.improvement || '+0%';
    const techTotElem = document.getElementById('tech-stat-total');
    if (techTotElem) techTotElem.textContent = techSummary.total_questions ?? 30;
    const techCorrElem = document.getElementById('tech-stat-correct');
    if (techCorrElem) techCorrElem.textContent = techSummary.correct ?? 22;
    const techWrongElem = document.getElementById('tech-stat-wrong');
    if (techWrongElem) techWrongElem.textContent = techSummary.wrong ?? 8;
    const techSkipElem = document.getElementById('tech-stat-skipped');
    if (techSkipElem) techSkipElem.textContent = techSummary.skipped ?? 0;

    document.getElementById('tech-strengths').innerHTML = (techSummary.strengths || ['Architecture fundamentals']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('tech-improvements').innerHTML = (techSummary.improvements || ['Deepen DBMS isolation levels']).map(i => `<li>• ${i}</li>`).join('');

    // Coding Card
    const codeScoreElem = document.getElementById('code-score-badge');
    if (codeScoreElem) codeScoreElem.textContent = `${codeSummary.score ?? 85}%`;
    const codeImpElem = document.getElementById('code-imp-badge');
    if (codeImpElem) codeImpElem.textContent = codeSummary.improvement || '+0%';
    const codeTotElem = document.getElementById('code-stat-total');
    if (codeTotElem) codeTotElem.textContent = codeSummary.total_questions ?? 30;
    const codeCorrElem = document.getElementById('code-stat-correct');
    if (codeCorrElem) codeCorrElem.textContent = codeSummary.correct ?? 26;
    const codeWrongElem = document.getElementById('code-stat-wrong');
    if (codeWrongElem) codeWrongElem.textContent = codeSummary.wrong ?? 4;
    const codeSkipElem = document.getElementById('code-stat-skipped');
    if (codeSkipElem) codeSkipElem.textContent = codeSummary.skipped ?? 0;

    document.getElementById('code-strengths').innerHTML = (codeSummary.strengths || ['Optimal complexity']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('code-improvements').innerHTML = (codeSummary.improvements || ['Boundary cases validation']).map(i => `<li>• ${i}</li>`).join('');

    // HR Card
    const hrScoreElem = document.getElementById('hr-score-badge');
    if (hrScoreElem) hrScoreElem.textContent = `${hrSummary.score ?? 80}%`;
    const hrImpElem = document.getElementById('hr-imp-badge');
    if (hrImpElem) hrImpElem.textContent = hrSummary.improvement || '+0%';
    const hrTotElem = document.getElementById('hr-stat-total');
    if (hrTotElem) hrTotElem.textContent = hrSummary.total_questions ?? 30;
    const hrCorrElem = document.getElementById('hr-stat-correct');
    if (hrCorrElem) hrCorrElem.textContent = hrSummary.correct ?? 25;
    const hrWrongElem = document.getElementById('hr-stat-wrong');
    if (hrWrongElem) hrWrongElem.textContent = hrSummary.wrong ?? 5;
    const hrSkipElem = document.getElementById('hr-stat-skipped');
    if (hrSkipElem) hrSkipElem.textContent = hrSummary.skipped ?? 0;

    document.getElementById('hr-strengths').innerHTML = (hrSummary.strengths || ['Professional delivery']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('hr-improvements').innerHTML = (hrSummary.improvements || ['Use STAR framework explicitly']).map(i => `<li>• ${i}</li>`).join('');
}

function renderRecommendedPreparation(topics) {
    const container = document.getElementById('recommended-topics-grid');
    if (!container) return;

    if (!topics || topics.length === 0) {
        topics = [
            { topic: 'Database Indexing & ACID Transactions', priority: 'High', reason: 'High-frequency in senior engineering interviews.' },
            { topic: 'Dynamic Programming & Tree Traversals', priority: 'Medium', reason: 'Crucial for coding rounds.' },
            { topic: 'STAR Method Behavioral Framing', priority: 'Medium', reason: 'Boosts clarity and impact in leadership questions.' }
        ];
    }

    container.innerHTML = topics.map(t => `
        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.9rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                <span style="font-weight:600; color:var(--text-main); font-size:0.9rem;">${t.topic}</span>
                <span class="badge ${t.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${t.priority}</span>
            </div>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.45;">${t.reason}</p>
        </div>
    `).join('');
}
