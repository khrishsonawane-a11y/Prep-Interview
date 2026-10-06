/**
 * Supabase Client Integration & Auth Layer
 */
class SupabaseAuthManager {
    constructor() {
        this.client = null;
        this.init();
    }

    init() {
        const url = window.CONFIG?.SUPABASE_URL;
        const key = window.CONFIG?.SUPABASE_ANON_KEY;

        const isRealSupabase = url && key && !url.includes('placeholder-project') && typeof window.supabase !== 'undefined';

        if (isRealSupabase) {
            try {
                this.client = window.supabase.createClient(url, key);
                console.log('Supabase Auth Client initialized successfully');
            } catch (err) {
                console.warn('Failed to initialize Supabase client:', err);
            }
        }
    }

    async signUp(email, password, fullName) {
        if (this.client) {
            const { data, error } = await this.client.auth.signUp({
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

            // Attempt immediate login if auto-confirm is enabled
            try {
                const loginRes = await this.client.auth.signInWithPassword({ email, password });
                if (loginRes.data?.session) {
                    this.saveSession(loginRes.data.session.access_token, loginRes.data.user);
                    return { success: true, user: loginRes.data.user, session: loginRes.data.session };
                }
            } catch (loginErr) {
                console.warn('Auto sign-in pending email confirmation:', loginErr.message);
            }

            return {
                success: true,
                user: data?.user,
                session: null,
                message: 'Account created! Please verify your email if required, then sign in.'
            };
        }

        // Only fall back to local mock if Supabase URL is explicitly not configured
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

        throw new Error('Supabase client failed to initialize. Please reload the page.');
    }

    async signIn(email, password) {
        if (this.client) {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;

            if (data?.session) {
                this.saveSession(data.session.access_token, data.user);
            }
            return data;
        }

        // Only fall back to local mock if Supabase URL is explicitly not configured
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

        throw new Error('Supabase client failed to initialize. Please reload the page.');
    }

    async signOut() {
        if (this.client) {
            try {
                await this.client.auth.signOut();
            } catch (err) {
                console.warn('SignOut error:', err);
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
