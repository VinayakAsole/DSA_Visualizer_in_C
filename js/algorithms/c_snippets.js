// C code snippets for all experiments

const C_CODE_SNIPPETS = {
    ARRAY_MAX: `#include <stdio.h>

int findMax(int arr[], int n, int *maxIndex) {
    int max = arr[0];
    *maxIndex = 0;
    
    // Traverse array to find maximum
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
            *maxIndex = i;
        }
    }
    
    return max;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1};
    int n = 5;
    int maxIndex;
    int max = findMax(arr, n, &maxIndex);
    
    printf("Largest number: %d\\n", max);
    printf("Index: %d\\n", maxIndex);
    return 0;
}`,

    ARRAY_SUM_AVG: `#include <stdio.h>

void sumAndAverage(int arr[], int n, int *sum, float *avg) {
    *sum = 0;
    
    // Traverse and sum all elements
    for (int i = 0; i < n; i++) {
        *sum += arr[i];
    }
    
    // Calculate average
    *avg = (float)(*sum) / n;
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = 5;
    int sum;
    float avg;
    
    sumAndAverage(arr, n, &sum, &avg);
    printf("Sum: %d\\n", sum);
    printf("Average: %.2f\\n", avg);
    return 0;
}`,

    ARRAY_INSERT: `#include <stdio.h>

void insertElement(int arr[], int *n, int element, int pos) {
    // Shift elements to the right
    for (int i = *n; i > pos; i--) {
        arr[i] = arr[i - 1];
    }
    
    // Insert element at position
    arr[pos] = element;
    (*n)++;
}

int main() {
    int arr[10] = {1, 2, 3, 4, 5};
    int n = 5;
    int element = 10;
    int pos = 2;
    
    insertElement(arr, &n, element, pos);
    
    // Print array
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,

    ARRAY_DELETE: `#include <stdio.h>

void deleteElement(int arr[], int *n, int pos) {
    // Shift elements to the left
    for (int i = pos; i < *n - 1; i++) {
        arr[i] = arr[i + 1];
    }
    (*n)--;
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = 5;
    int pos = 2;
    
    deleteElement(arr, &n, pos);
    
    // Print array
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,

    LINEAR_SEARCH: `#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    // Traverse array sequentially
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Found at index i
        }
    }
    return -1; // Not found
}

int main() {
    int arr[] = {5, 2, 8, 1, 9, 3};
    int n = 6;
    int target = 8;
    
    int index = linearSearch(arr, n, target);
    if (index != -1) {
        printf("Found at index: %d\\n", index);
    } else {
        printf("Not found\\n");
    }
    return 0;
}`,

    BINARY_SEARCH: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid; // Found
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Not found
}

int main() {
    int arr[] = {1, 3, 5, 7, 9, 11, 13};
    int n = 7;
    int target = 7;
    
    int index = binarySearch(arr, n, target);
    if (index != -1) {
        printf("Found at index: %d\\n", index);
    } else {
        printf("Not found\\n");
    }
    return 0;
}`,

    BUBBLE_SORT: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    // Outer loop: number of passes
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        
        // Inner loop: compare adjacent elements
        for (int j = 0; j < n - i - 1; j++) {
            // Swap if current > next
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        
        // If no swap, array is sorted
        if (!swapped) break;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    
    bubbleSort(arr, n);
    
    // Print sorted array
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,

    NAIVE_PATTERN: `#include <stdio.h>
#include <string.h>

void naivePatternMatch(char text[], char pattern[]) {
    int n = strlen(text);
    int m = strlen(pattern);
    
    // Try all possible starting positions
    for (int i = 0; i <= n - m; i++) {
        int j;
        // Check if pattern matches at position i
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        
        if (j == m) {
            printf("Pattern found at index: %d\\n", i);
        }
    }
}

int main() {
    char text[] = "ABABDABACDABABCABCAB";
    char pattern[] = "ABABCABCAB";
    
    naivePatternMatch(text, pattern);
    return 0;
}`,

    KMP_PATTERN: `#include <stdio.h>
#include <string.h>

// Build LPS (Longest Proper Prefix which is also Suffix) array
void computeLPS(char pattern[], int m, int lps[]) {
    int len = 0;
    lps[0] = 0;
    
    int i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}

// KMP Pattern Matching
void kmpPatternMatch(char text[], char pattern[]) {
    int n = strlen(text);
    int m = strlen(pattern);
    int lps[m];
    
    computeLPS(pattern, m, lps);
    
    int i = 0; // index for text
    int j = 0; // index for pattern
    
    while (i < n) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (j == m) {
            printf("Pattern found at index: %d\\n", i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
}

int main() {
    char text[] = "ABABDABACDABABCABCAB";
    char pattern[] = "ABABCABCAB";
    
    kmpPatternMatch(text, pattern);
    return 0;
}`,

    SLL_TRAVERSE: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void traverse(struct Node* head) {
    struct Node* current = head;
    
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

int main() {
    // Create sample list: 1 -> 2 -> 3 -> 4 -> NULL
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = 1;
    head->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->data = 2;
    head->next->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->next->data = 3;
    head->next->next->next = NULL;
    
    traverse(head);
    return 0;
}`,

    SLL_INSERT_FRONT: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* insertFront(struct Node* head, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = head;
    return newNode; // New head
}

int main() {
    struct Node* head = NULL;
    
    head = insertFront(head, 3);
    head = insertFront(head, 2);
    head = insertFront(head, 1);
    
    // List: 1 -> 2 -> 3 -> NULL
    return 0;
}`,

    SLL_DELETE_LAST: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* deleteLast(struct Node* head) {
    if (head == NULL || head->next == NULL) {
        free(head);
        return NULL;
    }
    
    struct Node* current = head;
    // Traverse to second last node
    while (current->next->next != NULL) {
        current = current->next;
    }
    
    free(current->next);
    current->next = NULL;
    return head;
}

int main() {
    // Implementation
    return 0;
}`,

    DLL_INSERT_FRONT: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
    struct Node* prev;
};

struct Node* insertFront(struct Node* head, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = head;
    newNode->prev = NULL;
    
    // If list is not empty, update previous of old head
    if (head != NULL) {
        head->prev = newNode;
    }
    
    return newNode; // New head
}

int main() {
    struct Node* head = NULL;
    
    head = insertFront(head, 3);
    head = insertFront(head, 2);
    head = insertFront(head, 1);
    
    // List: 1 ⇄ 2 ⇄ 3 ⇄ NULL
    return 0;
}`,

    DLL_INSERT_END: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
    struct Node* prev;
};

struct Node* insertEnd(struct Node* head, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    
    // If list is empty
    if (head == NULL) {
        newNode->prev = NULL;
        return newNode;
    }
    
    // Traverse to last node
    struct Node* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    
    // Insert at end
    current->next = newNode;
    newNode->prev = current;
    
    return head;
}

int main() {
    struct Node* head = NULL;
    
    head = insertEnd(head, 1);
    head = insertEnd(head, 2);
    head = insertEnd(head, 3);
    
    // List: NULL ⇄ 1 ⇄ 2 ⇄ 3 ⇄ NULL
    return 0;
}`,

    DLL_DELETE_LAST: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
    struct Node* prev;
};

struct Node* deleteLast(struct Node* head) {
    if (head == NULL) {
        return NULL;
    }
    
    // If only one node
    if (head->next == NULL) {
        free(head);
        return NULL;
    }
    
    // Traverse to last node
    struct Node* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    
    // Update previous node's next
    current->prev->next = NULL;
    free(current);
    
    return head;
}

int main() {
    // Implementation
    return 0;
}`,

    DLL_DELETE_BEFORE: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
    struct Node* prev;
};

struct Node* deleteBefore(struct Node* head, int pos) {
    if (head == NULL || pos <= 1) {
        return head; // Cannot delete before first node
    }
    
    // Find node at position
    struct Node* current = head;
    int count = 1;
    
    while (current != NULL && count < pos) {
        current = current->next;
        count++;
    }
    
    if (current == NULL) {
        return head; // Position out of bounds
    }
    
    // Node to delete is current->prev
    struct Node* toDelete = current->prev;
    
    if (toDelete == NULL) {
        return head; // No node before
    }
    
    // Update links
    if (toDelete->prev != NULL) {
        toDelete->prev->next = current;
    } else {
        // Deleting first node, update head
        head = current;
    }
    current->prev = toDelete->prev;
    
    free(toDelete);
    return head;
}

int main() {
    // Implementation
    return 0;
}`,

    CLL_INSERT_END: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* insertEnd(struct Node* last, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    
    // If list is empty
    if (last == NULL) {
        newNode->next = newNode; // Point to itself
        return newNode; // New last node
    }
    
    // Insert after last node
    newNode->next = last->next;
    last->next = newNode;
    
    return newNode; // New last node
}

int main() {
    struct Node* last = NULL;
    
    last = insertEnd(last, 1);
    last = insertEnd(last, 2);
    last = insertEnd(last, 3);
    
    // Circular list: 1 -> 2 -> 3 -> (back to 1)
    return 0;
}`,

    CLL_INSERT_BEFORE: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* insertBefore(struct Node* head, int pos, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    
    if (head == NULL) {
        newNode->next = newNode;
        return newNode;
    }
    
    // Find node at position
    struct Node* current = head;
    int count = 1;
    
    while (count < pos && current->next != head) {
        current = current->next;
        count++;
    }
    
    // Insert before current
    struct Node* prev = head;
    while (prev->next != current) {
        prev = prev->next;
    }
    
    newNode->next = current;
    prev->next = newNode;
    
    if (current == head && pos == 1) {
        head = newNode; // Update head if inserting before first
    }
    
    return head;
}

int main() {
    // Implementation
    return 0;
}`,

    CLL_DELETE_FIRST: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* deleteFirst(struct Node* head) {
    if (head == NULL) {
        return NULL;
    }
    
    // If only one node
    if (head->next == head) {
        free(head);
        return NULL;
    }
    
    // Find last node
    struct Node* last = head;
    while (last->next != head) {
        last = last->next;
    }
    
    // Update links
    struct Node* toDelete = head;
    head = head->next;
    last->next = head;
    
    free(toDelete);
    return head;
}

int main() {
    // Implementation
    return 0;
}`,

    CLL_DELETE_AFTER: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* deleteAfter(struct Node* head, int pos) {
    if (head == NULL) {
        return head;
    }
    
    // Find node at position
    struct Node* current = head;
    int count = 1;
    
    while (count < pos && current->next != head) {
        current = current->next;
        count++;
    }
    
    if (current->next == head) {
        return head; // Cannot delete after last node
    }
    
    // Node to delete is current->next
    struct Node* toDelete = current->next;
    current->next = toDelete->next;
    
    free(toDelete);
    return head;
}

int main() {
    // Implementation
    return 0;
}`
};

// Get C code for experiment
function getCCode(experimentId) {
    return C_CODE_SNIPPETS[experimentId] || '// C code not available';
}

