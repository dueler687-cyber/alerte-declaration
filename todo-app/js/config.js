// Configuration for the To-Do List Application

const CONFIG = {
  // Storage key
  STORAGE_KEY: 'todoApp',

  // Categories
  CATEGORIES: [
    'Work',
    'Personal',
    'Shopping',
    'Health',
    'Other'
  ],

  // Priority levels
  PRIORITIES: ['low', 'medium', 'high'],

  // Priority colors
  PRIORITY_COLORS: {
    low: '#2ecc71',
    medium: '#f39c12',
    high: '#e74c3c'
  },

  // Filter types
  FILTERS: {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    TODAY: 'today',
    OVERDUE: 'overdue'
  },

  // Date format
  DATE_FORMAT: 'en-US',

  // Animation duration (ms)
  ANIMATION_DURATION: 300,

  // Toast notification timeout (ms)
  TOAST_TIMEOUT: 3000
};
