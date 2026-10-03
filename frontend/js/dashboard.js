/**
 * Dashboard Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    const user = window.authManager.getUser();
    const welcomeNameElem = document.getElementById('user-welcome-name');
    if (welcomeNameElem && user?.full_name) {
        welcomeNameElem.textContent = user.full_name;
    }

    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // 1. Fetch Profile & Aggregated Stats
        const profileRes = await window.API.getProfile();
        if (profileRes.success) {
            updateStatCards(profileRes.stats);
        }

        // 2. Fetch Recent Interviews
        const intRes = await window.API.getInterviews({ limit: 5 });
        if (intRes.success) {
            renderRecentInterviews(intRes.interviews || []);
        }
    } catch (err) {
        console.error('Error loading dashboard data:', err);
        window.Toast.error('Could not load dashboard statistics.');
    }
}

function updateStatCards(stats = {}) {
    const completedElem = document.getElementById('stat-completed');
    const attemptedElem = document.getElementById('stat-attempted');
    const avgScoreElem = document.getElementById('stat-avg-score');
    const lastInterviewElem = document.getElementById('stat-last-interview');

    if (completedElem) completedElem.textContent = stats.interviewsCompleted ?? 0;
    if (attemptedElem) attemptedElem.textContent = stats.interviewsAttempted ?? 0;
    if (avgScoreElem) avgScoreElem.textContent = `${stats.averageScore ?? 0}%`;
    if (lastInterviewElem) {
        lastInterviewElem.textContent = stats.lastInterviewRole
            ? `${stats.lastInterviewRole}`
            : 'No interviews yet';
    }
}

function renderRecentInterviews(interviews) {
    const tableBody = document.getElementById('recent-interviews-tbody');
    const emptyState = document.getElementById('empty-interviews-state');
    if (!tableBody) return;

    if (interviews.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = interviews.map(item => {
        const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const statusBadge = item.status === 'completed'
            ? `<span class="badge badge-success">Completed (${item.overall_score || 0}%)</span>`
            : `<span class="badge badge-warning">In Progress</span>`;

        const rounds = item.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
        const roundsDisplay = rounds.map(r => {
            return `<span class="badge badge-purple" style="font-size:0.7rem;">${r}</span>`;
        }).join(' ');

        return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-main);">${item.role}</div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">${item.difficulty || 'Intermediate'}</div>
          </td>
          <td>${dateStr}</td>
          <td>${roundsDisplay}</td>
          <td>${statusBadge}</td>
          <td>
            ${item.status === 'completed' 
              ? `<a href="report.html?id=${item.id}" class="btn btn-secondary btn-sm">View Report ↗</a>`
              : `<a href="interview.html?resume=${item.id}" class="btn btn-primary btn-sm">Resume →</a>`}
          </td>
        </tr>
      `;
    }).join('');
}
