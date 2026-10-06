import { getDbClient, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateFinalReport } from '../services/aiService.js';
import { randomUUID } from 'crypto';

const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * Format raw database answers into structured frontend review objects
 */
const formatAnswersForFrontend = (answers = []) => {
    return answers.map(a => {
        const aiEval = (typeof a.ai_evaluation === 'object' && a.ai_evaluation !== null) ? a.ai_evaluation : {};
        return {
            ...a,
            topic: aiEval.topic || 'Core Concept',
            reference_answer: aiEval.reference_answer || a.user_answer,
            is_skipped: Boolean(aiEval.is_skipped || a.user_answer === '[SKIPPED]'),
            viewed_answer: Boolean(aiEval.viewed_answer),
            error_type: aiEval.error_type || (a.is_correct ? 'None (Correct)' : 'Review Needed'),
            user_explanation: aiEval.user_explanation || '',
            evaluation: aiEval
        };
    });
};

/**
 * Format raw database results row into full frontend report structure
 */
const formatResultsForFrontend = (resultRow) => {
    if (!resultRow) return null;

    const rawRecommended = resultRow.recommended_topics;
    let recTopicsList = [];
    let extraMeta = {};

    if (Array.isArray(rawRecommended)) {
        recTopicsList = rawRecommended;
    } else if (typeof rawRecommended === 'object' && rawRecommended !== null) {
        recTopicsList = Array.isArray(rawRecommended.topics) ? rawRecommended.topics : [];
        extraMeta = rawRecommended;
    }

    const overallScore = Number(resultRow.overall_score) || 0;
    const defaultPerfLevel = overallScore >= 85 ? 'Exceptional Readiness'
        : overallScore >= 75 ? 'Strong Candidate'
        : overallScore >= 60 ? 'Proficient'
        : overallScore >= 50 ? 'Developing'
        : 'Needs Preparation';

    return {
        ...resultRow,
        overall_score: overallScore,
        performance_level: extraMeta.performance_level || defaultPerfLevel,
        overall_performance: extraMeta.overall_performance || {
            total_questions: 30,
            attempted: 30,
            correct: Math.round((overallScore / 100) * 30),
            wrong: Math.max(0, 30 - Math.round((overallScore / 100) * 30)),
            skipped: 0,
            accuracy: overallScore,
            completion_percentage: 100,
            percentage: overallScore,
            score: overallScore,
            performance_level: defaultPerfLevel,
            improvement: extraMeta.improvement || '+0%'
        },
        previous_attempt_comparison: extraMeta.previous_attempt_comparison || { has_previous: false },
        weak_topics: extraMeta.weak_topics || [],
        strong_topics: extraMeta.strong_topics || [],
        top_priorities: extraMeta.top_priorities || [
            'Master edge case handling in coding assessments.',
            'Deepen system design architecture and database indexing.',
            'Structure behavioral responses using quantifiable STAR metrics.'
        ],
        recommended_topics: recTopicsList
    };
};

/**
 * POST /api/interviews
 * Start a new interview session
 */
export const createInterview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
        const {
            role = 'Software Developer',
            difficulty = 'Intermediate',
            rounds = ['aptitude', 'technical', 'coding', 'hr']
        } = req.body || {};

        const newInterview = {
            id: randomUUID(),
            user_id: userId,
            role: role || 'Software Developer',
            difficulty: difficulty || 'Intermediate',
            status: 'in_progress',
            total_rounds: Array.isArray(rounds) && rounds.length > 0 ? rounds.length : 4,
            current_round_index: 0,
            rounds_config: Array.isArray(rounds) && rounds.length > 0 ? rounds : ['aptitude', 'technical', 'coding', 'hr'],
            overall_score: 0,
            created_at: new Date().toISOString()
        };

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                const { data, error } = await db
                    .from('interviews')
                    .insert([newInterview])
                    .select()
                    .single();

                if (error) {
                    console.error('[Supabase Error] createInterview insert failed:', error.message);
                    return res.status(500).json({ success: false, error: 'Failed to create interview in database: ' + error.message });
                }

                return res.status(201).json({ success: true, interview: data });
            } catch (supErr) {
                console.error('[Supabase Exception] createInterview:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database connection failed during interview creation: ' + supErr.message });
            }
        }

        mockStore.interviews.set(newInterview.id, newInterview);
        return res.status(201).json({ success: true, interview: newInterview });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/interviews
 * List authenticated user's interview history
 */
export const getInterviews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
        const { role, status, search } = req.query;

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                let query = db
                    .from('interviews')
                    .select(`
                        id,
                        role,
                        difficulty,
                        status,
                        total_rounds,
                        current_round_index,
                        rounds_config,
                        overall_score,
                        created_at,
                        completed_at,
                        interview_results(overall_summary, readiness_rating)
                    `)
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (role) query = query.ilike('role', `%${role}%`);
                if (status) query = query.eq('status', status);

                const { data, error } = await query;
                if (error) {
                    console.error('[Supabase Error] getInterviews query failed:', error.message);
                    return res.status(500).json({ success: false, error: 'Failed to fetch interview history: ' + error.message });
                }

                let filtered = data || [];
                if (search) {
                    const s = search.toLowerCase();
                    filtered = filtered.filter(item =>
                        (item.role && item.role.toLowerCase().includes(s)) ||
                        (item.difficulty && item.difficulty.toLowerCase().includes(s))
                    );
                }
                return res.json({ success: true, count: filtered.length, interviews: filtered });
            } catch (supErr) {
                console.error('[Supabase Exception] getInterviews:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database query failed: ' + supErr.message });
            }
        }

        // Mock store fallback for intentional demo/mock users
        let userInterviews = Array.from(mockStore.interviews.values())
            .filter(i => i.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (role) {
            userInterviews = userInterviews.filter(i => i.role.toLowerCase().includes(role.toLowerCase()));
        }
        if (status) {
            userInterviews = userInterviews.filter(i => i.status === status);
        }
        if (search) {
            const s = search.toLowerCase();
            userInterviews = userInterviews.filter(i => i.role.toLowerCase().includes(s));
        }

        const enriched = userInterviews.map(i => {
            const result = mockStore.results.get(i.id);
            return {
                ...i,
                interview_results: result ? { overall_summary: result.overall_summary, readiness_rating: result.readiness_rating } : null
            };
        });

        return res.json({ success: true, count: enriched.length, interviews: enriched });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/interviews/:id
 */
export const getInterviewById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                const { data: interview, error: intErr } = await db
                    .from('interviews')
                    .select('*')
                    .eq('id', id)
                    .eq('user_id', userId)
                    .maybeSingle();

                if (intErr) {
                    console.error('[Supabase Error] getInterviewById interview query:', intErr.message);
                    return res.status(500).json({ success: false, error: 'Database query error: ' + intErr.message });
                }

                if (!interview) {
                    return res.status(404).json({ success: false, error: 'Interview not found or unauthorized.' });
                }

                const { data: answers, error: ansErr } = await db
                    .from('interview_answers')
                    .select('*')
                    .eq('interview_id', id)
                    .eq('user_id', userId)
                    .order('created_at', { ascending: true });

                if (ansErr) {
                    console.error('[Supabase Error] getInterviewById answers query:', ansErr.message);
                }

                const { data: results, error: resErr } = await db
                    .from('interview_results')
                    .select('*')
                    .eq('interview_id', id)
                    .eq('user_id', userId)
                    .maybeSingle();

                if (resErr) {
                    console.error('[Supabase Error] getInterviewById results query:', resErr.message);
                }

                return res.json({
                    success: true,
                    interview,
                    answers: formatAnswersForFrontend(answers || []),
                    results: formatResultsForFrontend(results)
                });
            } catch (supErr) {
                console.error('[Supabase Exception] getInterviewById:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database retrieval exception: ' + supErr.message });
            }
        }

        const interview = mockStore.interviews.get(id);
        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview session not found in memory store.' });
        }

        const answers = Array.from(mockStore.answers.values()).filter(a => a.interview_id === id);
        const results = mockStore.results.get(id) || null;

        return res.json({
            success: true,
            interview,
            answers,
            results
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/interviews/:id/progress
 */
export const updateInterviewProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
        const { roundIndex, status } = req.body;

        const updates = {};
        if (typeof roundIndex === 'number') updates.current_round_index = roundIndex;
        if (status) updates.status = status;

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                const { data, error } = await db
                    .from('interviews')
                    .update(updates)
                    .eq('id', id)
                    .eq('user_id', userId)
                    .select()
                    .single();

                if (error) {
                    console.error('[Supabase Error] updateInterviewProgress:', error.message);
                    return res.status(500).json({ success: false, error: 'Failed to update interview progress: ' + error.message });
                }

                return res.json({ success: true, interview: data });
            } catch (supErr) {
                console.error('[Supabase Exception] updateInterviewProgress:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database exception during progress update: ' + supErr.message });
            }
        }

        const interview = mockStore.interviews.get(id) || { id, user_id: userId, current_round_index: 0 };
        Object.assign(interview, updates);
        mockStore.interviews.set(id, interview);
        return res.json({ success: true, interview });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/interviews/:id/finalize
 */
export const finalizeInterview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);

        let interview = null;
        let answers = [];

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            const { data: intData, error: intErr } = await db
                .from('interviews')
                .select('*')
                .eq('id', id)
                .eq('user_id', userId)
                .maybeSingle();

            if (intErr || !intData) {
                console.error('[Supabase Error] finalizeInterview interview lookup:', intErr?.message);
                return res.status(404).json({ success: false, error: 'Interview not found or unauthorized for finalization.' });
            }
            interview = intData;

            const { data: ansData, error: ansErr } = await db
                .from('interview_answers')
                .select('*')
                .eq('interview_id', id)
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (ansErr) {
                console.error('[Supabase Error] finalizeInterview answers lookup:', ansErr.message);
                return res.status(500).json({ success: false, error: 'Failed to retrieve submitted answers from database: ' + ansErr.message });
            }
            answers = formatAnswersForFrontend(ansData || []);
        } else {
            interview = mockStore.interviews.get(id) || {
                id,
                user_id: userId,
                role: 'Software Developer',
                difficulty: 'Intermediate'
            };
            answers = Array.from(mockStore.answers.values()).filter(a => a.interview_id === id);
        }

        // Look up previous completed interview for this user to compute improvement
        let prevInterview = null;
        let prevResult = null;
        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            try {
                const { data: prevList } = await db
                    .from('interviews')
                    .select('*, interview_results(*)')
                    .eq('user_id', userId)
                    .eq('status', 'completed')
                    .neq('id', id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                if (prevList && prevList.length > 0) {
                    prevInterview = prevList[0];
                    prevResult = prevList[0].interview_results?.[0] || prevList[0].interview_results;
                }
            } catch (supErr) {
                console.warn('Supabase previous interview check notice:', supErr.message);
            }
        } else {
            const allUserInterviews = Array.from(mockStore.interviews.values())
                .filter(i => i.user_id === userId && i.status === 'completed' && i.id !== id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            if (allUserInterviews.length > 0) {
                prevInterview = allUserInterviews[0];
                prevResult = mockStore.results.get(prevInterview.id) || null;
            }
        }

        // Calculate Round Metrics based on actual user answers
        const computeRound = (roundType, defaultCount = 30) => {
            const roundAns = answers.filter(a => a.round_type === roundType);
            const total = roundAns.length > 0 ? roundAns.length : defaultCount;
            let correct = 0;
            let skipped = 0;
            let totalScore = 0;
            let evaluatedCount = 0;

            for (const a of roundAns) {
                const isSkip = a.is_skipped === true || a.user_answer === '[SKIPPED]' || a.selectedOptionIndex === -1;
                if (isSkip) {
                    skipped++;
                } else {
                    const isCorr = roundType === 'coding'
                        ? (a.is_correct === true && Number(a.score) >= 75)
                        : (a.is_correct === true || (a.score !== undefined && Number(a.score) >= 60));
                    if (isCorr) correct++;
                    totalScore += Number(a.score) || (isCorr ? 100 : 0);
                    evaluatedCount++;
                }
            }

            const wrong = Math.max(0, total - correct - skipped);
            const attempted = total - skipped;
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
            const score = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : (correct > 0 ? Math.round((correct / total) * 100) : 0);
            return { total_questions: total, attempted, correct, wrong, skipped, accuracy, score, hasAnswers: roundAns.length > 0 };
        };

        const aptMetrics = computeRound('aptitude', 30);
        const techMetrics = computeRound('technical', 30);
        const codeMetrics = computeRound('coding', 30);
        const hrMetrics = computeRound('hr', 30);

        const activeMetrics = [aptMetrics, techMetrics, codeMetrics, hrMetrics].filter(m => m.hasAnswers);
        const metricsToUse = activeMetrics.length > 0 ? activeMetrics : [aptMetrics, techMetrics, codeMetrics, hrMetrics];

        const totalQuestions = metricsToUse.reduce((acc, m) => acc + m.total_questions, 0);
        const totalCorrect = metricsToUse.reduce((acc, m) => acc + m.correct, 0);
        const totalSkipped = metricsToUse.reduce((acc, m) => acc + (m.skipped || 0), 0);
        const totalWrong = metricsToUse.reduce((acc, m) => acc + m.wrong, 0);
        const totalAttempted = totalQuestions - totalSkipped;
        const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
        const completionPercentage = totalQuestions > 0 ? Math.round((totalAttempted / totalQuestions) * 100) : 100;
        const overallScore = Math.round(metricsToUse.reduce((acc, m) => acc + m.score, 0) / metricsToUse.length);

        // Improvement calculation against previous attempt
        const formatDiff = (curr, prev) => {
            if (prev === null || prev === undefined || isNaN(prev)) return '+0%';
            const diff = curr - prev;
            return diff >= 0 ? `+${diff}%` : `${diff}%`;
        };

        const overallImprovement = prevInterview ? formatDiff(overallScore, prevInterview.overall_score) : '+0%';
        const aptImprovement = prevResult?.aptitude_summary ? formatDiff(aptMetrics.score, prevResult.aptitude_summary.score) : '+0%';
        const techImprovement = prevResult?.technical_summary ? formatDiff(techMetrics.score, prevResult.technical_summary.score) : '+0%';
        const codeImprovement = prevResult?.coding_summary ? formatDiff(codeMetrics.score, prevResult.coding_summary.score) : '+0%';
        const hrImprovement = prevResult?.hr_summary ? formatDiff(hrMetrics.score, prevResult.hr_summary.score) : '+0%';

        const aiReport = await generateFinalReport({ interview, answers });

        const performanceLevel = aiReport.performance_level || (
            overallScore >= 90 ? 'Exceptional Readiness'
            : overallScore >= 80 ? 'Strong Candidate'
            : overallScore >= 70 ? 'Proficient'
            : overallScore >= 60 ? 'Developing Foundations'
            : 'Needs Intensive Preparation'
        );

        // Clean database-compatible record matching PostgreSQL schema
        const dbResultRecord = {
            id: randomUUID(),
            interview_id: id,
            user_id: userId,
            overall_score: overallScore,
            overall_summary: aiReport.overall_summary || 'The candidate has successfully completed the assessment.',
            aptitude_summary: {
                ...(aiReport.aptitude_summary || {}),
                round_name: 'Aptitude & Logic',
                total_questions: aptMetrics.total_questions,
                attempted: aptMetrics.attempted,
                correct: aptMetrics.correct,
                wrong: aptMetrics.wrong,
                skipped: aptMetrics.skipped,
                accuracy: aptMetrics.accuracy,
                score: aptMetrics.score,
                percentage: aptMetrics.score,
                improvement: aptImprovement
            },
            technical_summary: {
                ...(aiReport.technical_summary || {}),
                round_name: 'Technical Architecture',
                total_questions: techMetrics.total_questions,
                attempted: techMetrics.attempted,
                correct: techMetrics.correct,
                wrong: techMetrics.wrong,
                skipped: techMetrics.skipped,
                accuracy: techMetrics.accuracy,
                score: techMetrics.score,
                percentage: techMetrics.score,
                improvement: techImprovement
            },
            coding_summary: {
                ...(aiReport.coding_summary || {}),
                round_name: 'Coding & DSA (C++)',
                total_questions: codeMetrics.total_questions,
                attempted: codeMetrics.attempted,
                correct: codeMetrics.correct,
                wrong: codeMetrics.wrong,
                skipped: codeMetrics.skipped,
                accuracy: codeMetrics.accuracy,
                score: codeMetrics.score,
                percentage: codeMetrics.score,
                improvement: codeImprovement
            },
            hr_summary: {
                ...(aiReport.hr_summary || {}),
                round_name: 'HR & Behavioral',
                total_questions: hrMetrics.total_questions,
                attempted: hrMetrics.attempted,
                correct: hrMetrics.correct,
                wrong: hrMetrics.wrong,
                skipped: hrMetrics.skipped,
                accuracy: hrMetrics.accuracy,
                score: hrMetrics.score,
                percentage: hrMetrics.score,
                improvement: hrImprovement
            },
            recommended_topics: {
                topics: aiReport.recommended_topics || [],
                performance_level: performanceLevel,
                overall_performance: {
                    total_questions: totalQuestions,
                    attempted: totalAttempted,
                    correct: totalCorrect,
                    wrong: totalWrong,
                    skipped: totalSkipped,
                    accuracy: overallAccuracy,
                    completion_percentage: completionPercentage,
                    percentage: overallScore,
                    score: overallScore,
                    performance_level: performanceLevel,
                    improvement: overallImprovement
                },
                previous_attempt_comparison: prevInterview ? {
                    has_previous: true,
                    previous_interview_id: prevInterview.id,
                    previous_date: prevInterview.completed_at || prevInterview.created_at,
                    previous_score: prevInterview.overall_score || 0,
                    current_score: overallScore,
                    score_difference: formatDiff(overallScore, prevInterview.overall_score),
                    accuracy_difference: prevResult?.overall_performance?.accuracy !== undefined
                        ? formatDiff(overallAccuracy, prevResult.overall_performance.accuracy)
                        : '+0%'
                } : { has_previous: false },
                weak_topics: aiReport.weak_topics || [],
                strong_topics: aiReport.strong_topics || [],
                top_priorities: aiReport.top_priorities || [
                    'Master edge case handling in coding assessments.',
                    'Deepen system design architecture and database indexing.',
                    'Structure behavioral responses using quantifiable STAR metrics.'
                ]
            },
            readiness_rating: aiReport.readiness_rating || (overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Nearly Ready' : 'Developing'),
            created_at: new Date().toISOString()
        };

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            try {
                const { error: updErr } = await db
                    .from('interviews')
                    .update({
                        status: 'completed',
                        overall_score: overallScore,
                        completed_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .eq('user_id', userId);

                if (updErr) {
                    console.error('[Supabase Error] finalizeInterview status update:', updErr.message);
                    return res.status(500).json({ success: false, error: 'Failed to update interview status in database: ' + updErr.message });
                }

                const { error: resErr } = await db
                    .from('interview_results')
                    .upsert([dbResultRecord], { onConflict: 'interview_id' });

                if (resErr) {
                    console.error('[Supabase Error] finalizeInterview results upsert:', resErr.message);
                    return res.status(500).json({ success: false, error: 'Failed to persist final results to database: ' + resErr.message });
                }
            } catch (supErr) {
                console.error('[Supabase Exception] finalizeInterview:', supErr.message);
                return res.status(500).json({ success: false, error: 'Database exception during finalization: ' + supErr.message });
            }
        }

        interview.status = 'completed';
        interview.overall_score = overallScore;
        interview.completed_at = new Date().toISOString();
        mockStore.interviews.set(id, interview);
        mockStore.results.set(id, dbResultRecord);

        const fullFrontendResults = formatResultsForFrontend(dbResultRecord);

        return res.json({
            success: true,
            message: 'Interview finalized successfully',
            results: fullFrontendResults
        });
    } catch (err) {
        next(err);
    }
};

export default {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterviewProgress,
    finalizeInterview
};
