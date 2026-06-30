# 📝 To-Do List Application

## Description

A modern, feature-rich to-do list application built with vanilla JavaScript, HTML, and CSS. All data is stored locally using browser's LocalStorage, so your tasks persist even after closing the browser.

## ✨ Features

- ✅ **Add, Edit, Delete Tasks** - Full task management
- ✅ **Local Storage** - Tasks persist across browser sessions
- ✅ **Mark as Complete** - Check off completed tasks
- ✅ **Categories/Tags** - Organize tasks by categories
- ✅ **Due Dates** - Set deadlines for tasks
- ✅ **Priority Levels** - High, Medium, Low priority
- ✅ **Search & Filter** - Find tasks quickly
- ✅ **Dark Mode** - Eye-friendly dark theme option
- ✅ **Statistics** - Track completed/pending tasks
- ✅ **Export/Import** - Backup and restore tasks
- ✅ **Responsive Design** - Works on all devices

## 📦 Installation

### Option 1: Direct (No Installation Required)
1. Clone the repository
   ```bash
   git clone https://github.com/dueler687-cyber/todo-app.git
   cd todo-app
   ```

2. Open `index.html` in your browser
   ```bash
   # On macOS
   open index.html
   
   # On Windows
   start index.html
   
   # On Linux
   xdg-open index.html
   ```

### Option 2: Using Python HTTP Server
```bash
python -m http.server 8000
# Open http://localhost:8000
```

### Option 3: Using Node.js http-server
```bash
npm install -g http-server
http-server
# Open http://localhost:8080
```

## 🎮 Usage

### Adding a Task
1. Enter task title in the input field
2. (Optional) Select category and priority
3. (Optional) Set a due date
4. Click "Add Task" or press Enter

### Managing Tasks
- **Complete**: Click the checkbox to mark as done
- **Edit**: Click the edit button to modify
- **Delete**: Click the delete button to remove
- **Filter**: Use category filter to view specific tasks
- **Search**: Use search bar to find tasks

### Settings
- Toggle dark mode
- Export tasks as JSON
- Import tasks from backup
- Clear all tasks (with confirmation)

## 💾 Local Storage Structure

```json
{
  "tasks": [
    {
      "id": "1234567890",
      "title": "Buy groceries",
      "completed": false,
      "category": "Shopping",
      "priority": "high",
      "dueDate": "2026-07-15",
      "createdAt": "2026-06-30T10:00:00Z",
      "updatedAt": "2026-06-30T10:00:00Z",
      "description": "Milk, bread, eggs"
    }
  ],
  "settings": {
    "darkMode": false,
    "sortBy": "date",
    "filterBy": "all"
  }
}
```

## 🎨 Customization

### Change Theme Colors
Edit `css/style.css` and modify the CSS variables:
```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  /* ... other colors */
}
```

### Add New Categories
Modify `js/config.js`:
```javascript
const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Custom'];
```

## 📊 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ⚠️ Partial support

## 🔒 Data Privacy

- All data is stored **locally** in your browser
- **No server** communication
- **No tracking** or analytics
- **No ads**
- Complete privacy and control

## 📝 Local Storage Limitations

- Maximum storage: ~5-10MB per domain (varies by browser)
- Clearing browser data will delete all tasks
- Data is not synced across devices

## 🚀 Advanced Usage

### Export Tasks
1. Click Settings icon
2. Select "Export Tasks"
3. Save the JSON file

### Import Tasks
1. Click Settings icon
2. Select "Import Tasks"
3. Choose previously exported JSON file

### Keyboard Shortcuts
- `Ctrl + N` or `Cmd + N`: New task
- `Ctrl + S` or `Cmd + S`: Save
- `Escape`: Clear input

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **Icons**: Font Awesome 6.0
- **Responsive**: CSS Grid & Flexbox

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit pull requests.

## 📞 Support

For issues or suggestions, please open an issue on GitHub.
