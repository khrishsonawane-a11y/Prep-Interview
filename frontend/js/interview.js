/**
 * Interview Setup & Role Selector Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    renderRoleCards();
    setupDifficultyButtons();
    setupStartButton();

    // Check if resume parameter is present
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get('resume');
    if (resumeId) {
        resumeInterviewSession(resumeId);
    }
});

let selectedRole = 'Software Developer';
let selectedDifficulty = 'Intermediate';

function renderRoleCards() {
    const container = document.getElementById('roles-grid');
    if (!container) return;

    const roles = window.CONFIG?.JOB_ROLES || [];
    container.innerHTML = roles.map(r => `
        <div class="role-card ${r.id === selectedRole ? 'selected' : ''}" data-role="${r.id}">
            <div class="role-card-icon">${r.icon}</div>
            <div class="role-card-title">${r.title}</div>
            <div style="font-size:0.8rem; color:var(--text-dim); margin-top:0.4rem;">${r.desc}</div>
        </div>
    `).join('');

    container.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedRole = card.getAttribute('data-role');
        });
    });
}

function setupDifficultyButtons() {
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedDifficulty = btn.getAttribute('data-diff');
        });
    });
}

function getSelectedRounds() {
    const checkboxes = document.querySelectorAll('input[name="round-select"]:checked');
    const selected = Array.from(checkboxes).map(cb => cb.value);
    return selected.length > 0 ? selected : ['aptitude', 'technical', 'coding', 'hr'];
}

function setupStartButton() {
    const startBtn = document.getElementById('start-interview-btn');
    if (!startBtn) return;

    startBtn.addEventListener('click', async () => {
        const rounds = getSelectedRounds();

        try {
            startBtn.disabled = true;
            startBtn.innerHTML = '<span class="spinner"></span> Initializing AI Interview Session...';

            const res = await window.API.createInterview({
                role: selectedRole,
                difficulty: selectedDifficulty,
                rounds: rounds
            });

            if (res.success && res.interview) {
                window.Toast.success('Interview session created! Launching Round 1...');

                const firstRound = rounds[0];
                setTimeout(() => {
                    window.location.href = `${firstRound}.html?id=${res.interview.id}&role=${encodeURIComponent(selectedRole)}&difficulty=${selectedDifficulty}`;
                }, 800);
            }
        } catch (err) {
            console.error('Failed to create interview:', err);
            window.Toast.error(err.message || 'Failed to start interview.');
            startBtn.disabled = false;
            startBtn.innerHTML = 'Start Interview 🚀';
        }
    });
}

async function resumeInterviewSession(interviewId) {
    try {
        const res = await window.API.getInterviewById(interviewId);
        if (res.success && res.interview) {
            const { rounds_config, current_round_index, status } = res.interview;
            if (status === 'completed') {
                window.location.href = `report.html?id=${interviewId}`;
                return;
            }
            const activeRound = rounds_config[current_round_index] || rounds_config[0];
            window.location.href = `${activeRound}.html?id=${interviewId}&role=${encodeURIComponent(res.interview.role)}&difficulty=${res.interview.difficulty}`;
        }
    } catch (err) {
        console.error('Failed to resume interview:', err);
    }
}
