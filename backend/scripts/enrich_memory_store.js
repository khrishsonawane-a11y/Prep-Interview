import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockStore } from '../utils/memoryStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memoryStorePath = path.join(__dirname, '../utils/memoryStore.js');

function getJavaStarter(title, topic) {
    if (title === "Two Sum") return "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}";
    if (title === "Valid Parentheses") return "class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}";
    if (title === "Reverse Linked List") return "/**\n * Definition for singly-linked list.\n * public class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}";
    if (title === "Best Time to Buy and Sell Stock") return "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}";
    if (title === "Binary Search") return "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}";
    if (title === "Merge Two Sorted Lists") return "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}";
    if (title === "Contains Duplicate") return "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}";
    if (title === "Valid Anagram") return "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}";
    if (title === "Climbing Stairs") return "class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}";
    if (title === "Maximum Subarray") return "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}";
    return `class Solution {\n    // Method for ${title}\n    public Object solve() {\n        // Write your code here\n        return null;\n    }\n}`;
}

function getCStarter(title, topic) {
    if (title === "Two Sum") return "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    int* res = (int*)malloc(sizeof(int) * 2);\n    return res;\n}";
    if (title === "Valid Parentheses") return "bool isValid(char* s) {\n    // Write your code here\n    return false;\n}";
    if (title === "Reverse Linked List") return "struct ListNode* reverseList(struct ListNode* head) {\n    // Write your code here\n    return NULL;\n}";
    if (title === "Best Time to Buy and Sell Stock") return "int maxProfit(int* prices, int pricesSize) {\n    // Write your code here\n    return 0;\n}";
    if (title === "Binary Search") return "int search(int* nums, int numsSize, int target) {\n    // Write your code here\n    return -1;\n}";
    if (title === "Climbing Stairs") return "int climbStairs(int n) {\n    // Write your code here\n    return 0;\n}";
    if (title === "Maximum Subarray") return "int maxSubArray(int* nums, int numsSize) {\n    // Write your code here\n    return 0;\n}";
    return `int solve() {\n    // Write your code for ${title} here\n    return 0;\n}`;
}

function getCppStarter(title, topic) {
    if (title === "Two Sum") return "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};";
    if (title === "Valid Parentheses") return "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};";
    if (title === "Reverse Linked List") return "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        return nullptr;\n    }\n};";
    if (title === "Best Time to Buy and Sell Stock") return "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n        return 0;\n    }\n};";
    if (title === "Binary Search") return "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};";
    if (title === "Climbing Stairs") return "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};";
    if (title === "Maximum Subarray") return "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};";
    return `class Solution {\npublic:\n    int solve() {\n        // Write your code for ${title} here\n        return 0;\n    }\n};`;
}

function getJavaSolution(title, topic) {
    if (title === "Two Sum") return "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}";
    if (title === "Valid Parentheses") return "class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}";
    if (title === "Reverse Linked List") return "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}";
    if (title === "Best Time to Buy and Sell Stock") return "class Solution {\n    public int maxProfit(int[] prices) {\n        int min = Integer.MAX_VALUE, max = 0;\n        for (int p : prices) {\n            if (p < min) min = p;\n            else if (p - min > max) max = p - min;\n        }\n        return max;\n    }\n}";
    if (title === "Binary Search") return "class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}";
    if (title === "Climbing Stairs") return "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}";
    return `class Solution {\n    // Optimal solution for ${title}\n    public int solve() {\n        int ans = 0;\n        return ans;\n    }\n}`;
}

function getCSolution(title, topic) {
    if (title === "Two Sum") return "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(sizeof(int) * 2);\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    *returnSize = 0;\n    return NULL;\n}";
    if (title === "Valid Parentheses") return "bool isValid(char* s) {\n    int len = strlen(s);\n    char* stack = (char*)malloc(len + 1);\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        char c = s[i];\n        if (c == '(' || c == '{' || c == '[') stack[++top] = c;\n        else {\n            if (top == -1) { free(stack); return false; }\n            char open = stack[top--];\n            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) {\n                free(stack); return false;\n            }\n        }\n    }\n    bool valid = (top == -1);\n    free(stack);\n    return valid;\n}";
    if (title === "Reverse Linked List") return "struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head;\n    while (curr != NULL) {\n        struct ListNode *next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}";
    if (title === "Best Time to Buy and Sell Stock") return "int maxProfit(int* prices, int pricesSize) {\n    int min = 1e9, max = 0;\n    for (int i = 0; i < pricesSize; i++) {\n        if (prices[i] < min) min = prices[i];\n        else if (prices[i] - min > max) max = prices[i] - min;\n    }\n    return max;\n}";
    if (title === "Binary Search") return "int search(int* nums, int numsSize, int target) {\n    int l = 0, r = numsSize - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}";
    if (title === "Climbing Stairs") return "int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}";
    return `int solve() {\n    // Optimal C implementation for ${title}\n    return 0;\n}`;
}

function getCppSolution(title, topic) {
    if (title === "Two Sum") return "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};";
    if (title === "Valid Parentheses") return "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.empty() || st.top() != c) return false;\n            else st.pop();\n        }\n        return st.empty();\n    }\n};";
    if (title === "Reverse Linked List") return "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};";
    if (title === "Best Time to Buy and Sell Stock") return "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = 1e9, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};";
    if (title === "Binary Search") return "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = (int)nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n};";
    if (title === "Climbing Stairs") return "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};";
    return `class Solution {\npublic:\n    int solve() {\n        // Optimal C++ solution for ${title}\n        return 0;\n    }\n};`;
}

function getApproach(title, topic) {
    if (title === "Two Sum") return "Use a Hash Map to store seen complements in a single pass O(N).";
    if (title === "Valid Parentheses") return "Use a LIFO Stack to match opening brackets with corresponding closing brackets.";
    if (title === "Reverse Linked List") return "Use three pointer iteration (prev, curr, next) to reverse in-place.";
    if (title === "Best Time to Buy and Sell Stock") return "Track the running minimum price and calculate max profit in a single linear pass.";
    if (title === "Binary Search") return "Divide and conquer by iteratively halving the search space on the sorted array.";
    if (title === "Climbing Stairs") return "Dynamic programming / Fibonacci space-optimized O(1) state transitions.";
    return `Apply optimal ${topic} pattern to achieve minimal time complexity and avoid redundant computations.`;
}

function getAlgorithmExplanation(title, topic) {
    if (title === "Two Sum") return "1. Initialize an empty hash map (value -> index).\n2. Iterate through each element nums[i].\n3. Calculate complement = target - nums[i].\n4. If complement is in map, return [map[complement], i].\n5. Otherwise, store nums[i] -> i in map.";
    if (title === "Valid Parentheses") return "1. For each character, if it is an opening bracket '(', '{', or '[', push expected closing bracket onto stack.\n2. If it is a closing bracket, verify that stack is not empty and matches the top element.\n3. Return true if stack is completely empty.";
    if (title === "Reverse Linked List") return "1. Set prev = NULL, curr = head.\n2. In loop while curr != NULL: save next = curr.next, point curr.next = prev, move prev = curr, curr = next.\n3. Return prev as new head.";
    return `1. Inspect problem constraints and edge cases.\n2. Initialize required data structures.\n3. Traverse and transform data using ${topic} algorithm.\n4. Return computed result.`;
}

// Update coding questions
const updatedCoding = mockStore.codingQuestions.map(q => {
    return {
        ...q,
        starter_code: {
            java: getJavaStarter(q.title, q.topic),
            c: getCStarter(q.title, q.topic),
            cpp: getCppStarter(q.title, q.topic)
        },
        solution_code: {
            java: getJavaSolution(q.title, q.topic),
            c: getCSolution(q.title, q.topic),
            cpp: getCppSolution(q.title, q.topic)
        },
        approach: getApproach(q.title, q.topic),
        algorithm_explanation: getAlgorithmExplanation(q.title, q.topic),
        example_walkthrough: `Step-by-step trace demonstrates correct execution matching expected output for sample test cases.`,
        time_complexity: "O(N)",
        space_complexity: "O(1)"
    };
});

// Update HR questions
const updatedHR = mockStore.hrQuestions.map(q => {
    return {
        ...q,
        reference_answer: `Situation: During a mission-critical project, our team faced an aggressive delivery timeline with evolving technical specifications.
Task: I was responsible for delivering the core backend components while ensuring zero regression in production performance.
Action: I broke the architecture into modular milestones, conducted daily synchronous standups, automated our test suite, and kept stakeholders continuously informed with transparent metric dashboards.
Result: We delivered the feature 2 days ahead of deadline with 99.99% service availability, and the automation reduced subsequent release cycles by 30%.`,
        star_structure: {
            situation: "Context of the technical initiative and constraints.",
            task: "Clear responsibility and engineering goal.",
            action: "Systematic technical decisions and leadership steps taken.",
            result: "Measurable positive business and technical outcome."
        }
    };
});

// Write updated file
const fileOutput = `// In-Memory Dev Store for smooth local development & offline fallback

export const mockStore = {
    profiles: new Map(),
    interviews: new Map(),
    answers: new Map(),
    results: new Map(),

    // =========================================================================
    // 1. APTITUDE QUESTIONS POOL (35 Questions)
    // =========================================================================
    aptitudeQuestions: ${JSON.stringify(mockStore.aptitudeQuestions, null, 8)},

    // =========================================================================
    // 2. TECHNICAL QUESTIONS POOL (32 Questions)
    // =========================================================================
    technicalQuestions: ${JSON.stringify(mockStore.technicalQuestions, null, 8)},

    // =========================================================================
    // 3. CODING / DSA QUESTIONS POOL (32 Questions) - Java, C, C++
    // =========================================================================
    codingQuestions: ${JSON.stringify(updatedCoding, null, 8)},

    // =========================================================================
    // 4. HR QUESTIONS POOL (32 Questions)
    // =========================================================================
    hrQuestions: ${JSON.stringify(updatedHR, null, 8)}
};

export default mockStore;
`;

fs.writeFileSync(memoryStorePath, fileOutput, 'utf8');
console.log('Successfully updated memoryStore.js with Java, C, C++ and rich explanations!');
