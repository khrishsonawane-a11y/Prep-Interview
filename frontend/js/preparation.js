/**
 * Role-Specific Preparation Guide & Roadmap Controller
 * Adapts dynamically for all 8 engineering job roles
 */

const PREPARATION_DATA = {
    'Software Developer': {
        title: 'Software Developer',
        icon: '💻',
        subtitle: 'Core programming, algorithms, system design, and practical software engineering.',
        roadmap: [
            { phase: 'Phase 1', title: 'Fundamentals & Syntax', items: ['Master C++, Java, or Python', 'OOP principles (Inheritance, Polymorphism, Encapsulation)', 'Memory management & Pointers/References', 'Control flow & Exception handling'] },
            { phase: 'Phase 2', title: 'Data Structures & Algorithms', items: ['Arrays, Strings, Two Pointers, Sliding Window', 'Linked Lists, Stacks, Queues, Hash Maps', 'Trees, Binary Search Trees, Graphs & Traversals (DFS/BFS)', 'Recursion, Backtracking & Dynamic Programming basics'] },
            { phase: 'Phase 3', title: 'Databases & Storage', items: ['Relational DBMS (PostgreSQL/MySQL)', 'Normalization (1NF-3NF) & Indexing (B-Trees)', 'ACID properties & Transactions', 'Basic NoSQL key-value stores (Redis)'] },
            { phase: 'Phase 4', title: 'System Design & Core Engineering', items: ['HTTP protocols, REST APIs & Status codes', 'System architecture basics (Load Balancers, Caching)', 'Version control with Git & GitHub workflow', 'Unit testing & CI/CD fundamentals'] },
            { phase: 'Phase 5', title: 'Mock Technical Simulations', items: ['Timed DSA assessments (30 questions)', 'Technical architecture defense & trade-offs', 'STAR methodology behavioral answers', 'Resume deep-dive project walkthroughs'] },
            { phase: 'Phase 6', title: 'Job Ready & Production Polish', items: ['Time and space complexity optimization', 'Whiteboard problem breakdown communication', 'Production debugging scenarios', 'Full-loop mock interviews'] }
        ],
        curriculum: [
            { title: '1. Programming Fundamentals', items: ['C++ / Java / Python core syntax', 'Object-Oriented Design & SOLID principles', 'Pointers, References & Memory Lifecycles', 'Error & Exception handling patterns'] },
            { title: '2. Data Structures & Algorithms', items: ['Arrays, Strings & Hash Tables', 'Linked Lists, Stacks & Queues', 'Trees, Heaps & Graph Traversals', 'Sorting, Binary Search & Dynamic Programming'] },
            { title: '3. Database Management', items: ['SQL Queries, Complex Joins & Subqueries', 'Database Indexing & Query Execution Plans', 'ACID guarantees & Transaction Isolation', 'Schema design & Entity-Relationship modeling'] },
            { title: '4. Web & Engineering Fundamentals', items: ['HTTP/HTTPS methods, headers & status codes', 'REST API design principles', 'Git branching, rebasing & merge conflict resolution', 'Modular code structure & Clean Code conventions'] },
            { title: '5. Software Engineering Practices', items: ['Software Development Life Cycle (SDLC)', 'Unit Testing, Mocking & Test-Driven Design', 'Design patterns (Singleton, Factory, Observer)', 'Basic horizontal vs vertical scaling'] },
            { title: '6. Interview Preparation & Strategy', items: ['Aptitude speed math shortcuts', 'Clarifying ambiguous technical questions', 'STAR framed behavioral storytelling', 'Complexity explanation without rushing'] }
        ]
    },
    'Full Stack Developer': {
        title: 'Full Stack Developer',
        icon: '⚡',
        subtitle: 'End-to-end web architectures spanning responsive frontends, scalable REST/GraphQL backends, and databases.',
        roadmap: [
            { phase: 'Phase 1', title: 'Frontend Foundation', items: ['Semantic HTML5 & Modern CSS3 (Flexbox/Grid)', 'Modern JavaScript (ES6+), Closures, Promises, Async/Await', 'DOM manipulation & Event propagation'] },
            { phase: 'Phase 2', title: 'Modern UI Frameworks', items: ['React / Next.js component lifecycle & hooks', 'State management (Redux Toolkit / Zustand)', 'Client-side routing & Server-side rendering (SSR)', 'Responsive UX & accessibility (a11y)'] },
            { phase: 'Phase 3', title: 'Backend & APIs', items: ['Node.js & Express.js or Python FastAPI/Django', 'RESTful API design & OpenAPI specifications', 'Authentication (JWT, OAuth2, Session Cookies)', 'Middleware, Request Validation & Error Handling'] },
            { phase: 'Phase 4', title: 'Databases & ORMs', items: ['PostgreSQL / MySQL schema design & indexing', 'MongoDB / NoSQL document modeling', 'ORMs (Prisma, TypeORM, Mongoose)', 'Redis caching for session and query performance'] },
            { phase: 'Phase 5', title: 'Full Stack Integration & Cloud', items: ['Full-stack project deployment (Render, Vercel, AWS)', 'Docker containerization & Docker Compose', 'CI/CD pipelines with GitHub Actions', 'Security best practices (CORS, CSRF, XSS prevention)'] },
            { phase: 'Phase 6', title: 'Mock Interviews & System Design', items: ['Full Stack architectural trade-off discussions', 'Real-time WebSocket / SSE communication', 'Full mock interviews across all 4 rounds', 'Live coding & debugging under time limits'] }
        ],
        curriculum: [
            { title: '1. Frontend Architecture', items: ['HTML5, CSS3, Flexbox & Grid systems', 'React / Next.js component hierarchy & Hooks', 'State management & side effect handling', 'Web vitals, bundling & code-splitting'] },
            { title: '2. Backend Engineering', items: ['Node.js / Express or Python backend servers', 'RESTful & GraphQL API architectures', 'Middleware chains, rate limiting & error pipelines', 'Microservices vs Monolithic tradeoffs'] },
            { title: '3. Data Layer & Storage', items: ['SQL schema design & query optimization', 'NoSQL document stores & aggregation pipelines', 'In-memory caching with Redis', 'Database migrations & connection pooling'] },
            { title: '4. Authentication & Security', items: ['JWT tokens, refresh tokens & cookie flags', 'OAuth 2.0 social login flows', 'OWASP Top 10 vulnerabilities defense', 'CORS, CSP & XSS mitigation'] },
            { title: '5. DevOps & Deployment', items: ['Docker container creation & multi-stage builds', 'Environment variable & secret management', 'CI/CD automated test & build workflows', 'Cloud hosting & monitoring telemetry'] },
            { title: '6. Interview Mastery', items: ['Explaining full stack architecture coherently', 'Live DSA coding in JavaScript/Python', 'System design diagrams (Client -> Gateway -> DB)', 'Behavioral STAR situational responses'] }
        ]
    },
    'Frontend Developer': {
        title: 'Frontend Developer',
        icon: '🎨',
        subtitle: 'High-performance user interfaces, responsive layouts, web vitals optimization, and modern web applications.',
        roadmap: [
            { phase: 'Phase 1', title: 'Web Core & JavaScript Mastery', items: ['Deep dive into ES6+, Event Loop, Prototype chain', 'DOM manipulation, Event delegation, Bubbling/Capturing', 'CSS Box model, Flexbox, Grid, Animations'] },
            { phase: 'Phase 2', title: 'Component Frameworks', items: ['React internals (Virtual DOM, Reconciliation, Fibers)', 'Hooks (useState, useEffect, useMemo, useCallback, useRef)', 'Custom hooks & compound component patterns', 'TypeScript for robust component props'] },
            { phase: 'Phase 3', title: 'State & Network Layers', items: ['Global state management (Redux Toolkit, Zustand)', 'Server state caching (TanStack Query / SWR)', 'HTTP fetch, Axios interceptors, WebSockets', 'Optimistic UI updates & offline fallback'] },
            { phase: 'Phase 4', title: 'Performance & Accessibility', items: ['Core Web Vitals (LCP, INP, CLS) optimization', 'Lazy loading, bundle splitting, tree-shaking', 'ARIA attributes, keyboard navigation, a11y compliance', 'Cross-browser compatibility & responsive testing'] },
            { phase: 'Phase 5', title: 'Testing & Build Tooling', items: ['Vite, Webpack, Babel & module bundling', 'Jest / Vitest unit tests & React Testing Library', 'End-to-end testing with Playwright or Cypress', 'Design systems & CSS Modules / Tailwind'] },
            { phase: 'Phase 6', title: 'Frontend System Design & Mocks', items: ['Designing scalable UI components (Autocomplete, Infinite Scroll)', 'Frontend system architecture interviews', 'Algorithmic DSA in JavaScript', 'Mock behavioral & technical rounds'] }
        ],
        curriculum: [
            { title: '1. JavaScript & Web Internals', items: ['Event loop, Microtasks vs Macrotasks', 'Closures, Scopes & Prototypal inheritance', 'Promises, Async/Await & Generator functions', 'Browser rendering pipeline (Parse, Style, Layout, Paint)'] },
            { title: '2. React & Modern UI Ecosystem', items: ['Component lifecycle & React 18/19 concurrent features', 'Custom hooks composition & render performance', 'Server Components vs Client Components', 'Context API vs External state managers'] },
            { title: '3. CSS Architecture & Responsive Design', items: ['Flexbox, Grid & Container Queries', 'CSS Custom Properties & Theme switches', 'Transitions, Keyframes & smooth animations', 'Mobile-first responsive layout strategies'] },
            { title: '4. Web Performance & Optimization', items: ['Core Web Vitals metrics diagnostics', 'Image optimization (WebP/AVIF, responsive srcsets)', 'Code splitting, dynamic imports & caching', 'Debouncing, Throttling & Virtualization'] },
            { title: '5. Accessibility & Best Practices', items: ['WAI-ARIA roles, states and properties', 'Focus management & keyboard-only navigation', 'Color contrast ratios & screen reader testing', 'Semantic HTML5 structure'] },
            { title: '6. Frontend Technical Interviews', items: ['Live coding UI widgets (Debounced Search, Modals)', 'Frontend architecture discussions', 'DSA problem solving in JS', 'Communication on trade-offs & browser support'] }
        ]
    },
    'Backend Developer': {
        title: 'Backend Developer',
        icon: '🛠️',
        subtitle: 'High-throughput server architectures, microservices, databases, caching, and scalable distributed systems.',
        roadmap: [
            { phase: 'Phase 1', title: 'Backend Runtimes & CS Foundations', items: ['Master Node.js, Go, Java, or Python backend runtimes', 'Concurrency models, Event loop, Thread pools', 'Data structures & Algorithmic efficiency (O(N) time/space)'] },
            { phase: 'Phase 2', title: 'API Protocols & Architecture', items: ['REST API best practices & Richardson Maturity Model', 'gRPC, Protocol Buffers & WebSockets', 'Authentication (OAuth 2.0, JWT, API Keys, mTLS)', 'Request validation, serialization & logging'] },
            { phase: 'Phase 3', title: 'Data Persistence & Caching', items: ['PostgreSQL/MySQL indexing, transactions & query optimization', 'Redis for caching, rate limiting, and pub/sub', 'Database connection pooling & replication', 'Elasticsearch for full-text search'] },
            { phase: 'Phase 4', title: 'Microservices & Message Brokers', items: ['Event-driven architecture with Kafka or RabbitMQ', 'Service discovery, API Gateways & Reverse proxies (Nginx)', 'Circuit Breaker & Retry patterns', 'Database per service vs shared database'] },
            { phase: 'Phase 5', title: 'Distributed Systems & Scalability', items: ['Horizontal scaling, Load balancing & Consistent hashing', 'CAP Theorem & PACELC trade-offs', 'Distributed locking, ID generation (Snowflake)', 'Observability: Prometheus, Grafana, Distributed Tracing'] },
            { phase: 'Phase 6', title: 'System Design & Mock Loops', items: ['High-level & Low-level system design simulations', 'Handling failure scenarios & bottleneck mitigation', 'Backend live coding under test constraints', 'Full 4-round mock interview completion'] }
        ],
        curriculum: [
            { title: '1. Server Core & Concurrency', items: ['Event-driven asynchronous I/O models', 'Multi-threading, Thread safety & Race conditions', 'Memory management & Garbage collection profiles', 'Process management & IPC'] },
            { title: '2. API & Communication Protocols', items: ['RESTful standards & idempotency rules', 'gRPC & Binary serialization protocols', 'WebSocket duplex streaming', 'Rate limiting algorithms (Token Bucket, Leaky Bucket)'] },
            { title: '3. Databases & Data Consistency', items: ['B-Tree, Hash, and GIN Indexing internals', 'Transaction isolation levels (Read Committed, Serializable)', 'Read replicas, Sharding & Partitioning', 'Cache-aside, Write-through & Write-behind patterns'] },
            { title: '4. Distributed Systems & Messaging', items: ['Message brokers (Kafka partitions, consumer groups)', 'Distributed consensus & Leader election basics', 'Distributed transactions (Saga pattern, 2PC)', 'Eventual consistency & conflict resolution'] },
            { title: '5. Security & Reliability', items: ['SQL Injection, IDOR, SSRF defense', 'Secure secret management (Vault, KMS)', 'Graceful degradation & health checking', 'Structured logging & APM tracing'] },
            { title: '6. Backend Technical Interviews', items: ['System Design (URL Shortener, Chat System, Rate Limiter)', 'Core CS & OOP architectural defense', 'Algorithmic DSA problem solving', 'Behavioral leadership & incident response'] }
        ]
    },
    'Java Developer': {
        title: 'Java Developer',
        icon: '☕',
        subtitle: 'Enterprise Java, JVM memory architecture, Spring Boot ecosystem, multithreading, and OOP design.',
        roadmap: [
            { phase: 'Phase 1', title: 'Core Java & OOP Internals', items: ['Java 8 - 21 features (Lambdas, Streams, Records, Virtual Threads)', 'OOP principles & SOLID design patterns in Java', 'Java Collections Framework (HashMap internals, ConcurrentHashMap)', 'Exception handling & Generics in depth'] },
            { phase: 'Phase 2', title: 'Multithreading & Concurrency', items: ['Thread lifecycle, Synchronization & volatile keyword', 'java.util.concurrent (Executors, CountDownLatch, Semaphore)', 'Locks, Deadlocks & Thread safety patterns', 'Virtual Threads (Project Loom) in modern Java'] },
            { phase: 'Phase 3', title: 'JVM Architecture & Performance', items: ['JVM memory model (Heap, Stack, Metaspace, GC roots)', 'Garbage Collectors (G1, ZGC, Parallel GC)', 'JVM profiling, Heap dumps & Memory leak debugging', 'Classloaders & JIT compilation basics'] },
            { phase: 'Phase 4', title: 'Spring Framework & Spring Boot', items: ['Spring IoC & Dependency Injection', 'Spring Boot auto-configuration & Actuator', 'Spring Data JPA & Hibernate ORM (N+1 query resolution)', 'Spring Security (JWT, OAuth2, Filter chains)'] },
            { phase: 'Phase 5', title: 'Microservices & Enterprise Integration', items: ['Building REST APIs with Spring MVC / WebFlux', 'Kafka integration with Spring Cloud Stream', 'Database transactions (@Transactional propagation)', 'Unit & Integration testing with JUnit 5 & Mockito'] },
            { phase: 'Phase 6', title: 'Enterprise Mocks & Problem Solving', items: ['Java algorithmic problem solving in Collections', 'Java architecture & design pattern interviews', 'STAR behavioral responses for enterprise projects', 'Full mock interview preparation'] }
        ],
        curriculum: [
            { title: '1. Core Java & Language Features', items: ['Java memory model (Stack vs Heap allocation)', 'Collections hierarchy & internal workings (HashMap, ArrayList)', 'Generics, Type erasure & Wildcards', 'Stream API & Functional interfaces'] },
            { title: '2. Multithreading & Concurrency', items: ['Synchronization, ReentrantLocks & Condition variables', 'Thread pools (ThreadPoolExecutor tuning)', 'Atomic variables & Non-blocking algorithms', 'CompletableFuture & Async pipelines'] },
            { title: '3. Spring & Spring Boot Ecosystem', items: ['Spring Bean lifecycles & Scopes', 'Spring AOP for logging, security & metrics', 'Hibernate caching (1st & 2nd level cache)', 'Spring Boot starters & configuration properties'] },
            { title: '4. JVM Internals & Optimization', items: ['Garbage collection tuning & pauses', 'Memory leak detection via visual tools', 'Bytecode execution & JIT compiler optimizations', 'Class loading hierarchy'] },
            { title: '5. Enterprise Design Patterns', items: ['Creational patterns (Factory, Builder, Singleton)', 'Structural patterns (Adapter, Decorator, Facade)', 'Behavioral patterns (Strategy, Observer, Command)', 'Enterprise Service & DAO layer design'] },
            { title: '6. Java Technical Interviews', items: ['Writing clean, idiomatic Java in coding challenges', 'Explaining concurrency bugs & fixes', 'Microservice architecture design in Spring', 'Behavioral communication for enterprise teams'] }
        ]
    },
    'Python Developer': {
        title: 'Python Developer',
        icon: '🐍',
        subtitle: 'Python language internals, FastAPI/Django backends, async architectures, data structures, and automation.',
        roadmap: [
            { phase: 'Phase 1', title: 'Python Language Mastery', items: ['Python memory model, Reference counting & GC', 'Decorators, Generators, Iterators & Context Managers', 'Dunder / Magic methods & Metaclasses', 'Type hinting & Pydantic validation'] },
            { phase: 'Phase 2', title: 'Data Structures & Algorithms in Python', items: ['Built-in types (lists, dicts, sets, tuples, deques, heaps)', 'Algorithmic DSA with Python collections & itertools', 'Time and space complexity profiling', 'Writing clean, idiomatic PEP 8 Python code'] },
            { phase: 'Phase 3', title: 'Backend Frameworks & APIs', items: ['FastAPI asynchronous endpoints & dependency injection', 'Django ORM, migrations, views & admin panel', 'REST API design & Pydantic data schemas', 'Authentication with JWT & OAuth2 in Python'] },
            { phase: 'Phase 4', title: 'Concurrency & Async Programming', items: ['Asyncio event loop, coroutines & tasks', 'Multiprocessing vs Multithreading in Python', 'Global Interpreter Lock (GIL) internals & free-threaded Python', 'Celery & Redis for asynchronous background tasks'] },
            { phase: 'Phase 5', title: 'Databases & Testing', items: ['SQLAlchemy & Alembic migrations', 'PostgreSQL integration & async database drivers', 'PyTest fixtures, parametrization & mocking', 'Dockerizing Python applications & poetry/pipenv'] },
            { phase: 'Phase 6', title: 'System Architecture & Mock Interviews', items: ['Scalable Python service architectures', 'Algorithmic DSA live coding sessions', 'Python technical trivia & architecture defense', 'Full mock interviews across 4 rounds'] }
        ],
        curriculum: [
            { title: '1. Python Internals & Mechanics', items: ['Global Interpreter Lock (GIL) and its implications', 'Memory management & Garbage collection cycles', 'Decorators, Closures & Functional programming', 'Context Managers with `with` statements'] },
            { title: '2. Asynchronous & Concurrent Python', items: ['Asyncio event loop & Coroutine execution', 'Multiprocessing for CPU-bound computation', 'Threading vs Asyncio for I/O bound tasks', 'Task queues with Celery & Redis'] },
            { title: '3. Backend Frameworks (FastAPI & Django)', items: ['FastAPI automatic OpenAPI docs & Async routes', 'Django ORM queries, indexing & select_related/prefetch_related', 'Middleware architecture & custom filters', 'Dependency injection in FastAPI'] },
            { title: '4. Data Structures & Algorithmics', items: ['Hash maps (dict) hash tables implementation', 'Heaps (heapq), Stacks, Queues & Deques', 'Graph & Tree algorithms in Python', 'Sorting algorithms & Timsort mechanics'] },
            { title: '5. Testing & Code Quality', items: ['PyTest assertions, fixtures & mocking', 'Type checking with MyPy', 'Profiling with cProfile & memory_profiler', 'Linters (Ruff, Flake8, Black)'] },
            { title: '6. Python Technical Interviews', items: ['Solving algorithmic problems in Python under 20 mins', 'Explaining Python GIL & async performance', 'Designing microservice APIs with FastAPI', 'STAR format behavioral scenarios'] }
        ]
    },
    'Application Developer': {
        title: 'Application Developer',
        icon: '📱',
        subtitle: 'Cross-platform and native desktop/mobile application architecture, state lifecycles, and client performance.',
        roadmap: [
            { phase: 'Phase 1', title: 'Language Foundations & OOP', items: ['Dart, Kotlin, Swift, or TypeScript/JS', 'Object-Oriented Design & Clean Architecture principles', 'Asynchronous streams & Future/Promise handling'] },
            { phase: 'Phase 2', title: 'Application UI & Layouts', items: ['Declarative UI paradigms (Flutter / React Native / SwiftUI)', 'Responsive mobile & desktop layouts', 'Animations, gesture handling & custom canvas painting', 'Accessibility (Screen readers, high contrast, tap targets)'] },
            { phase: 'Phase 3', title: 'State Management & Architecture', items: ['State patterns (Bloc, Provider, Redux, MVVM)', 'Dependency Injection & Service Locators', 'Modular architecture & layer separation (Data, Domain, UI)', 'Navigation & Deep Linking'] },
            { phase: 'Phase 4', title: 'Storage & Network Integration', items: ['REST & GraphQL API integration with caching', 'Local persistence (SQLite, Room, CoreData, Hive)', 'Offline-first sync & conflict resolution', 'Push notifications & background background tasks'] },
            { phase: 'Phase 5', title: 'Security & App Performance', items: ['Secure storage for tokens & biometric auth', 'Memory leak prevention & frame rate (60/120 FPS) profiling', 'Network payload optimization & image caching', 'App store release & CI/CD deployment pipelines'] },
            { phase: 'Phase 6', title: 'Mock Technical & Behavioral Rounds', items: ['Client-side architectural system design', 'DSA problem solving in application languages', 'STAR leadership and product collaboration questions', 'Full 4-round mock interview preparation'] }
        ],
        curriculum: [
            { title: '1. App Architecture & Design Patterns', items: ['Clean Architecture & MVVM / MVI patterns', 'Dependency Injection & Inversion of Control', 'Repository & Data Source patterns', 'State machines & immutable state modeling'] },
            { title: '2. Client State Management', items: ['Unidirectional data flow paradigms', 'Global state vs Local widget state', 'Stream / Observable reactive state management', 'Memory lifecycle management & disposing listeners'] },
            { title: '3. Local Persistence & Offline Sync', items: ['SQLite schema design & migrations', 'Key-value encrypted storage (Keychain/Keystore)', 'Optimistic UI updates & sync queues', 'File system caching strategies'] },
            { title: '4. Network & Real-Time Comms', items: ['HTTP client interceptors, retries & token refresh', 'WebSocket persistent connections', 'Multipart file uploads & download progress', 'Error handling & user retry mechanisms'] },
            { title: '5. Client Performance & Profiling', items: ['Eliminating UI jank & frame drop debugging', 'Memory leak detection & profiling tools', 'Image rendering optimization & memory caches', 'Startup time & bundle size reduction'] },
            { title: '6. Application Technical Interviews', items: ['Designing mobile/desktop app architectures on whiteboard', 'Solving coding & DSA questions', 'Handling device constraints & battery efficiency questions', 'Behavioral STAR situational answers'] }
        ]
    },
    'Web Developer': {
        title: 'Web Developer',
        icon: '🌐',
        subtitle: 'End-to-end web technologies, semantic HTML, modern responsive CSS, DOM APIs, HTTP protocols, and web security.',
        roadmap: [
            { phase: 'Phase 1', title: 'HTML5 & Modern CSS3', items: ['Semantic HTML structure & a11y fundamentals', 'CSS Grid, Flexbox, Custom Properties & Responsive layouts', 'CSS animations, transforms & transitions', 'Forms, validation & custom controls'] },
            { phase: 'Phase 2', title: 'JavaScript (ES6+) & DOM APIs', items: ['Variables, scopes, closures, prototypal inheritance', 'DOM traversal, manipulation & event bubbling/capturing', 'Fetch API, Promises, Async/Await & JSON parsing', 'Web Storage (LocalStorage, SessionStorage, IndexedDB)'] },
            { phase: 'Phase 3', title: 'Web Protocols & Security', items: ['HTTP/1.1, HTTP/2, HTTPS & SSL/TLS handshake', 'CORS, Same-Origin Policy & CSP headers', 'Cookies, sessions, tokens & CSRF protection', 'Web security best practices (OWASP guidelines)'] },
            { phase: 'Phase 4', title: 'Frontend Tooling & Bundling', items: ['Modern build tools (Vite, Webpack, PostCSS)', 'Version control with Git & GitHub workflow', 'Responsive design for multi-device viewports', 'Cross-browser testing & automated linting'] },
            { phase: 'Phase 5', title: 'Web Performance & SEO', items: ['Core Web Vitals diagnostics & performance budgets', 'Image optimization, lazy loading & font loading strategies', 'Semantic SEO tags, Open Graph & schema.org markup', 'PWA fundamentals & Service Workers'] },
            { phase: 'Phase 6', title: 'Mock Technical & Behavioral Rounds', items: ['Live DOM coding & JavaScript algorithms', 'Web architecture design scenarios', 'STAR behavioral communication', 'Full mock interviews across all 4 rounds'] }
        ],
        curriculum: [
            { title: '1. Semantic Web & Standards', items: ['Semantic HTML5 tags for accessibility & SEO', 'ARIA attributes & screen reader compatibility', 'Accessible form controls & keyboard navigation', 'Microdata & Structured metadata'] },
            { title: '2. Advanced CSS & Layout Engineering', items: ['CSS Grid & Subgrid layouts', 'Flexbox alignment mechanics & margin auto tricks', 'CSS Custom Properties for dynamic theming', 'Media & Container queries for responsive design'] },
            { title: '3. JavaScript & Browser Internals', items: ['Event loop, Microtask queue & Call stack', 'Closures, Lexical scope & Hoisting', 'DOM tree manipulation & DocumentFragment performance', 'Custom events & Observer APIs (Intersection, Mutation, Resize)'] },
            { title: '4. HTTP Protocols & Web Security', items: ['HTTP request/response headers & status codes', 'CORS preflight requests & Access-Control headers', 'Content Security Policy (CSP) rules', 'Authentication cookies (HttpOnly, Secure, SameSite)'] },
            { title: '5. Web Performance Optimization', items: ['Minimizing critical rendering path', 'Asset bundling, tree-shaking & minification', 'Resource hints (dns-prefetch, preconnect, preload)', 'Caching headers (Cache-Control, ETag)'] },
            { title: '6. Web Developer Technical Interviews', items: ['Live coding DOM widgets without frameworks', 'Vanilla JavaScript DSA problem solving', 'Explaining browser rendering pipeline', 'Behavioral leadership & agile team questions'] }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Read pre-selected role from URL
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const initialRole = PREPARATION_DATA[roleParam] ? roleParam : 'Software Developer';

    renderRolePills(initialRole);
    loadRolePreparation(initialRole);
});

function renderRolePills(activeRole) {
    const switcher = document.getElementById('role-switcher');
    if (!switcher) return;

    const roles = Object.keys(PREPARATION_DATA);
    switcher.innerHTML = roles.map(role => `
        <a href="?role=${encodeURIComponent(role)}" class="role-pill ${role === activeRole ? 'active' : ''}" data-role="${role}">
            ${PREPARATION_DATA[role].icon} ${role}
        </a>
    `).join('');

    switcher.querySelectorAll('.role-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            const role = pill.getAttribute('data-role');
            switcher.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Update URL without reload
            const newUrl = `${window.location.pathname}?role=${encodeURIComponent(role)}`;
            window.history.pushState({ role }, '', newUrl);

            loadRolePreparation(role);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function loadRolePreparation(roleKey) {
    const data = PREPARATION_DATA[roleKey] || PREPARATION_DATA['Software Developer'];

    // 1. Header
    const titleEl = document.getElementById('prep-page-title');
    const subEl = document.getElementById('prep-page-subtitle');
    const startBtn = document.getElementById('prep-start-interview-btn');

    if (titleEl) titleEl.innerHTML = `${data.icon} How to Prepare for ${data.title}`;
    if (subEl) subEl.textContent = data.subtitle;
    if (startBtn) startBtn.href = `interview.html?role=${encodeURIComponent(data.title)}`;

    // 2. 6-Phase Roadmap
    const roadmapContainer = document.getElementById('roadmap-container');
    if (roadmapContainer) {
        roadmapContainer.innerHTML = data.roadmap.map(phase => `
            <div class="roadmap-phase-card">
                <div class="phase-badge">${phase.phase}</div>
                <div class="phase-title">${phase.title}</div>
                <ul class="phase-items">
                    ${phase.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 3. Core Curriculum
    const curriculumContainer = document.getElementById('curriculum-container');
    if (curriculumContainer) {
        curriculumContainer.innerHTML = data.curriculum.map(curr => `
            <div class="curriculum-card">
                <h3>${curr.title}</h3>
                <ul class="curriculum-list">
                    ${curr.items.map(item => `<li>✓ ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}
