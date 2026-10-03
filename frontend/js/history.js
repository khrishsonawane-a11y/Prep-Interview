/**
 * Interview History Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    setupFilters();
    await loadInterviewHistory();
});

function setupFilters() {
    const searchInput = document.getElementById('history-search-input');
    const roleSelect = document.getElementById('history-role-filter');
    const statusSelect = document.getElementById('history-status-filter');

    const debouncedFetch = debounce(() => {
        loadInterviewHistory({
            search: searchInput?.value.trim(),
            role: roleSelect?.value,
            status: statusSelect?.value
        });
    }, 300);

    if (searchInput) searchInput.addEventListener('input', debouncedFetch);
    if (roleSelect) roleSelect.addEventListener('change', debouncedFetch);
    if (statusSelect) statusSelect.addEventListener('change', debouncedFetch);
}

function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

async function loadInterviewHistory(filters = {}) {
    const tbody = document.getElementById('history-table-tbody');
    const emptyState = document.getElementById('history-empty-state');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;"><span class="spinner"></span> Loading history...</td></tr>';

    try {
        const res = await window.API.getInterviews(filters);
        if (res.success) {
            const list = res.interviews || [];

            if (list.length === 0) {
                tbody.innerHTML = '';
                if (emptyState) emptyState.style.display = 'block';
                return;
            }

            if (emptyState) emptyState.style.display = 'none';

            tbody.innerHTML = list.map(item => {
                const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                const isCompleted = item.status === 'completed';
                const statusBadge = isCompleted
                    ? `<span class="badge badge-success">Completed (${item.overall_score || 0}%)</span>`
                    : `<span class="badge badge-warning">In Progress</span>`;

                const rounds = item.rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
                const roundsBadges = rounds.map(r => {
                    const isDone = isCompleted || (item.current_round_index || 0) > rounds.indexOf(r);
                    return `<span class="round-pill ${isDone ? 'done' : ''}">${isDone ? '✓ ' : ''}${r}</span>`;
                }).join(' ');

                return `
                <tr>
                    <td>
                        <div style="font-weight:700; color:var(--text-main); font-size:1rem;">${item.role}</div>
                        <div style="font-size:0.8rem; color:var(--text-dim);">${item.difficulty || 'Intermediate'}</div>
                    </td>
                    <td>${dateStr}</td>
                    <td>
                        <div class="rounds-pills-wrap">${roundsBadges}</div>
                    </td>
                    <td>${statusBadge}</td>
                    <td>
                        ${isCompleted
                            ? `<a href="report.html?id=${item.id}" class="btn btn-secondary btn-sm">View Feedback ↗</a>`
                            : `<a href="interview.html?resume=${item.id}" class="btn btn-primary btn-sm">Resume →</a>`}
                    </td>
                </tr>
                `;
            }).join('');
        }
    } catch (err) {
        console.error('History fetch error:', err);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--accent-rose); padding:2rem;">Failed to load history.</td></tr>';
    }
}
