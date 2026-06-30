const API_BASE = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

window.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard();
  } else {
    showLoginPage();
  }
});

function showLoginPage() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('registerPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.add('hidden');
}

function showRegisterPage() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('registerPage').classList.remove('hidden');
  document.getElementById('dashboardPage').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('registerPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.remove('hidden');
  loadDashboardData();
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      alert('Erreur: ' + data.error);
      return;
    }

    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showDashboard();
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nom = document.getElementById('regNom').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      alert('Erreur: ' + data.error);
      return;
    }

    alert('Inscription réussie!');
    showLoginPage();
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  token = null;
  currentUser = {};
  showLoginPage();
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');

  if (tabName === 'collaborators') loadCollaborators();
  else if (tabName === 'history') loadHistory();
}

async function loadDashboardData() {
  await loadCollaborators();
  await loadHistory();
}

async function loadCollaborators() {
  try {
    const response = await fetch(`${API_BASE}/collaborators`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const collaborators = await response.json();
    let html = '';
    collaborators.forEach(collab => {
      html += `
        <tr>
          <td>${collab.nom}</td>
          <td>${collab.email}</td>
          <td>${collab.whatsapp || '-'}</td>
          <td><span class="badge ${collab.actif ? 'badge-success' : ''}">${collab.actif ? 'Actif' : 'Inactif'}</span></td>
          <td>
            <button class="btn btn-secondary" onclick="deleteCollaborator(${collab.id})">Supprimer</button>
          </td>
        </tr>
      `;
    });

    document.getElementById('collaboratorsTable').innerHTML = html || '<tr><td colspan="5">Aucun collaborateur</td></tr>';
    document.getElementById('totalCollaborators').textContent = collaborators.length;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function showAddCollaboratorModal() {
  document.getElementById('addCollaboratorModal').classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

document.getElementById('addCollaboratorForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nom = document.getElementById('collabNom').value;
  const email = document.getElementById('collabEmail').value;
  const whatsapp = document.getElementById('collabWhatsapp').value;
  const actif = document.getElementById('collabActif').checked;

  try {
    const response = await fetch(`${API_BASE}/collaborators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nom, email, whatsapp, actif })
    });

    const data = await response.json();
    if (!response.ok) {
      alert('Erreur: ' + data.error);
      return;
    }

    alert('Collaborateur ajouté!');
    closeModal('addCollaboratorModal');
    loadCollaborators();
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
});

async function deleteCollaborator(id) {
  if (!confirm('Êtes-vous sûr?')) return;

  try {
    await fetch(`${API_BASE}/collaborators/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadCollaborators();
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
}

async function sendReminders() {
  const reminderDate = document.getElementById('reminderDate').value;

  try {
    const response = await fetch(`${API_BASE}/alerts/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reminderDate: parseInt(reminderDate) })
    });

    const data = await response.json();
    alert(data.message || 'Rappels envoyés!');
    loadHistory();
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
}

async function loadHistory() {
  try {
    const response = await fetch(`${API_BASE}/history?limit=50`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    const history = result.data || [];

    let html = '';
    let emailsCount = 0, whatsappsCount = 0;

    history.forEach(item => {
      if (item.email_envoye) emailsCount++;
      if (item.whatsapp_envoye) whatsappsCount++;

      const date = new Date(item.date_rappel).toLocaleDateString('fr-FR');
      html += `
        <tr>
          <td>${item.nom}</td>
          <td>${item.email_envoye ? '✓' : '✗'}</td>
          <td>${item.whatsapp_envoye ? '✓' : '✗'}</td>
          <td>${date}</td>
          <td>${item.statut}</td>
        </tr>
      `;
    });

    document.getElementById('historyTable').innerHTML = html || '<tr><td colspan="5">Aucun historique</td></tr>';
    document.getElementById('emailsSent').textContent = emailsCount;
    document.getElementById('whatsappsSent').textContent = whatsappsCount;
  } catch (error) {
    console.error('Erreur:', error);
  }
}
