import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockStore } from '../utils/memoryStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
}

function jsonSql(obj) {
    return escapeSql(JSON.stringify(obj)) + '::jsonb';
}

function textArraySql(arr) {
    if (!arr || !Array.isArray(arr)) return 'ARRAY[]::TEXT[]';
    const escaped = arr.map(item => escapeSql(item)).join(', ');
    return 'ARRAY[' + escaped + ']::TEXT[]';
}

let sql = `-- =========================================================================
-- AI INTERVIEW PREPARATION SYSTEM - COMPREHENSIVE SEED DATA
-- =========================================================================
-- Includes 30+ questions for each interview round:
-- 1. Aptitude (35 questions)
-- 2. Technical (32 questions)
-- 3. Coding / DSA (32 questions)
-- 4. HR / Behavioral (32 questions)
-- =========================================================================

-- 1. APTITUDE QUESTIONS SEED (35 Questions)
INSERT INTO public.aptitude_questions (category, topic, difficulty, question, options, correct_option, explanation) VALUES
`;

const aptRows = mockStore.aptitudeQuestions.map(q => {
    return `(${escapeSql(q.category)}, ${escapeSql(q.topic)}, ${escapeSql(q.difficulty)}, ${escapeSql(q.question)}, ${jsonSql(q.options)}, ${q.correct_option}, ${escapeSql(q.explanation)})`;
});
sql += aptRows.join(',\n') + ';\n\n';

sql += `-- 2. TECHNICAL QUESTIONS SEED (32 Questions)
INSERT INTO public.technical_questions (role, topic, difficulty, question, expected_concepts, sample_answer) VALUES
`;

const techRows = mockStore.technicalQuestions.map(q => {
    return `(${escapeSql(q.role)}, ${escapeSql(q.topic)}, ${escapeSql(q.difficulty)}, ${escapeSql(q.question)}, ${jsonSql(q.expected_concepts)}, ${escapeSql(q.sample_answer)})`;
});
sql += techRows.join(',\n') + ';\n\n';

sql += `-- 3. CODING / DSA QUESTIONS SEED (32 Questions)
INSERT INTO public.coding_questions (title, role, topic, difficulty, description, examples, constraints, starter_code, test_cases) VALUES
`;

const codeRows = mockStore.codingQuestions.map(q => {
    return `(${escapeSql(q.title)}, ${escapeSql(q.role)}, ${escapeSql(q.topic)}, ${escapeSql(q.difficulty)}, ${escapeSql(q.description)}, ${jsonSql(q.examples)}, ${textArraySql(q.constraints)}, ${jsonSql(q.starter_code)}, ${jsonSql(q.test_cases)})`;
});
sql += codeRows.join(',\n') + ';\n\n';

sql += `-- 4. HR / BEHAVIORAL QUESTIONS SEED (32 Questions)
INSERT INTO public.hr_questions (category, question, key_evaluation_points) VALUES
`;

const hrRows = mockStore.hrQuestions.map(q => {
    return `(${escapeSql(q.category)}, ${escapeSql(q.question)}, ${jsonSql(q.key_evaluation_points)})`;
});
sql += hrRows.join(',\n') + ';\n';

const outputPath = path.resolve(__dirname, '../../database/seed_data.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Successfully wrote seed_data.sql to:', outputPath, 'Bytes:', fs.statSync(outputPath).size);
