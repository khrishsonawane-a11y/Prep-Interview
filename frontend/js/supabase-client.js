/**
 * Supabase Client Integration & Auth Layer
 * Production Frontend Auth Manager with Multi-Tier Fallback & Resilient Loading
 */
class SupabaseAuthManager {
    constructor() {
        this.client = null;
        this.initPromise = null;
        this.init();
    }

    async init() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            let url = window.CONFIG?.SUPABASE_URL;
            let key = window.CONFIG?.SUPABASE_ANON_KEY;

            // Step 1: If config is missing or contains placeholders, fetch dynamically from public config API
            if (!url || !key || url.includes('placeholder-project')) {
                try {
                    const apiBase = window.CONFIG?.API_BASE_URL || '/api';
                    const res = await fetch(`${apiBase}/config`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.SUPABASE_URL && data.SUPABASE_ANON_KEY) {
                            url = data.SUPABASE_URL;
                            key = data.SUPABASE_ANON_KEY;
                            if (window.CONFIG) {
                                window.CONFIG.SUPABASE_URL = url;
                                window.CONFIG.SUPABASE_ANON_KEY = key;
                            }
                        }
                    }
                } catch (fetchErr) {
                    console.warn('[SupabaseAuthManager] Could not fetch public config from backend:', fetchErr.message);
                }
            }

            // Step 2: Ensure the Supabase JS library is loaded in window
            if (typeof window.supabase === 'undefined') {
                // Poll briefly in case CDN script tag is still parsing
                for (let i = 0; i < 20; i++) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    if (typeof window.supabase !== 'undefined') break;
                }

                // If still undefined, dynamically inject local bundle or CDN
                if (typeof window.supabase === 'undefined') {
                    try {
                        await this.loadScript('js/libs/supabase.js').catch(() => 
                            this.loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2')
                        );
                    } catch (loadErr) {
                        console.error('[SupabaseAuthManager] Failed to load Supabase JS library script:', loadErr);
                    }
                }
            }

            // Step 3: Initialize Supabase Client
            const isRealSupabase = url && key && !url.includes('placeholder') && typeof window.supabase !== 'undefined';

            if (isRealSupabase) {
                try {
                    this.client = window.supabase.createClient(url, key, {
                        auth: {
                            persistSession: true,
                            autoRefreshToken: true,
                            detectSessionInUrl: true
                        }
                    });
                    console.log('[SupabaseAuthManager] Supabase Auth Client initialized successfully.');
                    return this.client;
                } catch (err) {
                    console.error('[SupabaseAuthManager] Failed to initialize Supabase client instance:', err);
                }
            }

            return null;
        })();

        return this.initPromise;
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
        });
    }

    async getClient() {
        if (this.client) return this.client;
        await this.init();
        return this.client;
    }

    async signUp(email, password, fullName) {
        const client = await this.getClient();
        const apiBase = window.CONFIG?.API_BASE_URL || '/api';

        // Step 1: Attempt auto-confirmed signup via backend API
        try {
            const signupRes = await fetch(`${apiBase}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName })
            });

            const signupData = await signupRes.json();

            if (!signupRes.ok || !signupData.success) {
                throw new Error(signupData.error || 'Registration failed.');
            }

            // Step 2: Now that user is confirmed in Supabase Auth, sign in immediately
            if (client) {
                const { data: signinData, error: signinError } = await client.auth.signInWithPassword({
                    email,
                    password
                });

                if (signinError) throw signinError;

                if (signinData?.session) {
                    this.saveSession(signinData.session.access_token, signinData.user);
                    return { success: true, user: signinData.user, session: signinData.session };
                }
            }

            return {
                success: true,
                user: signupData.user,
                session: null,
                message: 'Account created! Please sign in with your credentials.'
            };
        } catch (backendErr) {
            console.warn('[SupabaseAuthManager] Backend signup notice, trying client fallback:', backendErr.message);

            // Step 3: Direct Client Fallback if backend route is unreachable
            if (client) {
                const { data, error } = await client.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });
                if (error) throw error;

                if (data?.session) {
                    this.saveSession(data.session.access_token, data.user);
                    return { success: true, user: data.user, session: data.session };
                }

                try {
                    const loginRes = await client.auth.signInWithPassword({ email, password });
                    if (loginRes.data?.session) {
                        this.saveSession(loginRes.data.session.access_token, loginRes.data.user);
                        return { success: true, user: loginRes.data.user, session: loginRes.data.session };
                    }
                } catch (loginErr) {
                    console.warn('[SupabaseAuthManager] Direct auto sign-in notice:', loginErr.message);
                }

                return {
                    success: true,
                    user: data?.user,
                    session: null,
                    message: 'Account created! Please check your email for confirmation if required, or sign in.'
                };
            }

            // Mock / Offline fallback
            if (!window.CONFIG?.SUPABASE_URL || window.CONFIG?.SUPABASE_URL.includes('placeholder')) {
                const user = {
                    id: 'demo-user-123',
                    email,
                    user_metadata: { full_name: fullName }
                };
                const token = 'mock_' + user.id;
                this.saveSession(token, user);
                return { success: true, user, session: { access_token: token } };
            }

            throw new Error(backendErr.message || 'Supabase client failed to initialize. Please reload the page.');
        }
    }

    async signIn(email, password) {
        const client = await this.getClient();
        const apiBase = window.CONFIG?.API_BASE_URL || '/api';

        if (client) {
            let { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            // If sign-in failed due to unconfirmed email, auto-confirm via backend and retry
            if (error && (error.message?.toLowerCase().includes('not confirmed') || error.code === 'email_not_confirmed')) {
                try {
                    console.log('[SupabaseAuthManager] Auto-confirming unconfirmed email account...');
                    const confirmRes = await fetch(`${apiBase}/auth/auto-confirm`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    if (confirmRes.ok) {
                        const retryRes = await client.auth.signInWithPassword({ email, password });
                        if (!retryRes.error && retryRes.data?.session) {
                            data = retryRes.data;
                            error = null;
                        }
                    }
                } catch (autoErr) {
                    console.warn('[SupabaseAuthManager] Auto-confirm retry notice:', autoErr.message);
                }
            }

            if (error) throw error;

            if (data?.session) {
                this.saveSession(data.session.access_token, data.user);
            }
            return data;
        }

        // Only fall back to local mock if Supabase URL is explicitly not configured or placeholder
        if (!window.CONFIG?.SUPABASE_URL || window.CONFIG?.SUPABASE_URL.includes('placeholder')) {
            const user = {
                id: 'demo-user-123',
                email,
                user_metadata: { full_name: email.split('@')[0] }
            };
            const token = 'mock_' + user.id;
            this.saveSession(token, user);
            return { user, session: { access_token: token } };
        }

        throw new Error('Supabase client failed to initialize. Please check your network connection and reload.');
    }

    async signOut() {
        const client = await this.getClient();
        if (client) {
            try {
                await client.auth.signOut();
            } catch (err) {
                console.warn('[SupabaseAuthManager] SignOut warning:', err);
            }
        }
        localStorage.removeItem('ai_interview_token');
        localStorage.removeItem('ai_interview_user');
        window.location.href = 'login.html';
    }

    saveSession(token, user) {
        localStorage.setItem('ai_interview_token', token);
        localStorage.setItem('ai_interview_user', JSON.stringify({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate'
        }));
    }

    getToken() {
        return localStorage.getItem('ai_interview_token');
    }

    getUser() {
        const str = localStorage.getItem('ai_interview_user');
        try {
            return str ? JSON.parse(str) : null;
        } catch {
            return null;
        }
    }

    isAuthenticated() {
        return Boolean(this.getToken());
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
            return false;
        }
        return true;
    }
}

window.authManager = new SupabaseAuthManager();
