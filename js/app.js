// Main application logic - routing, localStorage, progress tracking

// Initialize dashboard
function initDashboard() {
    const experiments = getAllExperiments();
    const grid = document.getElementById('experiments-grid');
    const totalExp = document.getElementById('total-experiments');
    const completedExp = document.getElementById('completed-count');
    const savedCount = document.getElementById('saved-count');
    
    totalExp.textContent = experiments.length;
    
    // Load progress
    const progress = loadProgress();
    const completed = progress.filter(p => p.completed).length;
    const saved = progress.length;
    
    completedExp.textContent = completed;
    savedCount.textContent = saved;
    
    // Render experiment cards
    experiments.forEach(exp => {
        const card = createExperimentCard(exp, progress);
        grid.appendChild(card);
    });
}

// Create experiment card
function createExperimentCard(experiment, progress) {
    const card = document.createElement('div');
    card.className = 'experiment-card';
    
    const isCompleted = progress.some(p => p.experimentId === experiment.id && p.completed);
    if (isCompleted) {
        card.classList.add('completed');
    }
    
    card.innerHTML = `
        <h3>${experiment.title}</h3>
        <span class="category">${experiment.category}</span>
        <p class="description">${experiment.description}</p>
        <span class="difficulty ${experiment.difficulty}">${experiment.difficulty.toUpperCase()}</span>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `experiment.html?id=${experiment.id}`;
    });
    
    return card;
}

// Initialize experiment page
function initExperiment(experimentId) {
    const experiment = getExperiment(experimentId);
    if (!experiment) {
        alert('Experiment not found!');
        window.location.href = 'index.html';
        return;
    }
    
    // Set page title and header
    document.getElementById('experiment-title').textContent = experiment.title;
    document.getElementById('experiment-category').textContent = experiment.category;
    document.getElementById('experiment-difficulty').textContent = experiment.difficulty.toUpperCase();
    document.getElementById('experiment-difficulty').className = `difficulty ${experiment.difficulty}`;
    
    // Load C code
    loadCCode(experimentId);
    
    // Load explanation
    loadExplanation(experiment);
    
    // Setup inputs
    setupInputs(experiment);
    
    // Setup tabs
    setupTabs();
    
    // Setup practice mode
    setupPracticeMode(experiment);
    
    // Load progress
    loadProgressTab(experimentId);
    
    // Setup visualizer based on type
    setupVisualizer(experiment);
    
    // Setup controls
    setupControls(experiment);
}

// Load C code snippet with optional highlighting toggle
let codeHighlightEnabled = true;
function loadCCode(experimentId) {
    const cCode = getCCode(experimentId);
    const codeDisplay = document.getElementById('c-code-display');
    if (!codeDisplay) return;
    if (!cCode) {
        codeDisplay.innerHTML = '<code>// C code not available</code>';
        return;
    }
    if (codeHighlightEnabled) {
        codeDisplay.innerHTML = highlightCode(cCode);
    } else {
        // Render plain text without spans
        codeDisplay.textContent = cCode;
    }
}

// Safe code highlighting
function highlightCode(code) {
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    let out = escapeHtml(code);

    const placeholders = [];
    function protect(regex, type) {
        out = out.replace(regex, (m) => {
            const i = placeholders.length;
            placeholders.push({ type, value: m });
            return `__PH_${i}__`;
        });
    }

    // Protect comments and strings
    protect(/\/\*[\s\S]*?\*\//g, 'comment');      // block comments
    protect(/\/\/[^\n]*/g, 'comment');               // line comments
    protect(/\"(?:[^\"\\]|\\.)*\"/g, 'string'); // double-quoted strings
    protect(/'(?:[^'\\]|\\.)*'/g, 'string');        // single-quoted strings

    // Preprocessor directives
    out = out.replace(/#(include|define)\b/g, '<span class="keyword">#$1</span>');

    // Keywords with word boundaries
    const kw = /\b(int|char|void|struct|typedef|return|if|else|for|while|do|switch|case|break|continue|const|static|float|double|long|short|unsigned|signed)\b/g;
    out = out.replace(kw, '<span class="keyword">$1</span>');

    // Restore placeholders
    out = out.replace(/__PH_(\d+)__/g, (m, i) => {
        const ph = placeholders[Number(i)];
        if (!ph) return m;
        if (ph.type === 'comment') return `<span class="comment">${ph.value}</span>`;
        if (ph.type === 'string') return `<span class="string">${ph.value}</span>`;
        return ph.value;
    });

    return out;
}

// Load explanation
function loadExplanation(experiment) {
    const explanation = getExplanation(experiment.id);
    document.getElementById('algorithm-explanation').innerHTML = explanation.description;
    document.getElementById('pseudocode').textContent = explanation.pseudocode;
    document.getElementById('complexity-analysis').innerHTML = explanation.complexity;
}

// Theme toggle
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const saved = localStorage.getItem('dsa-theme') || 'light';
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark');
    btn.textContent = document.body.getAttribute('data-theme') === 'dark' ? '☀️ Light' : '🌙 Dark';
    btn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('dsa-theme', 'light');
            btn.textContent = '🌙 Dark';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('dsa-theme', 'dark');
            btn.textContent = '☀️ Light';
        }
    });
}

// Setup input fields
function setupInputs(experiment) {
    const inputSection = document.getElementById('input-section');
    inputSection.innerHTML = '';
    
    experiment.inputs.forEach(input => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${input.label}:</label>
            <input type="text" id="input-${input.name}" placeholder="Enter ${input.label.toLowerCase()}">
        `;
        inputSection.appendChild(div);
    });
}

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Setup practice mode
function setupPracticeMode(experiment) {
    const practiceTests = document.getElementById('practice-tests');
    const tests = getPracticeTests(experiment.id);
    
    practiceTests.innerHTML = '';
    
    if (!tests || tests.length === 0) {
        practiceTests.innerHTML = '<p style="color: #7f8c8d; padding: 20px;">No practice tests available for this experiment.</p>';
        return;
    }
    
    tests.forEach((test, index) => {
        const testDiv = document.createElement('div');
        testDiv.className = 'test-case';
        testDiv.innerHTML = `
            <h4>Test Case ${index + 1}</h4>
            <div class="test-input">Input: ${formatTestInput(test.input, experiment)}</div>
            <div class="test-expected">Expected: ${JSON.stringify(test.expected)}</div>
            <button class="btn-secondary run-test-btn" data-test-index="${index}">Run Test</button>
        `;
        practiceTests.appendChild(testDiv);
    });
    
    // Setup test run buttons - use event delegation to handle dynamically added buttons
    practiceTests.addEventListener('click', (e) => {
        if (e.target.classList.contains('run-test-btn')) {
            const testIndex = parseInt(e.target.dataset.testIndex);
            if (tests[testIndex]) {
                runPracticeTest(experiment, tests[testIndex]);
            }
        }
    });
}

// Format test input for display
function formatTestInput(input, experiment) {
    if (!input) return 'N/A';
    
    // Format based on input structure
    if (typeof input === 'object') {
        const parts = [];
        for (const key in input) {
            if (Array.isArray(input[key])) {
                parts.push(`${key}: [${input[key].join(', ')}]`);
            } else {
                parts.push(`${key}: ${input[key]}`);
            }
        }
        return parts.join(', ');
    }
    
    return JSON.stringify(input);
}

// Run practice test
async function runPracticeTest(experiment, test) {
    const result = document.getElementById('practice-result');
    if (!result) return;
    
    result.innerHTML = '<div style="color: #7f8c8d;">Running test...</div>';
    result.className = 'practice-result';
    
    try {
        const algorithm = getAlgorithmFunction(experiment.algorithm);
        if (!algorithm) {
            throw new Error('Algorithm function not found');
        }
        
        // Create a mock stepContext for practice mode (no visualization, just run algorithm)
        const mockStepContext = {
            log: async () => {}, // No-op for practice mode
            highlight: async () => {},
            highlightMatch: async () => {},
            highlightComparison: async () => {},
            update: async () => {},
            wait: async () => {}
        };
        
        // Run algorithm with test input
        const output = await algorithm(test.input, mockStepContext);
        
        // Compare outputs (handle both array and object comparisons)
        let passed = false;
        if (Array.isArray(output) && Array.isArray(test.expected)) {
            passed = JSON.stringify(output) === JSON.stringify(test.expected);
        } else if (typeof output === 'object' && typeof test.expected === 'object') {
            passed = JSON.stringify(output) === JSON.stringify(test.expected);
        } else {
            passed = output === test.expected;
        }
        
        result.className = `practice-result ${passed ? 'success' : 'failure'}`;
        result.innerHTML = `
            <div><strong>Your Output:</strong> ${JSON.stringify(output)}</div>
            <div><strong>Expected:</strong> ${JSON.stringify(test.expected)}</div>
            <div style="margin-top: 10px; font-weight: bold;">${passed ? '✅ Test Passed!' : '❌ Test Failed'}</div>
        `;
        
        if (passed) {
            savePracticeResult(experiment.id, test, output, true);
            // Update progress tab
            setTimeout(() => {
                loadProgressTab(experiment.id);
            }, 100);
        } else {
            savePracticeResult(experiment.id, test, output, false);
        }
    } catch (error) {
        result.className = 'practice-result failure';
        result.innerHTML = `<div><strong>Error:</strong> ${error.message}</div><div style="margin-top: 5px; font-size: 0.9rem;">Check console for details.</div>`;
        console.error('Practice test error:', error);
    }
}

// Setup controls
function setupControls(experiment) {
    const runBtn = document.getElementById('run-btn');
    const stepBtn = document.getElementById('step-btn');
    const prevBtn = document.getElementById('prev-btn');
    const resetBtn = document.getElementById('reset-btn');
    const autoBtn = document.getElementById('auto-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const speedSlider = document.getElementById('speed-slider');
    const speedPresetButtons = document.querySelectorAll('.speed-control button[data-speed]');
    const randomizeBtn = document.getElementById('randomize-btn');
    const sortBtn = document.getElementById('sort-btn');
    const resetInputsBtn = document.getElementById('reset-inputs-btn');
    const presetsSelect = document.getElementById('presets-select');
    
    let stepper = null;
    
    resetBtn.addEventListener('click', () => {
        if (stepper) {
            stepper.reset();
        }
        stepper = null;
        document.getElementById('output-log').innerHTML = '';
        const visualizer = getVisualizer(experiment.type);
        if (visualizer) {
            visualizer.clear();
        }
        // Clear visualizer area
        const visualizerArea = document.getElementById('visualizer-area');
        if (visualizerArea) {
            visualizerArea.innerHTML = '';
        }
    });
    
    runBtn.addEventListener('click', async () => {
        const inputs = getInputValues(experiment);
        if (!inputs) return;
        
        const algorithm = getAlgorithmFunction(experiment.algorithm);
        stepper = createStepper(algorithm, inputs, experiment);
        await stepper.run();
    });
    
    stepBtn.addEventListener('click', async () => {
        if (!stepper) {
            const inputs = getInputValues(experiment);
            if (!inputs) return;
            const algorithm = getAlgorithmFunction(experiment.algorithm);
            stepper = createStepper(algorithm, inputs, experiment);
            stepBtn.textContent = '⏭ Step';
        }
        
        // Resume from pause if paused
        if (stepper.isPaused) {
            stepper.isPaused = false;
            stepBtn.textContent = '⏸ Paused';
        } else {
            stepBtn.textContent = '⏸ Paused';
            await stepper.step();
            // Update button text after step completes or pauses
            setTimeout(() => {
                if (stepper && !stepper.isPaused) {
                    stepBtn.textContent = '⏭ Step';
                }
            }, 100);
        }
    });
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (stepper) {
                stepper.pauseResume();
                pauseBtn.textContent = stepper.isPaused ? '▶ Resume' : '⏸ Pause';
            }
        });
    }
    
    prevBtn.addEventListener('click', () => {
        if (stepper) {
            stepper.prev();
        }
    });
    
    autoBtn.addEventListener('click', async () => {
        if (!stepper) {
            const inputs = getInputValues(experiment);
            if (!inputs) return;
            const algorithm = getAlgorithmFunction(experiment.algorithm);
            stepper = createStepper(algorithm, inputs, experiment);
        }
        
        const speed = parseFloat(speedSlider.value);
        await stepper.auto(speed);
    });
    
    speedSlider.addEventListener('input', (e) => {
        document.getElementById('speed-value').textContent = `${e.target.value}x`;
        // If a stepper exists, update its delay immediately
        try {
            if (typeof stepper !== 'undefined' && stepper) {
                stepper.stepDelay = 2000 / parseFloat(e.target.value);
            }
        } catch {}
    });
    if (speedPresetButtons && speedPresetButtons.length) {
        speedPresetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-speed');
                speedSlider.value = val;
                document.getElementById('speed-value').textContent = `${val}x`;
            });
        });
    }

    if (randomizeBtn) {
        randomizeBtn.addEventListener('click', () => {
            if (!experiment.inputs) return;
            experiment.inputs.forEach(input => {
                const el = document.getElementById(`input-${input.name}`);
                if (!el) return;
                if (input.type === 'array') {
                    const len = 6 + Math.floor(Math.random() * 5);
                    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 99));
                    el.value = arr.join(', ');
                } else if (input.type === 'number') {
                    el.value = String(Math.floor(Math.random() * 50));
                } else if (input.type === 'string') {
                    el.value = 'ABABCABCAB';
                }
            });
        });
    }
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            if (experiment.id !== 'BINARY_SEARCH') return;
            const arrayEl = document.getElementById('input-array');
            if (!arrayEl || !arrayEl.value.trim()) return;
            const arr = arrayEl.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            arr.sort((a,b) => a - b);
            arrayEl.value = arr.join(', ');
        });
    }
    if (resetInputsBtn) {
        resetInputsBtn.addEventListener('click', () => {
            if (!experiment.inputs) return;
            experiment.inputs.forEach(input => {
                const el = document.getElementById(`input-${input.name}`);
                if (el) el.value = '';
            });
        });
    }
    if (presetsSelect) {
        presetsSelect.addEventListener('change', () => {
            const val = presetsSelect.value;
            if (!val) return;
            // Basic presets by type
            if (experiment.type === 'sort' || experiment.id === 'BUBBLE_SORT') {
                const el = document.getElementById('input-array');
                if (!el) return;
                if (val === 'best') el.value = '1, 2, 3, 4, 5, 6, 7';
                if (val === 'average') el.value = '5, 1, 4, 2, 8, 3, 7';
                if (val === 'worst') el.value = '7, 6, 5, 4, 3, 2, 1';
            } else if (experiment.id === 'BINARY_SEARCH') {
                const el = document.getElementById('input-array');
                const targetEl = document.getElementById('input-target');
                if (el && targetEl) {
                    if (val === 'best') { el.value = '1, 2, 3, 4, 5, 6, 7'; targetEl.value = '4'; }
                    if (val === 'average') { el.value = '1, 3, 5, 7, 9, 11, 13'; targetEl.value = '9'; }
                    if (val === 'worst') { el.value = '1, 3, 5, 7, 9, 11, 13'; targetEl.value = '2'; }
                }
            }
        });
    }
}

// Get input values
function getInputValues(experiment) {
    const values = {};
    let valid = true;
    
    experiment.inputs.forEach(input => {
        const inputEl = document.getElementById(`input-${input.name}`);
        const value = inputEl.value.trim();
        
        if (!value) {
            alert(`Please enter ${input.label}`);
            valid = false;
            return;
        }
        
        if (input.type === 'array') {
            values[input.name] = value.split(',').map(v => {
                const num = parseInt(v.trim());
                if (isNaN(num)) {
                    alert(`Invalid array value: ${v}`);
                    valid = false;
                }
                return num;
            });
        } else if (input.type === 'number') {
            values[input.name] = parseInt(value);
            if (isNaN(values[input.name])) {
                alert(`Invalid number: ${value}`);
                valid = false;
            }
        } else if (input.type === 'string') {
            values[input.name] = value;
        } else {
            values[input.name] = value;
        }
    });
    
    return valid ? values : null;
}

// Setup visualizer
function setupVisualizer(experiment) {
    const visualizerArea = document.getElementById('visualizer-area');
    const visualizer = getVisualizer(experiment.type);
    if (visualizer && visualizer.init) {
        visualizer.init(visualizerArea);
    }
}

// Get visualizer based on type
function getVisualizer(type) {
    if (type === 'array' || type === 'search' || type === 'sort') {
        return ArrayVisualizer;
    } else if (type === 'linkedlist') {
        return LinkedListVisualizer;
    } else if (type === 'pattern') {
        return PatternVisualizer;
    }
    return ArrayVisualizer; // default
}

// Load progress tab
function loadProgressTab(experimentId) {
    const progressList = document.getElementById('progress-list');
    if (!progressList) return;
    
    const progress = loadProgress();
    const experimentProgress = progress.filter(p => p.experimentId === experimentId);
    
    progressList.innerHTML = '';
    
    if (experimentProgress.length === 0) {
        progressList.innerHTML = '<p style="color: #7f8c8d; padding: 20px;">No practice attempts saved yet. Complete practice tests to save your progress!</p>';
        
        // Setup export/import buttons even when no progress
        setupProgressButtons(experimentId);
        return;
    }
    
    // Sort by timestamp (newest first)
    experimentProgress.sort((a, b) => b.timestamp - a.timestamp);
    
    experimentProgress.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'progress-item';
        
        const testInfo = item.test ? 
            `<div style="margin-top: 8px; font-size: 0.9rem;"><strong>Test Input:</strong> ${JSON.stringify(item.test.input)}</div>
             <div style="margin-top: 5px; font-size: 0.9rem;"><strong>Output:</strong> ${JSON.stringify(item.output)}</div>` : '';
        
        div.innerHTML = `
            <h4>Attempt ${experimentProgress.length - index} (${item.completed ? '✅ Passed' : '❌ Failed'})</h4>
            <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
            ${testInfo}
        `;
        progressList.appendChild(div);
    });
    
    // Setup export/import buttons
    setupProgressButtons(experimentId);
}

// Setup progress export/import buttons
function setupProgressButtons(experimentId) {
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    
    if (exportBtn) {
        // Remove old listeners by replacing the button
        const newExportBtn = exportBtn.cloneNode(true);
        exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
        
        newExportBtn.addEventListener('click', () => {
            exportProgress(experimentId);
        });
    }
    
    if (importBtn) {
        // Remove old listeners by replacing the button
        const newImportBtn = importBtn.cloneNode(true);
        importBtn.parentNode.replaceChild(newImportBtn, importBtn);
        
        newImportBtn.addEventListener('click', () => {
            if (importFile) {
                importFile.click();
            }
        });
    }
    
    if (importFile) {
        // Remove old listeners and add new one
        const newImportFile = importFile.cloneNode(true);
        importFile.parentNode.replaceChild(newImportFile, importFile);
        
        newImportFile.addEventListener('change', (e) => {
            importProgress(e.target.files[0], experimentId);
        });
    }
    // Copy JS Algorithm and Current State
    const copyJsBtn = document.getElementById('copy-js-btn');
    if (copyJsBtn) {
        const experiment = getExperiment(experimentId);
        copyJsBtn.onclick = () => {
            try {
                const fn = getAlgorithmFunction(experiment.algorithm);
                const src = typeof fn === 'function' ? fn.toString() : '// Not available';
                navigator.clipboard.writeText(src).then(() => {
                    copyJsBtn.textContent = 'Copied JS!';
                    setTimeout(() => copyJsBtn.textContent = '📋 Copy JS Algorithm', 1500);
                });
            } catch {}
        };
    }
    const copyStateBtn = document.getElementById('copy-state-btn');
    if (copyStateBtn) {
        const experiment = getExperiment(experimentId);
        copyStateBtn.onclick = () => {
            const inputs = getInputValues(experiment) || {};
            const visualizer = getVisualizer(experiment.type);
            let state = {};
            if (visualizer && visualizer.currentState) state.array = visualizer.currentState;
            if (visualizer && visualizer.currentList) state.list = visualizer.currentList;
            const dump = JSON.stringify({ inputs, state }, null, 2);
            navigator.clipboard.writeText(dump).then(() => {
                copyStateBtn.textContent = 'Copied State!';
                setTimeout(() => copyStateBtn.textContent = '📋 Copy Current State', 1500);
            });
        };
    }
}

// Progress storage functions
function savePracticeResult(experimentId, test, output, completed) {
    const progress = loadProgress();
    progress.push({
        experimentId,
        test,
        output,
        completed,
        timestamp: Date.now()
    });
    localStorage.setItem('dsa-progress', JSON.stringify(progress));
}

function loadProgress() {
    const stored = localStorage.getItem('dsa-progress');
    return stored ? JSON.parse(stored) : [];
}

function exportProgress(experimentId) {
    try {
        const progress = loadProgress();
        const filtered = progress.filter(p => p.experimentId === experimentId);
        
        if (filtered.length === 0) {
            alert('No progress to export for this experiment.');
            return;
        }
        
        const dataStr = JSON.stringify(filtered, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dsa-progress-${experimentId}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Exported ${filtered.length} progress item(s) successfully!`);
    } catch (error) {
        alert('Error exporting progress: ' + error.message);
        console.error('Export error:', error);
    }
}

function importProgress(file, experimentId) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (!Array.isArray(imported)) {
                throw new Error('Invalid file format. Expected an array.');
            }
            
            const current = loadProgress();
            
            // Filter out duplicates based on timestamp and experimentId
            const existingTimestamps = new Set(
                current.filter(p => p.experimentId === experimentId)
                    .map(p => p.timestamp)
            );
            
            const newItems = imported.filter(item => 
                !existingTimestamps.has(item.timestamp)
            );
            
            if (newItems.length === 0) {
                alert('No new progress items to import. All items already exist.');
                return;
            }
            
            const merged = [...current, ...newItems];
            localStorage.setItem('dsa-progress', JSON.stringify(merged));
            
            alert(`Imported ${newItems.length} progress item(s) successfully!`);
            
            // Reload progress tab
            if (experimentId) {
                loadProgressTab(experimentId);
            } else {
                location.reload();
            }
        } catch (error) {
            alert('Error importing progress: ' + error.message);
            console.error('Import error:', error);
        }
    };
    
    reader.onerror = () => {
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
}

// Get algorithm function by name
function getAlgorithmFunction(algorithmName) {
    const algorithms = {
        arrayMax: arrayMax,
        arraySumAvg: arraySumAvg,
        arrayInsert: arrayInsert,
        arrayDelete: arrayDelete,
        linearSearch: linearSearch,
        binarySearch: binarySearch,
        bubbleSort: bubbleSort,
        naivePattern: naivePattern,
        kmpPattern: kmpPattern,
        sllTraverse: sllTraverse,
        sllInsertFront: sllInsertFront,
        sllDeleteLast: sllDeleteLast,
        dllInsertFront: dllInsertFront,
        dllInsertEnd: dllInsertEnd,
        dllDeleteLast: dllDeleteLast,
        dllDeleteBefore: dllDeleteBefore,
        cllInsertEnd: cllInsertEnd,
        cllInsertBefore: cllInsertBefore,
        cllDeleteFirst: cllDeleteFirst,
        cllDeleteAfter: cllDeleteAfter
    };
    
    return algorithms[algorithmName] || null;
}

// Get explanation for experiment
function getExplanation(experimentId) {
    const explanations = {
        ARRAY_MAX: {
            description: '<p>The algorithm finds the largest number in an array by traversing through all elements and keeping track of the maximum value encountered.</p><p><strong>Key Steps:</strong></p><ul><li>Initialize max with first element</li><li>Compare each subsequent element with max</li><li>Update max if current element is larger</li><li>Return max value and its index</li></ul>',
            pseudocode: `FUNCTION findMax(arr, n):
    max = arr[0]
    maxIndex = 0
    FOR i = 1 TO n-1:
        IF arr[i] > max:
            max = arr[i]
            maxIndex = i
    RETURN max, maxIndex`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n) - Linear time, must check every element</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1) - Only using constant extra space</div>'
        },
        ARRAY_SUM_AVG: {
            description: '<p>Traverse the array once, accumulating the sum, then compute the average as sum/n.</p><ul><li>Initialize sum = 0</li><li>Add each element to sum</li><li>Average = sum / n</li></ul>',
            pseudocode: `FUNCTION sumAndAverage(arr, n):\n    sum = 0\n    FOR i = 0 TO n-1:\n        sum = sum + arr[i]\n    avg = sum / n\n    RETURN sum, avg`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        ARRAY_INSERT: {
            description: '<p>Insert an element at a position by shifting elements to the right to make space.</p><ul><li>Extend array by one</li><li>Shift elements from end to position+1</li><li>Place the new element at position</li></ul>',
            pseudocode: `FUNCTION insert(arr, n, x, pos):\n    FOR i = n DOWNTO pos+1:\n        arr[i] = arr[i-1]\n    arr[pos] = x\n    n = n + 1\n    RETURN arr`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n) worst case</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1) extra</div>'
        },
        ARRAY_DELETE: {
            description: '<p>Delete an element at a position by shifting left to fill the gap, then reducing length.</p>',
            pseudocode: `FUNCTION delete(arr, n, pos):\n    FOR i = pos TO n-2:\n        arr[i] = arr[i+1]\n    n = n - 1\n    RETURN arr`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n) worst case</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1) extra</div>'
        },
        BUBBLE_SORT: {
            description: '<p>Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p><p><strong>Key Steps:</strong></p><ul><li>Compare adjacent elements in each pass</li><li>Swap if they are in wrong order</li><li>Largest element "bubbles" to the end after each pass</li><li>Continue until no swaps occur</li></ul>',
            pseudocode: `FUNCTION bubbleSort(arr, n):
    FOR i = 0 TO n-2:
        swapped = FALSE
        FOR j = 0 TO n-i-2:
            IF arr[j] > arr[j+1]:
                SWAP arr[j] AND arr[j+1]
                swapped = TRUE
        IF NOT swapped:
            BREAK
    RETURN arr`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n²) - Worst case, O(n) - Best case (already sorted)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1) - In-place sorting</div>'
        },
        NAIVE_PATTERN: {
            description: '<p>Try matching the pattern at every possible position in the text.</p><ul><li>Slide pattern over text</li><li>Compare characters</li><li>Report indices where all characters match</li></ul>',
            pseudocode: `FUNCTION naive(text, pattern):\n    n = LEN(text), m = LEN(pattern)\n    FOR i = 0 TO n-m:\n        j = 0\n        WHILE j < m AND text[i+j] == pattern[j]:\n            j = j + 1\n        IF j == m: OUTPUT i`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n·m) worst</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        KMP_PATTERN: {
            description: '<p>Use the LPS array to avoid rechecking characters after mismatches.</p><ul><li>Precompute LPS for pattern</li><li>Scan text with two pointers</li><li>Jump in pattern using LPS on mismatch</li></ul>',
            pseudocode: `FUNCTION kmp(text, pattern):\n    lps = buildLPS(pattern)\n    i = 0, j = 0\n    WHILE i < LEN(text):\n        IF text[i] == pattern[j]: i++, j++\n        IF j == LEN(pattern): OUTPUT i-j; j = lps[j-1]\n        ELSE IF i < LEN(text) AND text[i] != pattern[j]:\n            IF j != 0: j = lps[j-1] ELSE i++`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n + m)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(m) for LPS</div>'
        },
        SLL_TRAVERSE: {
            description: '<p>Traverse a singly linked list from head to tail and visit each node once.</p><ul><li>Start at head</li><li>While current != NULL, process node and move to next</li></ul>',
            pseudocode: `FUNCTION traverse(head):\n    curr = head\n    WHILE curr != NULL:\n        VISIT curr.data\n        curr = curr.next`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        SLL_INSERT_FRONT: {
            description: '<p>Insert a new node at the beginning; update head to the new node.</p>',
            pseudocode: `FUNCTION insertFront(head, x):\n    node = NEW Node(x)\n    node.next = head\n    head = node\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(1)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        SLL_DELETE_LAST: {
            description: '<p>Delete the last node by traversing to the second last and setting its next to NULL.</p>',
            pseudocode: `FUNCTION deleteLast(head):\n    IF head == NULL OR head.next == NULL: RETURN NULL\n    curr = head\n    WHILE curr.next.next != NULL:\n        curr = curr.next\n    curr.next = NULL\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        DLL_INSERT_FRONT: {
            description: '<p>Insert a node before head in a doubly linked list; fix both next and prev pointers.</p>',
            pseudocode: `FUNCTION dllInsertFront(head, x):\n    node = NEW Node(x)\n    node.next = head\n    node.prev = NULL\n    IF head != NULL: head.prev = node\n    RETURN node`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(1)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        DLL_INSERT_END: {
            description: '<p>Traverse to the end and append; fix prev/next pointers.</p>',
            pseudocode: `FUNCTION dllInsertEnd(head, x):\n    node = NEW Node(x)\n    node.next = NULL\n    IF head == NULL: node.prev = NULL; RETURN node\n    curr = head\n    WHILE curr.next != NULL: curr = curr.next\n    curr.next = node\n    node.prev = curr\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        DLL_DELETE_LAST: {
            description: '<p>Remove the last node by moving to the tail and updating previous node’s next to NULL.</p>',
            pseudocode: `FUNCTION dllDeleteLast(head):\n    IF head == NULL: RETURN NULL\n    IF head.next == NULL: RETURN NULL\n    curr = head\n    WHILE curr.next != NULL: curr = curr.next\n    curr.prev.next = NULL\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        DLL_DELETE_BEFORE: {
            description: '<p>Delete the node immediately before a given 1-indexed position; adjust neighbors’ pointers.</p>',
            pseudocode: `FUNCTION dllDeleteBefore(head, pos):\n    IF pos <= 1: RETURN head\n    curr = head; i = 1\n    WHILE curr != NULL AND i < pos: curr = curr.next; i++\n    toDel = curr.prev\n    IF toDel == NULL: RETURN head\n    IF toDel.prev != NULL: toDel.prev.next = curr ELSE head = curr\n    curr.prev = toDel.prev\n    FREE toDel\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        CLL_INSERT_END: {
            description: '<p>Insert at the end (before head) in a circular list by updating last pointer links.</p>',
            pseudocode: `FUNCTION cllInsertEnd(last, x):\n    node = NEW Node(x)\n    IF last == NULL: node.next = node; RETURN node\n    node.next = last.next\n    last.next = node\n    RETURN node`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(1)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        CLL_INSERT_BEFORE: {
            description: '<p>Insert a node before 1-indexed position by finding predecessor and re-linking in the circle.</p>',
            pseudocode: `FUNCTION cllInsertBefore(head, pos, x):\n    node = NEW Node(x)\n    IF head == NULL: node.next = node; RETURN node\n    curr = head; count = 1\n    WHILE count < pos: curr = curr.next; count++\n    prev = head\n    WHILE prev.next != curr: prev = prev.next\n    node.next = curr\n    prev.next = node\n    IF pos == 1: head = node\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        CLL_DELETE_FIRST: {
            description: '<p>Remove the head node; update last.next to the new head.</p>',
            pseudocode: `FUNCTION cllDeleteFirst(head):\n    IF head == NULL: RETURN NULL\n    IF head.next == head: RETURN NULL\n    last = head\n    WHILE last.next != head: last = last.next\n    head = head.next\n    last.next = head\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        CLL_DELETE_AFTER: {
            description: '<p>Delete the node after a given 1-indexed position by re-linking around it.</p>',
            pseudocode: `FUNCTION cllDeleteAfter(head, pos):\n    IF head == NULL: RETURN head\n    curr = head; count = 1\n    WHILE count < pos: curr = curr.next; count++\n    toDel = curr.next\n    IF toDel == head: RETURN head\n    curr.next = toDel.next\n    RETURN head`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        LINEAR_SEARCH: {
            description: '<p>Linear search sequentially checks each element in the array until the target is found or the end is reached.</p>',
            pseudocode: `FUNCTION linearSearch(arr, n, target):
    FOR i = 0 TO n-1:
        IF arr[i] == target:
            RETURN i
    RETURN -1`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(n) - Worst case</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        },
        BINARY_SEARCH: {
            description: '<p>Binary search works on sorted arrays by repeatedly dividing the search interval in half.</p>',
            pseudocode: `FUNCTION binarySearch(arr, n, target):
    left = 0, right = n-1
    WHILE left <= right:
        mid = (left + right) / 2
        IF arr[mid] == target:
            RETURN mid
        ELSE IF arr[mid] < target:
            left = mid + 1
        ELSE:
            right = mid - 1
    RETURN -1`,
            complexity: '<div class="complexity-item"><strong>Time Complexity:</strong> O(log n)</div><div class="complexity-item"><strong>Space Complexity:</strong> O(1)</div>'
        }
    };
    
    // Default explanation if not found
    const defaultExp = {
        description: '<p>Algorithm explanation not available. Please refer to the C code for implementation details.</p>',
        pseudocode: '// Pseudocode not available',
        complexity: '<div class="complexity-item">Complexity analysis not available</div>'
    };
    
    return explanations[experimentId] || defaultExp;
}

// Get practice tests for experiment
function getPracticeTests(experimentId) {
    const tests = {
        ARRAY_MAX: [
            { input: { array: [3, 7, 2, 9, 1] }, expected: { max: 9, maxIndex: 3 } },
            { input: { array: [10, 5, 8, 15, 3] }, expected: { max: 15, maxIndex: 3 } }
        ],
        ARRAY_SUM_AVG: [
            { input: { array: [10, 20, 30] }, expected: { sum: 60, avg: 20 } },
            { input: { array: [5, 10, 15, 20] }, expected: { sum: 50, avg: 12.5 } }
        ],
        ARRAY_INSERT: [
            { input: { array: [1, 2, 4, 5], element: 3, position: 2 }, expected: [1, 2, 3, 4, 5] },
            { input: { array: [10, 20, 30], element: 5, position: 0 }, expected: [5, 10, 20, 30] }
        ],
        ARRAY_DELETE: [
            { input: { array: [1, 2, 3, 4, 5], position: 2 }, expected: [1, 2, 4, 5] },
            { input: { array: [10, 20, 30, 40], position: 0 }, expected: [20, 30, 40] }
        ],
        BUBBLE_SORT: [
            { input: { array: [64, 34, 25, 12, 22] }, expected: [12, 22, 25, 34, 64] },
            { input: { array: [5, 2, 8, 1, 9] }, expected: [1, 2, 5, 8, 9] }
        ],
        LINEAR_SEARCH: [
            { input: { array: [5, 2, 8, 1, 9], target: 8 }, expected: 2 },
            { input: { array: [10, 20, 30], target: 25 }, expected: -1 }
        ],
        BINARY_SEARCH: [
            { input: { array: [1, 3, 5, 7, 9], target: 7 }, expected: 3 },
            { input: { array: [1, 3, 5, 7, 9], target: 4 }, expected: -1 }
        ],
        NAIVE_PATTERN: [
            { input: { text: 'ABABDABACDABABCABCAB', pattern: 'ABABCABCAB' }, expected: [10] },
            { input: { text: 'AAAAA', pattern: 'AAA' }, expected: [0,1,2] }
        ],
        KMP_PATTERN: [
            { input: { text: 'ABABDABACDABABCABCAB', pattern: 'ABABCABCAB' }, expected: [10] },
            { input: { text: 'ABC ABCDAB ABCDABCDABDE', pattern: 'ABCDABD' }, expected: [15] }
        ],
        SLL_TRAVERSE: [
            { input: { array: [1, 2, 3, 4] }, expected: [1, 2, 3, 4] },
            { input: { array: [] }, expected: [] }
        ],
        SLL_INSERT_FRONT: [
            { input: { array: [2, 3], element: 1 }, expected: [1, 2, 3] },
            { input: { array: [], element: 5 }, expected: [5] }
        ],
        SLL_DELETE_LAST: [
            { input: { array: [1, 2, 3] }, expected: [1, 2] },
            { input: { array: [10] }, expected: [] }
        ],
        DLL_INSERT_FRONT: [
            { input: { array: [2, 3], element: 1 }, expected: [1, 2, 3] },
            { input: { array: [], element: 7 }, expected: [7] }
        ],
        DLL_INSERT_END: [
            { input: { array: [1, 2], element: 3 }, expected: [1, 2, 3] },
            { input: { array: [], element: 4 }, expected: [4] }
        ],
        DLL_DELETE_LAST: [
            { input: { array: [1, 2, 3] }, expected: [1, 2] },
            { input: { array: [5] }, expected: [] }
        ],
        DLL_DELETE_BEFORE: [
            { input: { array: [10, 20, 30, 40], position: 3 }, expected: [10, 30, 40] },
            { input: { array: [1, 2, 3, 4, 5], position: 5 }, expected: [1, 2, 4, 5] }
        ],
        CLL_INSERT_END: [
            { input: { array: [1, 2], element: 3 }, expected: [1, 2, 3] },
            { input: { array: [], element: 5 }, expected: [5] }
        ],
        CLL_INSERT_BEFORE: [
            { input: { array: [10, 20, 30], element: 15, position: 2 }, expected: [10, 15, 20, 30] },
            { input: { array: [1, 2, 3], element: 0, position: 1 }, expected: [0, 1, 2, 3] }
        ],
        CLL_DELETE_FIRST: [
            { input: { array: [1, 2, 3] }, expected: [2, 3] },
            { input: { array: [7] }, expected: [] }
        ],
        CLL_DELETE_AFTER: [
            { input: { array: [1, 2, 3, 4], position: 2 }, expected: [1, 2, 4] },
            { input: { array: [10, 20, 30], position: 1 }, expected: [10, 30] }
        ]
    };
    
    return tests[experimentId] || [];
}

// Copy code button
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copy-code-btn');
    const toggleBtn = document.getElementById('toggle-highlight-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('c-code-display').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Code';
                }, 2000);
            });
        });
    }
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            codeHighlightEnabled = !codeHighlightEnabled;
            // If we are on experiment page, re-render current code
            const urlParams = new URLSearchParams(window.location.search);
            const experimentId = urlParams.get('id');
            if (experimentId) {
                loadCCode(experimentId);
            }
            toggleBtn.textContent = codeHighlightEnabled ? 'Toggle Highlight' : 'Show Highlight';
        });
    }
    
    // Initialize based on page
    if (document.getElementById('experiments-grid')) {
        initDashboard();
    }
    initThemeToggle();
});

