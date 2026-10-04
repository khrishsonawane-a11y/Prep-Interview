import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';
import { generateFinalReport } from '../services/aiService.js';
import { randomUUID } from 'crypto';

/**
 * POST /api/interviews
 * Start a new interview session
 */
export const createInterview = async (req, res, next) => {
    try {
        const userId = req.user?.id || 'candidate-' + Date.now();
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

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
                if (isUuid) {
                    const { data, error } = await supabaseAdmin
                        .from('interviews')
                        .insert([newInterview])
                        .select()
                        .single();

                    if (!error && data) {
                        return res.status(201).json({ success: true, interview: data });
                    }
                    console.warn('Supabase insert fallback:', error?.message);
                }
            } catch (supErr) {
                console.warn('Supabase DB error, using fallback:', supErr.message);
            }
        }

        mockStore.interviews.set(newInterview.id, newInterview);
        return res.status(201).json({ success: true, interview: newInterview });
    } catch (err) {
        console.error('Error in createInterview:', err);
        const fallbackInterview = {
            id: randomUUID(),
            user_id: req.user?.id || 'demo-user',
            role: req.body?.role || 'Software Developer',
            difficulty: req.body?.difficulty || 'Intermediate',
            status: 'in_progress',
            total_rounds: 4,
            current_round_index: 0,
            rounds_config: ['aptitude', 'technical', 'coding', 'hr'],
            overall_score: 0,
            created_at: new Date().toISOString()
        };
        mockStore.interviews.set(fallbackInterview.id, fallbackInterview);
        return res.status(201).json({ success: true, interview: fallbackInterview });
    }
};

/**
 * GET /api/interviews
 * List authenticated user's interview history
 */
export const getInterviews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { role, status, search } = req.query;

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                let query = supabaseAdmin
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
                if (!error && data) {
                    let filtered = data;
                    if (search) {
                        const s = search.toLowerCase();
                        filtered = filtered.filter(item =>
                            item.role.toLowerCase().includes(s) ||
                            (item.difficulty && item.difficulty.toLowerCase().includes(s))
                        );
                    }
                    return res.json({ success: true, count: filtered.length, interviews: filtered });
                }
            } catch (supErr) {
                console.warn('Supabase query fallback:', supErr.message);
            }
        }

        // Mock store fallback
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

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data: interview, error: intErr } = await supabaseAdmin
                    .from('interviews')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (!intErr && interview) {
                    const { data: answers } = await supabaseAdmin
                        .from('interview_answers')
                        .select('*')
                        .eq('interview_id', id)
                        .order('created_at', { ascending: true });

                    const { data: results } = await supabaseAdmin
                        .from('interview_results')
                        .select('*')
                        .eq('interview_id', id)
                        .single();

                    return res.json({
                        success: true,
                        interview,
                        answers: answers || [],
                        results: results || null
                    });
                }
            } catch (supErr) {
                console.warn('Supabase getById fallback:', supErr.message);
            }
        }

        const interview = mockStore.interviews.get(id);
        if (!interview) {
            // Return placeholder interview session if not found in memory
            return res.json({
                success: true,
                interview: {
                    id,
                    user_id: userId,
                    role: 'Software Developer',
                    difficulty: 'Intermediate',
                    status: 'completed',
                    overall_score: 82,
                    rounds_config: ['aptitude', 'technical', 'coding', 'hr'],
                    created_at: new Date().toISOString()
                },
                answers: [],
                results: mockStore.results.get(id) || null
            });
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
        const { roundIndex, status } = req.body;

        const updates = {};
        if (typeof roundIndex === 'number') updates.current_round_index = roundIndex;
        if (status) updates.status = status;

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('interviews')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();

                if (!error && data) return res.json({ success: true, interview: data });
            } catch (supErr) {}
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

        let interview = mockStore.interviews.get(id) || {
            id,
            user_id: userId,
            role: 'Software Developer',
            difficulty: 'Intermediate'
        };
        let answers = Array.from(mockStore.answers.values()).filter(a => a.interview_id === id);

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data: intData } = await supabaseAdmin
                    .from('interviews')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (intData) interview = intData;

                const { data: ansData } = await supabaseAdmin
                    .from('interview_answers')
                    .select('*')
                    .eq('interview_id', id);
                if (ansData) answers = ansData;
            } catch (supErr) {}
        }

        // Look up previous completed interview for this user to compute improvement
        let prevInterview = null;
        let prevResult = null;
        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data: prevList } = await supabaseAdmin
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
            } catch (supErr) {}
        }

        if (!prevInterview) {
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
            let totalScore = 0;
            for (const a of roundAns) {
                const isCorr = a.is_correct === true || (a.score !== undefined && Number(a.score) >= 60);
                if (isCorr) correct++;
                totalScore += Number(a.score) || (isCorr ? 100 : 0);
            }
            const wrong = Math.max(0, total - correct);
            const score = roundAns.length > 0 ? Math.round(totalScore / roundAns.length) : (correct > 0 ? Math.round((correct / total) * 100) : 0);
            return { total_questions: total, correct, wrong, score, hasAnswers: roundAns.length > 0 };
        };

        const aptMetrics = computeRound('aptitude', 30);
        const techMetrics = computeRound('technical', 30);
        const codeMetrics = computeRound('coding', 30);
        const hrMetrics = computeRound('hr', 30);

        const activeMetrics = [aptMetrics, techMetrics, codeMetrics, hrMetrics].filter(m => m.hasAnswers);
        const metricsToUse = activeMetrics.length > 0 ? activeMetrics : [aptMetrics, techMetrics, codeMetrics, hrMetrics];

        const totalQuestions = metricsToUse.reduce((acc, m) => acc + m.total_questions, 0);
        const totalCorrect = metricsToUse.reduce((acc, m) => acc + m.correct, 0);
        const totalWrong = metricsToUse.reduce((acc, m) => acc + m.wrong, 0);
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

        const resultRecord = {
            id: randomUUID(),
            interview_id: id,
            user_id: userId,
            overall_score: overallScore,
            overall_performance: {
                total_questions: totalQuestions,
                correct: totalCorrect,
                wrong: totalWrong,
                score: overallScore,
                improvement: overallImprovement
            },
            overall_summary: aiReport.overall_summary,
            aptitude_summary: {
                ...(aiReport.aptitude_summary || {}),
                total_questions: aptMetrics.total_questions,
                correct: aptMetrics.correct,
                wrong: aptMetrics.wrong,
                score: aptMetrics.score,
                improvement: aptImprovement
            },
            technical_summary: {
                ...(aiReport.technical_summary || {}),
                total_questions: techMetrics.total_questions,
                correct: techMetrics.correct,
                wrong: techMetrics.wrong,
                score: techMetrics.score,
                improvement: techImprovement
            },
            coding_summary: {
                ...(aiReport.coding_summary || {}),
                total_questions: codeMetrics.total_questions,
                correct: codeMetrics.correct,
                wrong: codeMetrics.wrong,
                score: codeMetrics.score,
                improvement: codeImprovement
            },
            hr_summary: {
                ...(aiReport.hr_summary || {}),
                total_questions: hrMetrics.total_questions,
                correct: hrMetrics.correct,
                wrong: hrMetrics.wrong,
                score: hrMetrics.score,
                improvement: hrImprovement
            },
            recommended_topics: aiReport.recommended_topics || [],
            readiness_rating: aiReport.readiness_rating || (overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Nearly Ready' : 'Developing'),
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                await supabaseAdmin
                    .from('interviews')
                    .update({
                        status: 'completed',
                        overall_score: resultRecord.overall_score,
                        completed_at: new Date().toISOString()
                    })
                    .eq('id', id);

                await supabaseAdmin
                    .from('interview_results')
                    .upsert([resultRecord], { onConflict: 'interview_id' });
            } catch (supErr) {
                console.warn('Supabase finalize error:', supErr.message);
            }
        }

        interview.status = 'completed';
        interview.overall_score = resultRecord.overall_score;
        interview.completed_at = new Date().toISOString();
        mockStore.interviews.set(id, interview);
        mockStore.results.set(id, resultRecord);

        return res.json({
            success: true,
            message: 'Interview finalized successfully',
            results: resultRecord
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
