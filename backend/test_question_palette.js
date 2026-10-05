import { mockStore } from './utils/memoryStore.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function runTests() {
    console.log('🧪 Starting Question Palette Verification Tests...\n');
    let totalTests = 0;
    let passedTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            passedTests++;
        } else {
            console.error(`❌ FAIL: ${message}`);
        }
    }

    // TEST 1: Question pools have >= 30 questions each
    assert(mockStore.aptitudeQuestions.length >= 30, `Aptitude pool has ${mockStore.aptitudeQuestions.length} questions (>= 30)`);
    assert(mockStore.technicalQuestions.length >= 30, `Technical pool has ${mockStore.technicalQuestions.length} questions (>= 30)`);
    assert(mockStore.codingQuestions.length >= 30, `Coding pool has ${mockStore.codingQuestions.length} questions (>= 30)`);
    assert(mockStore.hrQuestions.length >= 30, `HR pool has ${mockStore.hrQuestions.length} questions (>= 30)`);

    // TEST 2: Check backend routes and controllers
    const techRoutes = fs.readFileSync(path.join(__dirname, 'routes/technicalRoutes.js'), 'utf8');
    assert(techRoutes.includes('/questions') && techRoutes.includes('getTechnicalQuestions'), 'technicalRoutes.js exposes /questions route');

    const codingRoutes = fs.readFileSync(path.join(__dirname, 'routes/codingRoutes.js'), 'utf8');
    assert(codingRoutes.includes('/questions') && codingRoutes.includes('getCodingQuestions'), 'codingRoutes.js exposes /questions route');

    const hrRoutes = fs.readFileSync(path.join(__dirname, 'routes/hrRoutes.js'), 'utf8');
    assert(hrRoutes.includes('/questions') && hrRoutes.includes('getHRQuestions'), 'hrRoutes.js exposes /questions route');

    const apiJs = fs.readFileSync(path.join(rootDir, 'frontend/js/api.js'), 'utf8');
    assert(apiJs.includes('getTechnicalQuestions') && apiJs.includes('getCodingQuestions') && apiJs.includes('getHRQuestions'), 'frontend/js/api.js contains batch retrieval methods');

    // TEST 3: Check HTML palette containers & legends across all 4 rounds
    const rounds = [
        { file: 'frontend/aptitude.html', name: 'Aptitude' },
        { file: 'frontend/technical.html', name: 'Technical' },
        { file: 'frontend/coding.html', name: 'Coding' },
        { file: 'frontend/hr.html', name: 'HR' }
    ];

    for (const r of rounds) {
        const html = fs.readFileSync(path.join(rootDir, r.file), 'utf8');
        assert(html.includes('id="palette-container"'), `${r.name} HTML contains palette-container`);
        assert(html.includes('palette-legend') || html.includes('palette-header'), `${r.name} HTML contains palette legend/header`);
        assert(html.includes('palette-progress-badge') || html.includes('palette-progress-pill'), `${r.name} HTML contains progress badge`);
    }

    // TEST 4: Check JavaScript controllers for palette rendering & state preservation
    const jsControllers = [
        { file: 'frontend/js/aptitude.js', name: 'Aptitude JS', draftCheck: c => c.includes('userAnswers'), visitedCheck: c => c.includes('visitedQuestions') },
        { file: 'frontend/js/technical.js', name: 'Technical JS', draftCheck: c => c.includes('draftAnswers'), visitedCheck: c => c.includes('visitedQuestions') },
        { file: 'frontend/js/coding.js', name: 'Coding JS', draftCheck: c => c.includes('candidateCode') || c.includes('questionsState'), visitedCheck: c => c.includes('visited') || c.includes('questionsState') },
        { file: 'frontend/js/hr.js', name: 'HR JS', draftCheck: c => c.includes('draftTranscripts'), visitedCheck: c => c.includes('visitedQuestions') }
    ];

    for (const j of jsControllers) {
        const code = fs.readFileSync(path.join(rootDir, j.file), 'utf8');
        assert(code.includes('renderPalette'), `${j.name} implements renderPalette()`);
        assert(j.draftCheck(code), `${j.name} preserves user draft answers`);
        assert(j.visitedCheck(code), `${j.name} tracks visited state`);
        assert(code.includes('current'), `${j.name} marks active question as current`);
        assert(code.includes('answered'), `${j.name} marks submitted/answered questions`);
        assert(code.includes('skipped'), `${j.name} marks skipped questions`);
        assert(code.includes('viewed'), `${j.name} marks viewed solution questions`);
    }

    // TEST 5: Check Global CSS for Question Palette classes & dark/light theme support
    const globalCss = fs.readFileSync(path.join(rootDir, 'frontend/css/global.css'), 'utf8');
    assert(globalCss.includes('.question-palette-card') || globalCss.includes('.question-palette'), 'global.css contains .question-palette-card styling');
    assert(globalCss.includes('.palette-btn.current') && globalCss.includes('.palette-btn.answered'), 'global.css contains active and answered palette button styles');
    assert(globalCss.includes('.palette-btn.skipped') && globalCss.includes('.palette-btn.visited'), 'global.css contains skipped and visited palette button styles');
    assert(globalCss.includes('.palette-legend'), 'global.css contains .palette-legend styles');
    assert(globalCss.includes('[data-theme="light"] .palette-btn'), 'global.css contains light theme support for palette buttons');

    console.log(`\n========================================`);
    console.log(`🎯 Results: ${passedTests} / ${totalTests} tests passed`);
    console.log(`========================================\n`);

    if (passedTests === totalTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
});
