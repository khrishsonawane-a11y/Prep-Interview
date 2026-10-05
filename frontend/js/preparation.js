/**
 * Role-Specific Preparation Guide & Roadmap Controller
 * Covers all 37 engineering & tech roles with comprehensive 6-phase roadmaps and curricula.
 */

// Base roadmap generator helper for rich, realistic curricula
function buildPreparationData(roleObj) {
    const title = roleObj.title;
    const skills = roleObj.skills || [];
    const icon = roleObj.icon || '💼';
    const category = roleObj.categoryName || 'Engineering';

    return {
        title: title,
        icon: icon,
        subtitle: roleObj.desc || `Comprehensive preparation curriculum and interview roadmap for ${title}.`,
        roadmap: [
            {
                phase: 'Phase 1',
                title: 'Foundations & Core Fundamentals',
                items: [
                    `Master primary languages & tools: ${skills.slice(0, 2).join(', ')}`,
                    'Core computer science & engineering principles',
                    'Development environment setup, CLI mastery, and version control',
                    'Fundamental syntax, memory models, and standard libraries'
                ]
            },
            {
                phase: 'Phase 2',
                title: 'Domain Architecture & Specialized Stack',
                items: [
                    `Deep dive into core stack: ${skills.slice(2, 4).join(', ') || skills.slice(0, 2).join(', ')}`,
                    'Architectural design patterns and component structuring',
                    'Data flow modeling, API communication, and state lifecycles',
                    'Clean Code principles, modular refactoring, and code reviews'
                ]
            },
            {
                phase: 'Phase 3',
                title: 'Data, Persistence & Protocol Mastery',
                items: [
                    `Hands-on workflows with ${skills.slice(4, 6).join(', ') || 'Relational & NoSQL databases'}`,
                    'Indexing, query optimization, and schema design',
                    'Caching mechanisms, concurrency control, and data integrity',
                    'Network protocols (HTTP/HTTPS, REST, gRPC, WebSockets)'
                ]
            },
            {
                phase: 'Phase 4',
                title: 'Testing, Security & Reliability',
                items: [
                    'Automated unit testing, integration testing, and test fixtures',
                    'Security best practices, auth protocols (OAuth/JWT), and threat defense',
                    'Containerization with Docker, CI/CD automated deployment pipelines',
                    'Performance profiling, bottleneck diagnosis, and observability'
                ]
            },
            {
                phase: 'Phase 5',
                title: 'Real-World Systems & Project Defense',
                items: [
                    `Architecting end-to-end applications demonstrating ${skills[0]} and ${skills[1]}`,
                    'High-availability trade-offs, scaling limits, and failure modes',
                    'Structured STAR behavioral framing for complex technical challenges',
                    'Technical portfolio refinement and architectural walkthroughs'
                ]
            },
            {
                phase: 'Phase 6',
                title: 'Mock Interview Simulations & Polish',
                items: [
                    'Timed aptitude speed calculation and quantitative deduction drills',
                    'Role-specific architectural interview defense against Senior Engineers',
                    'Hands-on coding execution and live algorithmic test-case passing',
                    'Executive presence, communication clarity, and leadership rounds'
                ]
            }
        ],
        curriculum: [
            {
                title: `1. Core ${title} Fundamentals`,
                items: [
                    `Primary competencies: ${skills.slice(0, 3).join(', ')}`,
                    'Fundamental theoretical principles and runtime execution',
                    'Object-oriented and functional programming paradigms',
                    'Memory lifecycles, resource management, and error handling'
                ]
            },
            {
                title: '2. Data Structures & Algorithmic Problem Solving',
                items: [
                    'Arrays, Strings, Hash Maps, Sets, and Two-Pointer strategies',
                    'Linked Lists, Stacks, Queues, Heaps, and Priority Queues',
                    'Trees, Binary Search Trees, Graphs, BFS, and DFS traversals',
                    'Time and space complexity analysis (Big-O notation)'
                ]
            },
            {
                title: '3. Domain Tools & Ecosystem',
                items: [
                    `Key frameworks and tools: ${skills.slice(2, 5).join(', ')}`,
                    'Configuration, package management, and build toolchains',
                    'API integrations, serialization, and asynchronous event handling',
                    'Modern industry standards and production best practices'
                ]
            },
            {
                title: '4. System Architecture & Scalability',
                items: [
                    'High-level and low-level system design patterns',
                    'Database indexing, partitioning, and caching strategies',
                    'Fault tolerance, rate limiting, and microservices decomposition',
                    'Handling edge cases, boundary inputs, and network latency'
                ]
            },
            {
                title: '5. Quality, Security & DevOps',
                items: [
                    'Comprehensive unit, regression, and integration testing',
                    'Authentication, authorization, and data encryption in transit & at rest',
                    'CI/CD automated pipelines and cloud deployment orchestration',
                    'Logging, metrics telemetry, and root-cause analysis'
                ]
            },
            {
                title: '6. Technical Interview Mastery',
                items: [
                    'Clear technical verbalization and whiteboarding communication',
                    'Handling ambiguous technical questions by proactively clarifying requirements',
                    'STAR framed behavioral responses with quantifiable impact metrics',
                    'Full-loop 4-round interview simulation strategy'
                ]
            }
        ]
    };
}

// Build index of all roles
const PREPARATION_DATA = {};
const allRoles = window.CONFIG?.JOB_ROLES || [];
allRoles.forEach(r => {
    PREPARATION_DATA[r.id] = buildPreparationData(r);
});

let prepSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    // Read pre-selected role from URL
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const initialRole = PREPARATION_DATA[roleParam] ? roleParam : (allRoles[0]?.id || 'Software Developer');

    setupPrepSearch();
    renderRolePills(initialRole);
    loadRolePreparation(initialRole);
});

function setupPrepSearch() {
    const searchInput = document.getElementById('prep-role-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            prepSearchQuery = (e.target.value || '').trim().toLowerCase();
            const activeRole = document.querySelector('.role-pill.active')?.getAttribute('data-role') || 'Software Developer';
            renderRolePills(activeRole);
        });
    }
}

function renderRolePills(activeRole) {
    const switcher = document.getElementById('role-switcher');
    if (!switcher) return;

    const roleKeys = Object.keys(PREPARATION_DATA);
    const filtered = roleKeys.filter(key => {
        if (!prepSearchQuery) return true;
        const roleData = PREPARATION_DATA[key];
        const matchTitle = key.toLowerCase().includes(prepSearchQuery);
        const matchSubtitle = (roleData?.subtitle || '').toLowerCase().includes(prepSearchQuery);
        return matchTitle || matchSubtitle;
    });

    if (filtered.length === 0) {
        switcher.innerHTML = `<span style="color:var(--text-dim); font-size:0.85rem;">No roles match "${escapeHtml(prepSearchQuery)}"</span>`;
        return;
    }

    switcher.innerHTML = filtered.map(role => `
        <a href="?role=${encodeURIComponent(role)}" class="role-pill ${role === activeRole ? 'active' : ''}" data-role="${escapeHtml(role)}">
            ${PREPARATION_DATA[role].icon} ${escapeHtml(role)}
        </a>
    `).join('');

    switcher.querySelectorAll('.role-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            const role = pill.getAttribute('data-role');
            switcher.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Update URL without reload
            const newUrl = `${window.location.pathname}?role=${encodeURIComponent(role)}`;
            window.history.pushState({ role }, '', newUrl);

            loadRolePreparation(role);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function loadRolePreparation(roleKey) {
    const data = PREPARATION_DATA[roleKey] || PREPARATION_DATA['Software Developer'] || buildPreparationData({ title: roleKey, icon: '💼', skills: [] });

    // 1. Header
    const titleEl = document.getElementById('prep-page-title');
    const subEl = document.getElementById('prep-page-subtitle');
    const startBtn = document.getElementById('prep-start-interview-btn');

    if (titleEl) titleEl.innerHTML = `${data.icon} How to Prepare for ${escapeHtml(data.title)}`;
    if (subEl) subEl.textContent = data.subtitle;
    if (startBtn) startBtn.href = `interview.html?role=${encodeURIComponent(data.title)}`;

    // 2. 6-Phase Roadmap
    const roadmapContainer = document.getElementById('roadmap-container');
    if (roadmapContainer) {
        roadmapContainer.innerHTML = data.roadmap.map(phase => `
            <div class="roadmap-phase-card">
                <div class="phase-badge">${escapeHtml(phase.phase)}</div>
                <div class="phase-title">${escapeHtml(phase.title)}</div>
                <ul class="phase-items">
                    ${phase.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 3. Core Curriculum
    const curriculumContainer = document.getElementById('curriculum-container');
    if (curriculumContainer) {
        curriculumContainer.innerHTML = data.curriculum.map(curr => `
            <div class="curriculum-card">
                <h3>${escapeHtml(curr.title)}</h3>
                <ul class="curriculum-list">
                    ${curr.items.map(item => `<li>✓ ${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
        `).join('');
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
