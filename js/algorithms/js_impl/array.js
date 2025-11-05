// Array algorithm implementations

async function arrayMax(inputs, stepContext) {
    const arr = [...inputs.array]; // Create copy to avoid mutation
    if (!arr || arr.length === 0) {
        await stepContext.log('Error: Array is empty');
        return { max: null, maxIndex: -1 };
    }
    
    let max = arr[0];
    let maxIndex = 0;
    
    await stepContext.log(`Starting: max = ${max} at index 0`);
    await stepContext.update({ array: arr });
    await stepContext.highlight([0], 'active');
    
    for (let i = 1; i < arr.length; i++) {
        await stepContext.log(`Comparing arr[${i}] = ${arr[i]} with max = ${max}`);
        await stepContext.highlight([i, maxIndex], 'comparing');
        
        if (arr[i] > max) {
            max = arr[i];
            maxIndex = i;
            await stepContext.log(`New max found: ${max} at index ${i}`);
            await stepContext.highlight([i], 'active');
        }
    }
    
    await stepContext.log(`Final result: Largest number = ${max} at index ${maxIndex}`);
    return { max, maxIndex };
}

async function arraySumAvg(inputs, stepContext) {
    const arr = [...inputs.array]; // Create copy
    if (!arr || arr.length === 0) {
        await stepContext.log('Error: Array is empty');
        return { sum: 0, avg: 0 };
    }
    
    let sum = 0;
    
    await stepContext.log(`Starting sum calculation on array of ${arr.length} elements`);
    await stepContext.update({ array: arr });
    
    for (let i = 0; i < arr.length; i++) {
        await stepContext.log(`Adding arr[${i}] = ${arr[i]}, sum = ${sum} + ${arr[i]}`);
        await stepContext.highlight([i], 'active');
        sum += arr[i];
        await stepContext.update({ array: arr }); // Update to show current state
    }
    
    const avg = sum / arr.length;
    await stepContext.log(`Sum = ${sum}, Average = ${avg.toFixed(2)}`);
    return { sum, avg: parseFloat(avg.toFixed(2)) };
}

async function arrayInsert(inputs, stepContext) {
    let arr = [...inputs.array];
    const element = inputs.element;
    const pos = inputs.position;
    
    await stepContext.log(`Inserting ${element} at position ${pos}`);
    await stepContext.update({ array: arr });
    
    // Shift elements to the right
    arr.push(0); // Add space
    await stepContext.update({ array: arr });
    
    for (let i = arr.length - 1; i > pos; i--) {
        arr[i] = arr[i - 1];
        await stepContext.log(`Shifting arr[${i-1}] to arr[${i}]`);
        await stepContext.update({ array: arr });
        await stepContext.highlight([i], 'active');
    }
    
    // Insert element
    arr[pos] = element;
    await stepContext.log(`Inserted ${element} at position ${pos}`);
    await stepContext.update({ array: arr });
    await stepContext.highlight([pos], 'active');
    
    return arr;
}

async function arrayDelete(inputs, stepContext) {
    let arr = [...inputs.array];
    const pos = inputs.position;
    
    await stepContext.log(`Deleting element at position ${pos}`);
    await stepContext.update({ array: arr });
    await stepContext.highlight([pos], 'active');
    
    // Shift elements to the left
    for (let i = pos; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
        await stepContext.log(`Shifting arr[${i+1}] to arr[${i}]`);
        await stepContext.update({ array: arr });
        await stepContext.highlight([i], 'active');
    }
    
    arr.pop(); // Remove last element
    await stepContext.log(`Element deleted. New array length: ${arr.length}`);
    await stepContext.update({ array: arr });
    
    return arr;
}

