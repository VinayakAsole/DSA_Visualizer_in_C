// Pattern Matching Visualizer for Naive and KMP algorithms

const PatternVisualizer = {
    container: null,
    textElements: [],
    patternElements: [],
    lpsElements: [],
    
    init(container) {
        this.container = container;
        this.textElements = [];
        this.patternElements = [];
    },
    
    render(text, pattern) {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.textElements = [];
        this.patternElements = [];
        this.lpsElements = [];
        
        // Text visualization
        const textSection = document.createElement('div');
        textSection.style.marginBottom = '30px';
        
        const textLabel = document.createElement('div');
        textLabel.textContent = 'Text:';
        textLabel.style.fontWeight = 'bold';
        textLabel.style.marginBottom = '10px';
        textSection.appendChild(textLabel);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'array-visualizer';
        textDiv.style.justifyContent = 'flex-start';
        
        text.split('').forEach((char, index) => {
            const charDiv = document.createElement('div');
            charDiv.className = 'array-element';
            charDiv.id = `text-char-${index}`;
            charDiv.textContent = char;
            textDiv.appendChild(charDiv);
            this.textElements.push(charDiv);
        });
        
        textSection.appendChild(textDiv);
        this.container.appendChild(textSection);
        
        // Pattern visualization
        const patternSection = document.createElement('div');
        
        const patternLabel = document.createElement('div');
        patternLabel.textContent = 'Pattern:';
        patternLabel.style.fontWeight = 'bold';
        patternLabel.style.marginBottom = '10px';
        patternSection.appendChild(patternLabel);
        
        const patternDiv = document.createElement('div');
        patternDiv.className = 'array-visualizer';
        patternDiv.style.justifyContent = 'flex-start';
        
        pattern.split('').forEach((char, index) => {
            const charDiv = document.createElement('div');
            charDiv.className = 'array-element';
            charDiv.id = `pattern-char-${index}`;
            charDiv.textContent = char;
            patternDiv.appendChild(charDiv);
            this.patternElements.push(charDiv);
        });
        
        patternSection.appendChild(patternDiv);
        this.container.appendChild(patternSection);

        // LPS visualization container (initially empty)
        const lpsSection = document.createElement('div');
        lpsSection.id = 'lps-section';
        lpsSection.style.marginTop = '20px';
        const lpsLabel = document.createElement('div');
        lpsLabel.textContent = 'LPS:';
        lpsLabel.style.fontWeight = 'bold';
        lpsLabel.style.marginBottom = '10px';
        lpsSection.appendChild(lpsLabel);
        const lpsDiv = document.createElement('div');
        lpsDiv.className = 'array-visualizer';
        lpsDiv.style.justifyContent = 'flex-start';
        lpsDiv.id = 'lps-visual';
        lpsSection.appendChild(lpsDiv);
        this.container.appendChild(lpsSection);
    },
    
    highlightMatch(textStart, patternLength, type = 'active') {
        // Clear all highlights
        this.textElements.forEach(el => el.classList.remove('active', 'comparing', 'swapped'));
        this.patternElements.forEach(el => el.classList.remove('active', 'comparing', 'swapped'));
        
        // Highlight text portion
        for (let i = textStart; i < textStart + patternLength && i < this.textElements.length; i++) {
            this.textElements[i].classList.add(type);
        }
        
        // Highlight pattern
        for (let i = 0; i < patternLength && i < this.patternElements.length; i++) {
            this.patternElements[i].classList.add(type);
        }
    },
    
    highlightComparison(textIndex, patternIndex, type = 'comparing') {
        // Clear all highlights
        this.textElements.forEach(el => el.classList.remove('active', 'comparing', 'swapped'));
        this.patternElements.forEach(el => el.classList.remove('active', 'comparing', 'swapped'));
        
        // Highlight comparing characters
        if (textIndex < this.textElements.length) {
            this.textElements[textIndex].classList.add(type);
        }
        if (patternIndex < this.patternElements.length) {
            this.patternElements[patternIndex].classList.add(type);
        }
    },
    
    highlight(indices, type) {
        // For pattern matching, this is a generic highlight method
        // Can be used for highlighting specific indices
        if (Array.isArray(indices)) {
            indices.forEach(index => {
                if (index < this.textElements.length) {
                    this.textElements[index].classList.add(type);
                }
            });
        }
    },
    
    update(data) {
        // Update visualization
        if (data.text && data.pattern) {
            this.render(data.text, data.pattern);
        }
        if (Array.isArray(data.lps)) {
            const lpsDiv = this.container && this.container.querySelector('#lps-visual');
            if (lpsDiv) {
                lpsDiv.innerHTML = '';
                this.lpsElements = [];
                data.lps.forEach((val, idx) => {
                    const el = document.createElement('div');
                    el.className = 'array-element';
                    el.textContent = val;
                    const idxSpan = document.createElement('span');
                    idxSpan.className = 'index';
                    idxSpan.textContent = idx;
                    el.appendChild(idxSpan);
                    lpsDiv.appendChild(el);
                    this.lpsElements.push(el);
                });
            }
        }
    },
    
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.textElements = [];
        this.patternElements = [];
    }
};

