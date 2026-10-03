/**
 * Auth Page Controller (Login & Signup)
 */
document.addEventListener('DOMContentLoaded', () => {
    // If user is already logged in on login or signup pages, redirect to dashboard
    if (window.authManager?.isAuthenticated() && (window.location.pathname.includes('login') || window.location.pathname.includes('signup'))) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Password visibility toggle
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.target.closest('.password-input-wrap').querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = '🙈';
            } else {
                input.type = 'password';
                btn.textContent = '👁️';
            }
        });
    });

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!email || !password) {
                window.Toast.error('Please fill in all fields.');
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Signing In...';

                await window.authManager.signIn(email, password);
                window.Toast.success('Login successful! Redirecting...');

                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect') || 'dashboard.html';

                setTimeout(() => {
                    window.location.href = redirect;
                }, 700);
            } catch (err) {
                console.error('Login Error:', err);
                window.Toast.error(err.message || 'Login failed. Check your credentials.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In';
            }
        });
    }

    // Signup Form Handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password')?.value;
            const submitBtn = signupForm.querySelector('button[type="submit"]');

            if (!fullName || !email || !password) {
                window.Toast.error('Please fill in all required fields.');
                return;
            }

            if (password.length < 6) {
                window.Toast.error('Password must be at least 6 characters.');
                return;
            }

            if (confirmPassword && password !== confirmPassword) {
                window.Toast.error('Passwords do not match.');
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Creating Account...';

                await window.authManager.signUp(email, password, fullName);
                window.Toast.success('Account created successfully! Welcome aboard.');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            } catch (err) {
                console.error('Signup Error:', err);
                window.Toast.error(err.message || 'Registration failed. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account';
            }
        });
    }
});
