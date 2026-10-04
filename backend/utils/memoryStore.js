// In-Memory Dev Store for smooth local development & offline fallback

export const mockStore = {
    profiles: new Map(),
    interviews: new Map(),
    answers: new Map(),
    results: new Map(),

    // =========================================================================
    // 1. APTITUDE QUESTIONS POOL (35 Questions)
    // =========================================================================
    aptitudeQuestions: [
        {
            id: "apt-1",
            category: "Quantitative",
            topic: "Percentages",
            difficulty: "Intermediate",
            question: "A shopkeeper marks an item at 25% above cost price and allows a discount of 10% for cash payment. What is his profit percentage?",
            options: ["10%", "12.5%", "15%", "17.5%"],
            correct_option: 1,
            explanation: "Let CP = 100. Marked Price (MP) = 125. Selling Price with 10% discount = 125 * 0.9 = 112.5. Profit = 112.5 - 100 = 12.5%."
        },
        {
            id: "apt-2",
            category: "Quantitative",
            topic: "Profit and Loss",
            difficulty: "Beginner",
            question: "If the cost price of 12 pens is equal to the selling price of 8 pens, find the gain percentage.",
            options: ["25%", "33.33%", "50%", "66.67%"],
            correct_option: 2,
            explanation: "Let CP of 1 pen = 1. CP of 8 pens = 8. SP of 8 pens = CP of 12 pens = 12. Profit = 12 - 8 = 4. Gain % = (4 / 8) * 100 = 50%."
        },
        {
            id: "apt-3",
            category: "Quantitative",
            topic: "Time and Work",
            difficulty: "Intermediate",
            question: "A can complete a piece of work in 12 days, and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work is left?",
            options: ["1/3", "4/9", "5/9", "2/3"],
            correct_option: 1,
            explanation: "1 day work of A+B = (1/12) + (1/18) = 5/36. 4 days work = 4 * (5/36) = 20/36 = 5/9. Work left = 1 - 5/9 = 4/9."
        },
        {
            id: "apt-4",
            category: "Logical Reasoning",
            topic: "Number Systems",
            difficulty: "Frequently Asked",
            question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
            options: ["126", "127", "128", "129"],
            correct_option: 1,
            explanation: "The pattern is (2 * n) + 1. 63 * 2 + 1 = 127."
        },
        {
            id: "apt-5",
            category: "Logical Reasoning",
            topic: "Logical Puzzles",
            difficulty: "Frequently Asked",
            question: "Pointing to a photograph of a man, Rahul said, 'His mother is the only daughter of my mother.' How is Rahul related to the person in the photograph?",
            options: ["Father", "Uncle", "Brother", "Maternal Uncle"],
            correct_option: 3,
            explanation: "Rahul's mother's only daughter is Rahul's sister. The man's mother is Rahul's sister. Thus, Rahul is the maternal uncle."
        },
        {
            id: "apt-6",
            category: "Quantitative",
            topic: "Time, Speed and Distance",
            difficulty: "Advanced",
            question: "A train 150 meters long takes 15 seconds to cross a bridge 300 meters long. What is the speed of the train in km/h?",
            options: ["72 km/h", "90 km/h", "108 km/h", "120 km/h"],
            correct_option: 2,
            explanation: "Total distance = 150 + 300 = 450 meters. Speed in m/s = 450 / 15 = 30 m/s. Speed in km/h = 30 * (18 / 5) = 108 km/h."
        },
        {
            id: "apt-7",
            category: "Quantitative",
            topic: "Probability",
            difficulty: "Intermediate",
            question: "Two dice are rolled simultaneously. What is the probability that the sum of the numbers obtained is a prime number?",
            options: ["5/12", "7/18", "1/2", "5/18"],
            correct_option: 0,
            explanation: "Prime sums possible: 2, 3, 5, 7, 11. Count of outcomes: 2 (1), 3 (2), 5 (4), 7 (6), 11 (2) = 15 out of 36. Probability = 15/36 = 5/12."
        },
        {
            id: "apt-8",
            category: "Quantitative",
            topic: "Ratio and Proportion",
            difficulty: "Beginner",
            question: "The ratio of the ages of A and B is 4:5. Six years hence, the ratio of their ages will become 5:6. What is the present age of A?",
            options: ["20 years", "24 years", "28 years", "30 years"],
            correct_option: 1,
            explanation: "Let ages be 4x and 5x. (4x + 6) / (5x + 6) = 5/6 => 24x + 36 = 25x + 30 => x = 6. Present age of A = 4 * 6 = 24 years."
        },
        {
            id: "apt-9",
            category: "Quantitative",
            topic: "Average",
            difficulty: "Beginner",
            question: "The average score of a batsman in 10 innings was 44. How many runs must he score in the 11th inning to raise his average to 48?",
            options: ["84", "88", "92", "96"],
            correct_option: 1,
            explanation: "Total runs in 10 innings = 10 * 44 = 440. Required total in 11 innings = 11 * 48 = 528. Required runs = 528 - 440 = 88."
        },
        {
            id: "apt-10",
            category: "Quantitative",
            topic: "Simple and Compound Interest",
            difficulty: "Intermediate",
            question: "A sum of money invested at Simple Interest doubles itself in 8 years. In how many years will it treble (become 3 times) at the same rate?",
            options: ["12 years", "14 years", "16 years", "20 years"],
            correct_option: 2,
            explanation: "Doubling means SI = P in 8 years. Trebling means SI = 2P. Time taken for double the interest = 2 * 8 = 16 years."
        },
        {
            id: "apt-11",
            category: "Quantitative",
            topic: "Simple and Compound Interest",
            difficulty: "Intermediate",
            question: "Find the compound interest on $10,000 for 2 years at 10% per annum, compounded annually.",
            options: ["$2,000", "$2,100", "$2,200", "$2,050"],
            correct_option: 1,
            explanation: "Amount = 10,000 * (1 + 0.10)^2 = 10,000 * 1.21 = $12,100. CI = 12,100 - 10,000 = $2,100."
        },
        {
            id: "apt-12",
            category: "Quantitative",
            topic: "Permutation and Combination",
            difficulty: "Intermediate",
            question: "In how many distinct ways can the letters of the word 'LEADER' be arranged?",
            options: ["720", "360", "120", "180"],
            correct_option: 1,
            explanation: "Word has 6 letters with 'E' repeating 2 times. Total permutations = 6! / 2! = 720 / 2 = 360."
        },
        {
            id: "apt-13",
            category: "Quantitative",
            topic: "Time and Work",
            difficulty: "Beginner",
            question: "Pipe A can fill a tank in 20 minutes and Pipe B can fill it in 30 minutes. If both pipes are opened together, how long will it take to fill the tank?",
            options: ["10 minutes", "12 minutes", "15 minutes", "18 minutes"],
            correct_option: 1,
            explanation: "Combined rate = 1/20 + 1/30 = 5/60 = 1/12. Time taken = 12 minutes."
        },
        {
            id: "apt-14",
            category: "Quantitative",
            topic: "Time, Speed and Distance",
            difficulty: "Intermediate",
            question: "Two cars start from two cities 300 km apart and travel towards each other at speeds of 60 km/h and 40 km/h respectively. After how many hours will they meet?",
            options: ["2.5 hours", "3 hours", "3.5 hours", "4 hours"],
            correct_option: 1,
            explanation: "Relative speed = 60 + 40 = 100 km/h. Time to meet = 300 / 100 = 3 hours."
        },
        {
            id: "apt-15",
            category: "Quantitative",
            topic: "Number Systems",
            difficulty: "Frequently Asked",
            question: "What is the remainder when (7^19 + 2) is divided by 6?",
            options: ["1", "2", "3", "5"],
            correct_option: 2,
            explanation: "7 mod 6 = 1. Therefore 7^19 mod 6 = 1^19 mod 6 = 1. Adding 2 gives (1 + 2) mod 6 = 3 mod 6 = 3."
        },
        {
            id: "apt-16",
            category: "Logical Reasoning",
            topic: "Logical Reasoning",
            difficulty: "Intermediate",
            question: "Statements: All cats are dogs. All dogs are birds. Conclusions: I. All cats are birds. II. All birds are cats.",
            options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
            correct_option: 0,
            explanation: "Cats ⊆ Dogs ⊆ Birds implies all cats are birds (I follows). But not all birds are necessarily cats (II does not follow)."
        },
        {
            id: "apt-17",
            category: "Logical Reasoning",
            topic: "Coding Patterns",
            difficulty: "Frequently Asked",
            question: "If in a certain code language 'PENCIL' is written as 'QGODKN', how is 'PAPER' written in that same code?",
            options: ["QBQFS", "QCQFS", "QBQES", "QBRFS"],
            correct_option: 0,
            explanation: "Pattern is +1 for each letter: P(+1)->Q, A(+1)->B, P(+1)->Q, E(+1)->F, R(+1)->S. Hence PAPER becomes QBQFS."
        },
        {
            id: "apt-18",
            category: "Logical Reasoning",
            topic: "Logical Reasoning",
            difficulty: "Beginner",
            question: "A person walks 10 meters North, turns right and walks 15 meters, then turns right again and walks 10 meters. How far and in which direction is he from his starting point?",
            options: ["15 meters East", "15 meters West", "10 meters East", "25 meters North"],
            correct_option: 0,
            explanation: "Moving 10m North and 10m South cancels the vertical displacement. The horizontal displacement is 15m to the East."
        },
        {
            id: "apt-19",
            category: "Data Interpretation",
            topic: "Basic Data Interpretation",
            difficulty: "Beginner",
            question: "A company produced 1200 units in 2021, 1500 units in 2022, and 1800 units in 2023. What is the percentage growth in production from 2021 to 2023?",
            options: ["33.33%", "40%", "50%", "60%"],
            correct_option: 2,
            explanation: "Increase = 1800 - 1200 = 600 units. Percentage growth = (600 / 1200) * 100 = 50%."
        },
        {
            id: "apt-20",
            category: "Quantitative",
            topic: "Ratio and Proportion",
            difficulty: "Intermediate",
            question: "In what ratio must tea at $62 per kg be mixed with tea at $72 per kg so that the mixture is worth $65 per kg?",
            options: ["7:3", "3:7", "5:3", "3:5"],
            correct_option: 0,
            explanation: "By rule of alligation: (72 - 65) : (65 - 62) = 7 : 3."
        },
        {
            id: "apt-21",
            category: "Quantitative",
            topic: "Basic Quantitative Reasoning",
            difficulty: "Beginner",
            question: "The sum of the present ages of a father and his son is 60 years. Six years ago, father's age was five times the age of the son. What is the son's present age?",
            options: ["12 years", "14 years", "16 years", "18 years"],
            correct_option: 1,
            explanation: "6 years ago sum was 60 - 12 = 48. Let son's age 6 yrs ago be x; 5x + x = 48 => x = 8. Son's present age = 8 + 6 = 14 years."
        },
        {
            id: "apt-22",
            category: "Quantitative",
            topic: "Probability",
            difficulty: "Intermediate",
            question: "A card is drawn at random from a standard well-shuffled pack of 52 cards. What is the probability of getting a King or a Heart?",
            options: ["4/13", "1/4", "17/52", "16/52"],
            correct_option: 0,
            explanation: "Number of Kings = 4, Number of Hearts = 13, King of Hearts = 1. Favorable = 4 + 13 - 1 = 16. Probability = 16/52 = 4/13."
        },
        {
            id: "apt-23",
            category: "Quantitative",
            topic: "Number Systems",
            difficulty: "Frequently Asked",
            question: "What is the smallest 4-digit number that is completely divisible by 12, 15, and 18?",
            options: ["1020", "1080", "1100", "1180"],
            correct_option: 1,
            explanation: "LCM(12, 15, 18) = 180. 1000 / 180 = 5 with remainder 100. Required number = 1000 + (180 - 100) = 1080."
        },
        {
            id: "apt-24",
            category: "Quantitative",
            topic: "Permutation and Combination",
            difficulty: "Frequently Asked",
            question: "In a room of 10 people, everyone shakes hands with everyone else exactly once. How many total handshakes take place?",
            options: ["45", "50", "90", "100"],
            correct_option: 0,
            explanation: "Total handshakes = 10C2 = (10 * 9) / 2 = 45."
        },
        {
            id: "apt-25",
            category: "Logical Reasoning",
            topic: "Number Systems",
            difficulty: "Intermediate",
            question: "Find the missing number in the sequence: 2, 6, 12, 20, 30, 42, ?",
            options: ["52", "54", "56", "60"],
            correct_option: 2,
            explanation: "The terms are n * (n + 1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8 = 56."
        },
        {
            id: "apt-26",
            category: "Quantitative",
            topic: "Time, Speed and Distance",
            difficulty: "Intermediate",
            question: "A boat can travel with a speed of 13 km/h in still water. If the speed of the stream is 4 km/h, find the time taken by the boat to go 68 km downstream.",
            options: ["3 hours", "4 hours", "5 hours", "5.5 hours"],
            correct_option: 1,
            explanation: "Downstream speed = 13 + 4 = 17 km/h. Time = 68 / 17 = 4 hours."
        },
        {
            id: "apt-27",
            category: "Quantitative",
            topic: "Percentages",
            difficulty: "Intermediate",
            question: "The population of a town increases by 10% annually. If its present population is 20,000, what will be the population after 2 years?",
            options: ["22,000", "24,000", "24,200", "24,400"],
            correct_option: 2,
            explanation: "Population after 2 years = 20,000 * (1 + 0.10)^2 = 20,000 * 1.21 = 24,200."
        },
        {
            id: "apt-28",
            category: "Quantitative",
            topic: "Profit and Loss",
            difficulty: "Frequently Asked",
            question: "Find the single equivalent discount percentage for two successive discounts of 20% and 10%.",
            options: ["28%", "30%", "25%", "29%"],
            correct_option: 0,
            explanation: "Equivalent discount = 20 + 10 - (20 * 10 / 100) = 30 - 2 = 28%."
        },
        {
            id: "apt-29",
            category: "Logical Reasoning",
            topic: "Logical Reasoning",
            difficulty: "Intermediate",
            question: "Five friends (P, Q, R, S, T) are sitting in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the middle?",
            options: ["P", "T", "S", "Q"],
            correct_option: 2,
            explanation: "Arrangement from left to right is P - T - S - Q - R. S is sitting in the exact middle."
        },
        {
            id: "apt-30",
            category: "Logical Reasoning",
            topic: "Logical Reasoning",
            difficulty: "Frequently Asked",
            question: "What is the angle between the hour hand and the minute hand of a clock at 3:30?",
            options: ["70 degrees", "75 degrees", "80 degrees", "85 degrees"],
            correct_option: 1,
            explanation: "Angle = |30*H - (11/2)*M| = |30*3 - (11/2)*30| = |90 - 165| = 75 degrees."
        },
        {
            id: "apt-31",
            category: "Logical Reasoning",
            topic: "Logical Reasoning",
            difficulty: "Frequently Asked",
            question: "If January 1, 2006 was a Sunday, what day of the week was January 1, 2010?",
            options: ["Thursday", "Friday", "Saturday", "Sunday"],
            correct_option: 1,
            explanation: "Odd days: 2006(1) + 2007(1) + 2008(2) + 2009(1) = 5 odd days. Sunday + 5 days = Friday."
        },
        {
            id: "apt-32",
            category: "Quantitative",
            topic: "Time and Work",
            difficulty: "Advanced",
            question: "A and B undertake to do a piece of work for $600. A alone can do it in 6 days while B alone can do it in 8 days. With the help of C, they finish it in 3 days. Find C's share.",
            options: ["$75", "$100", "$125", "$150"],
            correct_option: 0,
            explanation: "C's 1-day work = 1/3 - (1/6 + 1/8) = 1/24. Work ratio A:B:C = 4:3:1. C's share = (1/8) * 600 = $75."
        },
        {
            id: "apt-33",
            category: "Quantitative",
            topic: "Basic Quantitative Reasoning",
            difficulty: "Beginner",
            question: "Which of the following fractions is the largest: 3/4, 5/6, 7/9, 11/13?",
            options: ["3/4", "5/6", "7/9", "11/13"],
            correct_option: 3,
            explanation: "Decimals: 3/4 = 0.75, 5/6 = 0.833, 7/9 = 0.777, 11/13 ≈ 0.846. Hence 11/13 is the largest."
        },
        {
            id: "apt-34",
            category: "Logical Reasoning",
            topic: "Number Systems",
            difficulty: "Beginner",
            question: "Find the odd one out from the given options: 27, 64, 125, 144, 216.",
            options: ["27", "64", "125", "144"],
            correct_option: 3,
            explanation: "27=3^3, 64=4^3, 125=5^3, 216=6^3 are all perfect cubes. 144 = 12^2 is a square, not a cube."
        },
        {
            id: "apt-35",
            category: "Data Interpretation",
            topic: "Basic Data Interpretation",
            difficulty: "Beginner",
            question: "A monthly family budget of $4,000 allocates 35% to rent, 25% to food, 15% to savings, and the rest to miscellaneous expenses. How much is spent on miscellaneous expenses?",
            options: ["$800", "$1,000", "$1,200", "$600"],
            correct_option: 1,
            explanation: "Miscellaneous percentage = 100% - (35% + 25% + 15%) = 25%. Amount = 0.25 * 4,000 = $1,000."
        }
    ],

    // =========================================================================
    // 2. TECHNICAL QUESTIONS POOL (32 Questions)
    // =========================================================================
    technicalQuestions: [
        {
            id: "tech-1",
            role: "Software Developer",
            topic: "OOP",
            difficulty: "Intermediate",
            question: "Explain the four pillars of Object-Oriented Programming (OOP) with real-world engineering examples.",
            expected_concepts: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
            sample_answer: "Encapsulation (bundling state and methods within classes with access modifiers), Abstraction (hiding implementation complexity behind interfaces), Inheritance (reusing attributes from a base class), and Polymorphism (ability to take multiple forms via overriding and overloading)."
        },
        {
            id: "tech-2",
            role: "Full Stack Developer",
            topic: "DBMS & Databases",
            difficulty: "Intermediate",
            question: "What are ACID properties in database management systems and why are they critical for transaction reliability?",
            expected_concepts: ["Atomicity", "Consistency", "Isolation", "Durability"],
            sample_answer: "Atomicity ensures all-or-nothing transactions, Consistency guarantees state transitions adhere to constraints, Isolation prevents concurrent race collisions, and Durability ensures committed writes persist even through power outages."
        },
        {
            id: "tech-3",
            role: "Frontend Developer",
            topic: "Web Performance & DOM",
            difficulty: "Intermediate",
            question: "What is the difference between Virtual DOM and Real DOM, and how does the reconciliation algorithm optimize rendering?",
            expected_concepts: ["Virtual DOM tree", "Diffing algorithm", "Batch DOM updates", "Reflow and Repaint reduction"],
            sample_answer: "The Real DOM triggers expensive layout reflows on every mutation. The Virtual DOM creates an in-memory lightweight representation, computes minimal tree differences (diffing), and batch updates only the affected nodes."
        },
        {
            id: "tech-4",
            role: "Backend Developer",
            topic: "APIs & Web Services",
            difficulty: "Intermediate",
            question: "What is the architectural difference between REST and GraphQL? In what scenarios would you choose one over the other?",
            expected_concepts: ["Fixed endpoints vs Single endpoint", "Over-fetching and Under-fetching", "Schema & Type safety", "HTTP caching"],
            sample_answer: "REST uses resource-centric HTTP endpoints with standard methods and native caching. GraphQL uses a single POST endpoint with a strongly typed schema allowing clients to declare exact data shapes, eliminating over-fetching."
        },
        {
            id: "tech-5",
            role: "Full Stack Developer",
            topic: "Authentication & Security",
            difficulty: "Advanced",
            question: "How does JWT (JSON Web Token) authentication work, and how do you mitigate risks like token theft and session revocation?",
            expected_concepts: ["Header.Payload.Signature", "Statelessness", "HttpOnly Cookies", "Short-lived Access Tokens & Refresh Tokens"],
            sample_answer: "JWTs encode claims signed cryptographically. Mitigation includes storing tokens in secure HttpOnly SameSite cookies, issuing short-lived access tokens (15m) paired with rotating refresh tokens stored in a revoked-list database."
        },
        {
            id: "tech-6",
            role: "Software Developer",
            topic: "Operating Systems",
            difficulty: "Intermediate",
            question: "Explain the difference between a Process and a Thread. How does context switching overhead differ between them?",
            expected_concepts: ["Separate address space vs Shared memory", "Context switching overhead", "Process Control Block (PCB) vs TCB", "Inter-Process Communication (IPC)"],
            sample_answer: "A process has its own isolated virtual memory space and resources, while threads share the process memory heap, code, and file descriptors. Thread context switching is substantially faster because virtual memory mappings do not need to be reloaded."
        },
        {
            id: "tech-7",
            role: "Software Developer",
            topic: "Computer Networks",
            difficulty: "Intermediate",
            question: "Describe the TCP 3-Way Handshake. Why is it necessary before data transmission compared to UDP?",
            expected_concepts: ["SYN, SYN-ACK, ACK", "Sequence numbers initialization", "Reliable ordered delivery", "Connection-oriented vs Connectionless"],
            sample_answer: "Client sends SYN with initial sequence number, server responds with SYN-ACK, and client sends ACK. This synchronizes sequence numbers and establishes a reliable, bidirectional, ordered data transmission stream before payloads are exchanged."
        },
        {
            id: "tech-8",
            role: "Backend Developer",
            topic: "DBMS & Databases",
            difficulty: "Advanced",
            question: "How does database indexing work under the hood? Contrast B-Tree indexes with Hash indexes.",
            expected_concepts: ["B-Tree / B+Tree structure", "O(log N) lookup", "Range queries support", "Hash index O(1) exact match limitations"],
            sample_answer: "B-Tree indexes maintain balanced, sorted tree hierarchies optimal for range scans, sorting, and equality searches in O(log N) time. Hash indexes provide O(1) lookups for exact matches but cannot perform range searches or ORDER BY queries."
        },
        {
            id: "tech-9",
            role: "Software Developer",
            topic: "SQL & Databases",
            difficulty: "Beginner",
            question: "Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with practical examples.",
            expected_concepts: ["Matching rows only", "All left rows with NULL right", "All right rows with NULL left", "Union of all records"],
            sample_answer: "INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table with matched right records (or NULL). RIGHT JOIN does the reverse, and FULL OUTER JOIN returns all rows from both tables."
        },
        {
            id: "tech-10",
            role: "Java Developer",
            topic: "Java Internals & JVM",
            difficulty: "Intermediate",
            question: "How does Garbage Collection work in the JVM? Explain the Young, Old, and Permanent/Metaspace generations.",
            expected_concepts: ["Mark and Sweep algorithm", "Eden, Survivor (S0/S1), Tenured/Old generation", "Minor GC vs Major GC", "Metaspace memory"],
            sample_answer: "Objects are allocated in the Eden space. Surviving objects migrate through Survivor spaces during Minor GCs and get promoted to the Old Generation. Major GCs collect long-lived objects when Tenured memory fills up."
        },
        {
            id: "tech-11",
            role: "Python Developer",
            topic: "Python Internals",
            difficulty: "Intermediate",
            question: "What is the Global Interpreter Lock (GIL) in CPython, and how do you achieve true parallelism in CPU-bound vs I/O-bound Python programs?",
            expected_concepts: ["CPython mutex", "Single thread bytecode execution", "multiprocessing module for CPU tasks", "asyncio / threading for I/O tasks"],
            sample_answer: "The GIL is a mutex preventing multiple native threads from executing Python bytecodes simultaneously. For I/O-bound tasks, threading or asyncio achieves concurrency; for CPU-bound tasks, multiprocessing or C-extensions bypass the GIL."
        },
        {
            id: "tech-12",
            role: "Frontend Developer",
            topic: "JavaScript Internals",
            difficulty: "Intermediate",
            question: "Explain the JavaScript Event Loop, Call Stack, Microtask Queue, and Macrotask Queue execution order.",
            expected_concepts: ["Call stack execution", "Microtasks (Promises, queueMicrotask)", "Macrotasks (setTimeout, setInterval)", "Event loop prioritization"],
            sample_answer: "Synchronous code runs on the Call Stack. When empty, the event loop drains ALL microtasks (Promises, process.nextTick) before picking the next single macrotask (setTimeout, DOM events, I/O)."
        },
        {
            id: "tech-13",
            role: "Software Developer",
            topic: "System Design",
            difficulty: "Advanced",
            question: "Explain the CAP Theorem and how distributed databases make trade-offs between Consistency, Availability, and Partition Tolerance.",
            expected_concepts: ["Consistency", "Availability", "Partition Tolerance", "CP vs AP database systems"],
            sample_answer: "In a network partition (P), a distributed system can guarantee either Consistency (C) by rejecting stale writes/reads or Availability (A) by continuing to serve local responses at the expense of temporary divergence."
        },
        {
            id: "tech-14",
            role: "Backend Developer",
            topic: "Caching & Performance",
            difficulty: "Intermediate",
            question: "Compare Cache-Aside, Write-Through, and Write-Back caching strategies. When is Redis preferred over Memcached?",
            expected_concepts: ["Cache-Aside pattern", "Write-Through latency", "Write-Back async durability risk", "Redis data structures & persistence"],
            sample_answer: "Cache-Aside queries cache first and populates on miss. Write-Through writes simultaneously to cache and DB. Write-Back writes to cache and syncs DB asynchronously. Redis is chosen for rich data structures, pub/sub, and persistence."
        },
        {
            id: "tech-15",
            role: "Software Developer",
            topic: "Web Security",
            difficulty: "Intermediate",
            question: "Explain Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). How do you defend modern web applications against them?",
            expected_concepts: ["Stored/Reflected XSS", "Content Security Policy (CSP)", "HTML escaping & sanitization", "CSRF tokens & SameSite cookies"],
            sample_answer: "XSS executes unauthorized client scripts; defended with HTML context escaping and strict CSP headers. CSRF tricks authenticated browsers into submitting malicious requests; defended using Anti-CSRF tokens and SameSite=Strict cookies."
        },
        {
            id: "tech-16",
            role: "Software Developer",
            topic: "Computer Networks & Security",
            difficulty: "Intermediate",
            question: "How does an HTTPS TLS/SSL handshake establish secure communication? Explain symmetric vs asymmetric encryption in this context.",
            expected_concepts: ["TLS certificate verification", "Asymmetric key exchange (RSA/Diffie-Hellman)", "Symmetric session key", "Data integrity / HMAC"],
            sample_answer: "The client verifies the server certificate using CA public keys. Asymmetric encryption negotiates a shared secret session key. Subsequent HTTP traffic is encrypted using fast symmetric encryption (AES-GCM) with this shared key."
        },
        {
            id: "tech-17",
            role: "Software Developer",
            topic: "DBMS & Databases",
            difficulty: "Intermediate",
            question: "What is Database Normalization (1NF, 2NF, 3NF)? When is deliberate Denormalization justified in read-heavy applications?",
            expected_concepts: ["1NF atomic values", "2NF partial dependency removal", "3NF transitive dependency removal", "Denormalization for fast joins"],
            sample_answer: "1NF enforces atomic columns, 2NF eliminates partial dependencies on composite keys, and 3NF removes transitive dependencies. Denormalization reduces expensive multi-table joins in high-scale read-heavy systems like analytics dashboards."
        },
        {
            id: "tech-18",
            role: "Software Developer",
            topic: "System Design",
            difficulty: "Intermediate",
            question: "Explain the main Load Balancing algorithms (Round Robin, Least Connections, Consistent Hashing) and Layer 4 vs Layer 7 load balancing.",
            expected_concepts: ["Round Robin & Weighted Round Robin", "Least Connections", "Consistent Hashing for cache locality", "L4 (TCP/UDP) vs L7 (HTTP/Path routing)"],
            sample_answer: "Round Robin rotates requests sequentially; Least Connections directs traffic to servers with fewest active sessions. Consistent Hashing minimizes cache misses on node scaling. L4 balances at transport level; L7 inspects HTTP headers, cookies, and URLs."
        },
        {
            id: "tech-19",
            role: "Software Developer",
            topic: "Data Structures & Algorithms",
            difficulty: "Intermediate",
            question: "How do Hash Tables resolve collisions? Compare Separate Chaining with Open Addressing (Linear Probing, Quadratic Probing, Double Hashing).",
            expected_concepts: ["Hash function distribution", "Separate Chaining with Linked Lists / Red-Black trees", "Linear / Quadratic probing", "Load factor & rehashing"],
            sample_answer: "Separate Chaining stores colliding entries in linked lists or balanced trees at the bucket index. Open Addressing searches for adjacent empty slots in the main table array via probing sequences when collisions occur."
        },
        {
            id: "tech-20",
            role: "Backend Developer",
            topic: "Messaging & Microservices",
            difficulty: "Advanced",
            question: "What are the core differences between RabbitMQ (message broker) and Apache Kafka (distributed event streaming log)?",
            expected_concepts: ["Push vs Pull model", "Smart broker vs Dumb broker / Smart consumer", "Log retention & replayability", "Throughput scaling"],
            sample_answer: "RabbitMQ is an AMQP broker that tracks delivery state and deletes messages after ack. Kafka is an immutable, distributed, append-only partitioned log where consumers pull and track their own offsets, allowing historical replay."
        },
        {
            id: "tech-21",
            role: "Frontend Developer",
            topic: "Web Performance",
            difficulty: "Intermediate",
            question: "What are Google Core Web Vitals (LCP, INP, CLS) and what engineering techniques optimize each metric?",
            expected_concepts: ["Largest Contentful Paint (LCP)", "Interaction to Next Paint (INP)", "Cumulative Layout Shift (CLS)", "Image sizing, code splitting, layout stability"],
            sample_answer: "LCP measures load speed (optimized via CDNs, preload headers, and image compression). INP measures user interactivity responsiveness (optimized by yielding to main thread and debouncing). CLS measures layout shifts (fixed by reserving width/height on media)."
        },
        {
            id: "tech-22",
            role: "Software Developer",
            topic: "Operating Systems",
            difficulty: "Intermediate",
            question: "What are the four Coffman conditions required for a Deadlock to occur, and how do operating systems prevent or recover from deadlocks?",
            expected_concepts: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait", "Banker's Algorithm & Resource ordering"],
            sample_answer: "Deadlocks require: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Prevention breaks one condition, such as enforcing strict global resource hierarchy ordering to make Circular Wait impossible."
        },
        {
            id: "tech-23",
            role: "Software Developer",
            topic: "Clean Architecture & OOP",
            difficulty: "Intermediate",
            question: "Explain the SOLID principles of Object-Oriented Software Design with practical examples of their benefits.",
            expected_concepts: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"],
            sample_answer: "Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable for base types), Interface Segregation (focused client interfaces), and Dependency Inversion (depend on abstractions, not concretions)."
        },
        {
            id: "tech-24",
            role: "Backend Developer",
            topic: "APIs & Web Architecture",
            difficulty: "Intermediate",
            question: "What does Idempotency mean in HTTP and REST API design? Which HTTP verbs are inherently idempotent and why?",
            expected_concepts: ["Idempotency definition", "GET, PUT, DELETE, HEAD vs POST", "Idempotency-Key headers in payment gateways"],
            sample_answer: "An operation is idempotent if executing it multiple times produces the exact same server state as a single execution. GET, PUT, DELETE, and HEAD are idempotent; POST is non-idempotent because repeated requests create duplicate resources."
        },
        {
            id: "tech-25",
            role: "Backend Developer",
            topic: "Database Architecture",
            difficulty: "Advanced",
            question: "Compare Horizontal Database Sharding, Vertical Partitioning, and Read Replicas. What challenges arise with cross-shard joins and distributed transactions?",
            expected_concepts: ["Shard key selection", "Read/Write split with replicas", "Two-Phase Commit (2PC) / Sagas", "Cross-shard query latency"],
            sample_answer: "Read replicas scale read queries asynchronously. Vertical partitioning splits wide tables into functional tables. Horizontal sharding splits rows across distinct database instances by shard key. Cross-shard joins require 2PC or Saga patterns to maintain consistency."
        },
        {
            id: "tech-26",
            role: "Software Developer",
            topic: "DevOps & Containers",
            difficulty: "Beginner",
            question: "How do Docker containers differ from Virtual Machines? Explain the role of Linux cgroups and namespaces in container isolation.",
            expected_concepts: ["Shared host OS kernel", "Namespaces (PID, NET, MNT)", "cgroups (CPU/Memory limits)", "Lightweight footprint vs Hypervisor"],
            sample_answer: "VMs run full guest operating systems on top of hypervisors with duplicated kernel overhead. Containers share the host Linux kernel, using namespaces for process/network isolation and cgroups for resource quota enforcement."
        },
        {
            id: "tech-27",
            role: "Java Developer",
            topic: "Spring Boot & Java",
            difficulty: "Intermediate",
            question: "Explain Dependency Injection (DI) and Inversion of Control (IoC) in Spring Boot. What are Bean Scopes (Singleton, Prototype, Request, Session)?",
            expected_concepts: ["Inversion of Control container", "Constructor vs Setter injection", "Singleton default scope", "Prototype fresh instance scope"],
            sample_answer: "IoC delegates object lifecycle and dependency wiring to the Spring container via Dependency Injection. Singleton scope creates a single shared instance per ApplicationContext; Prototype creates a new bean every time requested."
        },
        {
            id: "tech-28",
            role: "Frontend Developer",
            topic: "State Management",
            difficulty: "Intermediate",
            question: "How do unidirectional data flow and state immutability prevent subtle UI synchronization bugs in modern frontend applications?",
            expected_concepts: ["Unidirectional data flow", "Immutability & shallow equality checks", "Predictable state transitions", "Pure functions and reducers"],
            sample_answer: "Unidirectional data flow ensures data travels in one direction (Action -> State -> View), making transitions predictable. Immutability enables shallow reference equality checks (prev !== next), bypassing deep object comparisons during re-renders."
        },
        {
            id: "tech-29",
            role: "Software Developer",
            topic: "Computer Networks",
            difficulty: "Beginner",
            question: "Describe the step-by-step lifecycle of a DNS lookup when a user types a URL into a browser.",
            expected_concepts: ["Browser / OS DNS cache", "Recursive DNS resolver", "Root nameservers", "TLD nameservers", "Authoritative nameserver & TTL"],
            sample_answer: "Browser checks local cache and OS resolver. If missing, the recursive resolver queries Root nameserver (.) -> TLD nameserver (.com) -> Authoritative nameserver for domain A records, which returns the IP and caches it with TTL."
        },
        {
            id: "tech-30",
            role: "Backend Developer",
            topic: "System Design",
            difficulty: "Advanced",
            question: "Explain the Token Bucket and Sliding Window Log algorithms for API Rate Limiting. Where should rate limiting be enforced in distributed systems?",
            expected_concepts: ["Token Bucket algorithm", "Sliding Window Log / Counter", "API Gateway / Reverse Proxy layer", "Redis atomic operations"],
            sample_answer: "Token Bucket adds tokens at a fixed rate and allows burst traffic if tokens are available. Sliding Window tracks timestamps in a sorted set to eliminate burst vulnerabilities. Rate limiting is enforced at API Gateways using Redis atomic increments."
        },
        {
            id: "tech-31",
            role: "Software Developer",
            topic: "Algorithms & Complexity",
            difficulty: "Beginner",
            question: "What is Big O notation? Contrast O(1), O(log N), O(N), O(N log N), and O(N^2) with concrete algorithmic examples.",
            expected_concepts: ["Upper bound growth rate", "O(1) hash lookup", "O(log N) binary search", "O(N log N) merge sort", "O(N^2) nested loops"],
            sample_answer: "Big O describes worst-case asymptotic growth. O(1) is instant array indexing; O(log N) halves problem size like Binary Search; O(N) is linear scan; O(N log N) is optimal comparison sorting (Merge Sort); O(N^2) is nested iterations (Bubble Sort)."
        },
        {
            id: "tech-32",
            role: "Software Developer",
            topic: "Git & Version Control",
            difficulty: "Beginner",
            question: "Explain the difference between `git merge` and `git rebase`. When is one preferred over the other in team workflows?",
            expected_concepts: ["Merge commits & non-destructive history", "Rebase linear commit history", "Golden Rule of Rebase (never rebase public main)", "Interactive rebasing"],
            sample_answer: "`git merge` combines branches with a dedicated merge commit preserving exact history timestamps. `git rebase` rewrites feature branch commits on top of the target branch for a clean, linear commit log before merging."
        }
    ],

    // =========================================================================
    // 3. CODING / DSA QUESTIONS POOL (32 Questions)
    // =========================================================================
    codingQuestions: [
        {
            id: "code-1",
            title: "Two Sum",
            role: "Software Developer",
            topic: "Arrays & Hash Maps",
            difficulty: "Beginner",
            description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            examples: [
                { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
                { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6." }
            ],
            constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
            starter_code: {
                javascript: "function twoSum(nums, target) {\n    // Write your code here\n    \n}",
                python: "def two_sum(nums, target):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}",
                python: "def two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i\n    return []"
            },
            test_cases: [
                { input: "nums = [2,7,11,15], target = 9", expected_output: "[0,1]", is_hidden: false },
                { input: "nums = [3,2,4], target = 6", expected_output: "[1,2]", is_hidden: false },
                { input: "nums = [3,3], target = 6", expected_output: "[0,1]", is_hidden: true }
            ]
        },
        {
            id: "code-2",
            title: "Valid Parentheses",
            role: "Software Developer",
            topic: "Stack",
            difficulty: "Beginner",
            description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if brackets are closed in the correct order with matching pairs.",
            examples: [
                { input: "s = \"()[]{}\"", output: "true", explanation: "All matched in correct order." },
                { input: "s = \"(]\"", output: "false", explanation: "Mismatched bracket types." }
            ],
            constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only."],
            starter_code: {
                javascript: "function isValid(s) {\n    // Write your code here\n    \n}",
                python: "def is_valid(s):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let c of s) {\n        if (map[c]) {\n            if (stack.pop() !== map[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}",
                python: "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack"
            },
            test_cases: [
                { input: "s = \"()\"", expected_output: "true", is_hidden: false },
                { input: "s = \"()[]{}\"", expected_output: "true", is_hidden: false },
                { input: "s = \"(]\"", expected_output: "false", is_hidden: false },
                { input: "s = \"([{}])\"", expected_output: "true", is_hidden: true }
            ]
        },
        {
            id: "code-3",
            title: "Reverse Linked List",
            role: "Software Developer",
            topic: "Linked Lists",
            difficulty: "Intermediate",
            description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
            examples: [
                { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "The list pointers are reversed." }
            ],
            constraints: ["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"],
            starter_code: {
                javascript: "function reverseList(head) {\n    // Write your code here\n    \n}",
                python: "def reverse_list(head):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
                python: "def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev"
            },
            test_cases: [
                { input: "head = [1,2,3,4,5]", expected_output: "[5,4,3,2,1]", is_hidden: false },
                { input: "head = [1,2]", expected_output: "[2,1]", is_hidden: false },
                { input: "head = []", expected_output: "[]", is_hidden: true }
            ]
        },
        {
            id: "code-4",
            title: "Best Time to Buy and Sell Stock",
            role: "Software Developer",
            topic: "Arrays & Sliding Window",
            difficulty: "Beginner",
            description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell. Return the maximum profit.",
            examples: [
                { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5." },
                { input: "prices = [7,6,4,3,1]", output: "0", explanation: "In this case, no transactions are done and max profit = 0." }
            ],
            constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
            starter_code: {
                javascript: "function maxProfit(prices) {\n    // Write your code here\n    \n}",
                python: "def max_profit(prices):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function maxProfit(prices) {\n    let minPrice = Infinity, maxProfit = 0;\n    for (let p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    return maxProfit;\n}",
                python: "def max_profit(prices):\n    min_price, max_profit = float('inf'), 0\n    for p in prices:\n        min_price = min(min_price, p)\n        max_profit = max(max_profit, p - min_price)\n    return max_profit"
            },
            test_cases: [
                { input: "prices = [7,1,5,3,6,4]", expected_output: "5", is_hidden: false },
                { input: "prices = [7,6,4,3,1]", expected_output: "0", is_hidden: false },
                { input: "prices = [2,4,1]", expected_output: "2", is_hidden: true }
            ]
        },
        {
            id: "code-5",
            title: "Maximum Subarray (Kadane's Algorithm)",
            role: "Software Developer",
            topic: "Dynamic Programming & Arrays",
            difficulty: "Intermediate",
            description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
            examples: [
                { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
                { input: "nums = [1]", output: "1", explanation: "Subarray [1] has sum 1." }
            ],
            constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
            starter_code: {
                javascript: "function maxSubArray(nums) {\n    // Write your code here\n    \n}",
                python: "def max_sub_array(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function maxSubArray(nums) {\n    let maxSoFar = nums[0], maxEndingHere = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n        maxSoFar = Math.max(maxSoFar, maxEndingHere);\n    }\n    return maxSoFar;\n}",
                python: "def max_sub_array(nums):\n    max_so_far = max_ending = nums[0]\n    for x in nums[1:]:\n        max_ending = max(x, max_ending + x)\n        max_so_far = max(max_so_far, max_ending)\n    return max_so_far"
            },
            test_cases: [
                { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expected_output: "6", is_hidden: false },
                { input: "nums = [1]", expected_output: "1", is_hidden: false },
                { input: "nums = [5,4,-1,7,8]", expected_output: "23", is_hidden: true }
            ]
        },
        {
            id: "code-6",
            title: "Valid Anagram",
            role: "Software Developer",
            topic: "Strings & Hash Table",
            difficulty: "Beginner",
            description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
            examples: [
                { input: "s = \"anagram\", t = \"nagaram\"", output: "true", explanation: "All character frequencies match." },
                { input: "s = \"rat\", t = \"car\"", output: "false", explanation: "Characters differ." }
            ],
            constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
            starter_code: {
                javascript: "function isAnagram(s, t) {\n    // Write your code here\n    \n}",
                python: "def is_anagram(s, t):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const count = {};\n    for (let c of s) count[c] = (count[c] || 0) + 1;\n    for (let c of t) {\n        if (!count[c]) return false;\n        count[c]--;\n    }\n    return true;\n}",
                python: "def is_anagram(s, t):\n    if len(s) != len(t): return False\n    from collections import Counter\n    return Counter(s) == Counter(t)"
            },
            test_cases: [
                { input: "s = \"anagram\", t = \"nagaram\"", expected_output: "true", is_hidden: false },
                { input: "s = \"rat\", t = \"car\"", expected_output: "false", is_hidden: false },
                { input: "s = \"a\", t = \"ab\"", expected_output: "false", is_hidden: true }
            ]
        },
        {
            id: "code-7",
            title: "Binary Search",
            role: "Software Developer",
            topic: "Searching",
            difficulty: "Beginner",
            description: "Given an array of integers `nums` sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1` in O(log n) time.",
            examples: [
                { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
                { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1." }
            ],
            constraints: ["1 <= nums.length <= 10^4", "All elements are unique and sorted."],
            starter_code: {
                javascript: "function search(nums, target) {\n    // Write your code here\n    \n}",
                python: "def search(nums, target):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
                python: "def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1"
            },
            test_cases: [
                { input: "nums = [-1,0,3,5,9,12], target = 9", expected_output: "4", is_hidden: false },
                { input: "nums = [-1,0,3,5,9,12], target = 2", expected_output: "-1", is_hidden: false },
                { input: "nums = [5], target = 5", expected_output: "0", is_hidden: true }
            ]
        },
        {
            id: "code-8",
            title: "Merge Two Sorted Lists",
            role: "Software Developer",
            topic: "Linked Lists",
            difficulty: "Beginner",
            description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list and return its head.",
            examples: [
                { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Merged in ascending sorted order." }
            ],
            constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
            starter_code: {
                javascript: "function mergeTwoLists(list1, list2) {\n    // Write your code here\n    \n}",
                python: "def merge_two_lists(list1, list2):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function mergeTwoLists(list1, list2) {\n    let dummy = { val: 0, next: null };\n    let curr = dummy;\n    while (list1 && list2) {\n        if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }\n        else { curr.next = list2; list2 = list2.next; }\n        curr = curr.next;\n    }\n    curr.next = list1 || list2;\n    return dummy.next;\n}",
                python: "def merge_two_lists(list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next, list1 = list1, list1.next\n        else:\n            curr.next, list2 = list2, list2.next\n        curr = curr.next\n    curr.next = list1 or list2\n    return dummy.next"
            },
            test_cases: [
                { input: "list1 = [1,2,4], list2 = [1,3,4]", expected_output: "[1,1,2,3,4,4]", is_hidden: false },
                { input: "list1 = [], list2 = []", expected_output: "[]", is_hidden: false }
            ]
        },
        {
            id: "code-9",
            title: "Invert Binary Tree",
            role: "Software Developer",
            topic: "Trees",
            difficulty: "Beginner",
            description: "Given the root of a binary tree, invert the tree (swap left and right children recursively), and return its root.",
            examples: [
                { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "Every left and right subtree swapped." }
            ],
            constraints: ["The number of nodes in the tree is in the range [0, 100]."],
            starter_code: {
                javascript: "function invertTree(root) {\n    // Write your code here\n    \n}",
                python: "def invert_tree(root):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function invertTree(root) {\n    if (!root) return null;\n    let temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}",
                python: "def invert_tree(root):\n    if not root: return None\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root"
            },
            test_cases: [
                { input: "root = [4,2,7,1,3,6,9]", expected_output: "[4,7,2,9,6,3,1]", is_hidden: false },
                { input: "root = [2,1,3]", expected_output: "[2,3,1]", is_hidden: false }
            ]
        },
        {
            id: "code-10",
            title: "Climbing Stairs",
            role: "Software Developer",
            topic: "Dynamic Programming",
            difficulty: "Beginner",
            description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            examples: [
                { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
                { input: "n = 3", output: "3", explanation: "1. 1+1+1\n2. 1+2\n3. 2+1" }
            ],
            constraints: ["1 <= n <= 45"],
            starter_code: {
                javascript: "function climbStairs(n) {\n    // Write your code here\n    \n}",
                python: "def climb_stairs(n):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}",
                python: "def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b"
            },
            test_cases: [
                { input: "n = 2", expected_output: "2", is_hidden: false },
                { input: "n = 3", expected_output: "3", is_hidden: false },
                { input: "n = 5", expected_output: "8", is_hidden: true }
            ]
        },
        {
            id: "code-11",
            title: "Contains Duplicate",
            role: "Software Developer",
            topic: "Arrays & Hash Sets",
            difficulty: "Beginner",
            description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
            examples: [
                { input: "nums = [1,2,3,1]", output: "true", explanation: "1 occurs twice." },
                { input: "nums = [1,2,3,4]", output: "false", explanation: "All elements are unique." }
            ],
            constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
            starter_code: {
                javascript: "function containsDuplicate(nums) {\n    // Write your code here\n    \n}",
                python: "def contains_duplicate(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function containsDuplicate(nums) {\n    const set = new Set();\n    for (let n of nums) {\n        if (set.has(n)) return true;\n        set.add(n);\n    }\n    return false;\n}",
                python: "def contains_duplicate(nums):\n    return len(nums) != len(set(nums))"
            },
            test_cases: [
                { input: "nums = [1,2,3,1]", expected_output: "true", is_hidden: false },
                { input: "nums = [1,2,3,4]", expected_output: "false", is_hidden: false },
                { input: "nums = [1,1,1,3,3,4,3,2,4,2]", expected_output: "true", is_hidden: true }
            ]
        },
        {
            id: "code-12",
            title: "Valid Palindrome",
            role: "Software Developer",
            topic: "Two Pointers & Strings",
            difficulty: "Beginner",
            description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Return `true` if it is a palindrome.",
            examples: [
                { input: "s = \"A man, a plan, a canal: Panama\"", output: "true", explanation: "\"amanaplanacanalpanama\" is a palindrome." },
                { input: "s = \"race a car\"", output: "false", explanation: "\"raceacar\" is not a palindrome." }
            ],
            constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
            starter_code: {
                javascript: "function isPalindrome(s) {\n    // Write your code here\n    \n}",
                python: "def is_palindrome(s):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function isPalindrome(s) {\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    let left = 0, right = clean.length - 1;\n    while (left < right) {\n        if (clean[left] !== clean[right]) return false;\n        left++; right--;\n    }\n    return true;\n}",
                python: "def is_palindrome(s):\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]"
            },
            test_cases: [
                { input: "s = \"A man, a plan, a canal: Panama\"", expected_output: "true", is_hidden: false },
                { input: "s = \"race a car\"", expected_output: "false", is_hidden: false },
                { input: "s = \" \"", expected_output: "true", is_hidden: true }
            ]
        },
        {
            id: "code-13",
            title: "Maximum Depth of Binary Tree",
            role: "Software Developer",
            topic: "Trees",
            difficulty: "Beginner",
            description: "Given the root of a binary tree, return its maximum depth (the number of nodes along the longest path from the root node down to the farthest leaf node).",
            examples: [
                { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Longest branch is 3 -> 20 -> 15 (depth 3)." }
            ],
            constraints: ["The number of nodes in the tree is in the range [0, 10^4]."],
            starter_code: {
                javascript: "function maxDepth(root) {\n    // Write your code here\n    \n}",
                python: "def max_depth(root):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
                python: "def max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))"
            },
            test_cases: [
                { input: "root = [3,9,20,null,null,15,7]", expected_output: "3", is_hidden: false },
                { input: "root = [1,null,2]", expected_output: "2", is_hidden: false },
                { input: "root = []", expected_output: "0", is_hidden: true }
            ]
        },
        {
            id: "code-14",
            title: "Single Number",
            role: "Software Developer",
            topic: "Bit Manipulation & Arrays",
            difficulty: "Beginner",
            description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. Implement a solution with linear runtime complexity and constant extra space using XOR.",
            examples: [
                { input: "nums = [2,2,1]", output: "1", explanation: "1 occurs once." },
                { input: "nums = [4,1,2,1,2]", output: "4", explanation: "4 occurs once." }
            ],
            constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4"],
            starter_code: {
                javascript: "function singleNumber(nums) {\n    // Write your code here\n    \n}",
                python: "def single_number(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function singleNumber(nums) {\n    let res = 0;\n    for (let n of nums) res ^= n;\n    return res;\n}",
                python: "def single_number(nums):\n    res = 0\n    for n in nums: res ^= n\n    return res"
            },
            test_cases: [
                { input: "nums = [2,2,1]", expected_output: "1", is_hidden: false },
                { input: "nums = [4,1,2,1,2]", expected_output: "4", is_hidden: false },
                { input: "nums = [1]", expected_output: "1", is_hidden: true }
            ]
        },
        {
            id: "code-15",
            title: "Intersection of Two Arrays",
            role: "Software Developer",
            topic: "Hash Maps & Sets",
            difficulty: "Beginner",
            description: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique.",
            examples: [
                { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]", explanation: "Common unique value is 2." }
            ],
            constraints: ["1 <= nums1.length, nums2.length <= 1000"],
            starter_code: {
                javascript: "function intersection(nums1, nums2) {\n    // Write your code here\n    \n}",
                python: "def intersection(nums1, nums2):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function intersection(nums1, nums2) {\n    const set1 = new Set(nums1);\n    const result = new Set();\n    for (let n of nums2) {\n        if (set1.has(n)) result.add(n);\n    }\n    return Array.from(result);\n}",
                python: "def intersection(nums1, nums2):\n    return list(set(nums1) & set(nums2))"
            },
            test_cases: [
                { input: "nums1 = [1,2,2,1], nums2 = [2,2]", expected_output: "[2]", is_hidden: false },
                { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", expected_output: "[4,9]", is_hidden: false }
            ]
        },
        {
            id: "code-16",
            title: "Move Zeroes",
            role: "Software Developer",
            topic: "Two Pointers & Arrays",
            difficulty: "Beginner",
            description: "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements in-place.",
            examples: [
                { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]", explanation: "All zeros shifted to end." }
            ],
            constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
            starter_code: {
                javascript: "function moveZeroes(nums) {\n    // Write your code here\n    \n}",
                python: "def move_zeroes(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function moveZeroes(nums) {\n    let insertPos = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) {\n            nums[insertPos++] = nums[i];\n        }\n    }\n    while (insertPos < nums.length) nums[insertPos++] = 0;\n    return nums;\n}",
                python: "def move_zeroes(nums):\n    insert_pos = 0\n    for x in nums:\n        if x != 0:\n            nums[insert_pos] = x\n            insert_pos += 1\n    for i in range(insert_pos, len(nums)):\n        nums[i] = 0\n    return nums"
            },
            test_cases: [
                { input: "nums = [0,1,0,3,12]", expected_output: "[1,3,12,0,0]", is_hidden: false },
                { input: "nums = [0]", expected_output: "[0]", is_hidden: false }
            ]
        },
        {
            id: "code-17",
            title: "Missing Number",
            role: "Software Developer",
            topic: "Math & Bit Manipulation",
            difficulty: "Beginner",
            description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
            examples: [
                { input: "nums = [3,0,1]", output: "2", explanation: "n = 3 since there are 3 numbers, missing number is 2." }
            ],
            constraints: ["n == nums.length", "1 <= n <= 10^4", "All numbers in nums are unique."],
            starter_code: {
                javascript: "function missingNumber(nums) {\n    // Write your code here\n    \n}",
                python: "def missing_number(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function missingNumber(nums) {\n    const n = nums.length;\n    const expectedSum = (n * (n + 1)) / 2;\n    const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n    return expectedSum - actualSum;\n}",
                python: "def missing_number(nums):\n    n = len(nums)\n    return (n * (n + 1)) // 2 - sum(nums)"
            },
            test_cases: [
                { input: "nums = [3,0,1]", expected_output: "2", is_hidden: false },
                { input: "nums = [0,1]", expected_output: "2", is_hidden: false },
                { input: "nums = [9,6,4,2,3,5,7,0,1]", expected_output: "8", is_hidden: true }
            ]
        },
        {
            id: "code-18",
            title: "Symmetric Tree",
            role: "Software Developer",
            topic: "Trees",
            difficulty: "Beginner",
            description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
            examples: [
                { input: "root = [1,2,2,3,4,4,3]", output: "true", explanation: "Left and right subtrees mirror." }
            ],
            constraints: ["The number of nodes in the tree is in the range [1, 1000]."],
            starter_code: {
                javascript: "function isSymmetric(root) {\n    // Write your code here\n    \n}",
                python: "def is_symmetric(root):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function isSymmetric(root) {\n    if (!root) return true;\n    function isMirror(t1, t2) {\n        if (!t1 && !t2) return true;\n        if (!t1 || !t2) return false;\n        return (t1.val === t2.val) && isMirror(t1.right, t2.left) && isMirror(t1.left, t2.right);\n    }\n    return isMirror(root.left, root.right);\n}",
                python: "def is_symmetric(root):\n    if not root: return True\n    def is_mirror(t1, t2):\n        if not t1 and not t2: return True\n        if not t1 or not t2: return False\n        return t1.val == t2.val and is_mirror(t1.left, t2.right) and is_mirror(t1.right, t2.left)\n    return is_mirror(root.left, root.right)"
            },
            test_cases: [
                { input: "root = [1,2,2,3,4,4,3]", expected_output: "true", is_hidden: false },
                { input: "root = [1,2,2,null,3,null,3]", expected_output: "false", is_hidden: false }
            ]
        },
        {
            id: "code-19",
            title: "Reverse String",
            role: "Software Developer",
            topic: "Two Pointers & Strings",
            difficulty: "Beginner",
            description: "Write a function that reverses a string given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
            examples: [
                { input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]", explanation: "Reversed in place." }
            ],
            constraints: ["1 <= s.length <= 10^5"],
            starter_code: {
                javascript: "function reverseString(s) {\n    // Write your code here\n    \n}",
                python: "def reverse_string(s):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function reverseString(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        [s[left], s[right]] = [s[right], s[left]];\n        left++; right--;\n    }\n    return s;\n}",
                python: "def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1\n    return s"
            },
            test_cases: [
                { input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", expected_output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]", is_hidden: false },
                { input: "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", expected_output: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]", is_hidden: false }
            ]
        },
        {
            id: "code-20",
            title: "Longest Common Prefix",
            role: "Software Developer",
            topic: "Strings",
            difficulty: "Beginner",
            description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
            examples: [
                { input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"", explanation: "Common prefix is 'fl'." }
            ],
            constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200"],
            starter_code: {
                javascript: "function longestCommonPrefix(strs) {\n    // Write your code here\n    \n}",
                python: "def longest_common_prefix(strs):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function longestCommonPrefix(strs) {\n    if (!strs.length) return '';\n    let prefix = strs[0];\n    for (let i = 1; i < strs.length; i++) {\n        while (strs[i].indexOf(prefix) !== 0) {\n            prefix = prefix.substring(0, prefix.length - 1);\n            if (!prefix) return '';\n        }\n    }\n    return prefix;\n}",
                python: "def longest_common_prefix(strs):\n    if not strs: return ''\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix: return ''\n    return prefix"
            },
            test_cases: [
                { input: "strs = [\"flower\",\"flow\",\"flight\"]", expected_output: "\"fl\"", is_hidden: false },
                { input: "strs = [\"dog\",\"racecar\",\"car\"]", expected_output: "\"\"", is_hidden: false }
            ]
        },
        {
            id: "code-21",
            title: "Min Stack",
            role: "Software Developer",
            topic: "Stack",
            difficulty: "Intermediate",
            description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
            examples: [
                { input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", output: "[-3, 0, -2]", explanation: "Min values retrieved in O(1)." }
            ],
            constraints: ["Methods pop, top and getMin operations will always be called on non-empty stacks."],
            starter_code: {
                javascript: "class MinStack {\n    constructor() {\n        // Initialize stack\n    }\n    push(val) {}\n    pop() {}\n    top() {}\n    getMin() {}\n}",
                python: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def get_min(self) -> int:\n        pass"
            },
            solution_code: {
                javascript: "class MinStack {\n    constructor() {\n        this.stack = [];\n        this.minStack = [];\n    }\n    push(val) {\n        this.stack.push(val);\n        if (!this.minStack.length || val <= this.minStack[this.minStack.length - 1]) this.minStack.push(val);\n    }\n    pop() {\n        let val = this.stack.pop();\n        if (val === this.minStack[this.minStack.length - 1]) this.minStack.pop();\n    }\n    top() { return this.stack[this.stack.length - 1]; }\n    getMin() { return this.minStack[this.minStack.length - 1]; }\n}",
                python: "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]: self.min_stack.append(val)\n    def pop(self) -> None:\n        if self.stack.pop() == self.min_stack[-1]: self.min_stack.pop()\n    def top(self) -> int: return self.stack[-1]\n    def get_min(self) -> int: return self.min_stack[-1]"
            },
            test_cases: [
                { input: "MinStack operations", expected_output: "All O(1) operations valid", is_hidden: false }
            ]
        },
        {
            id: "code-22",
            title: "Merge Sorted Array",
            role: "Software Developer",
            topic: "Two Pointers & Arrays",
            difficulty: "Beginner",
            description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array in-place.",
            examples: [
                { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]", explanation: "Merged elements." }
            ],
            constraints: ["nums1.length == m + n", "nums2.length == n"],
            starter_code: {
                javascript: "function merge(nums1, m, nums2, n) {\n    // Write your code here\n    \n}",
                python: "def merge(nums1, m, nums2, n):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function merge(nums1, m, nums2, n) {\n    let p1 = m - 1, p2 = n - 1, p = m + n - 1;\n    while (p2 >= 0) {\n        if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n        else nums1[p--] = nums2[p2--];\n    }\n    return nums1;\n}",
                python: "def merge(nums1, m, nums2, n):\n    p1, p2, p = m - 1, n - 1, m + n - 1\n    while p2 >= 0:\n        if p1 >= 0 and nums1[p1] > nums2[p2]:\n            nums1[p] = nums1[p1]\n            p1 -= 1\n        else:\n            nums1[p] = nums2[p2]\n            p2 -= 1\n        p -= 1\n    return nums1"
            },
            test_cases: [
                { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", expected_output: "[1,2,2,3,5,6]", is_hidden: false }
            ]
        },
        {
            id: "code-23",
            title: "First Unique Character in a String",
            role: "Software Developer",
            topic: "Hash Maps & Strings",
            difficulty: "Beginner",
            description: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
            examples: [
                { input: "s = \"leetcode\"", output: "0", explanation: "'l' is the first unique character." },
                { input: "s = \"loveleetcode\"", output: "2", explanation: "'v' is the first unique character." }
            ],
            constraints: ["1 <= s.length <= 10^5", "s consists of only lowercase English letters."],
            starter_code: {
                javascript: "function firstUniqChar(s) {\n    // Write your code here\n    \n}",
                python: "def first_uniq_char(s):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function firstUniqChar(s) {\n    const map = {};\n    for (let c of s) map[c] = (map[c] || 0) + 1;\n    for (let i = 0; i < s.length; i++) {\n        if (map[s[i]] === 1) return i;\n    }\n    return -1;\n}",
                python: "def first_uniq_char(s):\n    from collections import Counter\n    count = Counter(s)\n    for i, c in enumerate(s):\n        if count[c] == 1: return i\n    return -1"
            },
            test_cases: [
                { input: "s = \"leetcode\"", expected_output: "0", is_hidden: false },
                { input: "s = \"loveleetcode\"", expected_output: "2", is_hidden: false },
                { input: "s = \"aabb\"", expected_output: "-1", is_hidden: true }
            ]
        },
        {
            id: "code-24",
            title: "Palindrome Linked List",
            role: "Software Developer",
            topic: "Linked Lists",
            difficulty: "Intermediate",
            description: "Given the head of a singly linked list, return `true` if it is a palindrome or `false` otherwise.",
            examples: [
                { input: "head = [1,2,2,1]", output: "true", explanation: "Reads same forward and backwards." }
            ],
            constraints: ["The number of nodes in the list is in the range [1, 10^5]."],
            starter_code: {
                javascript: "function isPalindrome(head) {\n    // Write your code here\n    \n}",
                python: "def is_palindrome(head):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function isPalindrome(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n    let prev = null;\n    while (slow) { let nxt = slow.next; slow.next = prev; prev = slow; slow = nxt; }\n    while (prev) {\n        if (head.val !== prev.val) return false;\n        head = head.next; prev = prev.next;\n    }\n    return true;\n}",
                python: "def is_palindrome(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    prev = None\n    while slow:\n        nxt = slow.next; slow.next = prev; prev = slow; slow = nxt\n    while prev:\n        if head.val != prev.val: return False\n        head, prev = head.next, prev.next\n    return True"
            },
            test_cases: [
                { input: "head = [1,2,2,1]", expected_output: "true", is_hidden: false },
                { input: "head = [1,2]", expected_output: "false", is_hidden: false }
            ]
        },
        {
            id: "code-25",
            title: "Majority Element",
            role: "Software Developer",
            topic: "Arrays & Voting Algorithm",
            difficulty: "Beginner",
            description: "Given an array `nums` of size `n`, return the majority element that appears more than `⌊n / 2⌋` times. You may assume the majority element always exists.",
            examples: [
                { input: "nums = [3,2,3]", output: "3", explanation: "3 appears 2 out of 3 times." },
                { input: "nums = [2,2,1,1,1,2,2]", output: "2", explanation: "2 appears 4 out of 7 times." }
            ],
            constraints: ["1 <= nums.length <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
            starter_code: {
                javascript: "function majorityElement(nums) {\n    // Write your code here\n    \n}",
                python: "def majority_element(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function majorityElement(nums) {\n    let count = 0, candidate = null;\n    for (let num of nums) {\n        if (count === 0) candidate = num;\n        count += (num === candidate) ? 1 : -1;\n    }\n    return candidate;\n}",
                python: "def majority_element(nums):\n    count, candidate = 0, None\n    for n in nums:\n        if count == 0: candidate = n\n        count += (1 if n == candidate else -1)\n    return candidate"
            },
            test_cases: [
                { input: "nums = [3,2,3]", expected_output: "3", is_hidden: false },
                { input: "nums = [2,2,1,1,1,2,2]", expected_output: "2", is_hidden: false }
            ]
        },
        {
            id: "code-26",
            title: "Middle of the Linked List",
            role: "Software Developer",
            topic: "Linked Lists & Fast-Slow Pointers",
            difficulty: "Beginner",
            description: "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
            examples: [
                { input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "Middle node is 3." }
            ],
            constraints: ["The number of nodes in the list is in the range [1, 100]."],
            starter_code: {
                javascript: "function middleNode(head) {\n    // Write your code here\n    \n}",
                python: "def middle_node(head):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function middleNode(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}",
                python: "def middle_node(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    return slow"
            },
            test_cases: [
                { input: "head = [1,2,3,4,5]", expected_output: "[3,4,5]", is_hidden: false }
            ]
        },
        {
            id: "code-27",
            title: "House Robber",
            role: "Software Developer",
            topic: "Dynamic Programming",
            difficulty: "Intermediate",
            description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will alert police if two adjacent houses are broken into on the same night. Return the maximum money you can rob.",
            examples: [
                { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) and house 3 (3), total = 4." },
                { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9), and house 5 (1), total = 12." }
            ],
            constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
            starter_code: {
                javascript: "function rob(nums) {\n    // Write your code here\n    \n}",
                python: "def rob(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function rob(nums) {\n    let rob1 = 0, rob2 = 0;\n    for (let n of nums) {\n        let temp = Math.max(n + rob1, rob2);\n        rob1 = rob2;\n        rob2 = temp;\n    }\n    return rob2;\n}",
                python: "def rob(nums):\n    rob1, rob2 = 0, 0\n    for n in nums:\n        rob1, rob2 = rob2, max(n + rob1, rob2)\n    return rob2"
            },
            test_cases: [
                { input: "nums = [1,2,3,1]", expected_output: "4", is_hidden: false },
                { input: "nums = [2,7,9,3,1]", expected_output: "12", is_hidden: false }
            ]
        },
        {
            id: "code-28",
            title: "Coin Change",
            role: "Software Developer",
            topic: "Dynamic Programming",
            difficulty: "Intermediate",
            description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up, return `-1`.",
            examples: [
                { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1 (3 coins)." }
            ],
            constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
            starter_code: {
                javascript: "function coinChange(coins, amount) {\n    // Write your code here\n    \n}",
                python: "def coin_change(coins, amount):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let a = 1; a <= amount; a++) {\n        for (let c of coins) {\n            if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n        }\n    }\n    return dp[amount] !== Infinity ? dp[amount] : -1;\n}",
                python: "def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1"
            },
            test_cases: [
                { input: "coins = [1,2,5], amount = 11", expected_output: "3", is_hidden: false },
                { input: "coins = [2], amount = 3", expected_output: "-1", is_hidden: false }
            ]
        },
        {
            id: "code-29",
            title: "Search in Rotated Sorted Array",
            role: "Software Developer",
            topic: "Binary Search",
            difficulty: "Intermediate",
            description: "Given the array `nums` after possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums` in O(log n) time.",
            examples: [
                { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 is located at index 4." }
            ],
            constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4"],
            starter_code: {
                javascript: "function search(nums, target) {\n    // Write your code here\n    \n}",
                python: "def search(nums, target):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function search(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        let mid = Math.floor((l + r) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}",
                python: "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1"
            },
            test_cases: [
                { input: "nums = [4,5,6,7,0,1,2], target = 0", expected_output: "4", is_hidden: false }
            ]
        },
        {
            id: "code-30",
            title: "Longest Substring Without Repeating Characters",
            role: "Software Developer",
            topic: "Sliding Window & Hash Sets",
            difficulty: "Intermediate",
            description: "Given a string `s`, find the length of the longest substring without repeating characters.",
            examples: [
                { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }
            ],
            constraints: ["0 <= s.length <= 5 * 10^4"],
            starter_code: {
                javascript: "function lengthOfLongestSubstring(s) {\n    // Write your code here\n    \n}",
                python: "def length_of_longest_substring(s):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function lengthOfLongestSubstring(s) {\n    let set = new Set(), l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) { set.delete(s[l]); l++; }\n        set.add(s[r]);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}",
                python: "def length_of_longest_substring(s):\n    char_set = set(); l = max_len = 0\n    for r in range(len(s)):\n        while s[r] in char_set:\n            char_set.remove(s[l]); l += 1\n        char_set.add(s[r])\n        max_len = max(max_len, r - l + 1)\n    return max_len"
            },
            test_cases: [
                { input: "s = \"abcabcbb\"", expected_output: "3", is_hidden: false },
                { input: "s = \"bbbbb\"", expected_output: "1", is_hidden: false }
            ]
        },
        {
            id: "code-31",
            title: "Group Anagrams",
            role: "Software Developer",
            topic: "Hash Maps & Strings",
            difficulty: "Intermediate",
            description: "Given an array of strings `strs`, group the anagrams together in any order.",
            examples: [
                { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", explanation: "Anagrams grouped." }
            ],
            constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100"],
            starter_code: {
                javascript: "function groupAnagrams(strs) {\n    // Write your code here\n    \n}",
                python: "def group_anagrams(strs):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function groupAnagrams(strs) {\n    const map = {};\n    for (let s of strs) {\n        let key = s.split('').sort().join('');\n        if (!map[key]) map[key] = [];\n        map[key].push(s);\n    }\n    return Object.values(map);\n}",
                python: "def group_anagrams(strs):\n    from collections import defaultdict\n    res = defaultdict(list)\n    for s in strs:\n        res[tuple(sorted(s))].append(s)\n    return list(res.values())"
            },
            test_cases: [
                { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expected_output: "Grouped anagram lists", is_hidden: false }
            ]
        },
        {
            id: "code-32",
            title: "3Sum",
            role: "Software Developer",
            topic: "Two Pointers & Arrays",
            difficulty: "Intermediate",
            description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0` without duplicates.",
            examples: [
                { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Unique zero-sum triplets." }
            ],
            constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
            starter_code: {
                javascript: "function threeSum(nums) {\n    // Write your code here\n    \n}",
                python: "def three_sum(nums):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function threeSum(nums) {\n    nums.sort((a, b) => a - b);\n    const res = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            let sum = nums[i] + nums[l] + nums[r];\n            if (sum === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l + 1]) l++;\n                while (l < r && nums[r] === nums[r - 1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}",
                python: "def three_sum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res"
            },
            test_cases: [
                { input: "nums = [-1,0,1,2,-1,-4]", expected_output: "[[-1,-1,2],[-1,0,1]]", is_hidden: false }
            ]
        }
    ],

    // =========================================================================
    // 4. HR QUESTIONS POOL (32 Questions)
    // =========================================================================
    hrQuestions: [
        {
            id: "hr-1",
            category: "Introduction",
            question: "Tell me about yourself and walk me through your key achievements in software engineering.",
            key_evaluation_points: ["Structured chronological narrative (Present -> Past -> Future)", "Concrete technical achievements", "Clarity and communication confidence"]
        },
        {
            id: "hr-2",
            category: "Problem Solving",
            question: "Describe a challenging technical problem or production bug you solved under tight deadlines. How did you diagnose and resolve it?",
            key_evaluation_points: ["STAR method structure", "Root cause diagnostic capability", "Engineering ownership and resilience"]
        },
        {
            id: "hr-3",
            category: "Conflict Handling",
            question: "How do you handle disagreement with a teammate or technical lead regarding an architectural decision?",
            key_evaluation_points: ["Professional empathy & communication", "Data-driven decision making", "Commitment to team consensus"]
        },
        {
            id: "hr-4",
            category: "Motivation & Fit",
            question: "Why do you want to join our engineering team and what makes you a strong candidate for this role?",
            key_evaluation_points: ["Alignment with company mission", "Clear value proposition of candidate skills", "Long-term enthusiasm"]
        },
        {
            id: "hr-5",
            category: "Strengths & Growth",
            question: "What are your greatest technical strengths and an area you are actively working to improve?",
            key_evaluation_points: ["Authentic self-awareness", "Specific examples of strengths in practice", "Constructive, actionable growth mindset"]
        },
        {
            id: "hr-6",
            category: "Failure & Learning",
            question: "Tell me about a time when a project or feature you built didn't go as planned or failed. What did you learn?",
            key_evaluation_points: ["Accountability without finger-pointing", "Retrospective analysis", "Systemic safeguards implemented"]
        },
        {
            id: "hr-7",
            category: "Pressure & Prioritization",
            question: "Describe a high-pressure situation with competing deadlines. How did you organize and prioritize your tasks?",
            key_evaluation_points: ["Task triage & stakeholder management", "Composure under pressure", "Execution quality"]
        },
        {
            id: "hr-8",
            category: "Leadership & Initiative",
            question: "Give an example of a time when you took proactive initiative on a project or codebase without being explicitly asked.",
            key_evaluation_points: ["Proactive ownership mindset", "Measurable engineering improvement", "Collaboration with peers"]
        },
        {
            id: "hr-9",
            category: "Teamwork & Cross-functional",
            question: "Describe a project where you collaborated closely with non-engineering stakeholders (Product, Design, QA). How did you ensure alignment?",
            key_evaluation_points: ["Cross-functional empathy", "Translating technical constraints into business language", "Shared milestone alignment"]
        },
        {
            id: "hr-10",
            category: "Adaptability & Learning",
            question: "How do you approach mastering an unfamiliar programming language, framework, or technology stack rapidly?",
            key_evaluation_points: ["Curiosity & structured learning strategy", "Hands-on prototyping", "Speed to production competence"]
        },
        {
            id: "hr-11",
            category: "Career Vision",
            question: "Where do you see your career heading over the next 3 to 5 years, both technically and professionally?",
            key_evaluation_points: ["Ambition and realistic growth roadmap", "Desire for mentorship and deeper mastery", "Commitment to engineering excellence"]
        },
        {
            id: "hr-12",
            category: "Handling Feedback",
            question: "Tell me about a time you received difficult or critical feedback during a code review. How did you respond?",
            key_evaluation_points: ["Non-defensive mindset", "Objectivity regarding code quality", "Translating critique into better habits"]
        },
        {
            id: "hr-13",
            category: "Decision Making",
            question: "Describe a scenario where you had to make an important engineering decision with incomplete or ambiguous data.",
            key_evaluation_points: ["Calculated risk assessment", "Prototyping & incremental validation", "Reversibility analysis"]
        },
        {
            id: "hr-14",
            category: "Communication & Mentorship",
            question: "How do you explain an intricate technical architecture or distributed systems problem to a non-technical audience?",
            key_evaluation_points: ["Simplification without losing essence", "Use of analogies", "Active listening & checking for understanding"]
        },
        {
            id: "hr-15",
            category: "Work-Life & Stress Management",
            question: "How do you maintain high code quality and avoid burnout during demanding release cycles?",
            key_evaluation_points: ["Sustainable engineering practices", "Automation & CI/CD reliance", "Proactive time management"]
        },
        {
            id: "hr-16",
            category: "Ethics & Integrity",
            question: "Have you ever encountered a situation where code quality or security was being compromised to hit a release date? How did you handle it?",
            key_evaluation_points: ["Commitment to security and customer trust", "Constructive trade-off framing", "Technical debt documentation"]
        },
        {
            id: "hr-17",
            category: "Ambiguity",
            question: "How do you navigate project specifications that are rapidly shifting or underspecified?",
            key_evaluation_points: ["Proactive requirement clarification", "Iterative milestone delivery", "Clear assumption documentation"]
        },
        {
            id: "hr-18",
            category: "Innovation",
            question: "Tell me about an optimization or tool you introduced to your team that improved developer productivity or runtime performance.",
            key_evaluation_points: ["Creative problem identification", "Tooling adoption impact", "Measurable efficiency gain"]
        },
        {
            id: "hr-19",
            category: "Motivation & Drive",
            question: "What intrinsically drives you to write well-tested, maintainable code every day beyond meeting minimum requirements?",
            key_evaluation_points: ["Engineering craftsmanship", "Empathy for future maintainers", "Pride in system reliability"]
        },
        {
            id: "hr-20",
            category: "Customer Centricity",
            question: "Describe a time when customer or end-user feedback directly influenced how you designed or refactored a feature.",
            key_evaluation_points: ["Focus on real-world user value", "Data-informed iteration", "User experience advocacy"]
        },
        {
            id: "hr-21",
            category: "Interpersonal Collaboration",
            question: "How do you handle collaborating with a teammate whose communication style is very different from yours?",
            key_evaluation_points: ["Interpersonal flexibility", "Direct, respectful communication", "Establishing shared team norms"]
        },
        {
            id: "hr-22",
            category: "Task Triage",
            question: "When you have multiple high-priority bugs reported at once, how do you decide what order to fix them?",
            key_evaluation_points: ["Severity vs blast radius evaluation", "Customer impact assessment", "Clear communication of ETA"]
        },
        {
            id: "hr-23",
            category: "Remote Collaboration",
            question: "How do you ensure transparency, alignment, and momentum when working in an asynchronous, remote engineering team?",
            key_evaluation_points: ["Thorough documentation & async PR notes", "Regular progress updates", "Proactive unblocking"]
        },
        {
            id: "hr-24",
            category: "Proudest Achievement",
            question: "What is the single most rewarding technical project you have built so far, and why does it stand out?",
            key_evaluation_points: ["Technical complexity navigated", "Measurable user impact", "Personal growth milestone"]
        },
        {
            id: "hr-25",
            category: "Career Transition",
            question: "What motivated you to look for a new engineering role at this point in your career?",
            key_evaluation_points: ["Positive growth orientation", "Seeking greater technical scope", "Enthusiasm for new challenges"]
        },
        {
            id: "hr-26",
            category: "Engineering Culture",
            question: "What kind of engineering culture and team environment allows you to do your highest impact work?",
            key_evaluation_points: ["Psychological safety & blameless postmortems", "High standard of peer review", "Culture of ownership"]
        },
        {
            id: "hr-27",
            category: "Continuous Learning",
            question: "What technical blogs, books, podcasts, or open-source projects have you engaged with recently to stay sharp?",
            key_evaluation_points: ["Intellectual curiosity", "Staying current with industry evolution", "Application of insights to real work"]
        },
        {
            id: "hr-28",
            category: "Mentorship & Support",
            question: "Describe a time when you helped unblock a peer or mentored a less experienced teammate through a complex bug.",
            key_evaluation_points: ["Generosity with knowledge", "Patience and structured guidance", "Elevating the whole team"]
        },
        {
            id: "hr-29",
            category: "Resilience",
            question: "How do you stay engaged and maintain rigor when tasked with maintenance, migration, or repetitive technical chores?",
            key_evaluation_points: ["Appreciation for foundational stability", "Looking for automation opportunities", "Dependable work ethic"]
        },
        {
            id: "hr-30",
            category: "Expectations & Growth",
            question: "What are your core expectations from leadership and engineering managers to help you succeed in this role?",
            key_evaluation_points: ["Clear goal setting & feedback", "Autonomy with accountability", "Support for professional development"]
        },
        {
            id: "hr-31",
            category: "Risk Mitigation",
            question: "Tell me about a time you identified a potential risk, security vulnerability, or bottleneck before it hit production.",
            key_evaluation_points: ["Proactive foresight & code review rigor", "Clear risk escalation", "Preventive solution design"]
        },
        {
            id: "hr-32",
            category: "Managerial Alignment",
            question: "What management style brings out the best in you, and how do you prefer to receive coaching and feedback?",
            key_evaluation_points: ["High accountability and trust", "Direct, timely feedback", "Regular 1-on-1 alignment"]
        }
    ]
};
