// Search algorithm implementations

async function linearSearch(inputs, stepContext) {
    const arr = [...inputs.array]; // Create copy
    const target = inputs.target;
    
    if (!arr || arr.length === 0) {
        await stepContext.log('Error: Array is empty');
        return -1;
    }
    
    await stepContext.log(`Searching for ${target} using linear search`);
    await stepContext.update({ array: arr });
    
    for (let i = 0; i < arr.length; i++) {
        await stepContext.log(`Checking arr[${i}] = ${arr[i]}`);
        await stepContext.highlight([i], 'comparing');
        await stepContext.update({ array: arr }); // Update visualization
        
        if (arr[i] === target) {
            await stepContext.log(`Found ${target} at index ${i}!`);
            await stepContext.highlight([i], 'active');
            return i;
        }
    }
    
    await stepContext.log(`${target} not found in array`);
    return -1;
}

async function binarySearch(inputs, stepContext) {
    const arr = [...inputs.array]; // Create copy
    const target = inputs.target;
    
    if (!arr || arr.length === 0) {
        await stepContext.log('Error: Array is empty');
        return -1;
    }
    
    // Check if sorted
    const isSorted = arr.every((val, i, arr) => !i || arr[i - 1] <= val);
    if (!isSorted) {
        await stepContext.log('Warning: Array must be sorted for binary search!');
    }
    
    await stepContext.log(`Searching for ${target} using binary search`);
    await stepContext.update({ array: arr });
    
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        await stepContext.log(`Left=${left}, Right=${right}, Mid=${mid}, arr[${mid}]=${arr[mid]}`);
        await stepContext.highlight([left, mid, right], 'comparing');
        await stepContext.update({ array: arr }); // Update visualization
        
        if (arr[mid] === target) {
            await stepContext.log(`Found ${target} at index ${mid}!`);
            await stepContext.highlight([mid], 'active');
            return mid;
        } else if (arr[mid] < target) {
            await stepContext.log(`arr[${mid}] < ${target}, searching right half`);
            left = mid + 1;
        } else {
            await stepContext.log(`arr[${mid}] > ${target}, searching left half`);
            right = mid - 1;
        }
    }
    
    await stepContext.log(`${target} not found in array`);
    return -1;
}

