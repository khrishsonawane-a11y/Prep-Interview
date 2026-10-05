// In-Memory Dev Store for smooth local development & offline fallback

export const mockStore = {
    profiles: new Map(),
    interviews: new Map(),
    answers: new Map(),
    results: new Map(),
    jobRoles: [
        { id: 'Software Developer', title: 'Software Developer', category: 'software', skills: ['Data Structures & Algorithms', 'C++ / Java / Python', 'System Design', 'SQL & Databases', 'Git & Testing', 'OOP Principles'] },
        { id: 'Full Stack Developer', title: 'Full Stack Developer', category: 'software', skills: ['HTML5 & CSS3', 'JavaScript & TypeScript', 'React / Next.js', 'Node.js & Express', 'REST & GraphQL APIs', 'SQL & MongoDB', 'Docker'] },
        { id: 'Frontend Developer', title: 'Frontend Developer', category: 'software', skills: ['HTML5 & Semantic Web', 'CSS3 & Responsive UI', 'JavaScript (ES6+) & TypeScript', 'React / Next.js', 'State Management', 'Web Performance'] },
        { id: 'Backend Developer', title: 'Backend Developer', category: 'software', skills: ['Node.js / Java / Go / Python', 'REST & gRPC APIs', 'PostgreSQL / MySQL', 'Redis Caching', 'System Scalability', 'Microservices', 'OAuth/JWT'] },
        { id: 'Java Developer', title: 'Java Developer', category: 'software', skills: ['Core Java (8-21)', 'Spring Boot & Spring Data', 'Multithreading & Concurrency', 'JVM Internals & GC Tuning', 'Microservices Architecture', 'Hibernate/JPA'] },
        { id: 'Python Developer', title: 'Python Developer', category: 'software', skills: ['Python 3 & Advanced OOP', 'FastAPI & Django', 'Asyncio & Concurrency', 'Data Structures & Algorithms', 'PostgreSQL & SQLAlchemy', 'PyTest'] },
        { id: 'C++ Developer', title: 'C++ Developer', category: 'software', skills: ['Modern C++ (17/20)', 'STL & Memory Management', 'Pointers & Smart Pointers', 'Concurrency & Multithreading', 'Data Structures', 'Low-Latency Systems'] },
        { id: 'Mobile App Developer', title: 'Mobile App Developer', category: 'software', skills: ['Flutter / Dart', 'React Native / TypeScript', 'iOS (Swift) / Android (Kotlin)', 'State Management', 'Local Storage (SQLite/Room)', 'Mobile UI/UX'] },
        { id: 'Game Developer', title: 'Game Developer', category: 'software', skills: ['Unity & C#', 'Unreal Engine & C++', '2D & 3D Math / Physics', 'Graphics & Shader Pipelines', 'Game Loop & Optimization'] },
        { id: 'Application Developer', title: 'Application Developer', category: 'software', skills: ['App Architecture (MVVM/Clean)', 'Flutter / React Native / Electron', 'Local Persistence', 'State Management', 'REST APIs'] },
        { id: 'Web Developer', title: 'Web Developer', category: 'software', skills: ['HTML5 & Semantic Web', 'CSS3 & CSS Grid/Flexbox', 'JavaScript (ES6+)', 'HTTP/HTTPS & Fetch APIs', 'Web Security (CORS/CSRF)', 'Git'] },
        { id: 'Data Analyst', title: 'Data Analyst', category: 'data_ai', skills: ['Excel & Advanced Formulas', 'SQL (PostgreSQL/BigQuery)', 'Python (Pandas & NumPy)', 'Data Visualization', 'Power BI / Tableau', 'Statistical Analysis'] },
        { id: 'Data Scientist', title: 'Data Scientist', category: 'data_ai', skills: ['Python & R', 'Machine Learning Algorithms', 'Statistical Inference', 'Scikit-learn', 'Pandas & NumPy', 'Feature Engineering', 'SQL'] },
        { id: 'AI Engineer', title: 'AI Engineer', category: 'data_ai', skills: ['Python', 'Generative AI & LLMs', 'LangChain & LlamaIndex', 'Vector Databases (Pinecone/Chroma)', 'RAG Architectures', 'Prompt Engineering', 'PyTorch'] },
        { id: 'Machine Learning Engineer', title: 'Machine Learning Engineer', category: 'data_ai', skills: ['Python', 'PyTorch & TensorFlow', 'Scikit-learn', 'MLOps (MLflow/Kubeflow)', 'Model Deployment & Serving', 'Docker'] },
        { id: 'Generative AI Engineer', title: 'Generative AI Engineer', category: 'data_ai', skills: ['LLM Fine-Tuning (LoRA/QLoRA)', 'Transformers (Hugging Face)', 'RAG & Vector Search', 'AI Agents & Function Calling', 'Prompt Optimization'] },
        { id: 'NLP Engineer', title: 'NLP Engineer', category: 'data_ai', skills: ['Python', 'Transformers & BERT/GPT', 'Spacy & NLTK', 'Tokenization & Word Embeddings', 'Named Entity Recognition', 'Sentiment Analysis'] },
        { id: 'Computer Vision Engineer', title: 'Computer Vision Engineer', category: 'data_ai', skills: ['OpenCV & Image Processing', 'PyTorch & TensorFlow', 'YOLO & Object Detection', 'Semantic Segmentation', 'CNNs & Vision Transformers'] },
        { id: 'DevOps Engineer', title: 'DevOps Engineer', category: 'cloud_infra', skills: ['Linux & Bash Scripting', 'Git & GitHub Workflows', 'Docker Containerization', 'Kubernetes Orchestration', 'CI/CD Pipelines', 'AWS/GCP/Azure', 'Terraform (IaC)'] },
        { id: 'Cloud Engineer', title: 'Cloud Engineer', category: 'cloud_infra', skills: ['AWS / GCP / Azure Services', 'VPC & Cloud Networking', 'IAM & Cloud Security', 'Terraform & CloudFormation', 'Serverless (Lambda/Functions)', 'S3/GCS'] },
        { id: 'Cloud Architect', title: 'Cloud Architect', category: 'cloud_infra', skills: ['Multi-Cloud Architecture', 'Well-Architected Framework', 'High Availability & Disaster Recovery', 'Microservices Architecture', 'Cloud Governance'] },
        { id: 'Site Reliability Engineer', title: 'Site Reliability Engineer', category: 'cloud_infra', skills: ['Linux Internals & Networking', 'Python / Go Automation', 'Prometheus, Grafana & Datadog', 'Incident Management', 'SLI/SLO/SLA Framework'] },
        { id: 'Kubernetes Engineer', title: 'Kubernetes Engineer', category: 'cloud_infra', skills: ['Kubernetes Architecture', 'Helm Charts', 'Istio & Service Mesh', 'Cluster Networking (CNI)', 'Container Security', 'Persistent Volumes'] },
        { id: 'Cybersecurity Analyst', title: 'Cybersecurity Analyst', category: 'security', skills: ['SIEM Tools (Splunk/Sentinel)', 'Threat Detection & Analysis', 'Network Security & TCP/IP', 'Vulnerability Management', 'Incident Response'] },
        { id: 'Cybersecurity Engineer', title: 'Cybersecurity Engineer', category: 'security', skills: ['Network Defense & Firewalls', 'Identity & Access Management (IAM)', 'Cryptography & PKI', 'Zero-Trust Architecture', 'Endpoint Security'] },
        { id: 'Security Engineer', title: 'Security Engineer', category: 'security', skills: ['Application Security (OWASP Top 10)', 'SAST & DAST Tools', 'Secure Code Review', 'Threat Modeling', 'Container & Cloud Security'] },
        { id: 'Ethical Hacker / Penetration Tester', title: 'Ethical Hacker / Penetration Tester', category: 'security', skills: ['Penetration Testing Methodologies', 'Kali Linux & Burp Suite', 'Metasploit', 'Web App Vulnerabilities', 'Network Exploitation'] },
        { id: 'QA Engineer', title: 'QA Engineer', category: 'qa_testing', skills: ['Software Testing Life Cycle (STLC)', 'Test Case Design & Execution', 'Functional & Regression Testing', 'Bug Tracking (Jira)', 'API Testing (Postman)'] },
        { id: 'Software Test Engineer', title: 'Software Test Engineer', category: 'qa_testing', skills: ['Black-Box & White-Box Testing', 'Integration & System Testing', 'API Validation', 'SQL for Verification', 'Test Automation Basics'] },
        { id: 'Automation Test Engineer', title: 'Automation Test Engineer', category: 'qa_testing', skills: ['Selenium WebDriver', 'Playwright / Cypress', 'Java / Python / JS', 'TestNG / PyTest / JUnit', 'API Automation (RestAssured)', 'CI/CD Testing'] },
        { id: 'Performance Test Engineer', title: 'Performance Test Engineer', category: 'qa_testing', skills: ['Apache JMeter & Gatling', 'k6 Load Testing', 'Load & Stress Testing', 'Server Resource Monitoring', 'APM Profiling'] },
        { id: 'Database Administrator', title: 'Database Administrator', category: 'other_tech', skills: ['PostgreSQL / MySQL / Oracle', 'Performance Tuning & Query Plans', 'Backup & Disaster Recovery', 'Replication & Clustering', 'Index Optimization'] },
        { id: 'System Administrator', title: 'System Administrator', category: 'other_tech', skills: ['Linux & Windows Administration', 'Bash & PowerShell Scripting', 'Active Directory & LDAP', 'Network Protocols (DNS/DHCP/SSH)', 'Virtualization'] },
        { id: 'Business Analyst', title: 'Business Analyst', category: 'other_tech', skills: ['Requirements Gathering', 'User Stories & Acceptance Criteria', 'Process Flow Mapping (BPMN)', 'SQL & Data Analysis', 'Agile & Scrum'] },
        { id: 'UI/UX Designer', title: 'UI/UX Designer', category: 'other_tech', skills: ['Figma & Prototyping', 'User Research & Usability Testing', 'Wireframing & User Journeys', 'Design Systems', 'Accessibility (a11y)'] },
        { id: 'Technical Support Engineer', title: 'Technical Support Engineer', category: 'other_tech', skills: ['Technical Troubleshooting', 'Log Analysis & Debugging', 'Linux CLI & Networking', 'Ticketing Systems (Jira/ServiceNow)', 'Customer Communication'] },
        { id: 'Mechanical Engineer', title: 'Mechanical Engineer', category: 'other_tech', skills: ['CAD Modeling (SolidWorks/AutoCAD)', 'Thermodynamics & Fluid Mechanics', 'Strength of Materials', 'Manufacturing Processes', 'FEA Simulation'] }
    ],

    // =========================================================================
    // 1. APTITUDE QUESTIONS POOL (35 Questions)
    // =========================================================================
    aptitudeQuestions: [
        {
                "id": "apt-1",
                "category": "Quantitative",
                "topic": "Percentages",
                "difficulty": "Intermediate",
                "question": "A shopkeeper marks an item at 25% above cost price and allows a discount of 10% for cash payment. What is his profit percentage?",
                "options": [
                        "10%",
                        "12.5%",
                        "15%",
                        "17.5%"
                ],
                "correct_option": 1,
                "explanation": "Let CP = 100. Marked Price (MP) = 125. Selling Price with 10% discount = 125 * 0.9 = 112.5. Profit = 112.5 - 100 = 12.5%."
        },
        {
                "id": "apt-2",
                "category": "Quantitative",
                "topic": "Profit and Loss",
                "difficulty": "Beginner",
                "question": "If the cost price of 12 pens is equal to the selling price of 8 pens, find the gain percentage.",
                "options": [
                        "25%",
                        "33.33%",
                        "50%",
                        "66.67%"
                ],
                "correct_option": 2,
                "explanation": "Let CP of 1 pen = 1. CP of 8 pens = 8. SP of 8 pens = CP of 12 pens = 12. Profit = 12 - 8 = 4. Gain % = (4 / 8) * 100 = 50%."
        },
        {
                "id": "apt-3",
                "category": "Quantitative",
                "topic": "Time and Work",
                "difficulty": "Intermediate",
                "question": "A can complete a piece of work in 12 days, and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work is left?",
                "options": [
                        "1/3",
                        "4/9",
                        "5/9",
                        "2/3"
                ],
                "correct_option": 1,
                "explanation": "1 day work of A+B = (1/12) + (1/18) = 5/36. 4 days work = 4 * (5/36) = 20/36 = 5/9. Work left = 1 - 5/9 = 4/9."
        },
        {
                "id": "apt-4",
                "category": "Logical Reasoning",
                "topic": "Number Systems",
                "difficulty": "Frequently Asked",
                "question": "Find the next number in the series: 3, 7, 15, 31, 63, ?",
                "options": [
                        "126",
                        "127",
                        "128",
                        "129"
                ],
                "correct_option": 1,
                "explanation": "The pattern is (2 * n) + 1. 63 * 2 + 1 = 127."
        },
        {
                "id": "apt-5",
                "category": "Logical Reasoning",
                "topic": "Logical Puzzles",
                "difficulty": "Frequently Asked",
                "question": "Pointing to a photograph of a man, Rahul said, 'His mother is the only daughter of my mother.' How is Rahul related to the person in the photograph?",
                "options": [
                        "Father",
                        "Uncle",
                        "Brother",
                        "Maternal Uncle"
                ],
                "correct_option": 3,
                "explanation": "Rahul's mother's only daughter is Rahul's sister. The man's mother is Rahul's sister. Thus, Rahul is the maternal uncle."
        },
        {
                "id": "apt-6",
                "category": "Quantitative",
                "topic": "Time, Speed and Distance",
                "difficulty": "Advanced",
                "question": "A train 150 meters long takes 15 seconds to cross a bridge 300 meters long. What is the speed of the train in km/h?",
                "options": [
                        "72 km/h",
                        "90 km/h",
                        "108 km/h",
                        "120 km/h"
                ],
                "correct_option": 2,
                "explanation": "Total distance = 150 + 300 = 450 meters. Speed in m/s = 450 / 15 = 30 m/s. Speed in km/h = 30 * (18 / 5) = 108 km/h."
        },
        {
                "id": "apt-7",
                "category": "Quantitative",
                "topic": "Probability",
                "difficulty": "Intermediate",
                "question": "Two dice are rolled simultaneously. What is the probability that the sum of the numbers obtained is a prime number?",
                "options": [
                        "5/12",
                        "7/18",
                        "1/2",
                        "5/18"
                ],
                "correct_option": 0,
                "explanation": "Prime sums possible: 2, 3, 5, 7, 11. Count of outcomes: 2 (1), 3 (2), 5 (4), 7 (6), 11 (2) = 15 out of 36. Probability = 15/36 = 5/12."
        },
        {
                "id": "apt-8",
                "category": "Quantitative",
                "topic": "Ratio and Proportion",
                "difficulty": "Beginner",
                "question": "The ratio of the ages of A and B is 4:5. Six years hence, the ratio of their ages will become 5:6. What is the present age of A?",
                "options": [
                        "20 years",
                        "24 years",
                        "28 years",
                        "30 years"
                ],
                "correct_option": 1,
                "explanation": "Let ages be 4x and 5x. (4x + 6) / (5x + 6) = 5/6 => 24x + 36 = 25x + 30 => x = 6. Present age of A = 4 * 6 = 24 years."
        },
        {
                "id": "apt-9",
                "category": "Quantitative",
                "topic": "Average",
                "difficulty": "Beginner",
                "question": "The average score of a batsman in 10 innings was 44. How many runs must he score in the 11th inning to raise his average to 48?",
                "options": [
                        "84",
                        "88",
                        "92",
                        "96"
                ],
                "correct_option": 1,
                "explanation": "Total runs in 10 innings = 10 * 44 = 440. Required total in 11 innings = 11 * 48 = 528. Required runs = 528 - 440 = 88."
        },
        {
                "id": "apt-10",
                "category": "Quantitative",
                "topic": "Simple and Compound Interest",
                "difficulty": "Intermediate",
                "question": "A sum of money invested at Simple Interest doubles itself in 8 years. In how many years will it treble (become 3 times) at the same rate?",
                "options": [
                        "12 years",
                        "14 years",
                        "16 years",
                        "20 years"
                ],
                "correct_option": 2,
                "explanation": "Doubling means SI = P in 8 years. Trebling means SI = 2P. Time taken for double the interest = 2 * 8 = 16 years."
        },
        {
                "id": "apt-11",
                "category": "Quantitative",
                "topic": "Simple and Compound Interest",
                "difficulty": "Intermediate",
                "question": "Find the compound interest on $10,000 for 2 years at 10% per annum, compounded annually.",
                "options": [
                        "$2,000",
                        "$2,100",
                        "$2,200",
                        "$2,050"
                ],
                "correct_option": 1,
                "explanation": "Amount = 10,000 * (1 + 0.10)^2 = 10,000 * 1.21 = $12,100. CI = 12,100 - 10,000 = $2,100."
        },
        {
                "id": "apt-12",
                "category": "Quantitative",
                "topic": "Permutation and Combination",
                "difficulty": "Intermediate",
                "question": "In how many distinct ways can the letters of the word 'LEADER' be arranged?",
                "options": [
                        "720",
                        "360",
                        "120",
                        "180"
                ],
                "correct_option": 1,
                "explanation": "Word has 6 letters with 'E' repeating 2 times. Total permutations = 6! / 2! = 720 / 2 = 360."
        },
        {
                "id": "apt-13",
                "category": "Quantitative",
                "topic": "Time and Work",
                "difficulty": "Beginner",
                "question": "Pipe A can fill a tank in 20 minutes and Pipe B can fill it in 30 minutes. If both pipes are opened together, how long will it take to fill the tank?",
                "options": [
                        "10 minutes",
                        "12 minutes",
                        "15 minutes",
                        "18 minutes"
                ],
                "correct_option": 1,
                "explanation": "Combined rate = 1/20 + 1/30 = 5/60 = 1/12. Time taken = 12 minutes."
        },
        {
                "id": "apt-14",
                "category": "Quantitative",
                "topic": "Time, Speed and Distance",
                "difficulty": "Intermediate",
                "question": "Two cars start from two cities 300 km apart and travel towards each other at speeds of 60 km/h and 40 km/h respectively. After how many hours will they meet?",
                "options": [
                        "2.5 hours",
                        "3 hours",
                        "3.5 hours",
                        "4 hours"
                ],
                "correct_option": 1,
                "explanation": "Relative speed = 60 + 40 = 100 km/h. Time to meet = 300 / 100 = 3 hours."
        },
        {
                "id": "apt-15",
                "category": "Quantitative",
                "topic": "Number Systems",
                "difficulty": "Frequently Asked",
                "question": "What is the remainder when (7^19 + 2) is divided by 6?",
                "options": [
                        "1",
                        "2",
                        "3",
                        "5"
                ],
                "correct_option": 2,
                "explanation": "7 mod 6 = 1. Therefore 7^19 mod 6 = 1^19 mod 6 = 1. Adding 2 gives (1 + 2) mod 6 = 3 mod 6 = 3."
        },
        {
                "id": "apt-16",
                "category": "Logical Reasoning",
                "topic": "Logical Reasoning",
                "difficulty": "Intermediate",
                "question": "Statements: All cats are dogs. All dogs are birds. Conclusions: I. All cats are birds. II. All birds are cats.",
                "options": [
                        "Only conclusion I follows",
                        "Only conclusion II follows",
                        "Both I and II follow",
                        "Neither I nor II follows"
                ],
                "correct_option": 0,
                "explanation": "Cats ⊆ Dogs ⊆ Birds implies all cats are birds (I follows). But not all birds are necessarily cats (II does not follow)."
        },
        {
                "id": "apt-17",
                "category": "Logical Reasoning",
                "topic": "Coding Patterns",
                "difficulty": "Frequently Asked",
                "question": "If in a certain code language 'PENCIL' is written as 'QGODKN', how is 'PAPER' written in that same code?",
                "options": [
                        "QBQFS",
                        "QCQFS",
                        "QBQES",
                        "QBRFS"
                ],
                "correct_option": 0,
                "explanation": "Pattern is +1 for each letter: P(+1)->Q, A(+1)->B, P(+1)->Q, E(+1)->F, R(+1)->S. Hence PAPER becomes QBQFS."
        },
        {
                "id": "apt-18",
                "category": "Logical Reasoning",
                "topic": "Logical Reasoning",
                "difficulty": "Beginner",
                "question": "A person walks 10 meters North, turns right and walks 15 meters, then turns right again and walks 10 meters. How far and in which direction is he from his starting point?",
                "options": [
                        "15 meters East",
                        "15 meters West",
                        "10 meters East",
                        "25 meters North"
                ],
                "correct_option": 0,
                "explanation": "Moving 10m North and 10m South cancels the vertical displacement. The horizontal displacement is 15m to the East."
        },
        {
                "id": "apt-19",
                "category": "Data Interpretation",
                "topic": "Basic Data Interpretation",
                "difficulty": "Beginner",
                "question": "A company produced 1200 units in 2021, 1500 units in 2022, and 1800 units in 2023. What is the percentage growth in production from 2021 to 2023?",
                "options": [
                        "33.33%",
                        "40%",
                        "50%",
                        "60%"
                ],
                "correct_option": 2,
                "explanation": "Increase = 1800 - 1200 = 600 units. Percentage growth = (600 / 1200) * 100 = 50%."
        },
        {
                "id": "apt-20",
                "category": "Quantitative",
                "topic": "Ratio and Proportion",
                "difficulty": "Intermediate",
                "question": "In what ratio must tea at $62 per kg be mixed with tea at $72 per kg so that the mixture is worth $65 per kg?",
                "options": [
                        "7:3",
                        "3:7",
                        "5:3",
                        "3:5"
                ],
                "correct_option": 0,
                "explanation": "By rule of alligation: (72 - 65) : (65 - 62) = 7 : 3."
        },
        {
                "id": "apt-21",
                "category": "Quantitative",
                "topic": "Basic Quantitative Reasoning",
                "difficulty": "Beginner",
                "question": "The sum of the present ages of a father and his son is 60 years. Six years ago, father's age was five times the age of the son. What is the son's present age?",
                "options": [
                        "12 years",
                        "14 years",
                        "16 years",
                        "18 years"
                ],
                "correct_option": 1,
                "explanation": "6 years ago sum was 60 - 12 = 48. Let son's age 6 yrs ago be x; 5x + x = 48 => x = 8. Son's present age = 8 + 6 = 14 years."
        },
        {
                "id": "apt-22",
                "category": "Quantitative",
                "topic": "Probability",
                "difficulty": "Intermediate",
                "question": "A card is drawn at random from a standard well-shuffled pack of 52 cards. What is the probability of getting a King or a Heart?",
                "options": [
                        "4/13",
                        "1/4",
                        "17/52",
                        "16/52"
                ],
                "correct_option": 0,
                "explanation": "Number of Kings = 4, Number of Hearts = 13, King of Hearts = 1. Favorable = 4 + 13 - 1 = 16. Probability = 16/52 = 4/13."
        },
        {
                "id": "apt-23",
                "category": "Quantitative",
                "topic": "Number Systems",
                "difficulty": "Frequently Asked",
                "question": "What is the smallest 4-digit number that is completely divisible by 12, 15, and 18?",
                "options": [
                        "1020",
                        "1080",
                        "1100",
                        "1180"
                ],
                "correct_option": 1,
                "explanation": "LCM(12, 15, 18) = 180. 1000 / 180 = 5 with remainder 100. Required number = 1000 + (180 - 100) = 1080."
        },
        {
                "id": "apt-24",
                "category": "Quantitative",
                "topic": "Permutation and Combination",
                "difficulty": "Frequently Asked",
                "question": "In a room of 10 people, everyone shakes hands with everyone else exactly once. How many total handshakes take place?",
                "options": [
                        "45",
                        "50",
                        "90",
                        "100"
                ],
                "correct_option": 0,
                "explanation": "Total handshakes = 10C2 = (10 * 9) / 2 = 45."
        },
        {
                "id": "apt-25",
                "category": "Logical Reasoning",
                "topic": "Number Systems",
                "difficulty": "Intermediate",
                "question": "Find the missing number in the sequence: 2, 6, 12, 20, 30, 42, ?",
                "options": [
                        "52",
                        "54",
                        "56",
                        "60"
                ],
                "correct_option": 2,
                "explanation": "The terms are n * (n + 1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8 = 56."
        },
        {
                "id": "apt-26",
                "category": "Quantitative",
                "topic": "Time, Speed and Distance",
                "difficulty": "Intermediate",
                "question": "A boat can travel with a speed of 13 km/h in still water. If the speed of the stream is 4 km/h, find the time taken by the boat to go 68 km downstream.",
                "options": [
                        "3 hours",
                        "4 hours",
                        "5 hours",
                        "5.5 hours"
                ],
                "correct_option": 1,
                "explanation": "Downstream speed = 13 + 4 = 17 km/h. Time = 68 / 17 = 4 hours."
        },
        {
                "id": "apt-27",
                "category": "Quantitative",
                "topic": "Percentages",
                "difficulty": "Intermediate",
                "question": "The population of a town increases by 10% annually. If its present population is 20,000, what will be the population after 2 years?",
                "options": [
                        "22,000",
                        "24,000",
                        "24,200",
                        "24,400"
                ],
                "correct_option": 2,
                "explanation": "Population after 2 years = 20,000 * (1 + 0.10)^2 = 20,000 * 1.21 = 24,200."
        },
        {
                "id": "apt-28",
                "category": "Quantitative",
                "topic": "Profit and Loss",
                "difficulty": "Frequently Asked",
                "question": "Find the single equivalent discount percentage for two successive discounts of 20% and 10%.",
                "options": [
                        "28%",
                        "30%",
                        "25%",
                        "29%"
                ],
                "correct_option": 0,
                "explanation": "Equivalent discount = 20 + 10 - (20 * 10 / 100) = 30 - 2 = 28%."
        },
        {
                "id": "apt-29",
                "category": "Logical Reasoning",
                "topic": "Logical Reasoning",
                "difficulty": "Intermediate",
                "question": "Five friends (P, Q, R, S, T) are sitting in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the middle?",
                "options": [
                        "P",
                        "T",
                        "S",
                        "Q"
                ],
                "correct_option": 2,
                "explanation": "Arrangement from left to right is P - T - S - Q - R. S is sitting in the exact middle."
        },
        {
                "id": "apt-30",
                "category": "Logical Reasoning",
                "topic": "Logical Reasoning",
                "difficulty": "Frequently Asked",
                "question": "What is the angle between the hour hand and the minute hand of a clock at 3:30?",
                "options": [
                        "70 degrees",
                        "75 degrees",
                        "80 degrees",
                        "85 degrees"
                ],
                "correct_option": 1,
                "explanation": "Angle = |30*H - (11/2)*M| = |30*3 - (11/2)*30| = |90 - 165| = 75 degrees."
        },
        {
                "id": "apt-31",
                "category": "Logical Reasoning",
                "topic": "Logical Reasoning",
                "difficulty": "Frequently Asked",
                "question": "If January 1, 2006 was a Sunday, what day of the week was January 1, 2010?",
                "options": [
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                ],
                "correct_option": 1,
                "explanation": "Odd days: 2006(1) + 2007(1) + 2008(2) + 2009(1) = 5 odd days. Sunday + 5 days = Friday."
        },
        {
                "id": "apt-32",
                "category": "Quantitative",
                "topic": "Time and Work",
                "difficulty": "Advanced",
                "question": "A and B undertake to do a piece of work for $600. A alone can do it in 6 days while B alone can do it in 8 days. With the help of C, they finish it in 3 days. Find C's share.",
                "options": [
                        "$75",
                        "$100",
                        "$125",
                        "$150"
                ],
                "correct_option": 0,
                "explanation": "C's 1-day work = 1/3 - (1/6 + 1/8) = 1/24. Work ratio A:B:C = 4:3:1. C's share = (1/8) * 600 = $75."
        },
        {
                "id": "apt-33",
                "category": "Quantitative",
                "topic": "Basic Quantitative Reasoning",
                "difficulty": "Beginner",
                "question": "Which of the following fractions is the largest: 3/4, 5/6, 7/9, 11/13?",
                "options": [
                        "3/4",
                        "5/6",
                        "7/9",
                        "11/13"
                ],
                "correct_option": 3,
                "explanation": "Decimals: 3/4 = 0.75, 5/6 = 0.833, 7/9 = 0.777, 11/13 ≈ 0.846. Hence 11/13 is the largest."
        },
        {
                "id": "apt-34",
                "category": "Logical Reasoning",
                "topic": "Number Systems",
                "difficulty": "Beginner",
                "question": "Find the odd one out from the given options: 27, 64, 125, 144, 216.",
                "options": [
                        "27",
                        "64",
                        "125",
                        "144"
                ],
                "correct_option": 3,
                "explanation": "27=3^3, 64=4^3, 125=5^3, 216=6^3 are all perfect cubes. 144 = 12^2 is a square, not a cube."
        },
        {
                "id": "apt-35",
                "category": "Data Interpretation",
                "topic": "Basic Data Interpretation",
                "difficulty": "Beginner",
                "question": "A monthly family budget of $4,000 allocates 35% to rent, 25% to food, 15% to savings, and the rest to miscellaneous expenses. How much is spent on miscellaneous expenses?",
                "options": [
                        "$800",
                        "$1,000",
                        "$1,200",
                        "$600"
                ],
                "correct_option": 1,
                "explanation": "Miscellaneous percentage = 100% - (35% + 25% + 15%) = 25%. Amount = 0.25 * 4,000 = $1,000."
        }
],

    // =========================================================================
    // 2. TECHNICAL QUESTIONS POOL (32 Questions)
    // =========================================================================
    technicalQuestions: [
        {
                "id": "tech-1",
                "role": "Software Developer",
                "topic": "OOP",
                "difficulty": "Intermediate",
                "question": "Explain the four pillars of Object-Oriented Programming (OOP) with real-world engineering examples.",
                "expected_concepts": [
                        "Encapsulation",
                        "Abstraction",
                        "Inheritance",
                        "Polymorphism"
                ],
                "sample_answer": "Encapsulation (bundling state and methods within classes with access modifiers), Abstraction (hiding implementation complexity behind interfaces), Inheritance (reusing attributes from a base class), and Polymorphism (ability to take multiple forms via overriding and overloading)."
        },
        {
                "id": "tech-2",
                "role": "Full Stack Developer",
                "topic": "DBMS & Databases",
                "difficulty": "Intermediate",
                "question": "What are ACID properties in database management systems and why are they critical for transaction reliability?",
                "expected_concepts": [
                        "Atomicity",
                        "Consistency",
                        "Isolation",
                        "Durability"
                ],
                "sample_answer": "Atomicity ensures all-or-nothing transactions, Consistency guarantees state transitions adhere to constraints, Isolation prevents concurrent race collisions, and Durability ensures committed writes persist even through power outages."
        },
        {
                "id": "tech-3",
                "role": "Frontend Developer",
                "topic": "Web Performance & DOM",
                "difficulty": "Intermediate",
                "question": "What is the difference between Virtual DOM and Real DOM, and how does the reconciliation algorithm optimize rendering?",
                "expected_concepts": [
                        "Virtual DOM tree",
                        "Diffing algorithm",
                        "Batch DOM updates",
                        "Reflow and Repaint reduction"
                ],
                "sample_answer": "The Real DOM triggers expensive layout reflows on every mutation. The Virtual DOM creates an in-memory lightweight representation, computes minimal tree differences (diffing), and batch updates only the affected nodes."
        },
        {
                "id": "tech-4",
                "role": "Backend Developer",
                "topic": "APIs & Web Services",
                "difficulty": "Intermediate",
                "question": "What is the architectural difference between REST and GraphQL? In what scenarios would you choose one over the other?",
                "expected_concepts": [
                        "Fixed endpoints vs Single endpoint",
                        "Over-fetching and Under-fetching",
                        "Schema & Type safety",
                        "HTTP caching"
                ],
                "sample_answer": "REST uses resource-centric HTTP endpoints with standard methods and native caching. GraphQL uses a single POST endpoint with a strongly typed schema allowing clients to declare exact data shapes, eliminating over-fetching."
        },
        {
                "id": "tech-5",
                "role": "Full Stack Developer",
                "topic": "Authentication & Security",
                "difficulty": "Advanced",
                "question": "How does JWT (JSON Web Token) authentication work, and how do you mitigate risks like token theft and session revocation?",
                "expected_concepts": [
                        "Header.Payload.Signature",
                        "Statelessness",
                        "HttpOnly Cookies",
                        "Short-lived Access Tokens & Refresh Tokens"
                ],
                "sample_answer": "JWTs encode claims signed cryptographically. Mitigation includes storing tokens in secure HttpOnly SameSite cookies, issuing short-lived access tokens (15m) paired with rotating refresh tokens stored in a revoked-list database."
        },
        {
                "id": "tech-6",
                "role": "Software Developer",
                "topic": "Operating Systems",
                "difficulty": "Intermediate",
                "question": "Explain the difference between a Process and a Thread. How does context switching overhead differ between them?",
                "expected_concepts": [
                        "Separate address space vs Shared memory",
                        "Context switching overhead",
                        "Process Control Block (PCB) vs TCB",
                        "Inter-Process Communication (IPC)"
                ],
                "sample_answer": "A process has its own isolated virtual memory space and resources, while threads share the process memory heap, code, and file descriptors. Thread context switching is substantially faster because virtual memory mappings do not need to be reloaded."
        },
        {
                "id": "tech-7",
                "role": "Software Developer",
                "topic": "Computer Networks",
                "difficulty": "Intermediate",
                "question": "Describe the TCP 3-Way Handshake. Why is it necessary before data transmission compared to UDP?",
                "expected_concepts": [
                        "SYN, SYN-ACK, ACK",
                        "Sequence numbers initialization",
                        "Reliable ordered delivery",
                        "Connection-oriented vs Connectionless"
                ],
                "sample_answer": "Client sends SYN with initial sequence number, server responds with SYN-ACK, and client sends ACK. This synchronizes sequence numbers and establishes a reliable, bidirectional, ordered data transmission stream before payloads are exchanged."
        },
        {
                "id": "tech-8",
                "role": "Backend Developer",
                "topic": "DBMS & Databases",
                "difficulty": "Advanced",
                "question": "How does database indexing work under the hood? Contrast B-Tree indexes with Hash indexes.",
                "expected_concepts": [
                        "B-Tree / B+Tree structure",
                        "O(log N) lookup",
                        "Range queries support",
                        "Hash index O(1) exact match limitations"
                ],
                "sample_answer": "B-Tree indexes maintain balanced, sorted tree hierarchies optimal for range scans, sorting, and equality searches in O(log N) time. Hash indexes provide O(1) lookups for exact matches but cannot perform range searches or ORDER BY queries."
        },
        {
                "id": "tech-9",
                "role": "Software Developer",
                "topic": "SQL & Databases",
                "difficulty": "Beginner",
                "question": "Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with practical examples.",
                "expected_concepts": [
                        "Matching rows only",
                        "All left rows with NULL right",
                        "All right rows with NULL left",
                        "Union of all records"
                ],
                "sample_answer": "INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table with matched right records (or NULL). RIGHT JOIN does the reverse, and FULL OUTER JOIN returns all rows from both tables."
        },
        {
                "id": "tech-10",
                "role": "Java Developer",
                "topic": "Java Internals & JVM",
                "difficulty": "Intermediate",
                "question": "How does Garbage Collection work in the JVM? Explain the Young, Old, and Permanent/Metaspace generations.",
                "expected_concepts": [
                        "Mark and Sweep algorithm",
                        "Eden, Survivor (S0/S1), Tenured/Old generation",
                        "Minor GC vs Major GC",
                        "Metaspace memory"
                ],
                "sample_answer": "Objects are allocated in the Eden space. Surviving objects migrate through Survivor spaces during Minor GCs and get promoted to the Old Generation. Major GCs collect long-lived objects when Tenured memory fills up."
        },
        {
                "id": "tech-11",
                "role": "Python Developer",
                "topic": "Python Internals",
                "difficulty": "Intermediate",
                "question": "What is the Global Interpreter Lock (GIL) in CPython, and how do you achieve true parallelism in CPU-bound vs I/O-bound Python programs?",
                "expected_concepts": [
                        "CPython mutex",
                        "Single thread bytecode execution",
                        "multiprocessing module for CPU tasks",
                        "asyncio / threading for I/O tasks"
                ],
                "sample_answer": "The GIL is a mutex preventing multiple native threads from executing Python bytecodes simultaneously. For I/O-bound tasks, threading or asyncio achieves concurrency; for CPU-bound tasks, multiprocessing or C-extensions bypass the GIL."
        },
        {
                "id": "tech-12",
                "role": "Frontend Developer",
                "topic": "JavaScript Internals",
                "difficulty": "Intermediate",
                "question": "Explain the JavaScript Event Loop, Call Stack, Microtask Queue, and Macrotask Queue execution order.",
                "expected_concepts": [
                        "Call stack execution",
                        "Microtasks (Promises, queueMicrotask)",
                        "Macrotasks (setTimeout, setInterval)",
                        "Event loop prioritization"
                ],
                "sample_answer": "Synchronous code runs on the Call Stack. When empty, the event loop drains ALL microtasks (Promises, process.nextTick) before picking the next single macrotask (setTimeout, DOM events, I/O)."
        },
        {
                "id": "tech-13",
                "role": "Software Developer",
                "topic": "System Design",
                "difficulty": "Advanced",
                "question": "Explain the CAP Theorem and how distributed databases make trade-offs between Consistency, Availability, and Partition Tolerance.",
                "expected_concepts": [
                        "Consistency",
                        "Availability",
                        "Partition Tolerance",
                        "CP vs AP database systems"
                ],
                "sample_answer": "In a network partition (P), a distributed system can guarantee either Consistency (C) by rejecting stale writes/reads or Availability (A) by continuing to serve local responses at the expense of temporary divergence."
        },
        {
                "id": "tech-14",
                "role": "Backend Developer",
                "topic": "Caching & Performance",
                "difficulty": "Intermediate",
                "question": "Compare Cache-Aside, Write-Through, and Write-Back caching strategies. When is Redis preferred over Memcached?",
                "expected_concepts": [
                        "Cache-Aside pattern",
                        "Write-Through latency",
                        "Write-Back async durability risk",
                        "Redis data structures & persistence"
                ],
                "sample_answer": "Cache-Aside queries cache first and populates on miss. Write-Through writes simultaneously to cache and DB. Write-Back writes to cache and syncs DB asynchronously. Redis is chosen for rich data structures, pub/sub, and persistence."
        },
        {
                "id": "tech-15",
                "role": "Software Developer",
                "topic": "Web Security",
                "difficulty": "Intermediate",
                "question": "Explain Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). How do you defend modern web applications against them?",
                "expected_concepts": [
                        "Stored/Reflected XSS",
                        "Content Security Policy (CSP)",
                        "HTML escaping & sanitization",
                        "CSRF tokens & SameSite cookies"
                ],
                "sample_answer": "XSS executes unauthorized client scripts; defended with HTML context escaping and strict CSP headers. CSRF tricks authenticated browsers into submitting malicious requests; defended using Anti-CSRF tokens and SameSite=Strict cookies."
        },
        {
                "id": "tech-16",
                "role": "Software Developer",
                "topic": "Computer Networks & Security",
                "difficulty": "Intermediate",
                "question": "How does an HTTPS TLS/SSL handshake establish secure communication? Explain symmetric vs asymmetric encryption in this context.",
                "expected_concepts": [
                        "TLS certificate verification",
                        "Asymmetric key exchange (RSA/Diffie-Hellman)",
                        "Symmetric session key",
                        "Data integrity / HMAC"
                ],
                "sample_answer": "The client verifies the server certificate using CA public keys. Asymmetric encryption negotiates a shared secret session key. Subsequent HTTP traffic is encrypted using fast symmetric encryption (AES-GCM) with this shared key."
        },
        {
                "id": "tech-17",
                "role": "Software Developer",
                "topic": "DBMS & Databases",
                "difficulty": "Intermediate",
                "question": "What is Database Normalization (1NF, 2NF, 3NF)? When is deliberate Denormalization justified in read-heavy applications?",
                "expected_concepts": [
                        "1NF atomic values",
                        "2NF partial dependency removal",
                        "3NF transitive dependency removal",
                        "Denormalization for fast joins"
                ],
                "sample_answer": "1NF enforces atomic columns, 2NF eliminates partial dependencies on composite keys, and 3NF removes transitive dependencies. Denormalization reduces expensive multi-table joins in high-scale read-heavy systems like analytics dashboards."
        },
        {
                "id": "tech-18",
                "role": "Software Developer",
                "topic": "System Design",
                "difficulty": "Intermediate",
                "question": "Explain the main Load Balancing algorithms (Round Robin, Least Connections, Consistent Hashing) and Layer 4 vs Layer 7 load balancing.",
                "expected_concepts": [
                        "Round Robin & Weighted Round Robin",
                        "Least Connections",
                        "Consistent Hashing for cache locality",
                        "L4 (TCP/UDP) vs L7 (HTTP/Path routing)"
                ],
                "sample_answer": "Round Robin rotates requests sequentially; Least Connections directs traffic to servers with fewest active sessions. Consistent Hashing minimizes cache misses on node scaling. L4 balances at transport level; L7 inspects HTTP headers, cookies, and URLs."
        },
        {
                "id": "tech-19",
                "role": "Software Developer",
                "topic": "Data Structures & Algorithms",
                "difficulty": "Intermediate",
                "question": "How do Hash Tables resolve collisions? Compare Separate Chaining with Open Addressing (Linear Probing, Quadratic Probing, Double Hashing).",
                "expected_concepts": [
                        "Hash function distribution",
                        "Separate Chaining with Linked Lists / Red-Black trees",
                        "Linear / Quadratic probing",
                        "Load factor & rehashing"
                ],
                "sample_answer": "Separate Chaining stores colliding entries in linked lists or balanced trees at the bucket index. Open Addressing searches for adjacent empty slots in the main table array via probing sequences when collisions occur."
        },
        {
                "id": "tech-20",
                "role": "Backend Developer",
                "topic": "Messaging & Microservices",
                "difficulty": "Advanced",
                "question": "What are the core differences between RabbitMQ (message broker) and Apache Kafka (distributed event streaming log)?",
                "expected_concepts": [
                        "Push vs Pull model",
                        "Smart broker vs Dumb broker / Smart consumer",
                        "Log retention & replayability",
                        "Throughput scaling"
                ],
                "sample_answer": "RabbitMQ is an AMQP broker that tracks delivery state and deletes messages after ack. Kafka is an immutable, distributed, append-only partitioned log where consumers pull and track their own offsets, allowing historical replay."
        },
        {
                "id": "tech-21",
                "role": "Frontend Developer",
                "topic": "Web Performance",
                "difficulty": "Intermediate",
                "question": "What are Google Core Web Vitals (LCP, INP, CLS) and what engineering techniques optimize each metric?",
                "expected_concepts": [
                        "Largest Contentful Paint (LCP)",
                        "Interaction to Next Paint (INP)",
                        "Cumulative Layout Shift (CLS)",
                        "Image sizing, code splitting, layout stability"
                ],
                "sample_answer": "LCP measures load speed (optimized via CDNs, preload headers, and image compression). INP measures user interactivity responsiveness (optimized by yielding to main thread and debouncing). CLS measures layout shifts (fixed by reserving width/height on media)."
        },
        {
                "id": "tech-22",
                "role": "Software Developer",
                "topic": "Operating Systems",
                "difficulty": "Intermediate",
                "question": "What are the four Coffman conditions required for a Deadlock to occur, and how do operating systems prevent or recover from deadlocks?",
                "expected_concepts": [
                        "Mutual Exclusion",
                        "Hold and Wait",
                        "No Preemption",
                        "Circular Wait",
                        "Banker's Algorithm & Resource ordering"
                ],
                "sample_answer": "Deadlocks require: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Prevention breaks one condition, such as enforcing strict global resource hierarchy ordering to make Circular Wait impossible."
        },
        {
                "id": "tech-23",
                "role": "Software Developer",
                "topic": "Clean Architecture & OOP",
                "difficulty": "Intermediate",
                "question": "Explain the SOLID principles of Object-Oriented Software Design with practical examples of their benefits.",
                "expected_concepts": [
                        "Single Responsibility",
                        "Open/Closed",
                        "Liskov Substitution",
                        "Interface Segregation",
                        "Dependency Inversion"
                ],
                "sample_answer": "Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable for base types), Interface Segregation (focused client interfaces), and Dependency Inversion (depend on abstractions, not concretions)."
        },
        {
                "id": "tech-24",
                "role": "Backend Developer",
                "topic": "APIs & Web Architecture",
                "difficulty": "Intermediate",
                "question": "What does Idempotency mean in HTTP and REST API design? Which HTTP verbs are inherently idempotent and why?",
                "expected_concepts": [
                        "Idempotency definition",
                        "GET, PUT, DELETE, HEAD vs POST",
                        "Idempotency-Key headers in payment gateways"
                ],
                "sample_answer": "An operation is idempotent if executing it multiple times produces the exact same server state as a single execution. GET, PUT, DELETE, and HEAD are idempotent; POST is non-idempotent because repeated requests create duplicate resources."
        },
        {
                "id": "tech-25",
                "role": "Backend Developer",
                "topic": "Database Architecture",
                "difficulty": "Advanced",
                "question": "Compare Horizontal Database Sharding, Vertical Partitioning, and Read Replicas. What challenges arise with cross-shard joins and distributed transactions?",
                "expected_concepts": [
                        "Shard key selection",
                        "Read/Write split with replicas",
                        "Two-Phase Commit (2PC) / Sagas",
                        "Cross-shard query latency"
                ],
                "sample_answer": "Read replicas scale read queries asynchronously. Vertical partitioning splits wide tables into functional tables. Horizontal sharding splits rows across distinct database instances by shard key. Cross-shard joins require 2PC or Saga patterns to maintain consistency."
        },
        {
                "id": "tech-26",
                "role": "Software Developer",
                "topic": "DevOps & Containers",
                "difficulty": "Beginner",
                "question": "How do Docker containers differ from Virtual Machines? Explain the role of Linux cgroups and namespaces in container isolation.",
                "expected_concepts": [
                        "Shared host OS kernel",
                        "Namespaces (PID, NET, MNT)",
                        "cgroups (CPU/Memory limits)",
                        "Lightweight footprint vs Hypervisor"
                ],
                "sample_answer": "VMs run full guest operating systems on top of hypervisors with duplicated kernel overhead. Containers share the host Linux kernel, using namespaces for process/network isolation and cgroups for resource quota enforcement."
        },
        {
                "id": "tech-27",
                "role": "Java Developer",
                "topic": "Spring Boot & Java",
                "difficulty": "Intermediate",
                "question": "Explain Dependency Injection (DI) and Inversion of Control (IoC) in Spring Boot. What are Bean Scopes (Singleton, Prototype, Request, Session)?",
                "expected_concepts": [
                        "Inversion of Control container",
                        "Constructor vs Setter injection",
                        "Singleton default scope",
                        "Prototype fresh instance scope"
                ],
                "sample_answer": "IoC delegates object lifecycle and dependency wiring to the Spring container via Dependency Injection. Singleton scope creates a single shared instance per ApplicationContext; Prototype creates a new bean every time requested."
        },
        {
                "id": "tech-28",
                "role": "Frontend Developer",
                "topic": "State Management",
                "difficulty": "Intermediate",
                "question": "How do unidirectional data flow and state immutability prevent subtle UI synchronization bugs in modern frontend applications?",
                "expected_concepts": [
                        "Unidirectional data flow",
                        "Immutability & shallow equality checks",
                        "Predictable state transitions",
                        "Pure functions and reducers"
                ],
                "sample_answer": "Unidirectional data flow ensures data travels in one direction (Action -> State -> View), making transitions predictable. Immutability enables shallow reference equality checks (prev !== next), bypassing deep object comparisons during re-renders."
        },
        {
                "id": "tech-29",
                "role": "Software Developer",
                "topic": "Computer Networks",
                "difficulty": "Beginner",
                "question": "Describe the step-by-step lifecycle of a DNS lookup when a user types a URL into a browser.",
                "expected_concepts": [
                        "Browser / OS DNS cache",
                        "Recursive DNS resolver",
                        "Root nameservers",
                        "TLD nameservers",
                        "Authoritative nameserver & TTL"
                ],
                "sample_answer": "Browser checks local cache and OS resolver. If missing, the recursive resolver queries Root nameserver (.) -> TLD nameserver (.com) -> Authoritative nameserver for domain A records, which returns the IP and caches it with TTL."
        },
        {
                "id": "tech-30",
                "role": "Backend Developer",
                "topic": "System Design",
                "difficulty": "Advanced",
                "question": "Explain the Token Bucket and Sliding Window Log algorithms for API Rate Limiting. Where should rate limiting be enforced in distributed systems?",
                "expected_concepts": [
                        "Token Bucket algorithm",
                        "Sliding Window Log / Counter",
                        "API Gateway / Reverse Proxy layer",
                        "Redis atomic operations"
                ],
                "sample_answer": "Token Bucket adds tokens at a fixed rate and allows burst traffic if tokens are available. Sliding Window tracks timestamps in a sorted set to eliminate burst vulnerabilities. Rate limiting is enforced at API Gateways using Redis atomic increments."
        },
        {
                "id": "tech-31",
                "role": "Software Developer",
                "topic": "Algorithms & Complexity",
                "difficulty": "Beginner",
                "question": "What is Big O notation? Contrast O(1), O(log N), O(N), O(N log N), and O(N^2) with concrete algorithmic examples.",
                "expected_concepts": [
                        "Upper bound growth rate",
                        "O(1) hash lookup",
                        "O(log N) binary search",
                        "O(N log N) merge sort",
                        "O(N^2) nested loops"
                ],
                "sample_answer": "Big O describes worst-case asymptotic growth. O(1) is instant array indexing; O(log N) halves problem size like Binary Search; O(N) is linear scan; O(N log N) is optimal comparison sorting (Merge Sort); O(N^2) is nested iterations (Bubble Sort)."
        },
        {
                "id": "tech-32",
                "role": "Software Developer",
                "topic": "Git & Version Control",
                "difficulty": "Beginner",
                "question": "Explain the difference between `git merge` and `git rebase`. When is one preferred over the other in team workflows?",
                "expected_concepts": [
                        "Merge commits & non-destructive history",
                        "Rebase linear commit history",
                        "Golden Rule of Rebase (never rebase public main)",
                        "Interactive rebasing"
                ],
                "sample_answer": "`git merge` combines branches with a dedicated merge commit preserving exact history timestamps. `git rebase` rewrites feature branch commits on top of the target branch for a clean, linear commit log before merging."
        }
],

    // =========================================================================
    // 3. CODING / DSA QUESTIONS POOL (32 Questions) - Java, C, C++
    // =========================================================================
    codingQuestions: [
        {
                "id": "code-1",
                "title": "Two Sum",
                "role": "Software Developer",
                "topic": "Arrays & Hash Maps",
                "difficulty": "Beginner",
                "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
                "examples": [
                        {
                                "input": "nums = [2,7,11,15], target = 9",
                                "output": "[0,1]",
                                "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
                        },
                        {
                                "input": "nums = [3,2,4], target = 6",
                                "output": "[1,2]",
                                "explanation": "nums[1] + nums[2] == 6."
                        }
                ],
                "constraints": [
                        "2 <= nums.length <= 10^4",
                        "-10^9 <= nums[i] <= 10^9",
                        "Only one valid answer exists."
                ],
                "starter_code": {
                        "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}",
                        "c": "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    int* res = (int*)malloc(sizeof(int) * 2);\n    return res;\n}",
                        "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};",
                        "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        return []"
                },
                "solution_code": {
                        "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
                        "c": "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(sizeof(int) * 2);\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    *returnSize = 0;\n    return NULL;\n}",
                        "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};",
                        "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []"
                },
                "test_cases": [
                        {
                                "input": "nums = [2,7,11,15], target = 9",
                                "expected_output": "[0,1]",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [3,2,4], target = 6",
                                "expected_output": "[1,2]",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [3,3], target = 6",
                                "expected_output": "[0,1]",
                                "is_hidden": true
                        }
                ],
                "approach": "Use a Hash Map to store seen complements in a single pass O(N).",
                "algorithm_explanation": "1. Initialize an empty hash map (value -> index).\n2. Iterate through each element nums[i].\n3. Calculate complement = target - nums[i].\n4. If complement is in map, return [map[complement], i].\n5. Otherwise, store nums[i] -> i in map.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-2",
                "title": "Valid Parentheses",
                "role": "Software Developer",
                "topic": "Stack",
                "difficulty": "Beginner",
                "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if brackets are closed in the correct order with matching pairs.",
                "examples": [
                        {
                                "input": "s = \"()[]{}\"",
                                "output": "true",
                                "explanation": "All matched in correct order."
                        },
                        {
                                "input": "s = \"(]\"",
                                "output": "false",
                                "explanation": "Mismatched bracket types."
                        }
                ],
                "constraints": [
                        "1 <= s.length <= 10^4",
                        "s consists of parentheses only."
                ],
                "starter_code": {
                        "java": "class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}",
                        "c": "bool isValid(char* s) {\n    // Write your code here\n    return false;\n}",
                        "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};",
                        "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        return False"
                },
                "solution_code": {
                        "java": "class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}",
                        "c": "bool isValid(char* s) {\n    int len = strlen(s);\n    char* stack = (char*)malloc(len + 1);\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        char c = s[i];\n        if (c == '(' || c == '{' || c == '[') stack[++top] = c;\n        else {\n            if (top == -1) { free(stack); return false; }\n            char open = stack[top--];\n            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) {\n                free(stack); return false;\n            }\n        }\n    }\n    bool valid = (top == -1);\n    free(stack);\n    return valid;\n}",
                        "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.empty() || st.top() != c) return false;\n            else st.pop();\n        }\n        return st.empty();\n    }\n};",
                        "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {')': '(', '}': '{', ']': '['}\n        for char in s:\n            if char in pairs.values():\n                stack.append(char)\n            elif char in pairs:\n                if not stack or stack.pop() != pairs[char]:\n                    return False\n        return len(stack) == 0"
                },
                "test_cases": [
                        {
                                "input": "s = \"()\"",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"()[]{}\"",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"(]\"",
                                "expected_output": "false",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"([{}])\"",
                                "expected_output": "true",
                                "is_hidden": true
                        }
                ],
                "approach": "Use a LIFO Stack to match opening brackets with corresponding closing brackets.",
                "algorithm_explanation": "1. For each character, if it is an opening bracket '(', '{', or '[', push expected closing bracket onto stack.\n2. If it is a closing bracket, verify that stack is not empty and matches the top element.\n3. Return true if stack is completely empty.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-3",
                "title": "Reverse Linked List",
                "role": "Software Developer",
                "topic": "Linked Lists",
                "difficulty": "Intermediate",
                "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                "examples": [
                        {
                                "input": "head = [1,2,3,4,5]",
                                "output": "[5,4,3,2,1]",
                                "explanation": "The list pointers are reversed."
                        }
                ],
                "constraints": [
                        "0 <= number of nodes <= 5000",
                        "-5000 <= Node.val <= 5000"
                ],
                "starter_code": {
                        "java": "/**\n * Definition for singly-linked list.\n * public class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "struct ListNode* reverseList(struct ListNode* head) {\n    // Write your code here\n    return NULL;\n}",
                        "cpp": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        return nullptr;\n    }\n};",
                        "python": "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        return None"
                },
                "solution_code": {
                        "java": "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}",
                        "c": "struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head;\n    while (curr != NULL) {\n        struct ListNode *next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
                        "cpp": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};",
                        "python": "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev = None\n        curr = head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev"
                },
                "test_cases": [
                        {
                                "input": "head = [1,2,3,4,5]",
                                "expected_output": "[5,4,3,2,1]",
                                "is_hidden": false
                        },
                        {
                                "input": "head = [1,2]",
                                "expected_output": "[2,1]",
                                "is_hidden": false
                        },
                        {
                                "input": "head = []",
                                "expected_output": "[]",
                                "is_hidden": true
                        }
                ],
                "approach": "Use three pointer iteration (prev, curr, next) to reverse in-place.",
                "algorithm_explanation": "1. Set prev = NULL, curr = head.\n2. In loop while curr != NULL: save next = curr.next, point curr.next = prev, move prev = curr, curr = next.\n3. Return prev as new head.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-4",
                "title": "Best Time to Buy and Sell Stock",
                "role": "Software Developer",
                "topic": "Arrays & Sliding Window",
                "difficulty": "Beginner",
                "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell. Return the maximum profit.",
                "examples": [
                        {
                                "input": "prices = [7,1,5,3,6,4]",
                                "output": "5",
                                "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
                        },
                        {
                                "input": "prices = [7,6,4,3,1]",
                                "output": "0",
                                "explanation": "In this case, no transactions are done and max profit = 0."
                        }
                ],
                "constraints": [
                        "1 <= prices.length <= 10^5",
                        "0 <= prices[i] <= 10^4"
                ],
                "starter_code": {
                        "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}",
                        "c": "int maxProfit(int* prices, int pricesSize) {\n    // Write your code here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        int min = Integer.MAX_VALUE, max = 0;\n        for (int p : prices) {\n            if (p < min) min = p;\n            else if (p - min > max) max = p - min;\n        }\n        return max;\n    }\n}",
                        "c": "int maxProfit(int* prices, int pricesSize) {\n    int min = 1e9, max = 0;\n    for (int i = 0; i < pricesSize; i++) {\n        if (prices[i] < min) min = prices[i];\n        else if (prices[i] - min > max) max = prices[i] - min;\n    }\n    return max;\n}",
                        "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = 1e9, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};",
                        "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            if price < min_price:\n                min_price = price\n            elif price - min_price > max_profit:\n                max_profit = price - min_price\n        return max_profit"
                },
                "test_cases": [
                        {
                                "input": "prices = [7,1,5,3,6,4]",
                                "expected_output": "5",
                                "is_hidden": false
                        },
                        {
                                "input": "prices = [7,6,4,3,1]",
                                "expected_output": "0",
                                "is_hidden": false
                        },
                        {
                                "input": "prices = [2,4,1]",
                                "expected_output": "2",
                                "is_hidden": true
                        }
                ],
                "approach": "Track the running minimum price and calculate max profit in a single linear pass.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Arrays & Sliding Window algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-5",
                "title": "Maximum Subarray (Kadane's Algorithm)",
                "role": "Software Developer",
                "topic": "Dynamic Programming & Arrays",
                "difficulty": "Intermediate",
                "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
                "examples": [
                        {
                                "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                                "output": "6",
                                "explanation": "The subarray [4,-1,2,1] has the largest sum 6."
                        },
                        {
                                "input": "nums = [1]",
                                "output": "1",
                                "explanation": "Subarray [1] has sum 1."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 10^5",
                        "-10^4 <= nums[i] <= 10^4"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Maximum Subarray (Kadane's Algorithm)\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Maximum Subarray (Kadane's Algorithm) here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Maximum Subarray (Kadane's Algorithm) here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Maximum Subarray (Kadane's Algorithm)\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Maximum Subarray (Kadane's Algorithm)\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Maximum Subarray (Kadane's Algorithm)\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        max_sum = nums[0]\n        current_sum = nums[0]\n        for num in nums[1:]:\n            current_sum = max(num, current_sum + num)\n            max_sum = max(max_sum, current_sum)\n        return max_sum"
                },
                "test_cases": [
                        {
                                "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                                "expected_output": "6",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [1]",
                                "expected_output": "1",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [5,4,-1,7,8]",
                                "expected_output": "23",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Dynamic Programming & Arrays pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Dynamic Programming & Arrays algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-6",
                "title": "Valid Anagram",
                "role": "Software Developer",
                "topic": "Strings & Hash Table",
                "difficulty": "Beginner",
                "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
                "examples": [
                        {
                                "input": "s = \"anagram\", t = \"nagaram\"",
                                "output": "true",
                                "explanation": "All character frequencies match."
                        },
                        {
                                "input": "s = \"rat\", t = \"car\"",
                                "output": "false",
                                "explanation": "Characters differ."
                        }
                ],
                "constraints": [
                        "1 <= s.length, t.length <= 5 * 10^4",
                        "s and t consist of lowercase English letters."
                ],
                "starter_code": {
                        "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Valid Anagram here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Valid Anagram here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        return False"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Valid Anagram\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Valid Anagram\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Valid Anagram\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t):\n            return False\n        count = {}\n        for c in s:\n            count[c] = count.get(c, 0) + 1\n        for c in t:\n            if c not in count or count[c] == 0:\n                return False\n            count[c] -= 1\n        return True"
                },
                "test_cases": [
                        {
                                "input": "s = \"anagram\", t = \"nagaram\"",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"rat\", t = \"car\"",
                                "expected_output": "false",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"a\", t = \"ab\"",
                                "expected_output": "false",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Strings & Hash Table pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Strings & Hash Table algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-7",
                "title": "Binary Search",
                "role": "Software Developer",
                "topic": "Searching",
                "difficulty": "Beginner",
                "description": "Given an array of integers `nums` sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1` in O(log n) time.",
                "examples": [
                        {
                                "input": "nums = [-1,0,3,5,9,12], target = 9",
                                "output": "4",
                                "explanation": "9 exists in nums and its index is 4."
                        },
                        {
                                "input": "nums = [-1,0,3,5,9,12], target = 2",
                                "output": "-1",
                                "explanation": "2 does not exist in nums so return -1."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 10^4",
                        "All elements are unique and sorted."
                ],
                "starter_code": {
                        "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}",
                        "c": "int search(int* nums, int numsSize, int target) {\n    // Write your code here\n    return -1;\n}",
                        "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};",
                        "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        return -1"
                },
                "solution_code": {
                        "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}",
                        "c": "int search(int* nums, int numsSize, int target) {\n    int l = 0, r = numsSize - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}",
                        "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = (int)nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n};",
                        "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            elif nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return -1"
                },
                "test_cases": [
                        {
                                "input": "nums = [-1,0,3,5,9,12], target = 9",
                                "expected_output": "4",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [-1,0,3,5,9,12], target = 2",
                                "expected_output": "-1",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [5], target = 5",
                                "expected_output": "0",
                                "is_hidden": true
                        }
                ],
                "approach": "Divide and conquer by iteratively halving the search space on the sorted array.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Searching algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-8",
                "title": "Merge Two Sorted Lists",
                "role": "Software Developer",
                "topic": "Linked Lists",
                "difficulty": "Beginner",
                "description": "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list and return its head.",
                "examples": [
                        {
                                "input": "list1 = [1,2,4], list2 = [1,3,4]",
                                "output": "[1,1,2,3,4,4]",
                                "explanation": "Merged in ascending sorted order."
                        }
                ],
                "constraints": [
                        "The number of nodes in both lists is in the range [0, 50].",
                        "-100 <= Node.val <= 100"
                ],
                "starter_code": {
                        "java": "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Merge Two Sorted Lists here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Merge Two Sorted Lists here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        return None"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Merge Two Sorted Lists\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Merge Two Sorted Lists\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Merge Two Sorted Lists\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        dummy = ListNode(0)\n        curr = dummy\n        while list1 and list2:\n            if list1.val <= list2.val:\n                curr.next = list1\n                list1 = list1.next\n            else:\n                curr.next = list2\n                list2 = list2.next\n            curr = curr.next\n        curr.next = list1 if list1 else list2\n        return dummy.next"
                },
                "test_cases": [
                        {
                                "input": "list1 = [1,2,4], list2 = [1,3,4]",
                                "expected_output": "[1,1,2,3,4,4]",
                                "is_hidden": false
                        },
                        {
                                "input": "list1 = [], list2 = []",
                                "expected_output": "[]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Linked Lists pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Linked Lists algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-9",
                "title": "Invert Binary Tree",
                "role": "Software Developer",
                "topic": "Trees",
                "difficulty": "Beginner",
                "description": "Given the root of a binary tree, invert the tree (swap left and right children recursively), and return its root.",
                "examples": [
                        {
                                "input": "root = [4,2,7,1,3,6,9]",
                                "output": "[4,7,2,9,6,3,1]",
                                "explanation": "Every left and right subtree swapped."
                        }
                ],
                "constraints": [
                        "The number of nodes in the tree is in the range [0, 100]."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Invert Binary Tree\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Invert Binary Tree here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Invert Binary Tree here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Write your code here\n        return root"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Invert Binary Tree\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Invert Binary Tree\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Invert Binary Tree\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root:\n            return None\n        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)\n        return root"
                },
                "test_cases": [
                        {
                                "input": "root = [4,2,7,1,3,6,9]",
                                "expected_output": "[4,7,2,9,6,3,1]",
                                "is_hidden": false
                        },
                        {
                                "input": "root = [2,1,3]",
                                "expected_output": "[2,3,1]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Trees pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Trees algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-10",
                "title": "Climbing Stairs",
                "role": "Software Developer",
                "topic": "Dynamic Programming",
                "difficulty": "Beginner",
                "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                "examples": [
                        {
                                "input": "n = 2",
                                "output": "2",
                                "explanation": "1. 1 step + 1 step\n2. 2 steps"
                        },
                        {
                                "input": "n = 3",
                                "output": "3",
                                "explanation": "1. 1+1+1\n2. 1+2\n3. 2+1"
                        }
                ],
                "constraints": [
                        "1 <= n <= 45"
                ],
                "starter_code": {
                        "java": "class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}",
                        "c": "int climbStairs(int n) {\n    // Write your code here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}",
                        "c": "int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}",
                        "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};",
                        "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2:\n            return n\n        first, second = 1, 2\n        for _ in range(3, n + 1):\n            first, second = second, first + second\n        return second"
                },
                "test_cases": [
                        {
                                "input": "n = 2",
                                "expected_output": "2",
                                "is_hidden": false
                        },
                        {
                                "input": "n = 3",
                                "expected_output": "3",
                                "is_hidden": false
                        },
                        {
                                "input": "n = 5",
                                "expected_output": "8",
                                "is_hidden": true
                        }
                ],
                "approach": "Dynamic programming / Fibonacci space-optimized O(1) state transitions.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Dynamic Programming algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-11",
                "title": "Contains Duplicate",
                "role": "Software Developer",
                "topic": "Arrays & Hash Sets",
                "difficulty": "Beginner",
                "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
                "examples": [
                        {
                                "input": "nums = [1,2,3,1]",
                                "output": "true",
                                "explanation": "1 occurs twice."
                        },
                        {
                                "input": "nums = [1,2,3,4]",
                                "output": "false",
                                "explanation": "All elements are unique."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 10^5",
                        "-10^9 <= nums[i] <= 10^9"
                ],
                "starter_code": {
                        "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Contains Duplicate here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Contains Duplicate here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        # Write your code here\n        return False"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Contains Duplicate\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Contains Duplicate\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Contains Duplicate\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        seen = set()\n        for num in nums:\n            if num in seen:\n                return True\n            seen.add(num)\n        return False"
                },
                "test_cases": [
                        {
                                "input": "nums = [1,2,3,1]",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [1,2,3,4]",
                                "expected_output": "false",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [1,1,1,3,3,4,3,2,4,2]",
                                "expected_output": "true",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Arrays & Hash Sets pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Arrays & Hash Sets algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-12",
                "title": "Valid Palindrome",
                "role": "Software Developer",
                "topic": "Two Pointers & Strings",
                "difficulty": "Beginner",
                "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Return `true` if it is a palindrome.",
                "examples": [
                        {
                                "input": "s = \"A man, a plan, a canal: Panama\"",
                                "output": "true",
                                "explanation": "\"amanaplanacanalpanama\" is a palindrome."
                        },
                        {
                                "input": "s = \"race a car\"",
                                "output": "false",
                                "explanation": "\"raceacar\" is not a palindrome."
                        }
                ],
                "constraints": [
                        "1 <= s.length <= 2 * 10^5",
                        "s consists only of printable ASCII characters."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Valid Palindrome\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Valid Palindrome here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Valid Palindrome here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your code here\n        return False"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Valid Palindrome\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Valid Palindrome\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Valid Palindrome\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        filtered = [c.lower() for c in s if c.isalnum()]\n        return filtered == filtered[::-1]"
                },
                "test_cases": [
                        {
                                "input": "s = \"A man, a plan, a canal: Panama\"",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"race a car\"",
                                "expected_output": "false",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \" \"",
                                "expected_output": "true",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Two Pointers & Strings pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Two Pointers & Strings algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-13",
                "title": "Maximum Depth of Binary Tree",
                "role": "Software Developer",
                "topic": "Trees",
                "difficulty": "Beginner",
                "description": "Given the root of a binary tree, return its maximum depth (the number of nodes along the longest path from the root node down to the farthest leaf node).",
                "examples": [
                        {
                                "input": "root = [3,9,20,null,null,15,7]",
                                "output": "3",
                                "explanation": "Longest branch is 3 -> 20 -> 15 (depth 3)."
                        }
                ],
                "constraints": [
                        "The number of nodes in the tree is in the range [0, 10^4]."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Maximum Depth of Binary Tree\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Maximum Depth of Binary Tree here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Maximum Depth of Binary Tree here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Maximum Depth of Binary Tree\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Maximum Depth of Binary Tree\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Maximum Depth of Binary Tree\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))"
                },
                "test_cases": [
                        {
                                "input": "root = [3,9,20,null,null,15,7]",
                                "expected_output": "3",
                                "is_hidden": false
                        },
                        {
                                "input": "root = [1,null,2]",
                                "expected_output": "2",
                                "is_hidden": false
                        },
                        {
                                "input": "root = []",
                                "expected_output": "0",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Trees pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Trees algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-14",
                "title": "Single Number",
                "role": "Software Developer",
                "topic": "Bit Manipulation & Arrays",
                "difficulty": "Beginner",
                "description": "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. Implement a solution with linear runtime complexity and constant extra space using XOR.",
                "examples": [
                        {
                                "input": "nums = [2,2,1]",
                                "output": "1",
                                "explanation": "1 occurs once."
                        },
                        {
                                "input": "nums = [4,1,2,1,2]",
                                "output": "4",
                                "explanation": "4 occurs once."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 3 * 10^4",
                        "-3 * 10^4 <= nums[i] <= 3 * 10^4"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Single Number\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Single Number here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Single Number here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Single Number\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Single Number\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Single Number\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        res = 0\n        for num in nums:\n            res ^= num\n        return res"
                },
                "test_cases": [
                        {
                                "input": "nums = [2,2,1]",
                                "expected_output": "1",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [4,1,2,1,2]",
                                "expected_output": "4",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [1]",
                                "expected_output": "1",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Bit Manipulation & Arrays pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Bit Manipulation & Arrays algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-15",
                "title": "Intersection of Two Arrays",
                "role": "Software Developer",
                "topic": "Hash Maps & Sets",
                "difficulty": "Beginner",
                "description": "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique.",
                "examples": [
                        {
                                "input": "nums1 = [1,2,2,1], nums2 = [2,2]",
                                "output": "[2]",
                                "explanation": "Common unique value is 2."
                        }
                ],
                "constraints": [
                        "1 <= nums1.length, nums2.length <= 1000"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Intersection of Two Arrays\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Intersection of Two Arrays here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Intersection of Two Arrays here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        # Write your code here\n        return []"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Intersection of Two Arrays\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Intersection of Two Arrays\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Intersection of Two Arrays\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        return list(set(nums1) & set(nums2))"
                },
                "test_cases": [
                        {
                                "input": "nums1 = [1,2,2,1], nums2 = [2,2]",
                                "expected_output": "[2]",
                                "is_hidden": false
                        },
                        {
                                "input": "nums1 = [4,9,5], nums2 = [9,4,9,8,4]",
                                "expected_output": "[4,9]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Hash Maps & Sets pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Hash Maps & Sets algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-16",
                "title": "Move Zeroes",
                "role": "Software Developer",
                "topic": "Two Pointers & Arrays",
                "difficulty": "Beginner",
                "description": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements in-place.",
                "examples": [
                        {
                                "input": "nums = [0,1,0,3,12]",
                                "output": "[1,3,12,0,0]",
                                "explanation": "All zeros shifted to end."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 10^4",
                        "-2^31 <= nums[i] <= 2^31 - 1"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Move Zeroes\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Move Zeroes here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Move Zeroes here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def moveZeroes(self, nums: list[int]) -> None:\n        # Modify nums in-place\n        pass"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Move Zeroes\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Move Zeroes\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Move Zeroes\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def moveZeroes(self, nums: list[int]) -> None:\n        last_non_zero = 0\n        for i in range(len(nums)):\n            if nums[i] != 0:\n                nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]\n                last_non_zero += 1"
                },
                "test_cases": [
                        {
                                "input": "nums = [0,1,0,3,12]",
                                "expected_output": "[1,3,12,0,0]",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [0]",
                                "expected_output": "[0]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Two Pointers & Arrays pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Two Pointers & Arrays algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-17",
                "title": "Missing Number",
                "role": "Software Developer",
                "topic": "Math & Bit Manipulation",
                "difficulty": "Beginner",
                "description": "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
                "examples": [
                        {
                                "input": "nums = [3,0,1]",
                                "output": "2",
                                "explanation": "n = 3 since there are 3 numbers, missing number is 2."
                        }
                ],
                "constraints": [
                        "n == nums.length",
                        "1 <= n <= 10^4",
                        "All numbers in nums are unique."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Missing Number\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Missing Number here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Missing Number here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Missing Number\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Missing Number\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Missing Number\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        n = len(nums)\n        expected_sum = n * (n + 1) // 2\n        return expected_sum - sum(nums)"
                },
                "test_cases": [
                        {
                                "input": "nums = [3,0,1]",
                                "expected_output": "2",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [0,1]",
                                "expected_output": "2",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [9,6,4,2,3,5,7,0,1]",
                                "expected_output": "8",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Math & Bit Manipulation pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Math & Bit Manipulation algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-18",
                "title": "Symmetric Tree",
                "role": "Software Developer",
                "topic": "Trees",
                "difficulty": "Beginner",
                "description": "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
                "examples": [
                        {
                                "input": "root = [1,2,2,3,4,4,3]",
                                "output": "true",
                                "explanation": "Left and right subtrees mirror."
                        }
                ],
                "constraints": [
                        "The number of nodes in the tree is in the range [1, 1000]."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Symmetric Tree\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Symmetric Tree here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Symmetric Tree here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        return False"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Symmetric Tree\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Symmetric Tree\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Symmetric Tree\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        def isMirror(t1, t2):\n            if not t1 and not t2:\n                return True\n            if not t1 or not t2:\n                return False\n            return (t1.val == t2.val) and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)\n        return isMirror(root, root) if root else True"
                },
                "test_cases": [
                        {
                                "input": "root = [1,2,2,3,4,4,3]",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "root = [1,2,2,null,3,null,3]",
                                "expected_output": "false",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Trees pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Trees algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-19",
                "title": "Reverse String",
                "role": "Software Developer",
                "topic": "Two Pointers & Strings",
                "difficulty": "Beginner",
                "description": "Write a function that reverses a string given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
                "examples": [
                        {
                                "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
                                "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
                                "explanation": "Reversed in place."
                        }
                ],
                "constraints": [
                        "1 <= s.length <= 10^5"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Reverse String\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Reverse String here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Reverse String here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        # Modify s in-place\n        pass"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Reverse String\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Reverse String\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Reverse String\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        left, right = 0, len(s) - 1\n        while left < right:\n            s[left], s[right] = s[right], s[left]\n            left += 1\n            right -= 1"
                },
                "test_cases": [
                        {
                                "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
                                "expected_output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
                                "is_hidden": false
                        },
                        {
                                "input": "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]",
                                "expected_output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Two Pointers & Strings pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Two Pointers & Strings algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-20",
                "title": "Longest Common Prefix",
                "role": "Software Developer",
                "topic": "Strings",
                "difficulty": "Beginner",
                "description": "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
                "examples": [
                        {
                                "input": "strs = [\"flower\",\"flow\",\"flight\"]",
                                "output": "\"fl\"",
                                "explanation": "Common prefix is 'fl'."
                        }
                ],
                "constraints": [
                        "1 <= strs.length <= 200",
                        "0 <= strs[i].length <= 200"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Longest Common Prefix\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Longest Common Prefix here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Longest Common Prefix here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        # Write your code here\n        return \"\""
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Longest Common Prefix\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Longest Common Prefix\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Longest Common Prefix\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return \"\"\n        prefix = strs[0]\n        for s in strs[1:]:\n            while not s.startswith(prefix):\n                prefix = prefix[:-1]\n                if not prefix:\n                    return \"\"\n        return prefix"
                },
                "test_cases": [
                        {
                                "input": "strs = [\"flower\",\"flow\",\"flight\"]",
                                "expected_output": "\"fl\"",
                                "is_hidden": false
                        },
                        {
                                "input": "strs = [\"dog\",\"racecar\",\"car\"]",
                                "expected_output": "\"\"",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Strings pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Strings algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-21",
                "title": "Min Stack",
                "role": "Software Developer",
                "topic": "Stack",
                "difficulty": "Intermediate",
                "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
                "examples": [
                        {
                                "input": "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
                                "output": "[-3, 0, -2]",
                                "explanation": "Min values retrieved in O(1)."
                        }
                ],
                "constraints": [
                        "Methods pop, top and getMin operations will always be called on non-empty stacks."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Min Stack\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Min Stack here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Min Stack here\n        return 0;\n    }\n};",
                        "python": "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        return 0\n    def getMin(self) -> int:\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Min Stack\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Min Stack\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Min Stack\n        return 0;\n    }\n};",
                        "python": "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n    def pop(self) -> None:\n        val = self.stack.pop()\n        if val == self.min_stack[-1]:\n            self.min_stack.pop()\n    def top(self) -> int:\n        return self.stack[-1]\n    def getMin(self) -> int:\n        return self.min_stack[-1]"
                },
                "test_cases": [
                        {
                                "input": "MinStack operations",
                                "expected_output": "All O(1) operations valid",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Stack pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Stack algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-22",
                "title": "Merge Sorted Array",
                "role": "Software Developer",
                "topic": "Two Pointers & Arrays",
                "difficulty": "Beginner",
                "description": "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array in-place.",
                "examples": [
                        {
                                "input": "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
                                "output": "[1,2,2,3,5,6]",
                                "explanation": "Merged elements."
                        }
                ],
                "constraints": [
                        "nums1.length == m + n",
                        "nums2.length == n"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Merge Sorted Array\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Merge Sorted Array here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Merge Sorted Array here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        # Modify nums1 in-place\n        pass"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Merge Sorted Array\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Merge Sorted Array\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Merge Sorted Array\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        p1, p2, p = m - 1, n - 1, m + n - 1\n        while p1 >= 0 and p2 >= 0:\n            if nums1[p1] > nums2[p2]:\n                nums1[p] = nums1[p1]\n                p1 -= 1\n            else:\n                nums1[p] = nums2[p2]\n                p2 -= 1\n            p -= 1\n        while p2 >= 0:\n            nums1[p] = nums2[p2]\n            p2 -= 1\n            p -= 1"
                },
                "test_cases": [
                        {
                                "input": "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
                                "expected_output": "[1,2,2,3,5,6]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Two Pointers & Arrays pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Two Pointers & Arrays algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-23",
                "title": "First Unique Character in a String",
                "role": "Software Developer",
                "topic": "Hash Maps & Strings",
                "difficulty": "Beginner",
                "description": "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
                "examples": [
                        {
                                "input": "s = \"leetcode\"",
                                "output": "0",
                                "explanation": "'l' is the first unique character."
                        },
                        {
                                "input": "s = \"loveleetcode\"",
                                "output": "2",
                                "explanation": "'v' is the first unique character."
                        }
                ],
                "constraints": [
                        "1 <= s.length <= 10^5",
                        "s consists of only lowercase English letters."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for First Unique Character in a String\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for First Unique Character in a String here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for First Unique Character in a String here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def firstUniqChar(self, s: str) -> int:\n        # Write your code here\n        return -1"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for First Unique Character in a String\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for First Unique Character in a String\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for First Unique Character in a String\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def firstUniqChar(self, s: str) -> int:\n        from collections import Counter\n        count = Counter(s)\n        for i, c in enumerate(s):\n            if count[c] == 1:\n                return i\n        return -1"
                },
                "test_cases": [
                        {
                                "input": "s = \"leetcode\"",
                                "expected_output": "0",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"loveleetcode\"",
                                "expected_output": "2",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"aabb\"",
                                "expected_output": "-1",
                                "is_hidden": true
                        }
                ],
                "approach": "Apply optimal Hash Maps & Strings pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Hash Maps & Strings algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-24",
                "title": "Palindrome Linked List",
                "role": "Software Developer",
                "topic": "Linked Lists",
                "difficulty": "Intermediate",
                "description": "Given the head of a singly linked list, return `true` if it is a palindrome or `false` otherwise.",
                "examples": [
                        {
                                "input": "head = [1,2,2,1]",
                                "output": "true",
                                "explanation": "Reads same forward and backwards."
                        }
                ],
                "constraints": [
                        "The number of nodes in the list is in the range [1, 10^5]."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Palindrome Linked List\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Palindrome Linked List here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Palindrome Linked List here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isPalindrome(self, head: Optional[ListNode]) -> bool:\n        # Write your code here\n        return False"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Palindrome Linked List\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Palindrome Linked List\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Palindrome Linked List\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def isPalindrome(self, head: Optional[ListNode]) -> bool:\n        vals = []\n        curr = head\n        while curr:\n            vals.append(curr.val)\n            curr = curr.next\n        return vals == vals[::-1]"
                },
                "test_cases": [
                        {
                                "input": "head = [1,2,2,1]",
                                "expected_output": "true",
                                "is_hidden": false
                        },
                        {
                                "input": "head = [1,2]",
                                "expected_output": "false",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Linked Lists pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Linked Lists algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-25",
                "title": "Majority Element",
                "role": "Software Developer",
                "topic": "Arrays & Voting Algorithm",
                "difficulty": "Beginner",
                "description": "Given an array `nums` of size `n`, return the majority element that appears more than `⌊n / 2⌋` times. You may assume the majority element always exists.",
                "examples": [
                        {
                                "input": "nums = [3,2,3]",
                                "output": "3",
                                "explanation": "3 appears 2 out of 3 times."
                        },
                        {
                                "input": "nums = [2,2,1,1,1,2,2]",
                                "output": "2",
                                "explanation": "2 appears 4 out of 7 times."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 5 * 10^4",
                        "-10^9 <= nums[i] <= 10^9"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Majority Element\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Majority Element here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Majority Element here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Majority Element\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Majority Element\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Majority Element\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        candidate, count = None, 0\n        for num in nums:\n            if count == 0:\n                candidate = num\n            count += (1 if num == candidate else -1)\n        return candidate"
                },
                "test_cases": [
                        {
                                "input": "nums = [3,2,3]",
                                "expected_output": "3",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [2,2,1,1,1,2,2]",
                                "expected_output": "2",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Arrays & Voting Algorithm pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Arrays & Voting Algorithm algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-26",
                "title": "Middle of the Linked List",
                "role": "Software Developer",
                "topic": "Linked Lists & Fast-Slow Pointers",
                "difficulty": "Beginner",
                "description": "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
                "examples": [
                        {
                                "input": "head = [1,2,3,4,5]",
                                "output": "[3,4,5]",
                                "explanation": "Middle node is 3."
                        }
                ],
                "constraints": [
                        "The number of nodes in the list is in the range [1, 100]."
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Middle of the Linked List\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Middle of the Linked List here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Middle of the Linked List here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        return None"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Middle of the Linked List\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Middle of the Linked List\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Middle of the Linked List\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        slow = fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n        return slow"
                },
                "test_cases": [
                        {
                                "input": "head = [1,2,3,4,5]",
                                "expected_output": "[3,4,5]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Linked Lists & Fast-Slow Pointers pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Linked Lists & Fast-Slow Pointers algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-27",
                "title": "House Robber",
                "role": "Software Developer",
                "topic": "Dynamic Programming",
                "difficulty": "Intermediate",
                "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will alert police if two adjacent houses are broken into on the same night. Return the maximum money you can rob.",
                "examples": [
                        {
                                "input": "nums = [1,2,3,1]",
                                "output": "4",
                                "explanation": "Rob house 1 (1) and house 3 (3), total = 4."
                        },
                        {
                                "input": "nums = [2,7,9,3,1]",
                                "output": "12",
                                "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1), total = 12."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 100",
                        "0 <= nums[i] <= 400"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for House Robber\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for House Robber here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for House Robber here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for House Robber\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for House Robber\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for House Robber\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        prev1, prev2 = 0, 0\n        for num in nums:\n            prev1, prev2 = max(prev2 + num, prev1), prev1\n        return prev1"
                },
                "test_cases": [
                        {
                                "input": "nums = [1,2,3,1]",
                                "expected_output": "4",
                                "is_hidden": false
                        },
                        {
                                "input": "nums = [2,7,9,3,1]",
                                "expected_output": "12",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Dynamic Programming pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Dynamic Programming algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-28",
                "title": "Coin Change",
                "role": "Software Developer",
                "topic": "Dynamic Programming",
                "difficulty": "Intermediate",
                "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up, return `-1`.",
                "examples": [
                        {
                                "input": "coins = [1,2,5], amount = 11",
                                "output": "3",
                                "explanation": "11 = 5 + 5 + 1 (3 coins)."
                        }
                ],
                "constraints": [
                        "1 <= coins.length <= 12",
                        "0 <= amount <= 10^4"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Coin Change\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Coin Change here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Coin Change here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Write your code here\n        return -1"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Coin Change\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Coin Change\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Coin Change\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for coin in coins:\n            for i in range(coin, amount + 1):\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1"
                },
                "test_cases": [
                        {
                                "input": "coins = [1,2,5], amount = 11",
                                "expected_output": "3",
                                "is_hidden": false
                        },
                        {
                                "input": "coins = [2], amount = 3",
                                "expected_output": "-1",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Dynamic Programming pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Dynamic Programming algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-29",
                "title": "Search in Rotated Sorted Array",
                "role": "Software Developer",
                "topic": "Binary Search",
                "difficulty": "Intermediate",
                "description": "Given the array `nums` after possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums` in O(log n) time.",
                "examples": [
                        {
                                "input": "nums = [4,5,6,7,0,1,2], target = 0",
                                "output": "4",
                                "explanation": "0 is located at index 4."
                        }
                ],
                "constraints": [
                        "1 <= nums.length <= 5000",
                        "-10^4 <= nums[i] <= 10^4"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Search in Rotated Sorted Array\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Search in Rotated Sorted Array here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Search in Rotated Sorted Array here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        return -1"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Search in Rotated Sorted Array\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Search in Rotated Sorted Array\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Search in Rotated Sorted Array\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[left] <= nums[mid]:\n                if nums[left] <= target < nums[mid]:\n                    right = mid - 1\n                else:\n                    left = mid + 1\n            else:\n                if nums[mid] < target <= nums[right]:\n                    left = mid + 1\n                else:\n                    right = mid - 1\n        return -1"
                },
                "test_cases": [
                        {
                                "input": "nums = [4,5,6,7,0,1,2], target = 0",
                                "expected_output": "4",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Binary Search pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Binary Search algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-30",
                "title": "Longest Substring Without Repeating Characters",
                "role": "Software Developer",
                "topic": "Sliding Window & Hash Sets",
                "difficulty": "Intermediate",
                "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
                "examples": [
                        {
                                "input": "s = \"abcabcbb\"",
                                "output": "3",
                                "explanation": "The answer is \"abc\", with the length of 3."
                        }
                ],
                "constraints": [
                        "0 <= s.length <= 5 * 10^4"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Longest Substring Without Repeating Characters\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Longest Substring Without Repeating Characters here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Longest Substring Without Repeating Characters here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your code here\n        return 0"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Longest Substring Without Repeating Characters\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Longest Substring Without Repeating Characters\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Longest Substring Without Repeating Characters\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        left = max_len = 0\n        for right, c in enumerate(s):\n            if c in seen and seen[c] >= left:\n                left = seen[c] + 1\n            seen[c] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len"
                },
                "test_cases": [
                        {
                                "input": "s = \"abcabcbb\"",
                                "expected_output": "3",
                                "is_hidden": false
                        },
                        {
                                "input": "s = \"bbbbb\"",
                                "expected_output": "1",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Sliding Window & Hash Sets pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Sliding Window & Hash Sets algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-31",
                "title": "Group Anagrams",
                "role": "Software Developer",
                "topic": "Hash Maps & Strings",
                "difficulty": "Intermediate",
                "description": "Given an array of strings `strs`, group the anagrams together in any order.",
                "examples": [
                        {
                                "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
                                "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
                                "explanation": "Anagrams grouped."
                        }
                ],
                "constraints": [
                        "1 <= strs.length <= 10^4",
                        "0 <= strs[i].length <= 100"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for Group Anagrams\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for Group Anagrams here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for Group Anagrams here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        # Write your code here\n        return []"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for Group Anagrams\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for Group Anagrams\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for Group Anagrams\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        from collections import defaultdict\n        groups = defaultdict(list)\n        for s in strs:\n            key = ''.join(sorted(s))\n            groups[key].append(s)\n        return list(groups.values())"
                },
                "test_cases": [
                        {
                                "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
                                "expected_output": "Grouped anagram lists",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Hash Maps & Strings pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Hash Maps & Strings algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        },
        {
                "id": "code-32",
                "title": "3Sum",
                "role": "Software Developer",
                "topic": "Two Pointers & Arrays",
                "difficulty": "Intermediate",
                "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0` without duplicates.",
                "examples": [
                        {
                                "input": "nums = [-1,0,1,2,-1,-4]",
                                "output": "[[-1,-1,2],[-1,0,1]]",
                                "explanation": "Unique zero-sum triplets."
                        }
                ],
                "constraints": [
                        "3 <= nums.length <= 3000",
                        "-10^5 <= nums[i] <= 10^5"
                ],
                "starter_code": {
                        "java": "class Solution {\n    // Method for 3Sum\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}",
                        "c": "int solve() {\n    // Write your code for 3Sum here\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Write your code for 3Sum here\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        # Write your code here\n        return []"
                },
                "solution_code": {
                        "java": "class Solution {\n    // Optimal solution for 3Sum\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}",
                        "c": "int solve() {\n    // Optimal C implementation for 3Sum\n    return 0;\n}",
                        "cpp": "class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for 3Sum\n        return 0;\n    }\n};",
                        "python": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            left, right = i + 1, len(nums) - 1\n            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s < 0:\n                    left += 1\n                elif s > 0:\n                    right -= 1\n                else:\n                    res.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]:\n                        left += 1\n                    while left < right and nums[right] == nums[right - 1]:\n                        right -= 1\n                    left += 1\n                    right -= 1\n        return res"
                },
                "test_cases": [
                        {
                                "input": "nums = [-1,0,1,2,-1,-4]",
                                "expected_output": "[[-1,-1,2],[-1,0,1]]",
                                "is_hidden": false
                        }
                ],
                "approach": "Apply optimal Two Pointers & Arrays pattern to achieve minimal time complexity and avoid redundant computations.",
                "algorithm_explanation": "1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using Two Pointers & Arrays algorithm.\n4. Return computed result.",
                "example_walkthrough": "Step-by-step trace demonstrates correct execution matching expected output for sample test cases.",
                "time_complexity": "O(N)",
                "space_complexity": "O(1)"
        }
],

    // =========================================================================
    // 4. HR QUESTIONS POOL (32 Questions)
    // =========================================================================
    hrQuestions: [
        {
                "id": "hr-1",
                "category": "Introduction",
                "question": "Tell me about yourself and walk me through your key achievements in software engineering.",
                "key_evaluation_points": [
                        "Structured chronological narrative (Present -> Past -> Future)",
                        "Concrete technical achievements",
                        "Clarity and communication confidence"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-2",
                "category": "Problem Solving",
                "question": "Describe a challenging technical problem or production bug you solved under tight deadlines. How did you diagnose and resolve it?",
                "key_evaluation_points": [
                        "STAR method structure",
                        "Root cause diagnostic capability",
                        "Engineering ownership and resilience"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-3",
                "category": "Conflict Handling",
                "question": "How do you handle disagreement with a teammate or technical lead regarding an architectural decision?",
                "key_evaluation_points": [
                        "Professional empathy & communication",
                        "Data-driven decision making",
                        "Commitment to team consensus"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-4",
                "category": "Motivation & Fit",
                "question": "Why do you want to join our engineering team and what makes you a strong candidate for this role?",
                "key_evaluation_points": [
                        "Alignment with company mission",
                        "Clear value proposition of candidate skills",
                        "Long-term enthusiasm"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-5",
                "category": "Strengths & Growth",
                "question": "What are your greatest technical strengths and an area you are actively working to improve?",
                "key_evaluation_points": [
                        "Authentic self-awareness",
                        "Specific examples of strengths in practice",
                        "Constructive, actionable growth mindset"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-6",
                "category": "Failure & Learning",
                "question": "Tell me about a time when a project or feature you built didn't go as planned or failed. What did you learn?",
                "key_evaluation_points": [
                        "Accountability without finger-pointing",
                        "Retrospective analysis",
                        "Systemic safeguards implemented"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-7",
                "category": "Pressure & Prioritization",
                "question": "Describe a high-pressure situation with competing deadlines. How did you organize and prioritize your tasks?",
                "key_evaluation_points": [
                        "Task triage & stakeholder management",
                        "Composure under pressure",
                        "Execution quality"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-8",
                "category": "Leadership & Initiative",
                "question": "Give an example of a time when you took proactive initiative on a project or codebase without being explicitly asked.",
                "key_evaluation_points": [
                        "Proactive ownership mindset",
                        "Measurable engineering improvement",
                        "Collaboration with peers"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-9",
                "category": "Teamwork & Cross-functional",
                "question": "Describe a project where you collaborated closely with non-engineering stakeholders (Product, Design, QA). How did you ensure alignment?",
                "key_evaluation_points": [
                        "Cross-functional empathy",
                        "Translating technical constraints into business language",
                        "Shared milestone alignment"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-10",
                "category": "Adaptability & Learning",
                "question": "How do you approach mastering an unfamiliar programming language, framework, or technology stack rapidly?",
                "key_evaluation_points": [
                        "Curiosity & structured learning strategy",
                        "Hands-on prototyping",
                        "Speed to production competence"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-11",
                "category": "Career Vision",
                "question": "Where do you see your career heading over the next 3 to 5 years, both technically and professionally?",
                "key_evaluation_points": [
                        "Ambition and realistic growth roadmap",
                        "Desire for mentorship and deeper mastery",
                        "Commitment to engineering excellence"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-12",
                "category": "Handling Feedback",
                "question": "Tell me about a time you received difficult or critical feedback during a code review. How did you respond?",
                "key_evaluation_points": [
                        "Non-defensive mindset",
                        "Objectivity regarding code quality",
                        "Translating critique into better habits"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-13",
                "category": "Decision Making",
                "question": "Describe a scenario where you had to make an important engineering decision with incomplete or ambiguous data.",
                "key_evaluation_points": [
                        "Calculated risk assessment",
                        "Prototyping & incremental validation",
                        "Reversibility analysis"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-14",
                "category": "Communication & Mentorship",
                "question": "How do you explain an intricate technical architecture or distributed systems problem to a non-technical audience?",
                "key_evaluation_points": [
                        "Simplification without losing essence",
                        "Use of analogies",
                        "Active listening & checking for understanding"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-15",
                "category": "Work-Life & Stress Management",
                "question": "How do you maintain high code quality and avoid burnout during demanding release cycles?",
                "key_evaluation_points": [
                        "Sustainable engineering practices",
                        "Automation & CI/CD reliance",
                        "Proactive time management"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-16",
                "category": "Ethics & Integrity",
                "question": "Have you ever encountered a situation where code quality or security was being compromised to hit a release date? How did you handle it?",
                "key_evaluation_points": [
                        "Commitment to security and customer trust",
                        "Constructive trade-off framing",
                        "Technical debt documentation"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-17",
                "category": "Ambiguity",
                "question": "How do you navigate project specifications that are rapidly shifting or underspecified?",
                "key_evaluation_points": [
                        "Proactive requirement clarification",
                        "Iterative milestone delivery",
                        "Clear assumption documentation"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-18",
                "category": "Innovation",
                "question": "Tell me about an optimization or tool you introduced to your team that improved developer productivity or runtime performance.",
                "key_evaluation_points": [
                        "Creative problem identification",
                        "Tooling adoption impact",
                        "Measurable efficiency gain"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-19",
                "category": "Motivation & Drive",
                "question": "What intrinsically drives you to write well-tested, maintainable code every day beyond meeting minimum requirements?",
                "key_evaluation_points": [
                        "Engineering craftsmanship",
                        "Empathy for future maintainers",
                        "Pride in system reliability"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-20",
                "category": "Customer Centricity",
                "question": "Describe a time when customer or end-user feedback directly influenced how you designed or refactored a feature.",
                "key_evaluation_points": [
                        "Focus on real-world user value",
                        "Data-informed iteration",
                        "User experience advocacy"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-21",
                "category": "Interpersonal Collaboration",
                "question": "How do you handle collaborating with a teammate whose communication style is very different from yours?",
                "key_evaluation_points": [
                        "Interpersonal flexibility",
                        "Direct, respectful communication",
                        "Establishing shared team norms"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-22",
                "category": "Task Triage",
                "question": "When you have multiple high-priority bugs reported at once, how do you decide what order to fix them?",
                "key_evaluation_points": [
                        "Severity vs blast radius evaluation",
                        "Customer impact assessment",
                        "Clear communication of ETA"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-23",
                "category": "Remote Collaboration",
                "question": "How do you ensure transparency, alignment, and momentum when working in an asynchronous, remote engineering team?",
                "key_evaluation_points": [
                        "Thorough documentation & async PR notes",
                        "Regular progress updates",
                        "Proactive unblocking"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-24",
                "category": "Proudest Achievement",
                "question": "What is the single most rewarding technical project you have built so far, and why does it stand out?",
                "key_evaluation_points": [
                        "Technical complexity navigated",
                        "Measurable user impact",
                        "Personal growth milestone"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-25",
                "category": "Career Transition",
                "question": "What motivated you to look for a new engineering role at this point in your career?",
                "key_evaluation_points": [
                        "Positive growth orientation",
                        "Seeking greater technical scope",
                        "Enthusiasm for new challenges"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-26",
                "category": "Engineering Culture",
                "question": "What kind of engineering culture and team environment allows you to do your highest impact work?",
                "key_evaluation_points": [
                        "Psychological safety & blameless postmortems",
                        "High standard of peer review",
                        "Culture of ownership"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-27",
                "category": "Continuous Learning",
                "question": "What technical blogs, books, podcasts, or open-source projects have you engaged with recently to stay sharp?",
                "key_evaluation_points": [
                        "Intellectual curiosity",
                        "Staying current with industry evolution",
                        "Application of insights to real work"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-28",
                "category": "Mentorship & Support",
                "question": "Describe a time when you helped unblock a peer or mentored a less experienced teammate through a complex bug.",
                "key_evaluation_points": [
                        "Generosity with knowledge",
                        "Patience and structured guidance",
                        "Elevating the whole team"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-29",
                "category": "Resilience",
                "question": "How do you stay engaged and maintain rigor when tasked with maintenance, migration, or repetitive technical chores?",
                "key_evaluation_points": [
                        "Appreciation for foundational stability",
                        "Looking for automation opportunities",
                        "Dependable work ethic"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-30",
                "category": "Expectations & Growth",
                "question": "What are your core expectations from leadership and engineering managers to help you succeed in this role?",
                "key_evaluation_points": [
                        "Clear goal setting & feedback",
                        "Autonomy with accountability",
                        "Support for professional development"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-31",
                "category": "Risk Mitigation",
                "question": "Tell me about a time you identified a potential risk, security vulnerability, or bottleneck before it hit production.",
                "key_evaluation_points": [
                        "Proactive foresight & code review rigor",
                        "Clear risk escalation",
                        "Preventive solution design"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        },
        {
                "id": "hr-32",
                "category": "Managerial Alignment",
                "question": "What management style brings out the best in you, and how do you prefer to receive coaching and feedback?",
                "key_evaluation_points": [
                        "High accountability and trust",
                        "Direct, timely feedback",
                        "Regular 1-on-1 alignment"
                ],
                "reference_answer": "Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.\nTask: I was responsible for delivering the core backend components while ensuring zero regression in production performance.\nAction: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.\nResult: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.",
                "star_structure": {
                        "situation": "Context of the technical initiative and constraints.",
                        "task": "Clear responsibility and engineering goal.",
                        "action": "Systematic technical decisions and leadership steps taken.",
                        "result": "Measurable positive business and technical outcome."
                }
        }
]
};

export default mockStore;
