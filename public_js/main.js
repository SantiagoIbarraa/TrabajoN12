// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    // Vistas
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (token) {
        showApp();
    } else {
        showAuth();
    }

    function showAuth() {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        fetchTasks();
    }

    // Lógica de autenticación
    document.getElementById('show-register').addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    document.getElementById('register-btn').addEventListener('click', async () => {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            alert(`Error: ${data.error}`);
        }
    });

    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            showApp();
        } else {
            alert(`Error: ${data.error}`);
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        showAuth();
    });

    // Lógica de tareas
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    async function fetchTasks() {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const tasks = await response.json();
        renderTasks(tasks);
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task ${task.completed ? 'completed' : ''}`;
            taskEl.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description || ''}</p>
                </div>
                <div class="task-actions">
                    <button class="toggle-btn">${task.completed ? 'Desmarcar' : 'Completar'}</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;
            
            taskEl.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
            taskEl.querySelector('.toggle-btn').addEventListener('click', () => toggleTask(task));
            
            taskList.appendChild(taskEl);
        });
    }

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;

        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description })
        });
        
        taskForm.reset();
        fetchTasks();
    });
    
    async function deleteTask(id) {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchTasks();
    }

    async function toggleTask(task) {
        await fetch(`${API_URL}/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ 
                title: task.title, 
                description: task.description, 
                completed: !task.completed 
            })
        });
        fetchTasks();
    }
});