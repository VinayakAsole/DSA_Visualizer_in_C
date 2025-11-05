// Linked List Visualizer for singly, doubly, and circular linked lists

const LinkedListVisualizer = {
    container: null,
    nodes: [],
    currentList: null,
    listType: 'singly', // singly, doubly, circular
    
    init(container) {
        this.container = container;
        this.nodes = [];
        this.currentList = null;
    },
    
    render(list, type = 'singly') {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.nodes = [];
        this.currentList = list;
        this.listType = type;
        
        const listDiv = document.createElement('div');
        listDiv.className = 'linkedlist-visualizer';
        
        if (!list || list.length === 0) {
            listDiv.innerHTML = '<p>Empty list</p>';
            this.container.appendChild(listDiv);
            return;
        }
        
        list.forEach((value, index) => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'list-node';
            nodeDiv.id = `list-node-${index}`;
            
            // Node box
            const nodeBox = document.createElement('div');
            nodeBox.className = 'node-box';
            nodeBox.textContent = value;
            nodeDiv.appendChild(nodeBox);
            
            // Arrow (unless last node in non-circular list)
            if (index < list.length - 1 || type === 'circular') {
                const arrow = document.createElement('span');
                arrow.className = 'arrow';
                arrow.textContent = type === 'doubly' ? '⇄' : '→';
                nodeDiv.appendChild(arrow);
            }
            
            // Circular indicator
            if (type === 'circular' && index === list.length - 1) {
                const circularArrow = document.createElement('span');
                circularArrow.className = 'arrow';
                circularArrow.textContent = '→';
                nodeDiv.appendChild(circularArrow);
                const circularLabel = document.createElement('span');
                circularLabel.textContent = ' (back to start)';
                circularLabel.style.fontSize = '0.8rem';
                circularLabel.style.color = '#7f8c8d';
                nodeDiv.appendChild(circularLabel);
            }
            
            listDiv.appendChild(nodeDiv);
            this.nodes.push(nodeDiv);
        });
        
        this.container.appendChild(listDiv);
    },
    
    highlight(indices, type = 'active') {
        this.nodes.forEach(node => {
            const nodeBox = node.querySelector('.node-box');
            if (nodeBox) {
                nodeBox.classList.remove('active', 'comparing', 'swapped');
            }
        });
        
        if (Array.isArray(indices)) {
            indices.forEach(index => {
                if (this.nodes[index]) {
                    const nodeBox = this.nodes[index].querySelector('.node-box');
                    if (nodeBox) {
                        nodeBox.classList.add(type);
                    }
                }
            });
        } else if (typeof indices === 'number') {
            if (this.nodes[indices]) {
                const nodeBox = this.nodes[indices].querySelector('.node-box');
                if (nodeBox) {
                    nodeBox.classList.add(type);
                }
            }
        }
    },
    
    update(list, type = null) {
        if (type) {
            this.listType = type;
        }
        this.render(list, this.listType);
    },
    
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.nodes = [];
        this.currentList = null;
    }
};

