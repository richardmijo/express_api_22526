const API_URL = 'http://localhost:3000/api';

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const notificationForm = document.getElementById('notificationForm');
const messageBox = document.getElementById('messageBox');
const logoutBtn = document.getElementById('logoutBtn');

// Verificar Token al inicio
const token = localStorage.getItem('jwt_token');
if (token) {
    showDashboard();
}

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `status-message ${type}`;
    setTimeout(() => {
        messageBox.style.display = 'none';
        messageBox.className = 'status-message';
    }, 5000);
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    localStorage.removeItem('jwt_token');
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('jwt_token', data.token);
            showDashboard();
        } else {
            showMessage(data.error || 'Login fallido', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión', 'error');
    }
});

notificationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');

    // Convertir userId a número
    const userId = parseInt(e.target.userId.value);
    const title = e.target.title.value;
    const body = e.target.body.value;
    const extraData = e.target.data.value;

    let parsedData = {};
    if (extraData) {
        try {
            parsedData = JSON.parse(extraData);
        } catch (err) {
            showMessage('El JSON de Datos Extra es inválido', 'error');
            return;
        }
    }

    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
        const res = await fetch(`${API_URL}/notifications/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, title, body, data: parsedData })
        });

        const result = await res.json();

        if (res.ok) {
            // Verificar si realmente se enviaron
            if (result.details && result.details.successCount > 0) {
                showMessage(`¡Enviado! Éxitos: ${result.details.successCount}`, 'success');
            } else if (result.details) {
                showMessage(`Procesado, pero falló el envío. Fallos: ${result.details.failureCount} (Revisa logs)`, 'error');
            } else {
                showMessage('Solicitud enviada', 'success');
            }
        } else {
            showMessage(result.error || 'Error al enviar', 'error');
        }
    } catch (error) {
        showMessage('Error enviando solicitud', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Notificación';
    }
});

logoutBtn.addEventListener('click', showLogin);
