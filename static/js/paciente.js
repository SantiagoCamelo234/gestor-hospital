// Configuración de APIs
const API_BASE = "http://localhost:8080/api";
const API_CITAS = `${API_BASE}/citas`;
const API_PACIENTES = `${API_BASE}/pacientes`;
const API_MEDICOS = `${API_BASE}/medicos`;
const API_CONSULTAS = `${API_BASE}/consultas`;
const API_CHATBOT = `${API_BASE}/chatbot`;

let token = localStorage.getItem('token');
const pacienteId = localStorage.getItem('userId');

// Funciones de autenticación
async function ensureAuthPaciente() {
    token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    
    try {
        const res = await fetch('http://localhost:8080/api/auth/me', { headers: { 'Authorization': token } });
        if (!res.ok) {
            localStorage.clear();
            window.location.href = 'login.html';
            return false;
        }
        const me = await res.json();
        if (me.rol !== 'PACIENTE') {
            if (me.rol === 'ADMIN') window.location.href = 'admin-panel.html';
            else window.location.href = 'medico.html';
            return false;
        }
        return true;
    } catch (e) {
        window.location.href = 'login.html';
        return false;
    }
}

// Funciones de citas
async function cargarMisCitas() {
    try {
        const res = await fetch(`${API_CITAS}?pacienteId=${pacienteId}`, {
            headers: { "Authorization": token }
        });
        
        if (res.ok) {
            const citas = await res.json();
            renderMisCitas(citas);
        } else {
            throw new Error('Error cargando citas');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('misCitas').innerHTML = '<div class="alert alert-danger">Error cargando citas</div>';
    }
}

function renderMisCitas(citas) {
    const container = document.getElementById('misCitas');
    
    if (citas.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No tienes citas programadas</div>';
        return;
    }
    
    const html = citas.map(cita => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title">${formatDateTime(cita.fecha)}</h6>
                        <p class="card-text"><strong>Médico:</strong> ${cita.medicoNombre || 'N/A'}</p>
                        <p class="card-text"><strong>Estado:</strong> 
                            <span class="badge bg-${cita.estado === 'ATENDIDA' ? 'success' : cita.estado === 'CANCELADA' ? 'danger' : 'warning'}">${cita.estado || 'PENDIENTE'}</span>
                        </p>
                        <p class="card-text"><strong>Prioridad:</strong> 
                            <span class="badge bg-${cita.prioridad === 'EMERGENCIA' ? 'danger' : cita.prioridad === 'URGENTE' ? 'warning' : 'success'}">${cita.prioridad}</span>
                        </p>
                        ${cita.motivo ? `<p class="card-text"><strong>Motivo:</strong> ${cita.motivo}</p>` : ''}
                    </div>
                    <div class="btn-group-vertical">
                        <button class="btn btn-sm btn-outline-primary" onclick="verDetalleCita('${cita.id}')">
                            <i class="bi bi-eye"></i> Ver
                        </button>
                        ${cita.estado === 'PENDIENTE' ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="cancelarCita('${cita.id}')">
                                <i class="bi bi-x"></i> Cancelar
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

async function cargarMiHistorial() {
    try {
        const res = await fetch(`${API_CONSULTAS}/pacientes/${pacienteId}/consultas`, {
            headers: { "Authorization": token }
        });
        
        if (res.ok) {
            const consultas = await res.json();
            renderMiHistorial(consultas);
        } else {
            throw new Error('Error cargando historial');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('miHistorial').innerHTML = '<div class="alert alert-danger">Error cargando historial médico</div>';
    }
}

function renderMiHistorial(consultas) {
    const container = document.getElementById('miHistorial');
    
    if (consultas.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No tienes consultas registradas</div>';
        return;
    }
    
    const html = consultas.map(consulta => `
        <div class="card mb-3">
            <div class="card-body">
                <h6 class="card-title">${formatDateTime(consulta.fecha)}</h6>
                <p class="card-text"><strong>Diagnóstico:</strong> ${consulta.diagnostico || 'N/A'}</p>
                <p class="card-text"><strong>Tratamiento:</strong> ${consulta.tratamiento || 'N/A'}</p>
                ${consulta.observaciones ? `<p class="card-text"><strong>Observaciones:</strong> ${consulta.observaciones}</p>` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

async function cargarMedicos() {
    try {
        const res = await fetch(`${API_MEDICOS}`, {
            headers: { "Authorization": token }
        });
        
        if (res.ok) {
            const medicos = await res.json();
            const select = document.getElementById('cita_medico');
            select.innerHTML = '<option value="">Seleccione un médico</option>' +
                medicos.map(m => `<option value="${m.id}">${m.nombre} ${m.apellido || ''} - ${m.especialidad || ''}</option>`).join('');
        }
    } catch (error) {
        console.error('Error cargando médicos:', error);
    }
}

async function cargarPerfil() {
    try {
        const res = await fetch(`${API_PACIENTES}/${pacienteId}`, {
            headers: { "Authorization": token }
        });
        
        if (res.ok) {
            const paciente = await res.json();
            document.getElementById('perfil_nombre').value = paciente.nombre || '';
            document.getElementById('perfil_apellido').value = paciente.apellido || '';
            document.getElementById('perfil_edad').value = paciente.edad || '';
            document.getElementById('perfil_telefono').value = paciente.telefono || '';
            document.getElementById('perfil_email').value = paciente.email || '';
            document.getElementById('perfil_documento').value = paciente.documento || '';
            document.getElementById('perfil_direccion').value = paciente.direccion || '';
        }
    } catch (error) {
        console.error('Error cargando perfil:', error);
    }
}

// Funciones de formularios
async function agendarCita(event) {
    event.preventDefault();
    
    const cita = {
        pacienteId: pacienteId,
        medicoId: document.getElementById('cita_medico').value,
        fecha: document.getElementById('cita_fecha').value,
        prioridad: document.getElementById('cita_prioridad').value,
        motivo: document.getElementById('cita_motivo').value,
        usuarioId: pacienteId,
        rol: 'PACIENTE'
    };
    
    try {
        const res = await fetch(`${API_CITAS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(cita)
        });
        
        if (res.ok) {
            showNotification("Cita agendada exitosamente", 'success');
            document.getElementById('formAgendarCita').reset();
            cargarMisCitas();
        } else {
            const errorData = await res.text();
            showNotification("Error agendando cita: " + errorData, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error de conexión al agendar cita", 'danger');
    }
}

async function actualizarPerfil(event) {
    event.preventDefault();
    
    const perfil = {
        nombre: document.getElementById('perfil_nombre').value,
        apellido: document.getElementById('perfil_apellido').value,
        edad: parseInt(document.getElementById('perfil_edad').value) || null,
        telefono: document.getElementById('perfil_telefono').value,
        email: document.getElementById('perfil_email').value,
        documento: document.getElementById('perfil_documento').value,
        direccion: document.getElementById('perfil_direccion').value
    };
    
    try {
        const res = await fetch(`${API_PACIENTES}/${pacienteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(perfil)
        });
        
        if (res.ok) {
            showNotification("Perfil actualizado exitosamente", 'success');
        } else {
            const errorData = await res.text();
            showNotification("Error actualizando perfil: " + errorData, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error de conexión al actualizar perfil", 'danger');
    }
}

// Funciones auxiliares
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1055;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${message}</span>
            <button type="button" onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; font-size: 18px; cursor: pointer; color: inherit; opacity: 0.7;">
                ×
            </button>
        </div>
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Chatbot
function toggleChatbot() {
    const chat = document.getElementById("chatbot");
    chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const msg = input.value.trim();
    if (!msg) return;

    const messages = document.getElementById("messages");

    const userMsg = document.createElement("div");
    userMsg.className = "chatbot-msg user";
    userMsg.textContent = msg;
    messages.appendChild(userMsg);

    const botMsg = document.createElement("div");
    botMsg.className = "chatbot-msg bot";
    botMsg.textContent = "⏳ Procesando...";
    messages.appendChild(botMsg);

    fetch(API_CHATBOT, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": token 
        },
        body: JSON.stringify({ message: msg })
    })
        .then(res => res.json())
        .then(data => {
            botMsg.textContent = data.response || "Lo siento, no tengo respuesta.";
        })
        .catch(() => {
            botMsg.textContent = "⚠️ Error al conectar con el servidor.";
        });

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
}

// Inicialización
(async function init() {
    const ok = await ensureAuthPaciente();
    if (!ok) return;
    
    // Cargar datos iniciales
    await Promise.all([
        cargarMedicos(),
        cargarMisCitas(),
        cargarMiHistorial(),
        cargarPerfil()
    ]);
    
    // Establecer fecha mínima para citas (hoy)
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('cita_fecha').min = now.toISOString().slice(0, 16);
})();
