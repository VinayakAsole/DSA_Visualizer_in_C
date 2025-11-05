// Stepper engine for step-by-step algorithm execution

// Helper function to create delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Stepper {
    constructor(algorithmFn, inputs, experiment, visualizer) {
        this.algorithmFn = algorithmFn;
        this.inputs = inputs;
        this.experiment = experiment;
        this.visualizer = visualizer;
        this.steps = [];
        this.currentStep = 0;
        this.stepCounter = 0; // Counter for log messages
        this.isRunning = false;
        this.autoInterval = null;
        this.stepDelay = 500; // Default delay between steps in ms
        this.isPaused = false;
        this.shouldStep = false; // For step-by-step mode
        this.metrics = { steps: 0, comparisons: 0, swaps: 0 };
    }
    
    // Run algorithm with step-by-step visualization
    async run() {
        this.steps = [];
        this.currentStep = 0;
        this.stepCounter = 0; // Reset step counter
        this.stop(); // Stop any auto-play
        this.isPaused = false;
        this.shouldStep = false;
        this.stepDelay = 800; // Fast auto execution
        this.metrics = { steps: 0, comparisons: 0, swaps: 0 };
        
        // Clear output log
        const outputLog = document.getElementById('output-log');
        if (outputLog) {
            outputLog.innerHTML = '';
        }
        
        // Ensure visualizer is initialized and shows initial state
        if (this.visualizer && this.visualizer.init) {
            const visualizerArea = document.getElementById('visualizer-area');
            if (visualizerArea && !this.visualizer.container) {
                this.visualizer.init(visualizerArea);
            }
        }
        
        // Render initial state immediately
        this.renderInitialState();
        await sleep(300); // Brief pause to show initial state
        
        // Wrap algorithm and execute with delays
        const wrappedFn = this.wrapAlgorithm(this.algorithmFn);
        await wrappedFn(this.inputs);
    }
    
    // Render initial state
    renderInitialState() {
        if (!this.visualizer) return;
        
        const experiment = this.experiment;
        const inputs = this.inputs;
        
        if (experiment.type === 'array' || experiment.type === 'search' || experiment.type === 'sort') {
            if (inputs.array && inputs.array.length > 0) {
                this.visualizer.render(inputs.array);
            }
        } else if (experiment.type === 'linkedlist') {
            if (inputs.array && inputs.array.length > 0) {
                const listType = experiment.id.includes('DLL') ? 'doubly' : 
                                 experiment.id.includes('CLL') ? 'circular' : 'singly';
                this.visualizer.render(inputs.array, listType);
            }
        } else if (experiment.type === 'pattern') {
            if (inputs.text && inputs.pattern) {
                this.visualizer.render(inputs.text, inputs.pattern);
            }
        }
    }
    
    // Step forward - execute one step at a time
    async step() {
        this.stop(); // Stop any auto-play
        
        // Ensure visualizer is initialized
        if (this.visualizer && this.visualizer.init) {
            const visualizerArea = document.getElementById('visualizer-area');
            if (visualizerArea && !this.visualizer.container) {
                this.visualizer.init(visualizerArea);
            }
        }
        
        // Render initial state on first step
        if (this.currentStep === 0 && this.steps.length === 0) {
            this.stepCounter = 0; // Reset step counter
            // Clear output log
            const outputLog = document.getElementById('output-log');
            if (outputLog) {
                outputLog.innerHTML = '';
            }
            this.renderInitialState();
            await sleep(200);
        }
        
        // Enable step-by-step mode
        this.shouldStep = true;
        this.isPaused = false;
        
        // If algorithm hasn't started, begin execution
        if (this.steps.length === 0) {
            const wrappedFn = this.wrapAlgorithm(this.algorithmFn);
            // Start execution but it will pause after each step
            wrappedFn(this.inputs).then(() => {
                // Algorithm completed
                this.shouldStep = false;
                this.isPaused = false;
                const stepBtn = document.getElementById('step-btn');
                if (stepBtn) {
                    stepBtn.textContent = '⏭ Step';
                }
            }).catch(err => {
                console.error('Algorithm error:', err);
                this.shouldStep = false;
                this.isPaused = false;
            });
        } else {
            // Continue from where we paused
            this.isPaused = false;
        }
    }
    
    // Step backward
    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            // Re-execute from beginning to current step
            this.reset();
            for (let i = 0; i < this.currentStep; i++) {
                this.executeStep(i);
            }
        }
    }
    
    // Auto play - run with automatic stepping
    async auto(speed = 1) {
        if (this.isRunning) {
            this.stop();
            return;
        }
        
        this.shouldStep = false;
        this.isPaused = false;
        this.stepCounter = 0; // Reset step counter
        this.stepDelay = 2000 / speed; // Speed-based delay
        this.metrics = { steps: 0, comparisons: 0, swaps: 0 };
        
        // Clear output log
        const outputLog = document.getElementById('output-log');
        if (outputLog) {
            outputLog.innerHTML = '';
        }
        
        // Ensure visualizer is initialized
        if (this.visualizer && this.visualizer.init) {
            const visualizerArea = document.getElementById('visualizer-area');
            if (visualizerArea && !this.visualizer.container) {
                this.visualizer.init(visualizerArea);
            }
        }
        
        // Render initial state
        this.renderInitialState();
        await sleep(300);
        
        this.isRunning = true;
        
        // Run algorithm with automatic delays
        const wrappedFn = this.wrapAlgorithm(this.algorithmFn);
        await wrappedFn(this.inputs);
        
        this.isRunning = false;
    }
    
    // Stop auto play
    stop() {
        this.isRunning = false;
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }
    
    // Reset
    reset() {
        this.stop();
        this.steps = [];
        this.currentStep = 0;
        this.stepCounter = 0; // Reset step counter
        this.isPaused = false;
        this.shouldStep = false;
        if (this.visualizer) {
            this.visualizer.clear();
        }
        const outputLog = document.getElementById('output-log');
        if (outputLog) {
            outputLog.innerHTML = '';
        }
        const mS = document.getElementById('metric-steps');
        const mC = document.getElementById('metric-comparisons');
        const mW = document.getElementById('metric-swaps');
        if (mS) mS.textContent = '0';
        if (mC) mC.textContent = '0';
        if (mW) mW.textContent = '0';
        // Reset button text
        const stepBtn = document.getElementById('step-btn');
        if (stepBtn) {
            stepBtn.textContent = '⏭ Step';
        }
    }
    
    // Wrap algorithm to capture steps with async support
    wrapAlgorithm(algorithmFn) {
        const self = this;
        return async function(inputs) {
            // Create step context with async methods
            const stepContext = {
                state: {},
                log: async (message) => {
                    // Always honor pause
                    while (self.isPaused) { await sleep(50); }
                    self.log(message);
                    self.metrics.steps++;
                    self.updateMetricsUI();
                    // Wait if in step mode
                    if (self.shouldStep) {
                        self.isPaused = true;
                        // Wait for user to click step again
                        while (self.isPaused && self.shouldStep) {
                            await sleep(50);
                        }
                    } else {
                        await sleep(self.stepDelay);
                    }
                },
                highlight: async (indices, type) => {
                    while (self.isPaused) { await sleep(50); }
                    self.highlight(indices, type);
                    if (type === 'comparing') {
                        self.metrics.comparisons++;
                        self.updateMetricsUI();
                    } else if (type === 'swapped') {
                        self.metrics.swaps++;
                        self.updateMetricsUI();
                    }
                    if (self.shouldStep) {
                        self.isPaused = true;
                        while (self.isPaused && self.shouldStep) {
                            await sleep(50);
                        }
                    } else {
                        await sleep(self.stepDelay);
                    }
                },
                highlightMatch: async (textStart, patternLength, type) => {
                    while (self.isPaused) { await sleep(50); }
                    self.highlightMatch(textStart, patternLength, type);
                    if (self.shouldStep) {
                        self.isPaused = true;
                        while (self.isPaused && self.shouldStep) {
                            await sleep(50);
                        }
                    } else {
                        await sleep(self.stepDelay);
                    }
                },
                highlightComparison: async (textIndex, patternIndex, type) => {
                    while (self.isPaused) { await sleep(50); }
                    self.highlightComparison(textIndex, patternIndex, type);
                    if (type === 'comparing') {
                        self.metrics.comparisons++;
                        self.updateMetricsUI();
                    }
                    if (self.shouldStep) {
                        self.isPaused = true;
                        while (self.isPaused && self.shouldStep) {
                            await sleep(50);
                        }
                    } else {
                        await sleep(self.stepDelay);
                    }
                },
                update: async (data) => {
                    while (self.isPaused) { await sleep(50); }
                    self.updateVisualization(data);
                    if (self.shouldStep) {
                        self.isPaused = true;
                        while (self.isPaused && self.shouldStep) {
                            await sleep(50);
                        }
                    } else {
                        await sleep(self.stepDelay);
                    }
                },
                wait: async (ms) => {
                    const delay = ms || self.stepDelay;
                    let waited = 0;
                    // Sleep in small chunks to honor pause rapidly
                    while (waited < delay) {
                        if (self.isPaused) {
                            while (self.isPaused) { await sleep(50); }
                        }
                        const chunk = Math.min(50, delay - waited);
                        await sleep(chunk);
                        waited += chunk;
                    }
                }
            };
            
            return await algorithmFn(inputs, stepContext);
        };
    }
    
    // Execute all steps
    executeSteps() {
        this.steps.forEach((step, index) => {
            this.executeStep(index);
        });
    }
    
    // Execute a single step
    executeStep(stepIndex) {
        if (stepIndex >= this.steps.length) return;
        
        const step = this.steps[stepIndex];
        
        // Update visualization
        if (step.visualization) {
            this.updateVisualization(step.visualization);
        }
        
        // Log message
        if (step.message) {
            this.log(step.message);
        }
        
        // Highlight elements
        if (step.highlight) {
            this.highlight(step.highlight.indices, step.highlight.type);
        }
    }
    
    // Add step
    addStep(step) {
        this.steps.push(step);
    }
    
    // Log message
    log(message) {
        this.stepCounter++; // Increment step counter for each log
        const outputLog = document.getElementById('output-log');
        if (outputLog) {
            const logEntry = document.createElement('div');
            logEntry.textContent = `[Step ${this.stepCounter}] ${message}`;
            outputLog.appendChild(logEntry);
            outputLog.scrollTop = outputLog.scrollHeight;
        }
    }
    
    // Highlight elements
    highlight(indices, type) {
        if (this.visualizer && this.visualizer.highlight) {
            this.visualizer.highlight(indices, type);
        }
    }
    
    // Highlight match for pattern matching
    highlightMatch(textStart, patternLength, type) {
        if (this.visualizer && this.visualizer.highlightMatch) {
            this.visualizer.highlightMatch(textStart, patternLength, type);
        }
    }
    
    // Highlight comparison for pattern matching
    highlightComparison(textIndex, patternIndex, type) {
        if (this.visualizer && this.visualizer.highlightComparison) {
            this.visualizer.highlightComparison(textIndex, patternIndex, type);
        }
    }
    
    // Update visualization
    updateVisualization(data) {
        if (!this.visualizer) return;
        
        // Ensure visualizer is initialized
        if (!this.visualizer.container) {
            const visualizerArea = document.getElementById('visualizer-area');
            if (visualizerArea && this.visualizer.init) {
                this.visualizer.init(visualizerArea);
            }
        }
        
        if (data.array !== undefined && Array.isArray(data.array)) {
            if (this.visualizer.update) {
                this.visualizer.update(data.array, data);
            } else if (this.visualizer.render) {
                this.visualizer.render(data.array, data);
            }
        } else if (data.list !== undefined && Array.isArray(data.list)) {
            if (this.visualizer.update) {
                this.visualizer.update(data.list, data.type || 'singly');
            } else if (this.visualizer.render) {
                this.visualizer.render(data.list, data.type || 'singly');
            }
        } else if (data.text !== undefined && data.pattern !== undefined) {
            if (this.visualizer.update) {
                this.visualizer.update(data);
            } else if (this.visualizer.render) {
                this.visualizer.render(data.text, data.pattern);
            }
        }
    }

    pauseResume() {
        if (this.shouldStep || this.isRunning) {
            this.isPaused = !this.isPaused;
        }
    }

    updateMetricsUI() {
        const mS = document.getElementById('metric-steps');
        const mC = document.getElementById('metric-comparisons');
        const mW = document.getElementById('metric-swaps');
        if (mS) mS.textContent = String(this.metrics.steps);
        if (mC) mC.textContent = String(this.metrics.comparisons);
        if (mW) mW.textContent = String(this.metrics.swaps);
    }
}

// Create stepper instance
function createStepper(algorithmFn, inputs, experiment) {
    const visualizer = getVisualizer(experiment.type);
    const stepper = new Stepper(algorithmFn, inputs, experiment, visualizer);
    
    // Initialize visualizer with initial state
    if (visualizer && visualizer.init) {
        const visualizerArea = document.getElementById('visualizer-area');
        if (visualizerArea) {
            visualizer.init(visualizerArea);
            
            // Render initial state based on experiment type
            if (experiment.type === 'array' || experiment.type === 'search' || experiment.type === 'sort') {
                if (inputs.array && Array.isArray(inputs.array) && inputs.array.length > 0) {
                    visualizer.render(inputs.array);
                } else {
                    visualizerArea.innerHTML = '<p style="color: #7f8c8d; padding: 20px;">Enter array values (comma-separated) to visualize</p>';
                }
            } else if (experiment.type === 'linkedlist') {
                if (inputs.array && Array.isArray(inputs.array) && inputs.array.length > 0) {
                    const listType = experiment.id.includes('DLL') ? 'doubly' : 
                                     experiment.id.includes('CLL') ? 'circular' : 'singly';
                    visualizer.render(inputs.array, listType);
                } else {
                    visualizerArea.innerHTML = '<p style="color: #7f8c8d; padding: 20px;">Enter elements (comma-separated) to visualize</p>';
                }
            } else if (experiment.type === 'pattern') {
                if (inputs.text && inputs.pattern) {
                    visualizer.render(inputs.text, inputs.pattern);
                } else {
                    visualizerArea.innerHTML = '<p style="color: #7f8c8d; padding: 20px;">Enter text and pattern to visualize</p>';
                }
            }
        }
    }
    
    return stepper;
}

// Helper to get visualizer
function getVisualizer(type) {
    if (type === 'array' || type === 'search' || type === 'sort') {
        return ArrayVisualizer;
    } else if (type === 'linkedlist') {
        return LinkedListVisualizer;
    } else if (type === 'pattern') {
        return PatternVisualizer;
    }
    return ArrayVisualizer;
}

