// Main Application Controller

class TodoApp {
  constructor() {
    this.currentFilter = CONFIG.FILTERS.ALL;
    this.currentSort = 'date';
    this.searchQuery = '';
    this.editingTaskId = null;
    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.restoreSettings();
    this.render();
  }

  cacheDOM() {
    // Input elements
    this.taskInput = document.getElementById('taskInput');
    this.categorySelect = document.getElementById('categorySelect');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.dueDateInput = document.getElementById('dueDateInput');
    this.addBtn = document.getElementById('addBtn');

    // Buttons
    this.searchBtn = document.getElementById('searchBtn');
    this.settingsBtn = document.getElementById('settingsBtn');
    this.darkModeBtn = document.getElementById('darkModeBtn');

    // Sections
    this.tasksList = document.getElementById('tasksList');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.searchContainer = document.querySelector('.search-container');
    this.searchInput = document.getElementById('searchInput');
    this.closeSearchBtn = document.getElementById('closeSearchBtn');

    // Statistics
    this.totalTasksEl = document.getElementById('totalTasks');
    this.completedTasksEl = document.getElementById('completedTasks');
    this.pendingTasksEl = document.getElementById('pendingTasks');
    this.completionPercentEl = document.getElementById('completionPercent');

    // Modals
    this.settingsModal = document.getElementById('settingsModal');
    this.editModal = document.getElementById('editModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.closeEditBtn = document.getElementById('closeEditBtn');

    // Settings
    this.sortSelect = document.getElementById('sortSelect');
    this.exportBtn = document.getElementById('exportBtn');
    this.importBtn = document.getElementById('importBtn');
    this.importInput = document.getElementById('importInput');
    this.clearAllBtn = document.getElementById('clearAllBtn');

    // Edit modal inputs
    this.editTaskTitle = document.getElementById('editTaskTitle');
    this.editTaskDescription = document.getElementById('editTaskDescription');
    this.editCategorySelect = document.getElementById('editCategorySelect');
    this.editPrioritySelect = document.getElementById('editPrioritySelect');
    this.editDueDateInput = document.getElementById('editDueDateInput');
    this.saveEditBtn = document.getElementById('saveEditBtn');
    this.cancelEditBtn = document.getElementById('cancelEditBtn');

    // Notification
    this.notification = document.getElementById('notification');
  }

  bindEvents() {
    // Add task
    this.addBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    // Search
    this.searchBtn.addEventListener('click', () => this.toggleSearch());
    this.closeSearchBtn.addEventListener('click', () => this.toggleSearch());
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.render();
    });

    // Settings
    this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
    this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    this.darkModeBtn.addEventListener('click', () => this.toggleDarkMode());

    // Filters
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
    });

    // Sort
    this.sortSelect.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      storage.updateSettings({ sortBy: this.currentSort });
      this.render();
    });

    // Export/Import
    this.exportBtn.addEventListener('click', () => this.exportTasks());
    this.importBtn.addEventListener('click', () => this.importInput.click());
    this.importInput.addEventListener('change', (e) => this.importTasks(e));

    // Clear all
    this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());

    // Edit modal
    this.saveEditBtn.addEventListener('click', () => this.saveEdit());
    this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
    this.closeEditBtn.addEventListener('click', () => this.closeEditModal());

    // Close modals on outside click
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.closeSettingsModal();
    });
    this.editModal.addEventListener('click', (e) => {
      if (e.target === this.editModal) this.closeEditModal();
    });
  }

  addTask() {
    const title = this.taskInput.value.trim();
    if (!title) {
      this.showNotification('Please enter a task title', 'warning');
      return;
    }

    const task = {
      title,
      category: this.categorySelect.value,
      priority: this.prioritySelect.value || 'medium',
      dueDate: this.dueDateInput.value
    };

    storage.addTask(task);
    this.taskInput.value = '';
    this.categorySelect.value = '';
    this.prioritySelect.value = '';
    this.dueDateInput.value = '';

    this.showNotification('Task added successfully!', 'success');
    this.render();
  }

  deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      storage.deleteTask(taskId);
      this.showNotification('Task deleted', 'success');
      this.render();
    }
  }

  toggleTaskCompletion(taskId) {
    storage.toggleTaskCompletion(taskId);
    this.render();
  }

  openEditModal(taskId) {
    this.editingTaskId = taskId;
    const tasks = storage.getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      this.editTaskTitle.value = task.title;
      this.editTaskDescription.value = task.description;
      this.editCategorySelect.value = task.category;
      this.editPrioritySelect.value = task.priority;
      this.editDueDateInput.value = task.dueDate;
      this.editModal.classList.remove('hidden');
    }
  }

  closeEditModal() {
    this.editModal.classList.add('hidden');
    this.editingTaskId = null;
  }

  saveEdit() {
    const title = this.editTaskTitle.value.trim();
    if (!title) {
      this.showNotification('Task title cannot be empty', 'warning');
      return;
    }

    storage.updateTask(this.editingTaskId, {
      title,
      description: this.editTaskDescription.value,
      category: this.editCategorySelect.value,
      priority: this.editPrioritySelect.value,
      dueDate: this.editDueDateInput.value
    });

    this.showNotification('Task updated successfully!', 'success');
    this.closeEditModal();
    this.render();
  }

  setFilter(filterType) {
    this.currentFilter = filterType;
    storage.updateSettings({ filterBy: filterType });
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filterType}"]`).classList.add('active');
    this.render();
  }

  toggleSearch() {
    this.searchContainer.classList.toggle('hidden');
    if (!this.searchContainer.classList.contains('hidden')) {
      this.searchInput.focus();
    } else {
      this.searchQuery = '';
      this.searchInput.value = '';
      this.render();
    }
  }

  openSettingsModal() {
    this.settingsModal.classList.remove('hidden');
    this.sortSelect.value = this.currentSort;
  }

  closeSettingsModal() {
    this.settingsModal.classList.add('hidden');
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    storage.updateSettings({ darkMode: isDarkMode });
  }

  exportTasks() {
    const data = storage.exportTasks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.showNotification('Tasks exported successfully!', 'success');
  }

  importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (storage.importTasks(e.target.result)) {
          this.showNotification('Tasks imported successfully!', 'success');
          this.render();
        } else {
          this.showNotification('Invalid file format', 'error');
        }
      } catch (error) {
        this.showNotification('Error importing tasks', 'error');
      }
    };
    reader.readAsText(file);
    this.importInput.value = '';
  }

  clearAllTasks() {
    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
      storage.clearAllTasks();
      this.showNotification('All tasks cleared', 'success');
      this.render();
    }
  }

  restoreSettings() {
    const settings = storage.getSettings();
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    }
    this.currentSort = settings.sortBy || 'date';
    this.currentFilter = settings.filterBy || CONFIG.FILTERS.ALL;
  }

  getTasks() {
    let tasks = storage.getTasks();

    // Apply search
    if (this.searchQuery) {
      tasks = storage.searchTasks(this.searchQuery);
    }

    // Apply filter
    tasks = storage.getTasksByFilter(this.currentFilter);
    if (this.searchQuery) {
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Apply sort
    tasks = storage.sortTasks(tasks, this.currentSort);

    return tasks;
  }

  render() {
    this.updateStats();
    this.renderTasks();
  }

  updateStats() {
    const stats = storage.getTaskStats();
    this.totalTasksEl.textContent = stats.total;
    this.completedTasksEl.textContent = stats.completed;
    this.pendingTasksEl.textContent = stats.pending;
    this.completionPercentEl.textContent = stats.percentage + '%';
  }

  renderTasks() {
    const tasks = this.getTasks();
    const today = new Date().toDateString();

    if (tasks.length === 0) {
      this.tasksList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No tasks found. Add one to get started! 🚀</p>
        </div>
      `;
      return;
    }

    this.tasksList.innerHTML = tasks.map(task => {
      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(today) && !task.completed;
      return `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                 data-task-id="${task.id}">
          <div class="task-content">
            <div class="task-title">${this.escapeHtml(task.title)}</div>
            <div class="task-meta">
              ${task.category ? `<span class="task-badge category"><i class="fas fa-tag"></i> ${task.category}</span>` : ''}
              ${task.priority ? `<span class="task-badge priority-${task.priority}"><i class="fas fa-exclamation-circle"></i> ${task.priority}</span>` : ''}
              ${task.dueDate ? `<span class="task-badge ${isOverdue ? 'overdue' : 'due-date'}"><i class="fas fa-calendar"></i> ${this.formatDate(task.dueDate)}</span>` : ''}
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-task edit" data-task-id="${task.id}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-task delete" data-task-id="${task.id}" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind checkbox events
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.toggleTaskCompletion(e.target.dataset.taskId);
      });
    });

    // Bind edit button events
    document.querySelectorAll('.btn-task.edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.openEditModal(e.target.closest('button').dataset.taskId);
      });
    });

    // Bind delete button events
    document.querySelectorAll('.btn-task.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.deleteTask(e.target.closest('button').dataset.taskId);
      });
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(CONFIG.DATE_FORMAT, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  showNotification(message, type = 'info') {
    this.notification.textContent = message;
    this.notification.className = `notification ${type}`;
    this.notification.classList.remove('hidden');

    setTimeout(() => {
      this.notification.classList.add('hidden');
    }, CONFIG.TOAST_TIMEOUT);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
  });
} else {
  window.app = new TodoApp();
}
