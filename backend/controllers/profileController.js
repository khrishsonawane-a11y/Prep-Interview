import { getDbClient, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';

const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);

        let profile = null;
        let interviews = [];
        let allAnswers = [];

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                // 1. Fetch profile row
                const { data: profData, error: profErr } = await db
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                if (profErr) {
                    console.error('[Supabase Error] getProfile profiles fetch:', profErr.message);
                }

                if (profData) {
                    profile = profData;
                } else {
                    // Profile does not exist yet; create it in Supabase
                    const initialProfile = {
                        id: userId,
                        email: req.user.email,
                        full_name: req.user.full_name || req.user.email.split('@')[0] || 'Candidate',
                        avatar_url: req.user.avatar_url || '',
                        target_role: 'Software Developer',
                        experience_level: 'Intermediate',
                        bio: 'Passionate developer preparing for high-impact tech roles.'
                    };

                    const { data: createdProf, error: createErr } = await db
                        .from('profiles')
                        .upsert([initialProfile], { onConflict: 'id' })
                        .select()
                        .single();

                    if (createErr) {
                        console.error('[Supabase Error] getProfile initial upsert:', createErr.message);
                        return res.status(500).json({
                            success: false,
                            error: `Failed to create initial profile in database: ${createErr.message}`
                        });
                    }

                    profile = createdProf || initialProfile;
                }

                // 2. Fetch interviews for statistics
                const { data: intData, error: intErr } = await db
                    .from('interviews')
                    .select('id, status, overall_score, role, created_at')
                    .eq('user_id', userId);

                if (intErr) {
                    console.error('[Supabase Error] getProfile interviews fetch:', intErr.message);
                }
                if (intData) interviews = intData;

                // 3. Fetch answers for accuracy statistics
                const { data: ansData, error: ansErr } = await db
                    .from('interview_answers')
                    .select('is_correct, score')
                    .eq('user_id', userId);

                if (ansErr) {
                    console.error('[Supabase Error] getProfile answers fetch:', ansErr.message);
                }
                if (ansData) allAnswers = ansData;

            } catch (supErr) {
                console.error('[Supabase Exception] getProfile:', supErr.message);
                return res.status(500).json({
                    success: false,
                    error: `Database error retrieving profile: ${supErr.message}`
                });
            }
        } else {
            profile = mockStore.profiles.get(userId) || {
                id: userId,
                email: req.user.email,
                full_name: req.user.full_name || 'Candidate',
                target_role: 'Software Developer',
                experience_level: 'Intermediate',
                bio: 'Passionate developer preparing for high-impact tech roles.',
                created_at: new Date().toISOString()
            };
            interviews = Array.from(mockStore.interviews.values()).filter(i => i.user_id === userId);
            allAnswers = Array.from(mockStore.answers.values()).filter(a => a.user_id === userId);
        }

        const totalQuestions = allAnswers.length;
        const totalCorrect = allAnswers.filter(a => a.is_correct === true || (a.score !== undefined && Number(a.score) >= 60)).length;
        const totalWrong = Math.max(0, totalQuestions - totalCorrect);

        // Calculate statistics
        const completed = interviews.filter(i => i.status === 'completed').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const attempted = interviews.length;
        const avgScore = completed.length > 0
            ? Math.round(completed.reduce((acc, curr) => acc + (Number(curr.overall_score) || 0), 0) / completed.length)
            : 80;
        const lastInterview = completed.length > 0 ? completed[0] : (interviews.length > 0 ? interviews[0] : null);

        let latestImprovement = '+0%';
        if (completed.length >= 2) {
            const diff = (Number(completed[0].overall_score) || 0) - (Number(completed[1].overall_score) || 0);
            latestImprovement = diff >= 0 ? `+${diff}%` : `${diff}%`;
        }

        return res.json({
            success: true,
            profile,
            stats: {
                interviewsAttempted: attempted,
                interviewsCompleted: completed.length,
                averageScore: avgScore,
                totalQuestions: totalQuestions,
                totalCorrect: totalCorrect,
                totalWrong: totalWrong,
                latestImprovement: latestImprovement,
                lastInterviewDate: lastInterview?.created_at || null,
                lastInterviewRole: lastInterview?.role || 'Software Developer'
            }
        });
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMock = req.isMockUser || !isSupabaseConfigured() || !isUuid(userId);
        const { full_name, target_role, experience_level, bio } = req.body;

        const profilePayload = {
            id: userId,
            email: req.user.email,
            full_name: full_name || req.user.full_name || req.user.email.split('@')[0] || 'Candidate',
            ...(target_role && { target_role }),
            ...(experience_level && { experience_level }),
            ...(bio !== undefined && { bio }),
            updated_at: new Date().toISOString()
        };

        if (!isMock && isSupabaseConfigured()) {
            const db = getDbClient(req);
            if (!db) {
                return res.status(500).json({ success: false, error: 'Database client could not be initialized.' });
            }

            try {
                const { data, error } = await db
                    .from('profiles')
                    .upsert([profilePayload], { onConflict: 'id' })
                    .select()
                    .single();

                if (error) {
                    console.error('[Supabase Error] updateProfile:', error.message);
                    return res.status(500).json({
                        success: false,
                        error: `Failed to update profile in database: ${error.message}`
                    });
                }

                return res.json({ success: true, message: 'Profile updated successfully', profile: data });
            } catch (supErr) {
                console.error('[Supabase Exception] updateProfile:', supErr.message);
                return res.status(500).json({
                    success: false,
                    error: `Database exception during profile update: ${supErr.message}`
                });
            }
        }

        const existing = mockStore.profiles.get(userId) || { id: userId, email: req.user.email };
        const updated = { ...existing, ...profilePayload };
        mockStore.profiles.set(userId, updated);

        return res.json({ success: true, message: 'Profile updated successfully', profile: updated });
    } catch (err) {
        next(err);
    }
};

export default {
    getProfile,
    updateProfile
};
