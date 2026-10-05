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

    // Role Categories for organization & filtering
    ROLE_CATEGORIES: [
        { id: 'all', name: 'All Roles' },
        { id: 'software', name: 'Software / Development' },
        { id: 'data_ai', name: 'Data / AI' },
        { id: 'cloud_infra', name: 'Cloud / Infrastructure' },
        { id: 'security', name: 'Security' },
        { id: 'qa_testing', name: 'Testing / Quality' },
        { id: 'other_tech', name: 'Other Technology Roles' }
    ],

    // Available Job Roles with Tailored Skills & Descriptions
    JOB_ROLES: [
        // =====================================================================
        // 1. SOFTWARE / DEVELOPMENT
        // =====================================================================
        {
            id: 'Software Developer',
            title: 'Software Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '💻',
            desc: 'Core programming, algorithms, system design, data structures, and practical software engineering.',
            skills: ['Data Structures & Algorithms', 'C++ / Java / Python', 'System Design', 'SQL & Databases', 'Git & Version Control', 'OOP Principles', 'Unit Testing']
        },
        {
            id: 'Full Stack Developer',
            title: 'Full Stack Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '⚡',
            desc: 'Modern web architectures spanning dynamic frontends, APIs, and scalable relational/NoSQL databases.',
            skills: ['HTML5 & CSS3', 'JavaScript & TypeScript', 'React / Next.js', 'Node.js & Express', 'REST & GraphQL APIs', 'SQL & MongoDB', 'Docker & CI/CD', 'Git / GitHub']
        },
        {
            id: 'Frontend Developer',
            title: 'Frontend Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '🎨',
            desc: 'High-performance user interfaces, responsive layouts, web vitals, state management, and modern UX.',
            skills: ['HTML5 & Semantic Web', 'CSS3 & Responsive UI', 'JavaScript (ES6+) & TypeScript', 'React / Next.js', 'State Management (Redux/Zustand)', 'Web Performance & CWV', 'Accessibility (a11y)']
        },
        {
            id: 'Backend Developer',
            title: 'Backend Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '🛠️',
            desc: 'High-throughput servers, microservices, database optimizations, caching, and security architectures.',
            skills: ['Node.js / Java / Go / Python', 'REST & gRPC APIs', 'PostgreSQL / MySQL', 'Redis Caching', 'System Scalability & Design', 'Microservices', 'OAuth & JWT Security']
        },
        {
            id: 'Java Developer',
            title: 'Java Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '☕',
            desc: 'Enterprise systems, JVM memory internals, Spring Boot ecosystem, multithreading, and OOP design.',
            skills: ['Core Java (8-21)', 'Spring Boot & Spring Data', 'Multithreading & Concurrency', 'JVM Internals & GC Tuning', 'Microservices Architecture', 'Hibernate / JPA', 'SQL & Databases']
        },
        {
            id: 'Python Developer',
            title: 'Python Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '🐍',
            desc: 'Python programming, backend microservices, async processing, data pipelines, and APIs.',
            skills: ['Python 3 & Advanced OOP', 'FastAPI & Django', 'Asyncio & Concurrency', 'Data Structures & Algorithms', 'PostgreSQL & SQLAlchemy', 'PyTest & Testing', 'Docker & Packaging']
        },
        {
            id: 'C++ Developer',
            title: 'C++ Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '⚙️',
            desc: 'High-performance computing, memory management, low-latency systems, STL algorithms, and multithreading.',
            skills: ['Modern C++ (17/20)', 'STL & Memory Management', 'Pointers & Smart Pointers', 'Concurrency & Multithreading', 'Data Structures & Algorithms', 'Low-Latency Systems', 'GDB & Profiling']
        },
        {
            id: 'Mobile App Developer',
            title: 'Mobile App Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '📱',
            desc: 'Cross-platform and native mobile application architecture, state flows, animations, and offline sync.',
            skills: ['Flutter / Dart', 'React Native / TypeScript', 'iOS (Swift) / Android (Kotlin)', 'State Management (Bloc/Redux)', 'Local Storage (SQLite/Room)', 'Mobile UI/UX Design', 'REST & Push Notifications']
        },
        {
            id: 'Game Developer',
            title: 'Game Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '🎮',
            desc: 'Real-time game mechanics, physics engines, shaders, rendering pipelines, and C++/C# architectures.',
            skills: ['Unity & C#', 'Unreal Engine & C++', '2D & 3D Math / Physics', 'Graphics & Shader Pipelines', 'Game Loop & Memory Optimization', 'Multiplayer Networking', 'Asset Pipeline']
        },
        {
            id: 'Application Developer',
            title: 'Application Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '📲',
            desc: 'Cross-platform desktop and client application lifecycle, MVVM architectures, and local storage flows.',
            skills: ['App Architecture (MVVM/Clean)', 'Flutter / React Native / Electron', 'Local Persistence (SQLite/Room)', 'State Management', 'REST & GraphQL APIs', 'Client-Side Security']
        },
        {
            id: 'Web Developer',
            title: 'Web Developer',
            category: 'software',
            categoryName: 'Software / Development',
            icon: '🌐',
            desc: 'End-to-end web technologies, HTTP/HTTPS protocols, responsive UI, DOM, and web security best practices.',
            skills: ['HTML5 & Semantic Web', 'CSS3 & CSS Grid/Flexbox', 'JavaScript (ES6+)', 'HTTP/HTTPS & Fetch APIs', 'Web Security (CORS/CSRF)', 'Build Tools (Vite/Webpack)', 'Git & Version Control']
        },

        // =====================================================================
        // 2. DATA / AI
        // =====================================================================
        {
            id: 'Data Analyst',
            title: 'Data Analyst',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '📊',
            desc: 'Data transformation, SQL querying, statistical analysis, KPI tracking, and executive dashboard reporting.',
            skills: ['Excel & Advanced Formulas', 'SQL (PostgreSQL/BigQuery)', 'Python (Pandas & NumPy)', 'Data Visualization (Matplotlib/Seaborn)', 'Power BI / Tableau', 'Statistical Analysis', 'A/B Testing']
        },
        {
            id: 'Data Scientist',
            title: 'Data Scientist',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '🔬',
            desc: 'Predictive modeling, statistical inference, feature engineering, hypothesis testing, and ML pipelines.',
            skills: ['Python & R', 'Machine Learning Algorithms', 'Statistical Inference & Probability', 'Scikit-learn', 'Pandas & NumPy', 'Feature Engineering', 'SQL & BigQuery', 'Hypothesis Testing']
        },
        {
            id: 'AI Engineer',
            title: 'AI Engineer',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '🤖',
            desc: 'Foundation model integration, retrieval-augmented generation (RAG), embeddings, and agentic workflows.',
            skills: ['Python', 'Generative AI & LLMs', 'LangChain & LlamaIndex', 'Vector Databases (Pinecone/Chroma)', 'RAG Architectures', 'Prompt Engineering', 'PyTorch / TensorFlow', 'API Integration']
        },
        {
            id: 'Machine Learning Engineer',
            title: 'Machine Learning Engineer',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '🧠',
            desc: 'Scalable ML training pipelines, model quantization, MLOps, inference serving, and deployment.',
            skills: ['Python', 'PyTorch & TensorFlow', 'Scikit-learn', 'MLOps (MLflow/Kubeflow)', 'Model Deployment & Serving (ONNX/Triton)', 'Feature Stores & Data Pipelines', 'Docker & Kubernetes']
        },
        {
            id: 'Generative AI Engineer',
            title: 'Generative AI Engineer',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '✨',
            desc: 'Large language model application development, fine-tuning, embeddings, and autonomous agent systems.',
            skills: ['LLM Fine-Tuning (LoRA/QLoRA)', 'Transformers (Hugging Face)', 'RAG & Vector Search', 'AI Agents & Function Calling', 'OpenAI & Gemini APIs', 'Prompt Optimization', 'Python']
        },
        {
            id: 'NLP Engineer',
            title: 'NLP Engineer',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '🗣️',
            desc: 'Natural language processing, tokenization, transformer architectures, and sequence modeling.',
            skills: ['Python', 'Transformers & BERT/GPT', 'Spacy & NLTK', 'Tokenization & Word Embeddings', 'Named Entity Recognition (NER)', 'Text Classification & Sentiment', 'PyTorch']
        },
        {
            id: 'Computer Vision Engineer',
            title: 'Computer Vision Engineer',
            category: 'data_ai',
            categoryName: 'Data / AI',
            icon: '👁️',
            desc: 'Image processing, object detection, semantic segmentation, and convolutional neural networks.',
            skills: ['OpenCV & Image Processing', 'PyTorch & TensorFlow', 'YOLO & Object Detection', 'Semantic Segmentation', 'CNNs & Vision Transformers', 'Video Stream Processing', 'Model Optimization']
        },

        // =====================================================================
        // 3. CLOUD / INFRASTRUCTURE
        // =====================================================================
        {
            id: 'DevOps Engineer',
            title: 'DevOps Engineer',
            category: 'cloud_infra',
            categoryName: 'Cloud / Infrastructure',
            icon: '🚀',
            desc: 'CI/CD automated deployment pipelines, infrastructure as code, containerization, and cloud automation.',
            skills: ['Linux & Bash Scripting', 'Git & GitHub Workflows', 'Docker Containerization', 'Kubernetes Orchestration', 'CI/CD (GitHub Actions/Jenkins)', 'AWS / Azure / GCP', 'Terraform (IaC)', 'Monitoring & Logging']
        },
        {
            id: 'Cloud Engineer',
            title: 'Cloud Engineer',
            category: 'cloud_infra',
            categoryName: 'Cloud / Infrastructure',
            icon: '☁️',
            desc: 'Cloud infrastructure provisioning, virtual networking, serverless workloads, and cloud migration.',
            skills: ['AWS / GCP / Azure Services', 'VPC & Cloud Networking', 'IAM & Cloud Security', 'Terraform & CloudFormation', 'Serverless (Lambda/Cloud Functions)', 'Storage (S3/GCS)', 'Cost Optimization']
        },
        {
            id: 'Cloud Architect',
            title: 'Cloud Architect',
            category: 'cloud_infra',
            categoryName: 'Cloud / Infrastructure',
            icon: '🏛️',
            desc: 'Enterprise cloud infrastructure design, multi-region high availability, resilience, and governance.',
            skills: ['Multi-Cloud Architecture', 'Well-Architected Framework', 'High Availability & Disaster Recovery', 'Microservices Architecture', 'Cloud Governance & FinOps', 'Enterprise Security']
        },
        {
            id: 'Site Reliability Engineer',
            title: 'Site Reliability Engineer',
            category: 'cloud_infra',
            categoryName: 'Cloud / Infrastructure',
            icon: '📈',
            desc: 'Distributed system uptime, SLI/SLO monitoring, incident response, chaos engineering, and automation.',
            skills: ['Linux Internals & Networking', 'Python / Go Automation', 'Prometheus, Grafana & Datadog', 'Incident Management & Post-Mortems', 'SLI / SLO / SLA Framework', 'Resilience & Chaos Engineering']
        },
        {
            id: 'Kubernetes Engineer',
            title: 'Kubernetes Engineer',
            category: 'cloud_infra',
            categoryName: 'Cloud / Infrastructure',
            icon: '☸️',
            desc: 'Kubernetes cluster orchestration, ingress controllers, Helm charts, and service meshes.',
            skills: ['Kubernetes Architecture (Pods/Deployments)', 'Helm Charts & Package Management', 'Istio & Service Mesh', 'Cluster Networking (CNI)', 'Container Security & Policies', 'Persistent Volumes (CSI)']
        },

        // =====================================================================
        // 4. SECURITY
        // =====================================================================
        {
            id: 'Cybersecurity Analyst',
            title: 'Cybersecurity Analyst',
            category: 'security',
            categoryName: 'Security',
            icon: '🛡️',
            desc: 'Security operations, threat monitoring, SIEM analysis, vulnerability assessment, and incident response.',
            skills: ['SIEM Tools (Splunk/Sentinel)', 'Threat Detection & Analysis', 'Network Security & TCP/IP Protocols', 'Vulnerability Management', 'Incident Response Lifecycles', 'NIST & ISO 27001 Frameworks']
        },
        {
            id: 'Cybersecurity Engineer',
            title: 'Cybersecurity Engineer',
            category: 'security',
            categoryName: 'Security',
            icon: '🔒',
            desc: 'Security architecture, identity management, zero-trust infrastructure, and cryptographic protocols.',
            skills: ['Network Defense & Firewalls', 'Identity & Access Management (IAM)', 'Cryptography & PKI', 'Zero-Trust Architecture', 'Endpoint Detection & Response (EDR)', 'Cloud Security Hardening']
        },
        {
            id: 'Security Engineer',
            title: 'Security Engineer',
            category: 'security',
            categoryName: 'Security',
            icon: '🔐',
            desc: 'Application security (AppSec), static/dynamic code analysis, and threat modeling.',
            skills: ['Application Security (OWASP Top 10)', 'SAST & DAST Scanning Tools', 'Secure Code Review', 'Threat Modeling (STRIDE)', 'Container & Cloud Security', 'Secret Management (Vault)']
        },
        {
            id: 'Ethical Hacker / Penetration Tester',
            title: 'Ethical Hacker / Penetration Tester',
            category: 'security',
            categoryName: 'Security',
            icon: '🕵️',
            desc: 'Penetration testing, exploit development, red teaming, and network vulnerability exploitation.',
            skills: ['Penetration Testing Methodologies', 'Kali Linux & Burp Suite Pro', 'Metasploit & Exploitation', 'Web Application Vulnerabilities', 'Network Port Scanning & Nmap', 'Privilege Escalation']
        },

        // =====================================================================
        // 5. TESTING / QUALITY
        // =====================================================================
        {
            id: 'QA Engineer',
            title: 'QA Engineer',
            category: 'qa_testing',
            categoryName: 'Testing / Quality',
            icon: '🧪',
            desc: 'Quality assurance methodologies, test plan creation, bug tracking, and manual/functional testing.',
            skills: ['Software Testing Life Cycle (STLC)', 'Test Case Design & Execution', 'Functional & Regression Testing', 'Bug Tracking & Jira Workflows', 'API Testing (Postman)', 'Agile QA Practices']
        },
        {
            id: 'Software Test Engineer',
            title: 'Software Test Engineer',
            category: 'qa_testing',
            categoryName: 'Testing / Quality',
            icon: '📋',
            desc: 'Comprehensive system validation, integration testing, end-to-end user workflows, and test documentation.',
            skills: ['Black-Box & White-Box Testing', 'Integration & System Testing', 'API Validation & JSON Assertions', 'SQL for Data Verification', 'Test Metrics & Traceability', 'Test Automation Basics']
        },
        {
            id: 'Automation Test Engineer',
            title: 'Automation Test Engineer',
            category: 'qa_testing',
            categoryName: 'Testing / Quality',
            icon: '🤖',
            desc: 'Automated test suites, Selenium/Playwright/Cypress frameworks, and CI/CD test pipeline automation.',
            skills: ['Selenium WebDriver', 'Playwright / Cypress', 'Java / Python / JavaScript', 'TestNG / PyTest / JUnit Frameworks', 'API Automation (RestAssured)', 'CI/CD Pipeline Integration', 'Page Object Model (POM)']
        },
        {
            id: 'Performance Test Engineer',
            title: 'Performance Test Engineer',
            category: 'qa_testing',
            categoryName: 'Testing / Quality',
            icon: '⏱️',
            desc: 'Load, stress, endurance testing, system performance profiling, and bottleneck analysis.',
            skills: ['Apache JMeter & Gatling', 'k6 Load Testing', 'Load, Stress & Spike Testing', 'Server Resource Monitoring', 'APM Profiling & Diagnostics', 'Throughput & Latency Analysis']
        },

        // =====================================================================
        // 6. OTHER TECHNOLOGY ROLES
        // =====================================================================
        {
            id: 'Database Administrator',
            title: 'Database Administrator',
            category: 'other_tech',
            categoryName: 'Other Technology Roles',
            icon: '🗄️',
            desc: 'Database performance tuning, backup & recovery, replication, and high-availability clustering.',
            skills: ['PostgreSQL / MySQL / Oracle', 'Performance Tuning & Query Plans', 'Backup & Disaster Recovery', 'Replication & High Availability', 'Index Optimization & Partitioning', 'Database Security & Access']
        },
        {
            id: 'System Administrator',
            title: 'System Administrator',
            category: 'other_tech',
            categoryName: 'Other Technology Roles',
            icon: '🖥️',
            desc: 'Linux/Windows server administration, networking, active directory, and infrastructure maintenance.',
            skills: ['Linux & Windows Server Administration', 'Bash & PowerShell Scripting', 'Active Directory & LDAP', 'Network Protocols (DNS/DHCP/SSH)', 'Virtualization (VMware/KVM)', 'System Patching & Backups']
        },
        {
            id: 'Business Analyst',
            title: 'Business Analyst',
            category: 'other_tech',
            categoryName: 'Other Technology Roles',
            icon: '📈',
            desc: 'Requirements gathering, process mapping, stakeholder communication, and functional specifications.',
            skills: ['Requirements Gathering & Elicitation', 'User Stories & Acceptance Criteria', 'Process Flow Mapping (BPMN)', 'SQL & Data Analysis', 'Agile & Scrum Methodologies', 'Wireframing & Stakeholder Demos']
        },
        {
            id: 'UI/UX Designer',
            title: 'UI/UX Designer',
            category: 'other_tech',
            categoryName: 'Other Technology Roles',
            icon: '🖌️',
            desc: 'User experience research, wireframing, interactive prototyping, and design systems in Figma.',
            skills: ['Figma & Interactive Prototyping', 'User Research & Usability Testing', 'Wireframing & User Journey Flows', 'Design Systems & Component Libraries', 'Information Architecture', 'Accessibility (a11y) Design']
        },
        {
            id: 'Technical Support Engineer',
            title: 'Technical Support Engineer',
            category: 'other_tech',
            categoryName: 'Other Technology Roles',
            icon: '🎧',
            desc: 'Technical troubleshooting, log analysis, customer issue resolution, and incident escalation.',
            skills: ['Technical Troubleshooting & Diagnostics', 'Log Analysis & Debugging', 'Linux CLI & Networking Basics', 'Ticketing Systems (Jira/ServiceNow)', 'Customer Technical Communication', 'Root Cause Analysis']
        },
        {
            id: 'Mechanical Engineer',
            title: 'Mechanical Engineer',
            category: 'other_tech',
            categoryName: 'Other Technology Roles',
            icon: '🔧',
            desc: 'Mechanical design, CAD modeling, thermodynamics, material mechanics, and manufacturing processes.',
            skills: ['CAD Modeling (SolidWorks/AutoCAD)', 'Thermodynamics & Fluid Mechanics', 'Strength of Materials', 'Manufacturing Processes', 'FEA & Simulation Analysis', 'GD&T (Geometric Dimensioning)']
        }
    ]
};

window.CONFIG = CONFIG;
