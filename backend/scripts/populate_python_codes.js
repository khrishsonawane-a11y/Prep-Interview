import fs from 'fs';
import path from 'path';

const memoryStorePath = path.resolve('backend/utils/memoryStore.js');
let content = fs.readFileSync(memoryStorePath, 'utf8');

const pythonData = {
    "code-1": {
        "starter": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        return []",
        "solution": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []"
    },
    "code-2": {
        "starter": "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        return False",
        "solution": "class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {')': '(', '}': '{', ']': '['}\n        for char in s:\n            if char in pairs.values():\n                stack.append(char)\n            elif char in pairs:\n                if not stack or stack.pop() != pairs[char]:\n                    return False\n        return len(stack) == 0"
    },
    "code-3": {
        "starter": "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        return None",
        "solution": "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev = None\n        curr = head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev"
    },
    "code-4": {
        "starter": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            if price < min_price:\n                min_price = price\n            elif price - min_price > max_profit:\n                max_profit = price - min_price\n        return max_profit"
    },
    "code-5": {
        "starter": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        max_sum = nums[0]\n        current_sum = nums[0]\n        for num in nums[1:]:\n            current_sum = max(num, current_sum + num)\n            max_sum = max(max_sum, current_sum)\n        return max_sum"
    },
    "code-6": {
        "starter": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        return False",
        "solution": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t):\n            return False\n        count = {}\n        for c in s:\n            count[c] = count.get(c, 0) + 1\n        for c in t:\n            if c not in count or count[c] == 0:\n                return False\n            count[c] -= 1\n        return True"
    },
    "code-7": {
        "starter": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        return -1",
        "solution": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            elif nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return -1"
    },
    "code-8": {
        "starter": "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        return None",
        "solution": "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        dummy = ListNode(0)\n        curr = dummy\n        while list1 and list2:\n            if list1.val <= list2.val:\n                curr.next = list1\n                list1 = list1.next\n            else:\n                curr.next = list2\n                list2 = list2.next\n            curr = curr.next\n        curr.next = list1 if list1 else list2\n        return dummy.next"
    },
    "code-9": {
        "starter": "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Write your code here\n        return root",
        "solution": "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root:\n            return None\n        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)\n        return root"
    },
    "code-10": {
        "starter": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2:\n            return n\n        first, second = 1, 2\n        for _ in range(3, n + 1):\n            first, second = second, first + second\n        return second"
    },
    "code-11": {
        "starter": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        # Write your code here\n        return False",
        "solution": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        seen = set()\n        for num in nums:\n            if num in seen:\n                return True\n            seen.add(num)\n        return False"
    },
    "code-12": {
        "starter": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your code here\n        return False",
        "solution": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        filtered = [c.lower() for c in s if c.isalnum()]\n        return filtered == filtered[::-1]"
    },
    "code-13": {
        "starter": "class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))"
    },
    "code-14": {
        "starter": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        res = 0\n        for num in nums:\n            res ^= num\n        return res"
    },
    "code-15": {
        "starter": "class Solution:\n    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        # Write your code here\n        return []",
        "solution": "class Solution:\n    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        return list(set(nums1) & set(nums2))"
    },
    "code-16": {
        "starter": "class Solution:\n    def moveZeroes(self, nums: list[int]) -> None:\n        # Modify nums in-place\n        pass",
        "solution": "class Solution:\n    def moveZeroes(self, nums: list[int]) -> None:\n        last_non_zero = 0\n        for i in range(len(nums)):\n            if nums[i] != 0:\n                nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]\n                last_non_zero += 1"
    },
    "code-17": {
        "starter": "class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        n = len(nums)\n        expected_sum = n * (n + 1) // 2\n        return expected_sum - sum(nums)"
    },
    "code-18": {
        "starter": "class Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        return False",
        "solution": "class Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        def isMirror(t1, t2):\n            if not t1 and not t2:\n                return True\n            if not t1 or not t2:\n                return False\n            return (t1.val == t2.val) and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)\n        return isMirror(root, root) if root else True"
    },
    "code-19": {
        "starter": "class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        # Modify s in-place\n        pass",
        "solution": "class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        left, right = 0, len(s) - 1\n        while left < right:\n            s[left], s[right] = s[right], s[left]\n            left += 1\n            right -= 1"
    },
    "code-20": {
        "starter": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        # Write your code here\n        return \"\"",
        "solution": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return \"\"\n        prefix = strs[0]\n        for s in strs[1:]:\n            while not s.startswith(prefix):\n                prefix = prefix[:-1]\n                if not prefix:\n                    return \"\"\n        return prefix"
    },
    "code-21": {
        "starter": "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        return 0\n    def getMin(self) -> int:\n        return 0",
        "solution": "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n    def pop(self) -> None:\n        val = self.stack.pop()\n        if val == self.min_stack[-1]:\n            self.min_stack.pop()\n    def top(self) -> int:\n        return self.stack[-1]\n    def getMin(self) -> int:\n        return self.min_stack[-1]"
    },
    "code-22": {
        "starter": "class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        # Modify nums1 in-place\n        pass",
        "solution": "class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        p1, p2, p = m - 1, n - 1, m + n - 1\n        while p1 >= 0 and p2 >= 0:\n            if nums1[p1] > nums2[p2]:\n                nums1[p] = nums1[p1]\n                p1 -= 1\n            else:\n                nums1[p] = nums2[p2]\n                p2 -= 1\n            p -= 1\n        while p2 >= 0:\n            nums1[p] = nums2[p2]\n            p2 -= 1\n            p -= 1"
    },
    "code-23": {
        "starter": "class Solution:\n    def firstUniqChar(self, s: str) -> int:\n        # Write your code here\n        return -1",
        "solution": "class Solution:\n    def firstUniqChar(self, s: str) -> int:\n        from collections import Counter\n        count = Counter(s)\n        for i, c in enumerate(s):\n            if count[c] == 1:\n                return i\n        return -1"
    },
    "code-24": {
        "starter": "class Solution:\n    def isPalindrome(self, head: Optional[ListNode]) -> bool:\n        # Write your code here\n        return False",
        "solution": "class Solution:\n    def isPalindrome(self, head: Optional[ListNode]) -> bool:\n        vals = []\n        curr = head\n        while curr:\n            vals.append(curr.val)\n            curr = curr.next\n        return vals == vals[::-1]"
    },
    "code-25": {
        "starter": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        candidate, count = None, 0\n        for num in nums:\n            if count == 0:\n                candidate = num\n            count += (1 if num == candidate else -1)\n        return candidate"
    },
    "code-26": {
        "starter": "class Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        return None",
        "solution": "class Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        slow = fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n        return slow"
    },
    "code-27": {
        "starter": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        prev1, prev2 = 0, 0\n        for num in nums:\n            prev1, prev2 = max(prev2 + num, prev1), prev1\n        return prev1"
    },
    "code-28": {
        "starter": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Write your code here\n        return -1",
        "solution": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for coin in coins:\n            for i in range(coin, amount + 1):\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1"
    },
    "code-29": {
        "starter": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        return -1",
        "solution": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[left] <= nums[mid]:\n                if nums[left] <= target < nums[mid]:\n                    right = mid - 1\n                else:\n                    left = mid + 1\n            else:\n                if nums[mid] < target <= nums[right]:\n                    left = mid + 1\n                else:\n                    right = mid - 1\n        return -1"
    },
    "code-30": {
        "starter": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your code here\n        return 0",
        "solution": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        left = max_len = 0\n        for right, c in enumerate(s):\n            if c in seen and seen[c] >= left:\n                left = seen[c] + 1\n            seen[c] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len"
    },
    "code-31": {
        "starter": "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        # Write your code here\n        return []",
        "solution": "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        from collections import defaultdict\n        groups = defaultdict(list)\n        for s in strs:\n            key = ''.join(sorted(s))\n            groups[key].append(s)\n        return list(groups.values())"
    },
    "code-32": {
        "starter": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        # Write your code here\n        return []",
        "solution": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            left, right = i + 1, len(nums) - 1\n            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s < 0:\n                    left += 1\n                elif s > 0:\n                    right -= 1\n                else:\n                    res.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]:\n                        left += 1\n                    while left < right and nums[right] == nums[right - 1]:\n                        right -= 1\n                    left += 1\n                    right -= 1\n        return res"
    }
};

for (const [id, data] of Object.entries(pythonData)) {
    // Add "python": "..." to starter_code
    // Match the id block and find starter_code and solution_code
    const idRegex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"starter_code":\\s*{[\\s\\S]*?"cpp":\\s*"[^"]*")`, 'm');
    content = content.replace(idRegex, `$1,\n                        "python": ${JSON.stringify(data.starter)}`);

    const solRegex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"solution_code":\\s*{[\\s\\S]*?"cpp":\\s*"[^"]*")`, 'm');
    content = content.replace(solRegex, `$1,\n                        "python": ${JSON.stringify(data.solution)}`);
}

fs.writeFileSync(memoryStorePath, content, 'utf8');
console.log('Successfully updated memoryStore.js with Python starter and solution codes for all 32 questions.');
