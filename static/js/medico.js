const API_BASE = "http://localhost:8080/api";
const API_CITAS = `${API_BASE}/citas`;
const API_PACIENTES = `${API_BASE}/pacientes`;
const API_CONSULTAS = `${API_BASE}/consultas`;
const API_MEDICOS = `${API_BASE}/medicos`;
const API_CHATBOT = `${API_BASE}/chatbot`;

let token = localStorage.getItem("token");
const medicoId = localStorage.getItem("userId");

async function ensureAuthMedico(){
    token = localStorage.getItem('token');
    if(!token){ window.location.href = 'login.html'; return false; }
    if(!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    try{
        const res = await fetch('http://localhost:8080/api/auth/me', { headers: { 'Authorization': token }});
        if(!res.ok){ localStorage.clear(); window.location.href='login.html'; return false; }
        const me = await res.json();
        if(me.rol !== 'MEDICO'){ // redirigir por rol
            if(me.rol === 'ADMIN') window.location.href = 'admin-panel.html';
            else window.location.href = 'paciente.html';
            return false;
        }
        return true;
    }catch(e){ window.location.href='login.html'; return false; }
}

async function cargarCitas() {
    const prioridad = document.getElementById("filtroPrioridad").value;
    const fecha = document.getElementById("filtroFecha").value;

    try {
        const params = new URLSearchParams({ usuarioId: medicoId || '', rol: 'MEDICO' });
        const resp = await fetch(`${API_CITAS}?${params.toString()}`, {
            headers: { "Authorization": token }
        });
        
        if (!resp.ok) {
            throw new Error('Error cargando citas');
        }
        
        let citas = await resp.json();

        // Aplicar filtros
        if (prioridad) citas = citas.filter(c => c.prioridad === prioridad);
        if (fecha) {
            const fechaFiltro = new Date(fecha).toDateString();
            citas = citas.filter(c => new Date(c.fecha).toDateString() === fechaFiltro);
        }

        actualizarStats(citas);
        renderChart(citas);
        renderCitasCards(citas);

    } catch (err) {
        console.error(err);
        showNotification("Error al cargar citas", 'danger');
        // Fallback a datos mock
        loadCitasMock();
    }
}

function renderCitasCards(citas) {
    let html = "";
    if (citas.length === 0) {
        html = '<div class="col-12"><div class="alert alert-info text-center">No hay citas programadas</div></div>';
    } else {
        citas.forEach(c => {
            html += `
      <div class="col-md-6 mb-3">
        <div class="card cita-card priority-${c.prioridad}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${c.pacienteNombre || c.pacienteId || 'Paciente'}</h5>
              <span class="badge bg-${c.prioridad === 'EMERGENCIA' ? 'danger' : c.prioridad === 'URGENTE' ? 'warning' : 'success'}">${c.prioridad}</span>
            </div>
            <p class="card-text"><i class="bi bi-calendar me-2"></i><b>Fecha:</b> ${formatDateTime(c.fecha)}</p>
            <p class="card-text"><i class="bi bi-person-badge me-2"></i><b>Estado:</b> ${c.estado || "Pendiente"}</p>
            ${c.motivo ? `<p class="card-text"><i class="bi bi-chat-text me-2"></i><b>Motivo:</b> ${c.motivo}</p>` : ''}
            <div class="btn-group w-100" role="group">
              <button class="btn btn-sm btn-outline-info" onclick="verPaciente('${c.pacienteId}')" title="Ver paciente">
                <i class="bi bi-person"></i>
              </button>
              <button class="btn btn-sm btn-outline-success" onclick="actualizarEstado('${c.id}','ATENDIDA')" title="Marcar como atendida">
                <i class="bi bi-check"></i>
              </button>
              <button class="btn btn-sm btn-outline-warning" onclick="actualizarEstado('${c.id}','PENDIENTE')" title="Marcar como pendiente">
                <i class="bi bi-clock"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="actualizarEstado('${c.id}','CANCELADA')" title="Cancelar cita">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
        });
    }
    document.getElementById("listaCitas").innerHTML = html;
}

function actualizarStats(citas) {
    document.getElementById("statAtendidas").innerText = citas.filter(c => c.estado === "ATENDIDA").length;
    document.getElementById("statPendientes").innerText = citas.filter(c => !c.estado || c.estado === "PENDIENTE").length;
    document.getElementById("statUrgencias").innerText = citas.filter(c => c.prioridad === "EMERGENCIA").length;
}

function renderChart(citas) {
    const atendidas = citas.filter(c => c.estado === "ATENDIDA").length;
    const pendientes = citas.filter(c => !c.estado || c.estado === "PENDIENTE").length;
    const canceladas = citas.filter(c => c.estado === "CANCELADA").length;

    const ctx = document.getElementById("chartCitas").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Atendidas", "Pendientes", "Canceladas"],
            datasets: [{
                data: [atendidas, pendientes, canceladas],
                backgroundColor: ["#28a745","#ffc107","#dc3545"]
            }]
        }
    });
}

async function verPaciente(id) {
    try {
        const resp = await fetch(`${API_PACIENTES}/${id}`, { 
            headers: { "Authorization": token }
        });
        
        if (!resp.ok) {
            throw new Error('Error cargando paciente');
        }
        
        const p = await resp.json();
        document.getElementById("detallePaciente").innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <h6><i class="bi bi-person me-2"></i>Información Personal</h6>
              <p><b>Nombre:</b> ${p.nombre} ${p.apellido || ''}</p>
              <p><b>ID:</b> ${p.id}</p>
              <p><b>Edad:</b> ${p.edad || 'N/A'}</p>
              <p><b>Teléfono:</b> ${p.telefono || 'N/A'}</p>
            </div>
            <div class="col-md-6">
              <h6><i class="bi bi-info-circle me-2"></i>Información Adicional</h6>
              <p><b>Documento:</b> ${p.documento || 'N/A'}</p>
              <p><b>Dirección:</b> ${p.direccion || 'N/A'}</p>
              <p><b>Email:</b> ${p.email || 'N/A'}</p>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary" onclick="verHistorialPaciente('${p.id}')">
              <i class="bi bi-file-medical me-2"></i>Ver Historial Médico
            </button>
          </div>`;
        document.getElementById("modalPaciente").classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error cargando información del paciente", 'danger');
    }
}

async function verHistorialPaciente(pacienteId) {
    try {
        const resp = await fetch(`${API_CONSULTAS}/pacientes/${pacienteId}/consultas`, {
            headers: { "Authorization": token }
        });
        
        if (resp.ok) {
            const consultas = await resp.json();
            mostrarHistorialModal(consultas);
        } else {
            showNotification("Error cargando historial médico", 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error cargando historial médico", 'danger');
    }
}

function mostrarHistorialModal(consultas) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Historial Médico</h5>
                    <button type="button" class="btn-close" onclick="closeModal(this.closest('.modal'))">×</button>
                </div>
                <div class="modal-body">
                    ${consultas.length === 0 ? 
                        '<div class="alert alert-info">No hay consultas registradas</div>' :
                        consultas.map(c => `
                            <div class="card" style="margin-bottom: 1rem;">
                                <div class="card-body">
                                    <h6 style="color: #2b6cb0; margin-bottom: 0.5rem;">${formatDateTime(c.fecha)}</h6>
                                    <p><b>Diagnóstico:</b> ${c.diagnostico || 'N/A'}</p>
                                    <p><b>Tratamiento:</b> ${c.tratamiento || 'N/A'}</p>
                                    ${c.observaciones ? `<p><b>Observaciones:</b> ${c.observaciones}</p>` : ''}
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

async function actualizarEstado(citaId, estado) {
    try {
        const resp = await fetch(`${API_CITAS}/${citaId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify({ estado })
        });
        
        if (resp.ok) {
            showNotification(`Cita marcada como ${estado.toLowerCase()}`, 'success');
            cargarCitas();
        } else {
            throw new Error('Error actualizando estado');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error actualizando estado de la cita", 'danger');
    }
}

async function guardarPerfil() {
    const perfil = {
        nombre: document.getElementById("perfilNombre").value,
        apellido: document.getElementById("perfilApellido").value,
        especialidad: document.getElementById("perfilEspecialidad").value,
        telefono: document.getElementById("perfilTelefono").value,
        email: document.getElementById("perfilEmail").value
    };
    
    try {
        const resp = await fetch(`${API_MEDICOS}/${medicoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify(perfil)
        });
        
        if (resp.ok) {
            showNotification("Perfil actualizado exitosamente", 'success');
            cargarPerfil(); // Recargar perfil
        } else {
            throw new Error('Error actualizando perfil');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error actualizando perfil", 'danger');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
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

// Funciones del chatbot
function toggleChatbot() {
    const chat = document.getElementById("chatbot");
    chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
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

// Funciones del modal
function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// Cargar perfil del médico
async function cargarPerfil() {
    try {
        const resp = await fetch(`${API_MEDICOS}/${medicoId}`, {
            headers: { "Authorization": token }
        });
        
        if (resp.ok) {
            const medico = await resp.json();
            document.getElementById("perfilNombre").value = medico.nombre || '';
            document.getElementById("perfilApellido").value = medico.apellido || '';
            document.getElementById("perfilEspecialidad").value = medico.especialidad || '';
            document.getElementById("perfilTelefono").value = medico.telefono || '';
            document.getElementById("perfilEmail").value = medico.email || '';
            document.getElementById("medicoNombre").textContent = `${medico.nombre || ''} ${medico.apellido || ''}`.trim() || 'Médico';
        }
    } catch (error) {
        console.error('Error cargando perfil:', error);
    }
}

// Cargar consultas del médico
async function cargarMisConsultas() {
    try {
        const resp = await fetch(`${API_CONSULTAS}?medicoId=${medicoId}`, {
            headers: { "Authorization": token }
        });
        
        if (resp.ok) {
            const consultas = await resp.json();
            renderMisConsultas(consultas);
        } else {
            document.getElementById("misConsultas").innerHTML = '<div class="alert alert-info">No hay consultas registradas</div>';
        }
    } catch (error) {
        console.error('Error cargando consultas:', error);
        document.getElementById("misConsultas").innerHTML = '<div class="alert alert-danger">Error cargando consultas</div>';
    }
}

function renderMisConsultas(consultas) {
    const container = document.getElementById("misConsultas");
    
    if (consultas.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No hay consultas registradas</div>';
        return;
    }
    
    const html = consultas.map(consulta => `
        <div class="card" style="margin-bottom: 1rem;">
            <div class="card-body">
                <h6 style="color: #2b6cb0; margin-bottom: 0.5rem;">${formatDateTime(consulta.fecha)}</h6>
                <p><b>Paciente:</b> ${consulta.paciente?.nombre || 'N/A'} ${consulta.paciente?.apellido || ''}</p>
                <p><b>Diagnóstico:</b> ${consulta.diagnostico || 'N/A'}</p>
                <p><b>Tratamiento:</b> ${consulta.tratamiento || 'N/A'}</p>
                ${consulta.observaciones ? `<p><b>Observaciones:</b> ${consulta.observaciones}</p>` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Datos mock para fallback
function loadCitasMock() {
    const citasMock = [
        {id:'C-001', pacienteId:'P-001', pacienteNombre:'Juan Pérez', fecha:'2025-09-20T09:00:00', prioridad:'NORMAL', estado:'PENDIENTE', motivo:'Consulta de rutina'},
        {id:'C-002', pacienteId:'P-002', pacienteNombre:'María García', fecha:'2025-09-20T10:00:00', prioridad:'URGENTE', estado:'PENDIENTE', motivo:'Dolor de cabeza'},
    ];
    actualizarStats(citasMock);
    renderChart(citasMock);
    renderCitasCards(citasMock);
}

(async function init(){
    const ok = await ensureAuthMedico();
    if(!ok) return;
    
    // Cargar datos iniciales
    await Promise.all([
        cargarCitas(),
        cargarPerfil(),
        cargarMisConsultas()
    ]);
})();
