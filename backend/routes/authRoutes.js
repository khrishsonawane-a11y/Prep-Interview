import express from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

/**
 * Enhanced Signup Endpoint
 * Uses Supabase Admin API with email_confirm: true so candidates can log in immediately
 * without encountering "Invalid credentials" due to pending email verification.
 */
router.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                error: 'Full name, email, and password are required.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long.'
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedName = fullName.trim();

        if (isSupabaseConfigured() && supabaseAdmin) {
            let userId = null;
            let userObj = null;

            // 1. Attempt creating user with auto-confirmed email
            const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: trimmedEmail,
                password: password,
                email_confirm: true,
                user_metadata: {
                    full_name: trimmedName
                }
            });

            if (!createError && createData?.user) {
                userId = createData.user.id;
                userObj = createData.user;
            } else if (createError && (createError.message?.toLowerCase().includes('already') || createError.status === 422)) {
                // User already exists in auth.users - find and confirm them
                const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = listData?.users?.find(u => u.email?.toLowerCase() === trimmedEmail);

                if (existingUser) {
                    userId = existingUser.id;
                    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        password: password,
                        email_confirm: true,
                        user_metadata: {
                            full_name: trimmedName
                        }
                    });

                    if (updateError) {
                        return res.status(400).json({
                            success: false,
                            error: updateError.message || 'Account already registered. Please sign in.'
                        });
                    }
                    userObj = updateData?.user || existingUser;
                } else {
                    return res.status(400).json({
                        success: false,
                        error: createError.message || 'Registration failed.'
                    });
                }
            } else if (createError) {
                return res.status(400).json({
                    success: false,
                    error: createError.message || 'Registration failed.'
                });
            }

            // 2. Ensure profile is seeded/upserted in public.profiles table
            if (userId) {
                try {
                    await supabaseAdmin
                        .from('profiles')
                        .upsert([{
                            id: userId,
                            email: trimmedEmail,
                            full_name: trimmedName,
                            target_role: 'Software Developer',
                            experience_level: 'Intermediate',
                            updated_at: new Date().toISOString()
                        }], { onConflict: 'id' });
                } catch (profileErr) {
                    console.warn('[authRoutes] Profile auto-upsert warning:', profileErr.message);
                }
            }

            return res.json({
                success: true,
                message: 'Account created and activated successfully.',
                user: userObj
            });
        }

        // Mock / Offline Fallback
        const mockUser = {
            id: 'demo-user-' + Date.now(),
            email: trimmedEmail,
            user_metadata: { full_name: trimmedName }
        };

        return res.json({
            success: true,
            message: 'Account created (offline mode).',
            user: mockUser
        });
    } catch (err) {
        console.error('[authRoutes] Signup error:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Internal server error during account creation.'
        });
    }
});

/**
 * Auto-Confirm User Endpoint
 * If an existing user has an unconfirmed email status, this endpoint confirms it immediately
 * so they can log in with their password without email barriers.
 */
router.post('/auto-confirm', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required.' });
        }

        const trimmedEmail = email.trim().toLowerCase();

        if (isSupabaseConfigured() && supabaseAdmin) {
            const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
            if (listError) {
                return res.status(500).json({ success: false, error: listError.message });
            }

            const user = listData?.users?.find(u => u.email?.toLowerCase() === trimmedEmail);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User account not found.' });
            }

            if (!user.email_confirmed_at) {
                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
                    email_confirm: true
                });
                if (updateError) {
                    return res.status(500).json({ success: false, error: updateError.message });
                }
            }

            // Ensure profile exists in public.profiles
            try {
                await supabaseAdmin
                    .from('profiles')
                    .upsert([{
                        id: user.id,
                        email: trimmedEmail,
                        full_name: user.user_metadata?.full_name || trimmedEmail.split('@')[0],
                        target_role: 'Software Developer',
                        experience_level: 'Intermediate',
                        updated_at: new Date().toISOString()
                    }], { onConflict: 'id' });
            } catch (pErr) {
                console.warn('[authRoutes] auto-confirm profile warning:', pErr.message);
            }

            return res.json({ success: true, message: 'Account confirmed successfully.' });
        }

        return res.json({ success: true, message: 'Offline mode active.' });
    } catch (err) {
        console.error('[authRoutes] auto-confirm error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
