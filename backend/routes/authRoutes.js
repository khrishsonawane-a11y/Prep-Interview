import express from 'express';
import { supabaseAdmin, isSupabaseConfigured, getDbClient } from '../config/supabase.js';

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

export default router;
