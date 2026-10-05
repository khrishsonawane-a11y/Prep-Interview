/**
 * Three-Step Interview Configuration Wizard Controller
 * State Machine: Step 1 (Role) -> Step 2 (Difficulty) -> Step 3 (Rounds) -> Launch
 */

let currentStep = 1;
let selectedRole = 'Software Developer';
let selectedDifficulty = 'Intermediate';
let selectedRounds = ['aptitude', 'technical', 'coding', 'hr'];
let activeCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    // Read pre-selected parameters from URL if any
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam) {
        selectedRole = roleParam;
    }

    const resumeId = params.get('resume');
    if (resumeId) {
        resumeInterviewSession(resumeId);
        return;
    }

    setupRoleSearchAndFilters();
    renderRoleCards();
    setupDifficultyCards();
    setupRoundsCheckboxes();
    setupStepNavigation();
    updateStepUI();
});

/**
 * 1. Setup Role Search and Category Filters
 */
function setupRoleSearchAndFilters() {
    // 1a. Render Category Pills
    const pillsContainer = document.getElementById('role-category-pills');
    if (pillsContainer) {
        const categories = window.CONFIG?.ROLE_CATEGORIES || [
            { id: 'all', name: 'All Roles' },
            { id: 'software', name: 'Software / Development' },
            { id: 'data_ai', name: 'Data / AI' },
            { id: 'cloud_infra', name: 'Cloud / Infrastructure' },
            { id: 'security', name: 'Security' },
            { id: 'qa_testing', name: 'Testing / Quality' },
            { id: 'other_tech', name: 'Other Technology Roles' }
        ];

        pillsContainer.innerHTML = categories.map(cat => `
            <button type="button" class="role-pill-btn ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
                ${cat.name}
            </button>
        `).join('');

        pillsContainer.querySelectorAll('.role-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pillsContainer.querySelectorAll('.role-pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-cat') || 'all';
                renderRoleCards();
            });
        });
    }

    // 1b. Search Input Listener
    const searchInput = document.getElementById('role-search-input');
    const clearBtn = document.getElementById('role-search-clear-btn');
    const emptyClearBtn = document.getElementById('role-empty-clear-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = (e.target.value || '').trim().toLowerCase();
            if (clearBtn) {
                clearBtn.style.display = searchQuery ? 'flex' : 'none';
            }
            renderRoleCards();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchQuery = '';
                searchInput.value = '';
                if (clearBtn) clearBtn.style.display = 'none';
                renderRoleCards();
            }
        });
    }

    const handleClear = () => {
        searchQuery = '';
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        if (clearBtn) clearBtn.style.display = 'none';
        renderRoleCards();
    };

    if (clearBtn) clearBtn.addEventListener('click', handleClear);
    if (emptyClearBtn) emptyClearBtn.addEventListener('click', handleClear);
}

/**
 * 2. Render Step 1 Role Cards (Filtered by category & search query)
 */
function renderRoleCards() {
    const container = document.getElementById('roles-grid');
    const emptyState = document.getElementById('role-empty-state');
    const emptyQueryEl = document.getElementById('role-empty-query');
    const countEl = document.getElementById('role-search-count');
    if (!container) return;

    const allRoles = window.CONFIG?.JOB_ROLES || [];

    // Filter by Category and Search Query
    const filtered = allRoles.filter(role => {
        // Category check
        if (activeCategory !== 'all' && role.category !== activeCategory) {
            return false;
        }

        // Search query check (case-insensitive across title, desc, category, skills)
        if (searchQuery) {
            const titleMatch = (role.title || '').toLowerCase().includes(searchQuery);
            const descMatch = (role.desc || '').toLowerCase().includes(searchQuery);
            const catMatch = (role.categoryName || '').toLowerCase().includes(searchQuery);
            const skillsMatch = Array.isArray(role.skills) && role.skills.some(s => s.toLowerCase().includes(searchQuery));
            return titleMatch || descMatch || catMatch || skillsMatch;
        }

        return true;
    });

    // Update Count Display
    if (countEl) {
        if (searchQuery) {
            countEl.textContent = `Found ${filtered.length} of ${allRoles.length} roles`;
        } else if (activeCategory !== 'all') {
            countEl.textContent = `Showing ${filtered.length} roles in category`;
        } else {
            countEl.textContent = `Showing all ${allRoles.length} job roles`;
        }
    }

    // Handle Empty State
    if (filtered.length === 0) {
        container.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
            if (emptyQueryEl) emptyQueryEl.textContent = searchQuery || activeCategory;
        }
        return;
    }

    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(r => `
        <div class="role-card ${r.id === selectedRole ? 'selected' : ''}" data-role="${escapeHtml(r.id)}">
            <div class="role-card-header">
                <div class="role-card-icon">${r.icon}</div>
                <div>
                    <div class="role-card-title">${escapeHtml(r.title)}</div>
                    <div style="font-size: 0.72rem; color: var(--accent-blue); font-weight: 500;">${escapeHtml(r.categoryName || '')}</div>
                </div>
            </div>
            <div class="role-card-desc">${escapeHtml(r.desc)}</div>
            ${r.skills && r.skills.length > 0 ? `
                <div class="role-skill-tags">
                    ${r.skills.slice(0, 4).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
                    ${r.skills.length > 4 ? `<span class="skill-tag" style="color:var(--accent-blue);">+${r.skills.length - 4} more</span>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');

    container.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedRole = card.getAttribute('data-role');
            updateRoleDependentUI();
        });
    });

    updateRoleDependentUI();
}

function updateRoleDependentUI() {
    const roleDesc = document.getElementById('prep-hint-role-desc');
    const prepBtn = document.getElementById('view-role-prep-btn');
    const step2RoleDisplay = document.getElementById('step2-role-display');
    const summaryRoleVal = document.getElementById('summary-role-val');

    if (roleDesc) {
        roleDesc.innerHTML = `Explore the detailed curriculum, roadmap, and core topics recommended for <strong>${escapeHtml(selectedRole)}</strong>.`;
    }
    if (prepBtn) {
        prepBtn.href = `preparation.html?role=${encodeURIComponent(selectedRole)}`;
    }
    if (step2RoleDisplay) {
        step2RoleDisplay.textContent = selectedRole;
    }
    if (summaryRoleVal) {
        summaryRoleVal.textContent = selectedRole;
    }
}

/**
 * 3. Setup Step 2 Difficulty Cards
 */
function setupDifficultyCards() {
    const diffCards = document.querySelectorAll('.diff-card');
    diffCards.forEach(card => {
        card.addEventListener('click', () => {
            diffCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedDifficulty = card.getAttribute('data-diff');

            const summaryDiffVal = document.getElementById('summary-diff-val');
            if (summaryDiffVal) summaryDiffVal.textContent = selectedDifficulty;
        });
    });
}

/**
 * 4. Setup Step 3 Rounds Checkboxes
 */
function setupRoundsCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="round-select"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateSelectedRounds();
        });
    });
    updateSelectedRounds();
}

function updateSelectedRounds() {
    const checkboxes = document.querySelectorAll('input[name="round-select"]:checked');
    selectedRounds = Array.from(checkboxes).map(cb => cb.value);

    const summaryRoundsVal = document.getElementById('summary-rounds-val');
    if (summaryRoundsVal) {
        const totalQ = selectedRounds.length * 30;
        summaryRoundsVal.textContent = `${selectedRounds.length} Rounds (${totalQ} Questions)`;
    }
}

/**
 * 5. Step Navigation Management (Next / Back / State Validation)
 */
function setupStepNavigation() {
    // Step 1 -> Step 2
    const step1Next = document.getElementById('step1-next-btn');
    if (step1Next) {
        step1Next.addEventListener('click', () => {
            if (!selectedRole) {
                window.Toast.warning('Please select a target job role.');
                return;
            }
            goToStep(2);
        });
    }

    // Step 2 -> Step 1 (Back)
    const step2Back = document.getElementById('step2-back-btn');
    if (step2Back) {
        step2Back.addEventListener('click', () => {
            goToStep(1);
        });
    }

    // Step 2 -> Step 3 (Next)
    const step2Next = document.getElementById('step2-next-btn');
    if (step2Next) {
        step2Next.addEventListener('click', () => {
            if (!selectedDifficulty) {
                window.Toast.warning('Please select a difficulty level.');
                return;
            }
            goToStep(3);
        });
    }

    // Step 3 -> Step 2 (Back)
    const step3Back = document.getElementById('step3-back-btn');
    if (step3Back) {
        step3Back.addEventListener('click', () => {
            goToStep(2);
        });
    }

    // Step 3 -> Start Interview
    const startBtn = document.getElementById('start-interview-btn');
    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            updateSelectedRounds();
            if (!selectedRounds || selectedRounds.length === 0) {
                window.Toast.warning('Please select at least one interview round.');
                return;
            }

            try {
                startBtn.disabled = true;
                startBtn.innerHTML = '<span class="spinner"></span> Initializing AI Interview Session...';

                const res = await window.API.createInterview({
                    role: selectedRole,
                    difficulty: selectedDifficulty,
                    rounds: selectedRounds
                });

                if (res.success && res.interview) {
                    window.Toast.success('Interview session configured! Launching Round 1...');

                    const firstRound = selectedRounds[0];
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
}

function goToStep(stepNumber) {
    currentStep = stepNumber;
    updateStepUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepUI() {
    // 1. Toggle Step Panels
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById(`wizard-step-1`);
        const step2El = document.getElementById(`wizard-step-2`);
        const step3El = document.getElementById(`wizard-step-3`);

        if (stepEl) stepEl.style.display = currentStep === 1 ? 'block' : 'none';
        if (step2El) step2El.style.display = currentStep === 2 ? 'block' : 'none';
        if (step3El) step3El.style.display = currentStep === 3 ? 'block' : 'none';
    }

    // 2. Update Step Badge
    const badge = document.getElementById('step-badge-indicator');
    if (badge) {
        badge.textContent = `Step ${currentStep} of 3`;
    }

    // 3. Update Progress Step Icons & Connectors
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById(`step-indicator-${i}`);
        if (ind) {
            ind.classList.remove('active', 'completed');
            if (i === currentStep) {
                ind.classList.add('active');
            } else if (i < currentStep) {
                ind.classList.add('completed');
            }
        }
    }

    const conn1 = document.getElementById('connector-1-2');
    const conn2 = document.getElementById('connector-2-3');
    if (conn1) conn1.classList.toggle('active', currentStep >= 2);
    if (conn2) conn2.classList.toggle('active', currentStep >= 3);

    // 4. Update Summaries
    const summaryRole = document.getElementById('summary-role-val');
    const summaryDiff = document.getElementById('summary-diff-val');
    if (summaryRole) summaryRole.textContent = selectedRole;
    if (summaryDiff) summaryDiff.textContent = selectedDifficulty;
}

/**
 * Resume Session Helper
 */
async function resumeInterviewSession(interviewId) {
    try {
        const res = await window.API.getInterviewById(interviewId);
        if (res.success && res.interview) {
            const { rounds_config, current_round_index, status, role, difficulty } = res.interview;
            if (status === 'completed') {
                window.location.href = `report.html?id=${interviewId}`;
                return;
            }
            const rounds = rounds_config || ['aptitude', 'technical', 'coding', 'hr'];
            const targetRound = rounds[current_round_index || 0] || 'aptitude';
            window.location.href = `${targetRound}.html?id=${interviewId}&role=${encodeURIComponent(role || 'Software Developer')}&difficulty=${difficulty || 'Intermediate'}`;
        }
    } catch (err) {
        console.error('Failed to resume interview:', err);
    }
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
