// Array Visualizer for arrays, search, and sorting algorithms

const ArrayVisualizer = {
    container: null,
    elements: [],
    currentState: null,
    
    init(container) {
        this.container = container;
        this.elements = [];
        this.currentState = null;
    },
    
    render(array, options = {}) {
        if (!this.container) return;
        if (!array || !Array.isArray(array)) {
            this.container.innerHTML = '<p style="color: #7f8c8d;">Enter array values to visualize</p>';
            return;
        }
        
        this.container.innerHTML = '';
        this.elements = [];
        
        const arrayDiv = document.createElement('div');
        arrayDiv.className = 'array-visualizer';
        
        array.forEach((value, index) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'array-element';
            elementDiv.id = `array-elem-${index}`;
            
            // Value span (main content)
            const valueSpan = document.createElement('span');
            valueSpan.textContent = value;
            valueSpan.style.display = 'block';
            elementDiv.appendChild(valueSpan);
            
            // Index span (below value)
            const indexSpan = document.createElement('span');
            indexSpan.className = 'index';
            indexSpan.textContent = index;
            elementDiv.appendChild(indexSpan);
            
            arrayDiv.appendChild(elementDiv);
            this.elements.push(elementDiv);
        });
        
        this.container.appendChild(arrayDiv);
        this.currentState = [...array]; // Store copy
        
        // Apply initial highlights if provided
        if (options.highlight) {
            this.highlight(options.highlight.indices, options.highlight.type);
        }
    },
    
    update(array, options = {}) {
        if (!array || !Array.isArray(array) || array.length === 0) {
            return;
        }
        
        // If state doesn't exist or length changed, render fresh
        if (!this.currentState || array.length !== this.currentState.length) {
            this.render(array, options);
            return;
        }
        
        // Update values - find the first span (value span), not index span
        array.forEach((value, index) => {
            if (this.elements[index]) {
                const spans = this.elements[index].querySelectorAll('span');
                // First span is the value, second is the index
                if (spans.length >= 1) {
                    spans[0].textContent = value;
                }
            }
        });
        
        this.currentState = [...array]; // Store copy
        
        // Apply highlights
        if (options.highlight) {
            this.highlight(options.highlight.indices, options.highlight.type);
        }
    },
    
    highlight(indices, type = 'active') {
        // Clear all highlights first
        this.elements.forEach(el => {
            el.classList.remove('active', 'comparing', 'swapped', 'sorted');
        });
        
        // Apply highlights
        if (Array.isArray(indices)) {
            indices.forEach(index => {
                if (this.elements[index]) {
                    this.elements[index].classList.add(type);
                }
            });
        } else if (typeof indices === 'number') {
            if (this.elements[indices]) {
                this.elements[indices].classList.add(type);
            }
        }
    },
    
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.elements = [];
        this.currentState = null;
    },
    
    swap(i, j) {
        if (!this.currentState || i >= this.currentState.length || j >= this.currentState.length) {
            return;
        }
        
        // Swap in state
        [this.currentState[i], this.currentState[j]] = [this.currentState[j], this.currentState[i]];
        
        // Update visual
        const temp = this.elements[i].querySelector('span').textContent;
        this.elements[i].querySelector('span').textContent = this.elements[j].querySelector('span').textContent;
        this.elements[j].querySelector('span').textContent = temp;
        
        // Highlight swapped elements
        this.highlight([i, j], 'swapped');
    }
};

