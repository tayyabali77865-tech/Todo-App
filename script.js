document.addEventListener('DOMContentLoaded', () => {
    let todos = JSON.parse(localStorage.getItem('taskify-todos')) || [];
    let currentFilter = 'all';
    let editingId = null;

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const taskCount = document.getElementById('task-count');
    const currentDate = document.getElementById('current-date');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editInput = document.getElementById('edit-input');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    currentDate.textContent = new Date().toLocaleDateString('en-US', options);

    renderTodos();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        
        if (text) {
            const newTodo = {
                id: Date.now().toString(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            todos.push(newTodo);
            saveAndRender();
            input.value = '';
            
            const addBtn = document.getElementById('add-btn');
            addBtn.style.transform = 'scale(0.9)';
            setTimeout(() => addBtn.style.transform = '', 150);
        }
    });

    list.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        
        const id = item.dataset.id;

        if (e.target.closest('.checkbox-container')) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveAndRender();
            }
        }

        if (e.target.closest('.delete-btn')) {
            item.classList.add('removing');
            setTimeout(() => {
                todos = todos.filter(t => t.id !== id);
                saveAndRender();
            }, 300);
        }

        if (e.target.closest('.edit-btn')) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                editingId = id;
                editInput.value = todo.text;
                editModal.classList.remove('hidden');
                setTimeout(() => editInput.focus(), 100);
            }
        }
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newText = editInput.value.trim();
        
        if (newText && editingId) {
            const todo = todos.find(t => t.id === editingId);
            if (todo) {
                todo.text = newText;
                closeModal();
                saveAndRender();
            }
        }
    });

    cancelEditBtn.addEventListener('click', closeModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeModal();
    });

    function closeModal() {
        editModal.classList.add('hidden');
        editingId = null;
        editInput.value = '';
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    function saveAndRender() {
        localStorage.setItem('taskify-todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        list.innerHTML = '';
        
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                li.innerHTML = `
                    <label class="checkbox-container">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <span class="todo-text">${escapeHTML(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="action-btn edit-btn" aria-label="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" aria-label="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                list.appendChild(li);
            });
        }
        
        updateStats();
    }

    function updateStats() {
        const activeCount = todos.filter(t => !t.completed).length;
        if (todos.length === 0) {
            taskCount.textContent = 'No tasks';
        } else {
            taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
