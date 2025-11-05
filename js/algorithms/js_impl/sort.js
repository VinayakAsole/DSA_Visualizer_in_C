// Sorting algorithm implementations - Fully implemented Bubble Sort

async function bubbleSort(inputs, stepContext) {
    let arr = [...inputs.array];
    const n = arr.length;
    
    await stepContext.log(`Starting bubble sort on array of size ${n}`);
    await stepContext.update({ array: arr });
    
    // Outer loop: number of passes
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        await stepContext.log(`Pass ${i + 1}: Comparing adjacent elements`);
        await stepContext.update({ array: arr });
        
        // Inner loop: compare adjacent elements
        for (let j = 0; j < n - i - 1; j++) {
            await stepContext.log(`Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`);
            await stepContext.highlight([j, j + 1], 'comparing');
            
            // Swap if current > next
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                
                await stepContext.log(`Swapped: ${arr[j+1]} <-> ${arr[j]}`);
                await stepContext.update({ array: arr });
                await stepContext.highlight([j, j + 1], 'swapped');
            }
        }
        
        // Mark last element as sorted
        await stepContext.highlight([n - i - 1], 'sorted');
        await stepContext.log(`Pass ${i + 1} complete. Element at position ${n - i - 1} is in correct position.`);
        
        // If no swap occurred, array is sorted
        if (!swapped) {
            await stepContext.log('No swaps in this pass. Array is sorted!');
            // Mark all remaining as sorted
            for (let k = 0; k <= n - i - 1; k++) {
                await stepContext.highlight([k], 'sorted');
            }
            break;
        }
    }
    
    await stepContext.log(`Bubble sort complete! Final sorted array.`);
    await stepContext.update({ array: arr });
    
    // Mark all as sorted
    for (let i = 0; i < arr.length; i++) {
        await stepContext.highlight([i], 'sorted');
    }
    
    return arr;
}

