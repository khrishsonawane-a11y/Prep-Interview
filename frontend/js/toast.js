/**
 * Toast Notification System
 */
const Toast = {
    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    },

    show(message, type = 'info', duration = 3500) {
        this.init();
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '<i data-lucide="check-circle" style="color:var(--accent-emerald); width:18px; height:18px;"></i>',
            error: '<i data-lucide="alert-circle" style="color:var(--accent-rose); width:18px; height:18px;"></i>',
            warning: '<i data-lucide="alert-triangle" style="color:var(--accent-amber); width:18px; height:18px;"></i>',
            info: '<i data-lucide="info" style="color:var(--accent-blue); width:18px; height:18px;"></i>'
        };

        toast.innerHTML = `
            <span class="toast-icon-wrap" style="display:inline-flex; align-items:center;">${icons[type] || icons.info}</span>
            <span style="font-size:0.9rem; line-height:1.4;">${message}</span>
        `;

        container.appendChild(toast);
        if (window.renderIcons) window.renderIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => toast.remove(), 250);
        }, duration);
    },

    success(msg, duration) { this.show(msg, 'success', duration); },
    error(msg, duration) { this.show(msg, 'error', duration); },
    warning(msg, duration) { this.show(msg, 'warning', duration); },
    info(msg, duration) { this.show(msg, 'info', duration); }
};

window.Toast = Toast;
