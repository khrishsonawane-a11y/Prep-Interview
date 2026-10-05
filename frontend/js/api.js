/**
 * Centralized API Client
 * Wraps fetch calls with Authorization headers, error interceptors, and response parsing.
 */
const API = {
    async request(endpoint, options = {}) {
        const baseUrl = window.CONFIG?.API_BASE_URL || '/api';
        const url = `${baseUrl}${endpoint}`;
        const token = window.authManager?.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('Session expired or unauthorized. Redirecting to login.');
                    // window.authManager.signOut();
                }
                throw new Error(data.error || `HTTP error ${response.status}`);
            }

            return data;
        } catch (err) {
            console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
            throw err;
        }
    },

    // Interview Endpoints
    createInterview(payload) {
        return this.request('/interviews', { method: 'POST', body: JSON.stringify(payload) });
    },
    getInterviews(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/interviews${query ? `?${query}` : ''}`);
    },
    getInterviewById(id) {
        return this.request(`/interviews/${id}`);
    },
    updateInterviewProgress(id, payload) {
        return this.request(`/interviews/${id}/progress`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    finalizeInterview(id) {
        return this.request(`/interviews/${id}/finalize`, { method: 'POST' });
    },

    // Aptitude Endpoints
    getAptitudeQuestions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/aptitude/questions${query ? `?${query}` : ''}`);
    },
    submitAptitudeAnswer(payload) {
        return this.request('/aptitude/answers', { method: 'POST', body: JSON.stringify(payload) });
    },

    // Technical Endpoints
    getTechnicalQuestions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/technical/questions${query ? `?${query}` : ''}`);
    },
    getTechnicalQuestion(payload) {
        return this.request('/technical/question', { method: 'POST', body: JSON.stringify(payload) });
    },
    evaluateTechnicalAnswer(payload) {
        return this.request('/technical/evaluate', { method: 'POST', body: JSON.stringify(payload) });
    },

    // Coding Endpoints
    getCodingQuestions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/coding/questions${query ? `?${query}` : ''}`);
    },
    getCodingQuestion(payload) {
        return this.request('/coding/question', { method: 'POST', body: JSON.stringify(payload) });
    },
    runCode(payload) {
        return this.request('/coding/run', { method: 'POST', body: JSON.stringify(payload) });
    },
    submitCode(payload) {
        return this.request('/coding/submit', { method: 'POST', body: JSON.stringify(payload) });
    },

    // HR Endpoints
    getHRQuestions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/hr/questions${query ? `?${query}` : ''}`);
    },
    getHRQuestion(payload) {
        return this.request('/hr/question', { method: 'POST', body: JSON.stringify(payload) });
    },
    evaluateHRAnswer(payload) {
        return this.request('/hr/evaluate', { method: 'POST', body: JSON.stringify(payload) });
    },

    // Profile Endpoints
    getProfile() {
        return this.request('/profile');
    },
    updateProfile(payload) {
        return this.request('/profile', { method: 'PUT', body: JSON.stringify(payload) });
    }
};

window.API = API;
