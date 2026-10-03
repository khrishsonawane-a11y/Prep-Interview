import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { mockStore } from '../utils/memoryStore.js';

/**
 * Authentication Middleware
 * Extracts and verifies the Supabase Bearer token from the Authorization header.
 * Attaches the verified user payload (id, email, metadata) to req.user.
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required. No bearer token provided.'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Invalid authorization token.'
            });
        }

        // 1. Mock / Dev Token check (Allows testing & local dev without remote auth)
        if (token.startsWith('mock_') || token.startsWith('demo_') || !isSupabaseConfigured()) {
            const userId = token.replace('mock_', '').replace('demo_', '') || 'demo-user-123';
            const user = {
                id: userId,
                email: `${userId}@example.com`,
                full_name: 'Candidate',
                avatar_url: ''
            };

            // Sync user profile in mock store
            if (!mockStore.profiles.has(user.id)) {
                mockStore.profiles.set(user.id, {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    target_role: 'Software Developer',
                    experience_level: 'Intermediate',
                    created_at: new Date().toISOString()
                });
            }

            req.user = user;
            req.token = token;
            return next();
        }

        // 2. Real Supabase Auth Token verification
        if (isSupabaseConfigured() && supabaseAdmin) {
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({
                    success: false,
                    error: 'Session expired or invalid token. Please log in again.'
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url || ''
            };
            req.token = token;
            return next();
        }

        return res.status(401).json({
            success: false,
            error: 'Authentication failed.'
        });
    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        return res.status(500).json({
            success: false,
            error: 'Authentication verification encountered an error.'
        });
    }
};

export default requireAuth;
