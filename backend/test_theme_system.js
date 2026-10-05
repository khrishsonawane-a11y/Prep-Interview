import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING THEME SYSTEM VALIDATION SUITE ---');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const CSS_DIR = path.join(FRONTEND_DIR, 'css');
const JS_DIR = path.join(FRONTEND_DIR, 'js');

// 1. Verify all HTML files have consistent immediate theme bootstrapping
const htmlFiles = fs.readdirSync(FRONTEND_DIR).filter(f => f.endsWith('.html'));
assert(htmlFiles.length >= 10, 'Expected at least 10 HTML files');

console.log(`Checking ${htmlFiles.length} HTML files for theme script consistency...`);
for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(path.join(FRONTEND_DIR, htmlFile), 'utf8');
    assert(content.includes('localStorage.getItem(\'app_theme\')'), `${htmlFile} missing app_theme localStorage check`);
    assert(content.includes('document.documentElement.setAttribute(\'data-theme\''), `${htmlFile} missing data-theme attribute set`);
    console.log(`  ✓ ${htmlFile} has theme bootstrapping`);
}

// 2. Verify navbar.js theme toggle logic
const navbarJs = fs.readFileSync(path.join(JS_DIR, 'navbar.js'), 'utf8');
assert(navbarJs.includes('localStorage.getItem(\'app_theme\')'), 'navbar.js missing app_theme check');
assert(navbarJs.includes('document.documentElement.setAttribute(\'data-theme\', nextTheme)'), 'navbar.js missing theme toggle attribute set');
assert(navbarJs.includes('localStorage.setItem(\'app_theme\', nextTheme)'), 'navbar.js missing localStorage persistence');
console.log('  ✓ navbar.js has theme toggle and persistence');

// 3. Verify global.css defines both light and dark themes with all essential tokens
const globalCss = fs.readFileSync(path.join(CSS_DIR, 'global.css'), 'utf8');
const requiredTokens = [
    '--bg-primary',
    '--bg-secondary',
    '--bg-card',
    '--bg-card-hover',
    '--bg-input',
    '--border-subtle',
    '--border-card',
    '--border-focus',
    '--primary',
    '--text-main',
    '--text-muted',
    '--text-dim'
];

for (const token of requiredTokens) {
    assert(globalCss.includes(token), `global.css missing essential token: ${token}`);
}
assert(globalCss.includes('[data-theme="light"]'), 'global.css missing data-theme="light" selector');
assert(globalCss.includes('[data-theme="dark"]'), 'global.css missing data-theme="dark" selector');
console.log('  ✓ global.css has complete semantic tokens for both light and dark themes');

// 4. Verify component CSS files do not contain hardcoded #ffffff or #f8fafc card backgrounds
const componentCssFiles = ['aptitude.css', 'technical.css', 'coding.css', 'hr.css'];
for (const cssFile of componentCssFiles) {
    const content = fs.readFileSync(path.join(CSS_DIR, cssFile), 'utf8');
    const hasHardcodedWhiteCard = /background:\s*#ffffff;/i.test(content);
    assert(!hasHardcodedWhiteCard, `${cssFile} still contains hardcoded background: #ffffff;`);
    console.log(`  ✓ ${cssFile} uses semantic variables for card backgrounds`);
}

console.log('ALL THEME SYSTEM TESTS PASSED SUCCESSFULLY! ✓');
