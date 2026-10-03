/**
 * AI Interview Preparation System - Frontend Config
 * Production Configuration linked to Supabase project
 */
const CONFIG = {
    // Backend API base URL (automatically adapts to local dev & production cloud deployments)
    API_BASE_URL: (() => {
        if (window.APP_CONFIG?.API_BASE_URL) return window.APP_CONFIG.API_BASE_URL;
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal && window.location.port && window.location.port !== '5000') {
            return 'http://localhost:5000/api';
        }
        return '/api';
    })(),

    // Live Supabase project credentials for real user persistence
    SUPABASE_URL: window.APP_CONFIG?.SUPABASE_URL || 'https://fndwiwualrquwilfntmt.supabase.co',
    SUPABASE_ANON_KEY: window.APP_CONFIG?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZHdpd3VhbHJxdXdpbGZudG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTk3MDQsImV4cCI6MjEwNjU5NTcwNH0.1H7yw5pvxtwzvwfRmvaxqyosuTHltiv9IeEHV8HIsg4',

    // Available Job Roles
    JOB_ROLES: [
        { id: 'Software Developer', title: 'Software Developer', icon: '💻', desc: 'Core CS, algorithms, system design, and practical software development.' },
        { id: 'Full Stack Developer', title: 'Full Stack Developer', icon: '⚡', desc: 'Modern frontend, backend architecture, APIs, and databases.' },
        { id: 'Frontend Developer', title: 'Frontend Developer', icon: '🎨', desc: 'HTML/CSS/JS, modern UI, web performance, and responsive UX.' },
        { id: 'Backend Developer', title: 'Backend Developer', icon: '🛠️', desc: 'Server architectures, microservices, databases, caching, and scalability.' },
        { id: 'Java Developer', title: 'Java Developer', icon: '☕', desc: 'Java Core, JVM internals, Spring Boot, multithreading, and OOP.' },
        { id: 'Python Developer', title: 'Python Developer', icon: '🐍', desc: 'Python internals, Django/FastAPI, data manipulation, and automation.' },
        { id: 'Application Developer', title: 'Application Developer', icon: '📱', desc: 'Mobile & desktop application architecture, state management, and APIs.' },
        { id: 'Web Developer', title: 'Web Developer', icon: '🌐', desc: 'End-to-end web technologies, HTTP protocols, security, and DOM APIs.' }
    ]
};

window.CONFIG = CONFIG;
