// In-Memory Dev Store for smooth local development

export const mockStore = {
    profiles: new Map(),
    interviews: new Map(),
    answers: new Map(),
    results: new Map(),
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
    technicalQuestions: [
        {
            id: "tech-1",
            role: "Software Developer",
            topic: "OOP",
            difficulty: "Intermediate",
            question: "Explain the four pillars of Object-Oriented Programming (OOP) with real-world engineering examples.",
            expected_concepts: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
            sample_answer: "Encapsulation (bundling data/methods), Abstraction (hiding complexity), Inheritance (reusability from parent class), and Polymorphism (ability to take multiple forms)."
        },
        {
            id: "tech-2",
            role: "Full Stack Developer",
            topic: "DBMS & APIs",
            difficulty: "Intermediate",
            question: "What are ACID properties in database management systems and why are they critical for transaction reliability?",
            expected_concepts: ["Atomicity", "Consistency", "Isolation", "Durability"],
            sample_answer: "Atomicity ensures all-or-nothing, Consistency keeps constraints valid, Isolation prevents concurrent collision, and Durability ensures committed data survives failures."
        }
    ],
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
            // Skeleton only without prefilled solution
            starter_code: {
                javascript: "function twoSum(nums, target) {\n    // Write your code here\n    \n}",
                python: "def two_sum(nums, target):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
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
                { input: "s = \"()[]{}\"", output: "true", explanation: "All matched." },
                { input: "s = \"(]\"", output: "false", explanation: "Mismatched." }
            ],
            constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only."],
            starter_code: {
                javascript: "function isValid(s) {\n    // Write your code here\n    \n}",
                python: "def is_valid(s):\n    # Write your code here\n    pass"
            },
            solution_code: {
                javascript: "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let c of s) {\n        if (map[c]) {\n            if (stack.pop() !== map[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}",
                python: "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else '#'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack"
            },
            test_cases: [
                { input: "s = \"()\"", expected_output: "true", is_hidden: false },
                { input: "s = \"()[]{}\"", expected_output: "true", is_hidden: false },
                { input: "s = \"(]\"", expected_output: "false", is_hidden: false },
                { input: "s = \"([{}])\"", expected_output: "true", is_hidden: true }
            ]
        }
    ],
    hrQuestions: [
        {
            id: "hr-1",
            category: "Introduction",
            question: "Tell me about yourself and walk me through your key achievements in software engineering.",
            key_evaluation_points: ["Clear chronological narrative", "Relevance of experience", "Confidence", "Impact"]
        },
        {
            id: "hr-2",
            category: "Behavioral",
            question: "Describe a challenging technical problem you solved under tight deadlines. How did you diagnose and resolve it?",
            key_evaluation_points: ["STAR method structure", "Problem solving mindset", "Ownership", "Reflection"]
        }
    ]
};
