/**
 * User Profile Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.authManager?.requireAuth()) return;

    await loadUserProfile();
    setupProfileForm();
});

async function loadUserProfile() {
    try {
        const res = await window.API.getProfile();
        if (res.success && res.profile) {
            const p = res.profile;
            const stats = res.stats || {};

            document.getElementById('profile-name-header').textContent = p.full_name || 'Candidate';
            document.getElementById('profile-email-header').textContent = p.email;
            document.getElementById('profile-avatar-char').textContent = (p.full_name || p.email || 'U').charAt(0).toUpperCase();

            // Populate form fields
            const nameInput = document.getElementById('edit-name');
            const targetRoleSelect = document.getElementById('edit-target-role');
            const expLevelSelect = document.getElementById('edit-exp-level');
            const bioInput = document.getElementById('edit-bio');

            if (nameInput) nameInput.value = p.full_name || '';
            if (targetRoleSelect) targetRoleSelect.value = p.target_role || 'Software Developer';
            if (expLevelSelect) expLevelSelect.value = p.experience_level || 'Intermediate';
            if (bioInput) bioInput.value = p.bio || '';

            // Stats
            document.getElementById('profile-stat-attempted').textContent = stats.interviewsAttempted || 0;
            document.getElementById('profile-stat-completed').textContent = stats.interviewsCompleted || 0;
            document.getElementById('profile-stat-avg').textContent = `${stats.averageScore || 0}%`;
        }
    } catch (err) {
        console.error('Error loading profile:', err);
        window.Toast.error('Could not load user profile.');
    }
}

function setupProfileForm() {
    const form = document.getElementById('profile-edit-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('edit-name').value.trim();
        const targetRole = document.getElementById('edit-target-role').value;
        const expLevel = document.getElementById('edit-exp-level').value;
        const bio = document.getElementById('edit-bio').value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Saving Changes...';

            const res = await window.API.updateProfile({
                full_name: fullName,
                target_role: targetRole,
                experience_level: expLevel,
                bio: bio
            });

            if (res.success) {
                window.Toast.success('Profile updated successfully!');
                document.getElementById('profile-name-header').textContent = fullName;
                // Update local storage user info
                const user = window.authManager.getUser();
                if (user) {
                    user.full_name = fullName;
                    localStorage.setItem('ai_interview_user', JSON.stringify(user));
                }
            }
        } catch (err) {
            console.error('Update profile error:', err);
            window.Toast.error(err.message || 'Failed to update profile.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Save Profile Changes';
        }
    });
}
