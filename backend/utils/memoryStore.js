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
