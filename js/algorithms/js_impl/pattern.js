// Pattern matching algorithm implementations

async function naivePattern(inputs, stepContext) {
    const text = inputs.text;
    const pattern = inputs.pattern;
    const n = text.length;
    const m = pattern.length;
    
    await stepContext.log(`Naive pattern matching: searching for "${pattern}" in "${text}"`);
    await stepContext.update({ text, pattern });
    
    const results = [];
    
    // Try all possible starting positions
    for (let i = 0; i <= n - m; i++) {
        await stepContext.log(`Trying position ${i} in text`);
        if (stepContext.highlightMatch) {
            await stepContext.highlightMatch(i, m, 'comparing');
        }
        
        let j = 0;
        // Check if pattern matches at position i
        while (j < m && text[i + j] === pattern[j]) {
            await stepContext.log(`Match at position ${i + j}: '${text[i + j]}' == '${pattern[j]}'`);
            if (stepContext.highlightComparison) {
                await stepContext.highlightComparison(i + j, j, 'comparing');
            }
            j++;
        }
        
        if (j === m) {
            await stepContext.log(`Pattern found at index ${i}!`);
            if (stepContext.highlightMatch) {
                await stepContext.highlightMatch(i, m, 'active');
            }
            results.push(i);
        } else {
            await stepContext.log(`No match at position ${i}`);
        }
    }
    
    if (results.length === 0) {
        await stepContext.log('Pattern not found in text');
    } else {
        await stepContext.log(`Pattern found at ${results.length} position(s): ${results.join(', ')}`);
    }
    
    return results;
}

async function kmpPattern(inputs, stepContext) {
    const text = inputs.text;
    const pattern = inputs.pattern;
    const n = text.length;
    const m = pattern.length;
    
    await stepContext.log(`KMP pattern matching: searching for "${pattern}" in "${text}"`);
    await stepContext.update({ text, pattern });
    
    // Build LPS array
    await stepContext.log('Building LPS (Longest Proper Prefix which is also Suffix) array...');
    const lps = computeLPS(pattern, stepContext);
    await stepContext.update({ text, pattern, lps });
    await stepContext.log(`LPS array: [${lps.join(', ')}]`);
    
    const results = [];
    let i = 0; // index for text
    let j = 0; // index for pattern
    
    while (i < n) {
        await stepContext.log(`Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`);
        if (stepContext.highlightComparison) {
            await stepContext.highlightComparison(i, j, 'comparing');
        }
        
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        
        if (j === m) {
            await stepContext.log(`Pattern found at index ${i - j}!`);
            if (stepContext.highlightMatch) {
                await stepContext.highlightMatch(i - j, m, 'active');
            }
            results.push(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                await stepContext.log(`Mismatch. Using LPS: j = lps[${j - 1}] = ${lps[j - 1]}`);
                j = lps[j - 1];
            } else {
                await stepContext.log(`Mismatch. Moving to next character in text`);
                i++;
            }
        }
    }
    
    if (results.length === 0) {
        await stepContext.log('Pattern not found in text');
    } else {
        await stepContext.log(`Pattern found at ${results.length} position(s): ${results.join(', ')}`);
    }
    
    return results;
}

// Helper function to compute LPS array
function computeLPS(pattern, stepContext) {
    const m = pattern.length;
    const lps = new Array(m);
    let len = 0;
    lps[0] = 0;
    
    let i = 1;
    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

