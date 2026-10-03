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
}

function renderRoundsBreakdown(results, answers) {
    const aptSummary = results?.aptitude_summary || { score: 80, strengths: ['Quick calculations'], improvements: ['Speed math'] };
    const techSummary = results?.technical_summary || { score: 75, strengths: ['Core CS grasp'], improvements: ['Production trade-offs'] };
    const codeSummary = results?.coding_summary || { score: 85, strengths: ['Clean algorithmic approach'], improvements: ['Edge cases'] };
    const hrSummary = results?.hr_summary || { score: 80, strengths: ['Clear articulate delivery'], improvements: ['Quantifiable metrics'] };

    // Aptitude Card
    document.getElementById('apt-score-badge').textContent = `${aptSummary.score || 0}%`;
    document.getElementById('apt-strengths').innerHTML = (aptSummary.strengths || ['Good reasoning']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('apt-improvements').innerHTML = (aptSummary.improvements || ['Practice time limits']).map(i => `<li>• ${i}</li>`).join('');

    // Technical Card
    document.getElementById('tech-score-badge').textContent = `${techSummary.score || 0}%`;
    document.getElementById('tech-strengths').innerHTML = (techSummary.strengths || ['Architecture fundamentals']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('tech-improvements').innerHTML = (techSummary.improvements || ['Deepen DBMS isolation levels']).map(i => `<li>• ${i}</li>`).join('');

    // Coding Card
    document.getElementById('code-score-badge').textContent = `${codeSummary.score || 0}%`;
    document.getElementById('code-strengths').innerHTML = (codeSummary.strengths || ['Optimal complexity']).map(s => `<li>✓ ${s}</li>`).join('');
    document.getElementById('code-improvements').innerHTML = (codeSummary.improvements || ['Boundary cases validation']).map(i => `<li>• ${i}</li>`).join('');

    // HR Card
    document.getElementById('hr-score-badge').textContent = `${hrSummary.score || 0}%`;
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
