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

    // Available Job Roles with Tailored Skills & Descriptions
    JOB_ROLES: [
        {
            id: 'Software Developer',
            title: 'Software Developer',
            icon: '💻',
            desc: 'Core programming, algorithms, system design and software development.',
            skills: ['Data Structures & Algorithms', 'C++/Java/Python', 'System Design', 'SQL & Databases', 'Git & Testing']
        },
        {
            id: 'Full Stack Developer',
            title: 'Full Stack Developer',
            icon: '⚡',
            desc: 'Modern web architectures spanning dynamic frontends, APIs, and scalable databases.',
            skills: ['HTML/CSS/JS', 'React/Vue/Next', 'Node/Express', 'REST & GraphQL', 'SQL/NoSQL', 'Auth & Docker']
        },
        {
            id: 'Frontend Developer',
            title: 'Frontend Developer',
            icon: '🎨',
            desc: 'High-performance user interfaces, responsive layouts, web vitals, and modern state.',
            skills: ['Modern JavaScript/TypeScript', 'React/Next.js', 'CSS Grid/Flexbox', 'DOM & Event Loop', 'Web Performance & a11y']
        },
        {
            id: 'Backend Developer',
            title: 'Backend Developer',
            icon: '🛠️',
            desc: 'High-throughput servers, microservices, database optimizations, caching, and security.',
            skills: ['Node.js/Go/Java/Python', 'REST/gRPC APIs', 'PostgreSQL/MySQL', 'Redis Caching', 'System Scalability', 'OAuth/JWT']
        },
        {
            id: 'Java Developer',
            title: 'Java Developer',
            icon: '☕',
            desc: 'Enterprise systems, JVM memory internals, Spring Boot, concurrency, and OOP principles.',
            skills: ['Core Java (8-21)', 'Spring Boot & JPA', 'Multithreading & Concurrency', 'JVM & Garbage Collection', 'Microservices', 'SQL']
        },
        {
            id: 'Python Developer',
            title: 'Python Developer',
            icon: '🐍',
            desc: 'Python programming, backend microservices, async processing, data pipelines, and APIs.',
            skills: ['Core Python & OOP', 'FastAPI/Django', 'Asyncio & Concurrency', 'Data Structures', 'PostgreSQL/SQLAlchemy', 'PyTest']
        },
        {
            id: 'Application Developer',
            title: 'Application Developer',
            icon: '📱',
            desc: 'Cross-platform and native desktop/mobile application architecture and state flows.',
            skills: ['App Architecture (MVVM/Bloc)', 'Flutter/React Native/Swift', 'Local Storage (SQLite/Room)', 'State Management', 'REST APIs']
        },
        {
            id: 'Web Developer',
            title: 'Web Developer',
            icon: '🌐',
            desc: 'End-to-end web technologies, HTTP/HTTPS protocols, responsive UI, DOM, and web security.',
            skills: ['HTML5 & Semantic Web', 'CSS3 & Responsive UI', 'JavaScript (ES6+)', 'HTTP/Fetch APIs', 'Web Security (CORS/CSRF)', 'Git']
        }
    ]
};

window.CONFIG = CONFIG;
