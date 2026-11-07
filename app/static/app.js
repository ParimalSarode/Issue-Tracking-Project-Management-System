const API_URL = '/api/v1';
let isLoginMode = true;

// Utility: Authenticated Fetch
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401) logout();
    return response;
}

// Authentication
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').innerText = isLoginMode ? 'Login' : 'Register';
    document.getElementById('authSubmitBtn').innerText = isLoginMode ? 'Login' : 'Register';
    document.getElementById('authToggleText').innerText = isLoginMode ? 'Need an account? Register' : 'Have an account? Login';
}

async function handleAuth(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (!isLoginMode) {
        // Register
        const res = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        if (res.ok) toggleAuthMode();
        else alert('Registration failed. Username may exist.');
    } else {
        // Login uses form data (OAuth2 standard)
        const formData = new URLSearchParams();
        formData.append('username', user);
        formData.append('password', pass);

        const res = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            checkAuth();
        } else {
            alert('Invalid credentials');
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    checkAuth();
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('dashboardSection').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
        loadDashboard();
    } else {
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('dashboardSection').classList.add('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
    }
}

// Dashboard Data
async function loadDashboard() {
    await loadProjects();
    await loadIssues();
}

async function loadProjects() {
    const res = await apiFetch('/projects/');
    if (!res.ok) return;
    const projects = await res.json();
    
    const list = document.getElementById('projectList');
    const select = document.getElementById('issueProject');
    list.innerHTML = '';
    select.innerHTML = '<option value="">Select Project...</option>';

    projects.forEach(p => {
        list.innerHTML += `<li class="list-group-item"><strong>${p.name}</strong> - ${p.description || ''}</li>`;
        select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
}

async function createProject(e) {
    e.preventDefault();
    const name = document.getElementById('projName').value;
    const desc = document.getElementById('projDesc').value;

    const res = await apiFetch('/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: desc })
    });

    if (res.ok) {
        document.getElementById('projectForm').reset();
        loadProjects();
    } else {
        alert('Failed to create project (Admin role required).');
    }
}

async function loadIssues() {
    const res = await apiFetch('/issues/');
    if (!res.ok) return;
    const issues = await res.json();
    
    const list = document.getElementById('issueList');
    list.innerHTML = '';

    const statusColors = { 'open': 'danger', 'in progress': 'warning', 'resolved': 'success' };

    issues.forEach(i => {
        list.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm border-${statusColors[i.status]}">
                    <div class="card-body">
                        <h5 class="card-title">${i.title}</h5>
                        <p class="card-text text-muted small">Project ID: ${i.project_id}</p>
                        <select class="form-select form-select-sm" onchange="updateIssueStatus(${i.id}, this.value)">
                            <option value="open" ${i.status === 'open' ? 'selected' : ''}>Open</option>
                            <option value="in progress" ${i.status === 'in progress' ? 'selected' : ''}>In Progress</option>
                            <option value="resolved" ${i.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    });
}

async function createIssue(e) {
    e.preventDefault();
    const project_id = document.getElementById('issueProject').value;
    const title = document.getElementById('issueTitle').value;

    const res = await apiFetch('/issues/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(project_id), title })
    });

    if (res.ok) {
        document.getElementById('issueForm').reset();
        loadIssues();
    }
}

async function updateIssueStatus(id, newStatus) {
    await apiFetch(`/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    loadIssues();
}

// Initialize
checkAuth();