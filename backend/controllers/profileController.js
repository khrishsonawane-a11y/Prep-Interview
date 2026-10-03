import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        let profile = null;
        let interviews = [];

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data: profData } = await supabaseAdmin
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (profData) profile = profData;

                const { data: intData } = await supabaseAdmin
                    .from('interviews')
                    .select('id, status, overall_score, role, created_at')
                    .eq('user_id', userId);
                if (intData) interviews = intData;
            } catch (supErr) {}
        }

        if (!profile) {
            profile = mockStore.profiles.get(userId) || {
                id: userId,
                email: req.user.email,
                full_name: req.user.full_name || 'Candidate',
                target_role: 'Software Developer',
                experience_level: 'Intermediate',
                bio: 'Passionate developer preparing for high-impact tech roles.',
                created_at: new Date().toISOString()
            };
        }

        if (interviews.length === 0) {
            interviews = Array.from(mockStore.interviews.values()).filter(i => i.user_id === userId);
        }

        // Calculate statistics
        const completed = interviews.filter(i => i.status === 'completed');
        const attempted = interviews.length;
        const avgScore = completed.length > 0
            ? Math.round(completed.reduce((acc, curr) => acc + (Number(curr.overall_score) || 0), 0) / completed.length)
            : 80;
        const lastInterview = interviews.length > 0 ? interviews[0] : null;

        return res.json({
            success: true,
            profile,
            stats: {
                interviewsAttempted: attempted,
                interviewsCompleted: completed.length,
                averageScore: avgScore,
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
        const { full_name, target_role, experience_level, bio } = req.body;

        const updates = {
            ...(full_name && { full_name }),
            ...(target_role && { target_role }),
            ...(experience_level && { experience_level }),
            ...(bio !== undefined && { bio }),
            updated_at: new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabaseAdmin) {
            try {
                const { data, error } = await supabaseAdmin
                    .from('profiles')
                    .update(updates)
                    .eq('id', userId)
                    .select()
                    .single();

                if (!error && data) {
                    return res.json({ success: true, message: 'Profile updated successfully', profile: data });
                }
            } catch (supErr) {}
        }

        const existing = mockStore.profiles.get(userId) || { id: userId, email: req.user.email };
        const updated = { ...existing, ...updates };
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
