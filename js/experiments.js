// Experiments metadata - all experiments from the image
const EXPERIMENTS = [
    // Array Basics
    {
        id: 'ARRAY_MAX',
        title: 'Find Largest Number & Index',
        category: 'Array Basics',
        difficulty: 'easy',
        description: 'Find the largest number in an array and return its index.',
        type: 'array',
        inputs: [{ name: 'array', type: 'array', label: 'Array (comma-separated)' }],
        algorithm: 'arrayMax'
    },
    {
        id: 'ARRAY_SUM_AVG',
        title: 'Array Sum & Average',
        category: 'Array Basics',
        difficulty: 'easy',
        description: 'Traverse array to calculate sum and average.',
        type: 'array',
        inputs: [{ name: 'array', type: 'array', label: 'Array (comma-separated)' }],
        algorithm: 'arraySumAvg'
    },
    {
        id: 'ARRAY_INSERT',
        title: 'Insert Element in Array',
        category: 'Array Basics',
        difficulty: 'medium',
        description: 'Insert an element at a specified position in an array.',
        type: 'array',
        inputs: [
            { name: 'array', type: 'array', label: 'Array (comma-separated)' },
            { name: 'element', type: 'number', label: 'Element to insert' },
            { name: 'position', type: 'number', label: 'Position (0-indexed)' }
        ],
        algorithm: 'arrayInsert'
    },
    {
        id: 'ARRAY_DELETE',
        title: 'Delete Element from Array',
        category: 'Array Basics',
        difficulty: 'medium',
        description: 'Delete an element at a specified position in an array.',
        type: 'array',
        inputs: [
            { name: 'array', type: 'array', label: 'Array (comma-separated)' },
            { name: 'position', type: 'number', label: 'Position (0-indexed)' }
        ],
        algorithm: 'arrayDelete'
    },
    
    // Search Algorithms
    {
        id: 'LINEAR_SEARCH',
        title: 'Linear Search',
        category: 'Search',
        difficulty: 'easy',
        description: 'Sequential search through an array to find a target element.',
        type: 'search',
        inputs: [
            { name: 'array', type: 'array', label: 'Array (comma-separated)' },
            { name: 'target', type: 'number', label: 'Target value' }
        ],
        algorithm: 'linearSearch'
    },
    {
        id: 'BINARY_SEARCH',
        title: 'Binary Search',
        category: 'Search',
        difficulty: 'medium',
        description: 'Binary search on a sorted array (divide and conquer).',
        type: 'search',
        inputs: [
            { name: 'array', type: 'array', label: 'Sorted Array (comma-separated)' },
            { name: 'target', type: 'number', label: 'Target value' }
        ],
        algorithm: 'binarySearch'
    },
    
    // Sorting
    {
        id: 'BUBBLE_SORT',
        title: 'Bubble Sort',
        category: 'Sorting',
        difficulty: 'medium',
        description: 'Bubble sort algorithm with step-by-step visualization of passes and swaps.',
        type: 'sort',
        inputs: [{ name: 'array', type: 'array', label: 'Array (comma-separated)' }],
        algorithm: 'bubbleSort'
    },
    
    // Pattern Matching
    {
        id: 'NAIVE_PATTERN',
        title: 'Naive Pattern Matching',
        category: 'Pattern Matching',
        difficulty: 'medium',
        description: 'Naive (brute force) pattern matching algorithm.',
        type: 'pattern',
        inputs: [
            { name: 'text', type: 'string', label: 'Text' },
            { name: 'pattern', type: 'string', label: 'Pattern' }
        ],
        algorithm: 'naivePattern'
    },
    {
        id: 'KMP_PATTERN',
        title: 'KMP Pattern Matching',
        category: 'Pattern Matching',
        difficulty: 'hard',
        description: 'Knuth-Morris-Pratt algorithm for efficient pattern matching.',
        type: 'pattern',
        inputs: [
            { name: 'text', type: 'string', label: 'Text' },
            { name: 'pattern', type: 'string', label: 'Pattern' }
        ],
        algorithm: 'kmpPattern'
    },
    
    // Singly Linked List
    {
        id: 'SLL_TRAVERSE',
        title: 'SLL: Traverse',
        category: 'Singly Linked List',
        difficulty: 'easy',
        description: 'Traverse a singly linked list and print all elements.',
        type: 'linkedlist',
        inputs: [{ name: 'array', type: 'array', label: 'Elements (comma-separated)' }],
        algorithm: 'sllTraverse'
    },
    {
        id: 'SLL_INSERT_FRONT',
        title: 'SLL: Insert at Front',
        category: 'Singly Linked List',
        difficulty: 'easy',
        description: 'Insert a new node at the beginning of a singly linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Existing elements' },
            { name: 'element', type: 'number', label: 'Element to insert' }
        ],
        algorithm: 'sllInsertFront'
    },
    {
        id: 'SLL_DELETE_LAST',
        title: 'SLL: Delete Last Node',
        category: 'Singly Linked List',
        difficulty: 'medium',
        description: 'Delete the last node from a singly linked list.',
        type: 'linkedlist',
        inputs: [{ name: 'array', type: 'array', label: 'Elements (comma-separated)' }],
        algorithm: 'sllDeleteLast'
    },
    
    // Doubly Linked List
    {
        id: 'DLL_INSERT_FRONT',
        title: 'DLL: Insert at Front',
        category: 'Doubly Linked List',
        difficulty: 'easy',
        description: 'Insert a new node at the beginning of a doubly linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Existing elements' },
            { name: 'element', type: 'number', label: 'Element to insert' }
        ],
        algorithm: 'dllInsertFront'
    },
    {
        id: 'DLL_INSERT_END',
        title: 'DLL: Insert at End',
        category: 'Doubly Linked List',
        difficulty: 'easy',
        description: 'Insert a new node at the end of a doubly linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Existing elements' },
            { name: 'element', type: 'number', label: 'Element to insert' }
        ],
        algorithm: 'dllInsertEnd'
    },
    {
        id: 'DLL_DELETE_LAST',
        title: 'DLL: Delete Last',
        category: 'Doubly Linked List',
        difficulty: 'medium',
        description: 'Delete the last node from a doubly linked list.',
        type: 'linkedlist',
        inputs: [{ name: 'array', type: 'array', label: 'Elements (comma-separated)' }],
        algorithm: 'dllDeleteLast'
    },
    {
        id: 'DLL_DELETE_BEFORE',
        title: 'DLL: Delete Before Position',
        category: 'Doubly Linked List',
        difficulty: 'hard',
        description: 'Delete the node before a specified position in a doubly linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Elements (comma-separated)' },
            { name: 'position', type: 'number', label: 'Position (1-indexed)' }
        ],
        algorithm: 'dllDeleteBefore'
    },
    
    // Circular Linked List
    {
        id: 'CLL_INSERT_END',
        title: 'CLL: Insert at End',
        category: 'Circular Linked List',
        difficulty: 'medium',
        description: 'Insert a new node at the end of a circular linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Existing elements' },
            { name: 'element', type: 'number', label: 'Element to insert' }
        ],
        algorithm: 'cllInsertEnd'
    },
    {
        id: 'CLL_INSERT_BEFORE',
        title: 'CLL: Insert Before Position',
        category: 'Circular Linked List',
        difficulty: 'hard',
        description: 'Insert a new node before a specified position in a circular linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Existing elements' },
            { name: 'element', type: 'number', label: 'Element to insert' },
            { name: 'position', type: 'number', label: 'Position (1-indexed)' }
        ],
        algorithm: 'cllInsertBefore'
    },
    {
        id: 'CLL_DELETE_FIRST',
        title: 'CLL: Delete First Node',
        category: 'Circular Linked List',
        difficulty: 'medium',
        description: 'Delete the first node from a circular linked list.',
        type: 'linkedlist',
        inputs: [{ name: 'array', type: 'array', label: 'Elements (comma-separated)' }],
        algorithm: 'cllDeleteFirst'
    },
    {
        id: 'CLL_DELETE_AFTER',
        title: 'CLL: Delete After Position',
        category: 'Circular Linked List',
        difficulty: 'hard',
        description: 'Delete the node after a specified position in a circular linked list.',
        type: 'linkedlist',
        inputs: [
            { name: 'array', type: 'array', label: 'Elements (comma-separated)' },
            { name: 'position', type: 'number', label: 'Position (1-indexed)' }
        ],
        algorithm: 'cllDeleteAfter'
    }
];

// Get experiment by ID
function getExperiment(id) {
    return EXPERIMENTS.find(exp => exp.id === id);
}

// Get all experiments
function getAllExperiments() {
    return EXPERIMENTS;
}

// Get experiments by category
function getExperimentsByCategory(category) {
    return EXPERIMENTS.filter(exp => exp.category === category);
}

