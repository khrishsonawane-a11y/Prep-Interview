/**
 * Dynamic Navbar Component
 */
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
});

function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-mount');
    if (!navPlaceholder) return;

    const isAuth = window.authManager?.isAuthenticated();
    const user = window.authManager?.getUser();
    const currentPath = window.location.pathname;

    const navHtml = `
    <nav class="navbar">
      <div class="container nav-container">
        <a href="index.html" class="nav-brand">
          <div class="brand-icon">⚡</div>
          <span>InterviewPrep<span style="color:var(--primary);">AI</span></span>
          <span class="brand-badge">PRO</span>
        </a>

        <button class="nav-toggle" id="nav-toggle-btn" aria-label="Toggle Navigation">☰</button>

        <ul class="nav-links" id="nav-links-menu">
          <li class="nav-item ${currentPath.includes('index') || currentPath === '/' ? 'active' : ''}">
            <a href="index.html">Home</a>
          </li>
          ${isAuth ? `
            <li class="nav-item ${currentPath.includes('dashboard') ? 'active' : ''}">
              <a href="dashboard.html">Dashboard</a>
            </li>
            <li class="nav-item ${currentPath.includes('interview') ? 'active' : ''}">
              <a href="interview.html">Interview</a>
            </li>
            <li class="nav-item ${currentPath.includes('history') ? 'active' : ''}">
              <a href="history.html">History</a>
            </li>
            <li class="nav-item ${currentPath.includes('profile') ? 'active' : ''}">
              <a href="profile.html">Profile</a>
            </li>
          ` : `
            <li class="nav-item"><a href="index.html#features">Features</a></li>
            <li class="nav-item"><a href="index.html#process">Interview Process</a></li>
          `}
        </ul>

        <div class="nav-auth">
          ${isAuth ? `
            <div class="user-profile-menu">
              <div class="user-avatar" title="${user?.email || 'Candidate'}">
                ${(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span class="user-name-display">${user?.full_name || 'Candidate'}</span>
              <button class="btn btn-secondary btn-sm" id="nav-logout-btn">Logout</button>
            </div>
          ` : `
            <a href="login.html" class="btn btn-secondary btn-sm">Log In</a>
            <a href="signup.html" class="btn btn-primary btn-sm">Get Started</a>
          `}
        </div>
      </div>
    </nav>
    `;

    navPlaceholder.innerHTML = navHtml;

    // Mobile Toggle
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const linksMenu = document.getElementById('nav-links-menu');
    if (toggleBtn && linksMenu) {
        toggleBtn.addEventListener('click', () => {
            linksMenu.classList.toggle('show');
        });
    }

    // Logout Action
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.authManager.signOut();
        });
    }
}
