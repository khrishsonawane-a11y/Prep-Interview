/**
 * Automated Test Suite for Job Role Search & Expanded Job Roles
 */
import fs from 'fs';
import path from 'path';
import { mockStore } from './utils/memoryStore.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failed++;
    }
}

async function runTests() {
    console.log('====================================================');
    console.log('🚀 RUNNING JOB ROLE SEARCH & SKILLS VERIFICATION');
    console.log('====================================================\n');

    // 1. Inspect config.js for expanded roles
    console.log('--- 1. JOB ROLES CATALOG & METADATA ---');
    const configJs = fs.readFileSync(path.resolve('./frontend/js/config.js'), 'utf8');
    
    // Evaluate or parse JOB_ROLES from config
    const rolesMatch = configJs.match(/JOB_ROLES:\s*(\[[\s\S]*?\])\s*\n\s*\};/);
    assert(rolesMatch != null, 'CONFIG.JOB_ROLES is defined in config.js');

    const jobRoles = mockStore.jobRoles;
    assert(jobRoles.length >= 35, `Total job roles in catalog = ${jobRoles.length} (>= 35)`);

    // Verify metadata for all roles
    let allValid = true;
    for (const r of jobRoles) {
        if (!r.id || !r.title || !r.category || !Array.isArray(r.skills) || r.skills.length < 4) {
            console.error('Invalid role object:', r);
            allValid = false;
            break;
        }
    }
    assert(allValid, 'All job roles have id, title, category, and at least 4 detailed skills');

    // 2. Specific required roles existence check
    console.log('\n--- 2. REQUIRED ROLES COVERAGE ---');
    const requiredRoles = [
        'Software Developer',
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Java Developer',
        'Python Developer',
        'C++ Developer',
        'Mobile App Developer',
        'Game Developer',
        'Data Analyst',
        'Data Scientist',
        'AI Engineer',
        'Machine Learning Engineer',
        'Generative AI Engineer',
        'NLP Engineer',
        'Computer Vision Engineer',
        'DevOps Engineer',
        'Cloud Engineer',
        'Cloud Architect',
        'Site Reliability Engineer',
        'Kubernetes Engineer',
        'Cybersecurity Analyst',
        'Cybersecurity Engineer',
        'Security Engineer',
        'Ethical Hacker / Penetration Tester',
        'QA Engineer',
        'Software Test Engineer',
        'Automation Test Engineer',
        'Performance Test Engineer',
        'Database Administrator',
        'System Administrator',
        'Business Analyst',
        'UI/UX Designer',
        'Technical Support Engineer',
        'Mechanical Engineer'
    ];

    for (const reqRole of requiredRoles) {
        const found = jobRoles.some(r => r.title.toLowerCase() === reqRole.toLowerCase() || r.id.toLowerCase() === reqRole.toLowerCase());
        assert(found, `Role present: "${reqRole}"`);
    }

    // 3. Search Filter Logic Verification
    console.log('\n--- 3. SEARCH FILTERING SIMULATION ---');
    
    function filterRoles(query, category = 'all') {
        const q = (query || '').trim().toLowerCase();
        return jobRoles.filter(role => {
            if (category !== 'all' && role.category !== category) return false;
            if (!q) return true;
            const titleMatch = (role.title || '').toLowerCase().includes(q);
            const descMatch = (role.desc || '').toLowerCase().includes(q);
            const catMatch = (role.category || '').toLowerCase().includes(q);
            const skillsMatch = Array.isArray(role.skills) && role.skills.some(s => s.toLowerCase().includes(q));
            return titleMatch || descMatch || catMatch || skillsMatch;
        });
    }

    // 3a. Exact and case-insensitive search
    const r1 = filterRoles('software developer');
    assert(r1.length >= 1 && r1.some(r => r.title === 'Software Developer'), 'Search "software developer" returns Software Developer');

    const r2 = filterRoles('SOFTWARE DEVELOPER');
    assert(r2.length >= 1 && r2.some(r => r.title === 'Software Developer'), 'Search uppercase "SOFTWARE DEVELOPER" returns matching role');

    // 3b. Partial search
    const r3 = filterRoles('developer');
    assert(r3.length >= 7, `Partial search "developer" returns ${r3.length} roles (>= 7)`);

    const r4 = filterRoles('data');
    assert(r4.length >= 3, `Partial search "data" returns ${r4.length} roles (Data Analyst, Data Scientist, etc.)`);

    // 3c. Skill-based search
    const r5 = filterRoles('kubernetes');
    assert(r5.length >= 2, `Skill search "kubernetes" returns matching roles (${r5.map(r=>r.title).join(', ')})`);

    const r6 = filterRoles('figma');
    assert(r6.length >= 1 && r6.some(r => r.title === 'UI/UX Designer'), 'Skill search "figma" returns UI/UX Designer');

    const r7 = filterRoles('solidworks');
    assert(r7.length >= 1 && r7.some(r => r.title === 'Mechanical Engineer'), 'Skill search "solidworks" returns Mechanical Engineer');

    // 3d. No matches query
    const r8 = filterRoles('xyznonexistentrole123');
    assert(r8.length === 0, 'Non-existent search returns 0 results');

    // 3e. Category filtering
    const catSoftware = filterRoles('', 'software');
    assert(catSoftware.length >= 10, `Category "software" has ${catSoftware.length} roles`);

    const catDataAI = filterRoles('', 'data_ai');
    assert(catDataAI.length >= 7, `Category "data_ai" has ${catDataAI.length} roles`);

    const catSecurity = filterRoles('', 'security');
    assert(catSecurity.length >= 4, `Category "security" has ${catSecurity.length} roles`);

    // 4. Check Frontend Files for Search UI elements
    console.log('\n--- 4. UI COMPONENTS VERIFICATION ---');
    const interviewHtml = fs.readFileSync(path.resolve('./frontend/interview.html'), 'utf8');
    assert(interviewHtml.includes('id="role-search-input"'), 'interview.html has role-search-input');
    assert(interviewHtml.includes('id="role-search-clear-btn"'), 'interview.html has role-search-clear-btn');
    assert(interviewHtml.includes('id="role-empty-state"'), 'interview.html has role-empty-state');
    assert(interviewHtml.includes('id="role-category-pills"'), 'interview.html has role-category-pills');

    const interviewJs = fs.readFileSync(path.resolve('./frontend/js/interview.js'), 'utf8');
    assert(interviewJs.includes('setupRoleSearchAndFilters'), 'interview.js initializes search and category filters');
    assert(interviewJs.includes('searchQuery'), 'interview.js maintains searchQuery state');
    assert(interviewJs.includes('role-empty-state'), 'interview.js handles empty search state');

    const interviewCss = fs.readFileSync(path.resolve('./frontend/css/interview.css'), 'utf8');
    assert(interviewCss.includes('.role-search-input'), 'interview.css contains .role-search-input styling');
    assert(interviewCss.includes('.role-empty-state'), 'interview.css contains .role-empty-state styling');

    console.log('\n====================================================');
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) process.exit(1);
}

runTests().catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
});
