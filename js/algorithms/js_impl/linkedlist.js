// Linked List algorithm implementations

async function sllTraverse(inputs, stepContext) {
    const arr = inputs.array || [];
    const list = [...arr];
    
    await stepContext.log(`Traversing singly linked list with ${list.length} nodes`);
    await stepContext.update({ list, type: 'singly' });
    
    let result = [];
    for (let i = 0; i < list.length; i++) {
        await stepContext.log(`Visiting node ${i}: ${list[i]}`);
        await stepContext.highlight([i], 'active');
        result.push(list[i]);
    }
    
    await stepContext.log(`Traversal complete. Result: ${result.join(' -> ')}`);
    return result;
}

async function sllInsertFront(inputs, stepContext) {
    const arr = inputs.array || [];
    const element = inputs.element;
    
    if (element === undefined || element === null) {
        await stepContext.log('Error: Element to insert is required');
        return arr;
    }
    
    const list = [element, ...arr];
    
    await stepContext.log(`Inserting ${element} at the front of the list`);
    await stepContext.update({ list, type: 'singly' });
    await stepContext.highlight([0], 'active');
    
    return list;
}

async function sllDeleteLast(inputs, stepContext) {
    const arr = inputs.array || [];
    if (arr.length === 0) {
        await stepContext.log('List is empty, nothing to delete');
        return [];
    }
    
    await stepContext.log(`Deleting last node: ${arr[arr.length - 1]}`);
    await stepContext.update({ list: arr, type: 'singly' });
    await stepContext.highlight([arr.length - 1], 'active');
    
    const newList = arr.slice(0, -1);
    await stepContext.log(`Last node deleted. New list length: ${newList.length}`);
    await stepContext.update({ list: newList, type: 'singly' });
    
    return newList;
}

async function dllInsertFront(inputs, stepContext) {
    const arr = inputs.array || [];
    const element = inputs.element;
    
    if (element === undefined || element === null) {
        await stepContext.log('Error: Element to insert is required');
        return arr;
    }
    
    const list = [element, ...arr];
    
    await stepContext.log(`Inserting ${element} at the front of doubly linked list`);
    await stepContext.update({ list, type: 'doubly' });
    await stepContext.highlight([0], 'active');
    
    return list;
}

async function dllInsertEnd(inputs, stepContext) {
    const arr = inputs.array || [];
    const element = inputs.element;
    
    if (element === undefined || element === null) {
        await stepContext.log('Error: Element to insert is required');
        return arr;
    }
    
    const list = [...arr, element];
    
    await stepContext.log(`Inserting ${element} at the end of doubly linked list`);
    await stepContext.update({ list, type: 'doubly' });
    await stepContext.highlight([list.length - 1], 'active');
    
    return list;
}

async function dllDeleteLast(inputs, stepContext) {
    const arr = inputs.array || [];
    
    if (arr.length === 0) {
        await stepContext.log('List is empty, nothing to delete');
        return [];
    }
    
    const lastElement = arr[arr.length - 1];
    await stepContext.log(`Deleting last node from doubly linked list: ${lastElement}`);
    await stepContext.update({ list: arr, type: 'doubly' });
    await stepContext.highlight([arr.length - 1], 'active');
    
    const newList = arr.slice(0, -1);
    await stepContext.log(`Node deleted. New list length: ${newList.length}`);
    await stepContext.update({ list: newList, type: 'doubly' });
    
    return newList;
}

async function dllDeleteBefore(inputs, stepContext) {
    const arr = inputs.array || [];
    const position = inputs.position; // 1-indexed
    
    if (!position || position <= 1) {
        await stepContext.log('Error: Position must be greater than 1 (cannot delete before first node)');
        return arr;
    }
    
    if (position > arr.length) {
        await stepContext.log(`Error: Position ${position} is out of bounds. List has ${arr.length} nodes.`);
        return arr;
    }
    
    const deleteIndex = position - 2; // Position - 1 (convert to 0-index) - 1 (before that)
    const elementToDelete = arr[deleteIndex];
    
    await stepContext.log(`Deleting node before position ${position} (index ${deleteIndex}, value: ${elementToDelete})`);
    await stepContext.update({ list: arr, type: 'doubly' });
    await stepContext.highlight([deleteIndex], 'active');
    
    const newList = [...arr];
    newList.splice(deleteIndex, 1);
    await stepContext.log(`Node deleted. New list length: ${newList.length}`);
    await stepContext.update({ list: newList, type: 'doubly' });
    
    return newList;
}

async function cllInsertEnd(inputs, stepContext) {
    const arr = inputs.array || [];
    const element = inputs.element;
    
    if (element === undefined || element === null) {
        await stepContext.log('Error: Element to insert is required');
        return arr;
    }
    
    const list = [...arr, element];
    
    await stepContext.log(`Inserting ${element} at the end of circular linked list`);
    await stepContext.update({ list, type: 'circular' });
    await stepContext.highlight([list.length - 1], 'active');
    await stepContext.log(`Node inserted. List is now circular: last node connects back to first.`);
    
    return list;
}

async function cllInsertBefore(inputs, stepContext) {
    const arr = inputs.array || [];
    const element = inputs.element;
    const position = inputs.position; // 1-indexed
    
    if (element === undefined || element === null) {
        await stepContext.log('Error: Element to insert is required');
        return arr;
    }
    
    if (!position || position < 1) {
        await stepContext.log('Error: Position must be at least 1');
        return arr;
    }
    
    if (position > arr.length + 1) {
        await stepContext.log(`Error: Position ${position} is out of bounds. List has ${arr.length} nodes.`);
        return arr;
    }
    
    const insertIndex = Math.max(0, position - 1);
    const newList = [...arr];
    newList.splice(insertIndex, 0, element);
    
    await stepContext.log(`Inserting ${element} before position ${position} in circular linked list`);
    await stepContext.update({ list: newList, type: 'circular' });
    await stepContext.highlight([insertIndex], 'active');
    await stepContext.log(`Node inserted at index ${insertIndex}. List is circular.`);
    
    return newList;
}

async function cllDeleteFirst(inputs, stepContext) {
    const arr = inputs.array || [];
    
    if (arr.length === 0) {
        await stepContext.log('List is empty, nothing to delete');
        return [];
    }
    
    const firstElement = arr[0];
    await stepContext.log(`Deleting first node from circular linked list: ${firstElement}`);
    await stepContext.update({ list: arr, type: 'circular' });
    await stepContext.highlight([0], 'active');
    
    const newList = arr.slice(1);
    
    if (newList.length > 0) {
        await stepContext.log(`First node deleted. New first node is ${newList[0]}. List is still circular.`);
    } else {
        await stepContext.log(`First node deleted. List is now empty.`);
    }
    
    await stepContext.update({ list: newList, type: 'circular' });
    
    return newList;
}

async function cllDeleteAfter(inputs, stepContext) {
    const arr = inputs.array || [];
    const position = inputs.position; // 1-indexed
    
    if (!position || position < 1) {
        await stepContext.log('Error: Position must be at least 1');
        return arr;
    }
    
    if (arr.length === 0) {
        await stepContext.log('Error: List is empty, cannot delete');
        return arr;
    }
    
    if (position >= arr.length) {
        await stepContext.log(`Error: Position ${position} is out of bounds. List has ${arr.length} nodes. Cannot delete after last node in circular list.`);
        return arr;
    }
    
    const deleteIndex = position; // After position means at index = position (0-indexed)
    const elementToDelete = arr[deleteIndex];
    
    await stepContext.log(`Deleting node after position ${position} (index ${deleteIndex}, value: ${elementToDelete})`);
    await stepContext.update({ list: arr, type: 'circular' });
    await stepContext.highlight([deleteIndex], 'active');
    
    const newList = [...arr];
    newList.splice(deleteIndex, 1);
    await stepContext.log(`Node deleted. New list length: ${newList.length}. List is still circular.`);
    await stepContext.update({ list: newList, type: 'circular' });
    
    return newList;
}

