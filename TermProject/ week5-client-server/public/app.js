
// เพิ่มที่ด้านบน
const API_BASE = API_CONFIG.BASE_URL;
const API = {
    TASKS: `${API_BASE}${API_CONFIG.ENDPOINTS.TASKS}`,
    STATS: `${API_BASE}${API_CONFIG.ENDPOINTS.STATS}`
};

// อัพเดท fetch calls ทั้งหมด
// เปลี่ยนจาก: fetch('/api/tasks')
// เป็น: fetch(API.TASKS)

// ตัวอย่าง:
async function loadTasks() {
    try {
        const res = await fetch(API.TASKS);
        if (!res.ok) throw new Error('โหลด tasks ล้มเหลว');
        const { data } = await res.json();
        renderTasks(data);
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('โหลด tasks จาก server ล้มเหลว');
    }
}

// อัพเดท fetch calls อื่นๆ ด้วยวิธีเดียวกัน...

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task form
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value
    };
    
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    
    e.target.reset();
    loadTasks();
});

// Load all tasks
async function loadTasks() {
    const res = await fetch(API);
    const { data } = await res.json();
    
    const container = document.getElementById('tasksContainer');
    container.innerHTML = data.map(task => `
        <div class="task-card">
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <span>Status: ${task.status}</span><br>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTasks();
}