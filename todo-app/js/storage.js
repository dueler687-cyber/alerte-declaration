// Local Storage Manager

class StorageManager {
  constructor(storageKey = CONFIG.STORAGE_KEY) {
    this.key = storageKey;
    this.initializeStorage();
  }

  // Initialize storage with default structure
  initializeStorage() {
    if (!this.getData()) {
      this.setData({
        tasks: [],
        settings: {
          darkMode: false,
          sortBy: 'date',
          filterBy: 'all'
        }
      });
    }
  }

  // Get all data from storage
  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.key));
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  // Set all data to storage
  setData(data) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error writing to storage:', error);
      return false;
    }
  }

  // Get all tasks
  getTasks() {
    const data = this.getData();
    return data ? data.tasks : [];
  }

  // Add a new task
  addTask(task) {
    const data = this.getData();
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description || '',
      completed: false,
      category: task.category || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    this.setData(data);
    return newTask;
  }

  // Update a task
  updateTask(taskId, updates) {
    const data = this.getData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      data.tasks[taskIndex] = {
        ...data.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setData(data);
      return data.tasks[taskIndex];
    }
    return null;
  }

  // Delete a task
  deleteTask(taskId) {
    const data = this.getData();
    data.tasks = data.tasks.filter(t => t.id !== taskId);
    this.setData(data);
    return true;
  }

  // Toggle task completion
  toggleTaskCompletion(taskId) {
    const task = this.getTasks().find(t => t.id === taskId);
    if (task) {
      return this.updateTask(taskId, { completed: !task.completed });
    }
    return null;
  }

  // Get settings
  getSettings() {
    const data = this.getData();
    return data ? data.settings : {};
  }

  // Update settings
  updateSettings(settings) {
    const data = this.getData();
    data.settings = { ...data.settings, ...settings };
    this.setData(data);
    return data.settings;
  }

  // Clear all tasks
  clearAllTasks() {
    const data = this.getData();
    data.tasks = [];
    this.setData(data);
    return true;
  }

  // Export tasks as JSON
  exportTasks() {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  // Import tasks from JSON
  importTasks(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.tasks && Array.isArray(data.tasks)) {
        this.setData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing tasks:', error);
      return false;
    }
  }

  // Get task count by status
  getTaskStats() {
    const tasks = this.getTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      pending,
      percentage
    };
  }

  // Get tasks by filter
  getTasksByFilter(filterType) {
    let tasks = this.getTasks();
    const today = new Date().toDateString();

    switch (filterType) {
      case CONFIG.FILTERS.ACTIVE:
        return tasks.filter(t => !t.completed);
      case CONFIG.FILTERS.COMPLETED:
        return tasks.filter(t => t.completed);
      case CONFIG.FILTERS.TODAY:
        return tasks.filter(t => {
          if (!t.dueDate) return false;
          return new Date(t.dueDate).toDateString() === today;
        });
      case CONFIG.FILTERS.OVERDUE:
        return tasks.filter(t => {
          if (t.completed || !t.dueDate) return false;
          return new Date(t.dueDate) < new Date(today);
        });
      default:
        return tasks;
    }
  }

  // Search tasks
  searchTasks(query) {
    const tasks = this.getTasks();
    const lowerQuery = query.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort tasks
  sortTasks(tasks, sortBy) {
    const sorted = [...tasks];
    switch (sortBy) {
      case 'dueDate':
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      case 'date':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
}

// Create global storage instance
const storage = new StorageManager();
