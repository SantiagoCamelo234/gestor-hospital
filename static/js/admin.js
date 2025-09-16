// -------------------------
// Estado y utilidades UI
// -------------------------
let currentSection = 'dashboard';

// API Configuration
const API_BASE = "http://localhost:8080/api";
const API_PACIENTES = `${API_BASE}/pacientes`;
const API_MEDICOS = `${API_BASE}/medicos`;
const API_CITAS = `${API_BASE}/citas`;
const API_CONSULTAS = `${API_BASE}/consultas`;
const API_REPORTES = `${API_BASE}/reportes`;
const API_SYSTEM = `${API_BASE}/system`;
const API_CHATBOT = `${API_BASE}/chatbot`;

let currentUser = null; // Usuario actual

async function ensureAuth() {
    // Verificar si hay un token y usuario logueado
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if(!token || !username){
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const authToken = token.startsWith('Bearer ') ? token : 'Bearer ' + token;
        const res = await fetch('http://localhost:8080/api/auth/me', {
            headers: { 'Authorization': authToken }
        });
        if(!res.ok){
            localStorage.clear();
            window.location.href = 'login.html';
            return false;
        }
        const me = await res.json();
        currentUser = me;
        
        // Opcional: bloquear si no es ADMIN
        if(me.rol !== 'ADMIN'){
            // redirigir según rol
            if(me.rol === 'MEDICO') window.location.href = 'medico.html';
            else window.location.href = 'paciente.html';
            return false;
        }
        // pintar nombre
        document.querySelector('.topbar .text-end div[style*="font-weight:700"]').textContent = me.username;
        return true;
    } catch(e){
        console.error(e);
        window.location.href = 'login.html';
        return false;
    }
}

function toggleSidebar(){
    const sb = document.querySelector('.sidebar');
    if(sb.style.display === 'none' || getComputedStyle(sb).display === 'none') sb.style.display = '';
    else sb.style.display = 'none';
}

function showSection(name) {
    // hide all
    const sections = ['dashboard','pacientes','medicos','citas','consultas','usuarios','reportes','sistema'];
    sections.forEach(s => document.getElementById(s + 'Section').style.display = 'none');
    // show selected
    document.getElementById(name + 'Section').style.display = '';
    currentSection = name;
    // update sidebar active
    document.querySelectorAll('.sidebar .nav-link').forEach(a => a.classList.remove('active'));
    const link = document.querySelector('.sidebar .nav-link[data-section="'+name+'"]');
    if(link) link.classList.add('active');
    // lazy load content
    if(name === 'pacientes') {
        loadPacientes();
        listarPacientes(); // Load real data from API
    }
    if(name === 'medicos') loadMedicos();
    if(name === 'citas') loadCitas();
    if(name === 'consultas') loadConsultas();
    if(name === 'usuarios') loadUsuarios();
    if(name === 'reportes') loadReportes();
    if(name === 'sistema') loadSystemInfo();
}

// global search stub
function globalSearchDo(){
    const q = document.getElementById('globalSearch').value.trim();
    if(!q) return alert('Escribe algo para buscar');
    // aquí puedes redirigir a la sección correspondiente y aplicar el filtro
    alert('Buscar: ' + q + '\n(En la maqueta esto solo muestra una alerta)');
}

function logout(){
    localStorage.clear();
    window.location.href = '/login.html';
}

// -------------------------
// DATA LOADING (maqueta)
// -------------------------
function setStats({pacientes=0, medicos=0, citas=0, consultas=0} = {}) {
    document.getElementById('statPacientes').textContent = pacientes;
    document.getElementById('statMedicos').textContent = medicos;
    document.getElementById('statCitas').textContent = citas;
    document.getElementById('statConsultas').textContent = consultas;
}

async function loadDashboard() {
    try {
        // Cargar estadísticas reales
        const [pacientesRes, medicosRes, citasRes, consultasRes] = await Promise.all([
            fetch(`${API_PACIENTES}`),
            fetch(`${API_MEDICOS}`),
            fetch(`${API_CITAS}`),
            fetch(`${API_CONSULTAS}`)
        ]);

        const pacientes = await pacientesRes.json();
        const medicos = await medicosRes.json();
        const citas = await citasRes.json();
        const consultas = await consultasRes.json();

        setStats({
            pacientes: pacientes.length || 0,
            medicos: medicos.length || 0,
            citas: citas.length || 0,
            consultas: consultas.length || 0
        });

        // Cargar últimas citas
        loadLatestCitas(citas.slice(0, 5));
        
        document.getElementById('lastUpdate').textContent = 'hace 1 min';
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        // Fallback a datos mock
        loadDashboardMock();
    }
}

function loadDashboardMock() {
    // valores demo
    setStats({pacientes: 234, medicos: 18, citas: 72, consultas: 450});
    document.getElementById('lastUpdate').textContent = 'hace 1 min';
    // crear filas demo
    const sample = [
        {id:'C-101', paciente:'María Pérez', medico:'Dr. López', fecha:'2025-09-20 09:00', prioridad:'URGENTE'},
        {id:'C-100', paciente:'Juan Gómez', medico:'Dra. Ruiz', fecha:'2025-09-20 10:30', prioridad:'NORMAL'},
        {id:'C-99', paciente:'Ana Torres', medico:'Dr. Vélez', fecha:'2025-09-19 15:00', prioridad:'EMERGENCIA'},
    ];
    loadLatestCitas(sample);
}

function loadLatestCitas(citas) {
    const tbody = document.getElementById('latestCitasTable');
    tbody.innerHTML = citas.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.pacienteNombre || r.pacienteId || 'N/A'}</td>
        <td>${r.medicoNombre || r.medicoId || 'N/A'}</td>
        <td>${formatDateTime(r.fecha)}</td>
        <td><span class="badge ${r.prioridad==='EMERGENCIA'?'bg-danger':r.prioridad==='URGENTE'?'bg-warning text-dark':'bg-success'}">${r.prioridad}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="openCitaDetail('${r.id}')"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCita('${r.id}')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
}

// -------------------------
// API PATIENT MANAGEMENT
// -------------------------

// List Patients from API
async function listarPacientes() {
    try {
        const res = await fetch(`${API_PACIENTES}?orden=alfabetico&page=0&size=50`);
        
        if (res.ok) {
            const data = await res.json();
            document.getElementById('pacientesCount').textContent = data.length;
            const tbody = document.getElementById('pacientesTableBody');
            tbody.innerHTML = "";
            
            data.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.nombre}</td>
                        <td>${p.apellido}</td>
                        <td>${p.edad || '-'}</td>
                        <td>${p.telefono || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewPaciente('${p.id}')"><i class="bi bi-eye"></i></button>
                            <button class="btn btn-sm btn-outline-success" onclick="editPaciente('${p.id}')"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPacienteAPI('${p.id}')"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>`;
            });
            renderPacientesPagination();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.error('Error fetching patients:', error);
        // Fallback to mock data
        loadPacientes();
    }
}

// Delete Patient via API
async function eliminarPacienteAPI(id) {
    if (!confirm("¿Seguro que deseas eliminar este paciente?")) return;
    
    try {
        const res = await fetch(`${API_PACIENTES}/${id}`, {
            method: "DELETE"
        });
        
        if (res.ok) {
            alert("Paciente eliminado exitosamente");
            listarPacientes();
            // Update stats
            const currentStats = getCurrentStats();
            setStats({...currentStats, pacientes: Math.max(0, currentStats.pacientes - 1)});
        } else {
            alert("Error al eliminar paciente");
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        alert("Error de conexión al eliminar paciente");
        // Fallback to mock behavior
        deletePaciente(id);
    }
}

// Search Patients via API
async function searchPacientesAPI(query) {
    if (query.length < 2) {
        document.getElementById('resultados-busqueda').innerHTML = '';
        return;
    }
    
    try {
        const res = await fetch(`${API_PACIENTES}/search?nombre=${encodeURIComponent(query)}`);
        
        if (res.ok) {
            const data = await res.json();
            const ul = document.getElementById('resultados-busqueda');
            ul.innerHTML = data.map(nombre => `<li>• ${nombre}</li>`).join("");
        } else {
            throw new Error('Search API not available');
        }
    } catch (error) {
        console.error('Error searching patients:', error);
        // Fallback to mock search
        searchPacientesMock(query);
    }
}

// Helper function to get current stats
function getCurrentStats() {
    return {
        pacientes: parseInt(document.getElementById('statPacientes').textContent) || 0,
        medicos: parseInt(document.getElementById('statMedicos').textContent) || 0,
        citas: parseInt(document.getElementById('statCitas').textContent) || 0,
        consultas: parseInt(document.getElementById('statConsultas').textContent) || 0
    };
}

// PACIENTES (maqueta - fallback)
let pacientesMock = [];
function loadPacientes(page=1) {
    // demo: genera 25 pacientes
    if(pacientesMock.length === 0){
        for(let i=1;i<=25;i++){
            pacientesMock.push({
                id: 'P-'+String(i).padStart(3,'0'),
                nombre: 'Paciente '+i,
                apellido: 'Apellido '+i,
                edad: 25 + (i % 50),
                documento: 'DOC'+(1000+i),
                telefono: '+57 300 000 '+String(i).padStart(3,'0')
            });
        }
    }
    document.getElementById('pacientesCount').textContent = pacientesMock.length;
    const start = 0;
    const rows = pacientesMock.map(p => `<tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.apellido}</td>
        <td>${p.edad}</td>
        <td>${p.telefono}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="viewPaciente('${p.id}')"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-outline-success" onclick="editPaciente('${p.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="confirmDeletePaciente('${p.id}')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`).join('');
    document.getElementById('pacientesTableBody').innerHTML = rows;
    renderPacientesPagination();
}

function renderPacientesPagination(){
    const ul = document.getElementById('pacientesPagination');
    ul.innerHTML = `
      <li class="page-item disabled"><a class="page-link">Anterior</a></li>
      <li class="page-item active"><a class="page-link">1</a></li>
      <li class="page-item"><a class="page-link">2</a></li>
      <li class="page-item"><a class="page-link">Siguiente</a></li>
    `;
}

function openModalCrearPaciente(){
    document.getElementById('modalPacienteTitle').textContent = 'Crear Paciente';
    // limpiar form
    document.getElementById('formPaciente').reset();
    new bootstrap.Modal(document.getElementById('modalPaciente')).show();
}

function viewPaciente(id){
    alert('Ver paciente: ' + id + ' (maqueta)');
}
function editPaciente(id){
    // populate demo values and open modal
    const p = pacientesMock.find(x => x.id === id);
    if(!p) return alert('Paciente no encontrado (maqueta)');
    document.getElementById('paciente_nombre').value = p.nombre;
    document.getElementById('paciente_apellido').value = p.apellido;
    document.getElementById('paciente_documento').value = p.documento;
    document.getElementById('paciente_telefono').value = p.telefono;
    document.getElementById('paciente_direccion').value = 'Calle demo';
    document.getElementById('paciente_nacimiento').value = '1990-01-01';
    document.getElementById('paciente_email').value = 'demo@example.com';
    document.getElementById('modalPacienteTitle').textContent = 'Editar Paciente';
    new bootstrap.Modal(document.getElementById('modalPaciente')).show();
}
function confirmDeletePaciente(id){
    if(confirm('Eliminar paciente ' + id + '?')) {
        deletePaciente(id);
    }
}
function savePaciente(){
    // obtener campos simple
    const nuevo = {
        id: 'P-'+String(Math.floor(Math.random()*1000)).padStart(3,'0'),
        nombre: document.getElementById('paciente_nombre').value || 'Sin nombre',
        apellido: document.getElementById('paciente_apellido').value || 'Sin apellido',
        documento: document.getElementById('paciente_documento').value || '---',
        telefono: document.getElementById('paciente_telefono').value || '---'
    };
    pacientesMock.unshift(nuevo);
    bootstrap.Modal.getInstance(document.getElementById('modalPaciente')).hide();
    loadPacientes();
    alert('Paciente guardado (maqueta)');
}

function savePacienteMock(){
    const nuevo = {
        id: 'P-'+String(Math.floor(Math.random()*1000)).padStart(3,'0'),
        nombre: document.getElementById('crear-nombre').value || 'Sin nombre',
        apellido: document.getElementById('crear-apellido').value || 'Sin apellido',
        edad: parseInt(document.getElementById('crear-edad').value) || 0,
        telefono: document.getElementById('crear-telefono').value || '---'
    };
    pacientesMock.unshift(nuevo);
    document.getElementById('form-crear-paciente').reset();
    loadPacientes();
    alert('Paciente guardado (modo mock)');
}

function deletePaciente(id){
    pacientesMock = pacientesMock.filter(p => p.id !== id);
    loadPacientes();
}

function searchPacientesMock(query) {
    const results = pacientesMock.filter(p => 
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        p.apellido.toLowerCase().includes(query.toLowerCase())
    );
    const ul = document.getElementById('resultados-busqueda');
    ul.innerHTML = results.map(p => `<li>• ${p.nombre} ${p.apellido}</li>`).join("");
}

// -------------------------
// API MEDICOS MANAGEMENT
// -------------------------

async function loadMedicos(){
    try {
        const res = await fetch(`${API_MEDICOS}`);
        
        if (res.ok) {
            const medicos = await res.json();
            renderMedicosTable(medicos);
        } else {
            throw new Error('Error cargando médicos');
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
        // Fallback a datos mock
        loadMedicosMock();
    }
}

function renderMedicosTable(medicos) {
    const rows = medicos.map(m => `<tr>
      <td>${m.id}</td>
      <td>${m.nombre} ${m.apellido || ''}</td>
      <td>${m.especialidad || 'N/A'}</td>
      <td>${m.telefono || 'N/A'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="viewMedico('${m.id}')"><i class="bi bi-eye"></i></button>
        <button class="btn btn-sm btn-outline-success" onclick="openEditMedico('${m.id}')"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteMedico('${m.id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
    document.getElementById('medicosTableBody').innerHTML = rows;
}

// MEDICOS (maqueta - fallback)
let medicosMock = [];
function loadMedicosMock(){
    if(medicosMock.length === 0){
        medicosMock = [
            {id:'M-1', nombre:'Dr. Andrés López', especialidad:'Cardiología', telefono:'+57 300 111 222'},
            {id:'M-2', nombre:'Dra. Laura Ruiz', especialidad:'Pediatría', telefono:'+57 300 333 444'},
        ];
    }
    renderMedicosTable(medicosMock);
}
function openModalCrearMedico(){
    document.getElementById('formMedico').reset();
    new bootstrap.Modal(document.getElementById('modalMedico')).show();
}
function saveMedico(){
    const nuevo = {
        id: 'M-'+String(Math.floor(Math.random()*1000)),
        nombre: document.getElementById('medico_nombre').value || 'Dr. Demo',
        especialidad: document.getElementById('medico_especialidad').value || 'General',
        telefono: document.getElementById('medico_telefono').value || '---'
    };
    medicosMock.unshift(nuevo);
    bootstrap.Modal.getInstance(document.getElementById('modalMedico')).hide();
    loadMedicos();
    alert('Médico guardado (maqueta)');
}
function viewMedico(id){
    alert('Ver médico: ' + id);
}
function openEditMedico(id){
    const m = medicosMock.find(x => x.id === id);
    if(!m) return;
    document.getElementById('medico_nombre').value = m.nombre;
    document.getElementById('medico_especialidad').value = m.especialidad;
    document.getElementById('medico_telefono').value = m.telefono;
    new bootstrap.Modal(document.getElementById('modalMedico')).show();
}

// -------------------------
// API CITAS MANAGEMENT
// -------------------------

async function loadCitas(){
    try {
        const res = await fetch(`${API_CITAS}`);
        
        if (res.ok) {
            const citas = await res.json();
            renderCitasTable(citas);
        } else {
            throw new Error('Error cargando citas');
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        // Fallback a datos mock
        loadCitasMock();
    }
}

function renderCitasTable(citas) {
    const rows = citas.map(c => `<tr>
      <td>${c.id}</td>
      <td>${c.pacienteNombre || c.pacienteId || 'N/A'}</td>
      <td>${c.medicoNombre || c.medicoId || 'N/A'}</td>
      <td>${formatDateTime(c.fecha)}</td>
      <td><span class="badge ${c.prioridad==='EMERGENCIA'?'bg-danger':c.prioridad==='URGENTE'?'bg-warning text-dark':'bg-success'}">${c.prioridad}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="openCitaDetail('${c.id}')"><i class="bi bi-eye"></i></button>
        <button class="btn btn-sm btn-outline-success" onclick="attendCita('${c.id}')"><i class="bi bi-check"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDeleteCita('${c.id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
    document.getElementById('citasTableBody').innerHTML = rows;
}

// CITAS (maqueta - fallback)
let citasMock = [];
function loadCitasMock(){
    if(citasMock.length === 0){
        citasMock = [
            {id:'C-001', paciente:'Paciente 1', medico:'M-1', fecha:'2025-09-20 09:00', prioridad:'NORMAL'},
            {id:'C-002', paciente:'Paciente 2', medico:'M-2', fecha:'2025-09-21 10:00', prioridad:'URGENTE'},
        ];
    }
    renderCitasTable(citasMock);
}
function openModalCrearCita(){
    document.getElementById('formCita').reset();
    // cargar selects con medicos/pacientes demo
    const sp = document.getElementById('cita_paciente');
    sp.innerHTML = pacientesMock.map(p => `<option value="${p.id}">${p.nombre} (${p.id})</option>`).join('');
    const sm = document.getElementById('cita_medico');
    sm.innerHTML = medicosMock.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
    new bootstrap.Modal(document.getElementById('modalCita')).show();
}
function saveCita(){
    const nuevo = {
        id: 'C-'+String(Math.floor(Math.random()*1000)),
        paciente: document.getElementById('cita_paciente').value || 'Paciente X',
        medico: document.getElementById('cita_medico').value || 'M-X',
        fecha: document.getElementById('cita_fecha').value || '2025-09-30 10:00',
        prioridad: document.getElementById('cita_prioridad').value || 'NORMAL'
    };
    citasMock.unshift(nuevo);
    bootstrap.Modal.getInstance(document.getElementById('modalCita')).hide();
    loadCitas();
    alert('Cita creada (maqueta)');
}
function openCitaDetail(id){
    alert('Ver detalle de cita ' + id + ' (maqueta)');
}
function confirmDeleteCita(id){
    if(confirm('Eliminar cita ' + id + '?')) {
        citasMock = citasMock.filter(c => c.id !== id);
        loadCitas();
    }
}
function deleteCita(id){ confirmDeleteCita(id); }

// -------------------------
// API CONSULTAS MANAGEMENT
// -------------------------

async function loadConsultas(){
    try {
        const res = await fetch(`${API_CONSULTAS}`);
        
        if (res.ok) {
            const consultas = await res.json();
            renderConsultasTable(consultas);
        } else {
            throw new Error('Error cargando consultas');
        }
    } catch (error) {
        console.error('Error loading consultations:', error);
        // Fallback a datos mock
        loadConsultasMock();
    }
}

function renderConsultasTable(consultas) {
    const rows = consultas.map(c => `<tr>
      <td>${c.id}</td>
      <td>${c.citaId || 'N/A'}</td>
      <td>${c.medicoNombre || c.medicoId || 'N/A'}</td>
      <td>${c.pacienteNombre || c.pacienteId || 'N/A'}</td>
      <td>${c.diagnostico || c.resumen || 'N/A'}</td>
      <td>${formatDateTime(c.fecha)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="viewConsulta('${c.id}')"><i class="bi bi-eye"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteConsulta('${c.id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
    document.getElementById('consultasTableBody').innerHTML = rows;
}

// CONSULTAS (maqueta - fallback)
let consultasMock = [];
function loadConsultasMock(){
    if(consultasMock.length === 0){
        consultasMock = [
            {id:'CONS-01', cita:'C-001', medico:'M-1', paciente:'Paciente 1', resumen:'Consulta normal', fecha:'2025-09-10'},
        ];
    }
    renderConsultasTable(consultasMock);
}
function openModalRegistroConsulta(){
    alert('Abrir modal registrar consulta (maqueta)');
}

// USUARIOS (maqueta)
let usuariosMock = [];
function loadUsuarios(){
    if(usuariosMock.length === 0){
        usuariosMock = [
            {id:'U-1', username:'admin', rol:'ADMIN', asociado:'-' },
            {id:'U-2', username:'med1', rol:'MEDICO', asociado:'M-1' },
        ];
    }
    document.getElementById('usuariosTableBody').innerHTML = usuariosMock.map(u => `<tr>
      <td>${u.id}</td><td>${u.username}</td><td>${u.rol}</td><td>${u.asociado}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="viewUsuario('${u.id}')"><i class="bi bi-eye"></i></button>
        <button class="btn btn-sm btn-outline-success" onclick="openModalCrearUsuario()"><i class="bi bi-pencil"></i></button>
      </td>
    </tr>`).join('');
}
function openModalCrearUsuario(){
    document.getElementById('formUsuario').reset();
    new bootstrap.Modal(document.getElementById('modalUsuario')).show();
}
function saveUsuario(){
    const nuevo = {
        id: 'U-'+String(Math.floor(Math.random()*1000)),
        username: document.getElementById('usuario_username').value || 'userX',
        rol: document.getElementById('usuario_rol').value,
        asociado: document.getElementById('usuario_asociado').value || '-'
    };
    usuariosMock.unshift(nuevo);
    bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
    loadUsuarios();
    alert('Usuario creado (maqueta)');
}
function viewUsuario(id){ alert('Ver usuario ' + id); }

// REPORTES (maqueta)
function loadReportes(){ 
    document.getElementById('reportePreview').textContent = 'Seleccione un tipo y presione "Generar"'; 
}
function generarReporte(){
    const tipo = document.getElementById('reporteTipo').value;
    document.getElementById('reportePreview').textContent = 'Reporte ' + tipo + ' generado (maqueta).';
}
function exportPacientes(){ 
    alert('Exportar pacientes CSV (maqueta)'); 
}

// SISTEMA
function loadSystemInfo(){
    document.getElementById('systemLogs').textContent = '2025-09-15 12:00 INFO: Sistema iniciado\n2025-09-15 12:10 WARN: Backup pendiente';
}
function saveConfig(){ 
    alert('Guardar configuración (maqueta)'); 
}

// util: debounce simple
let debounceTimer;
function debouncedSearchPacientes(){
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=> {
        const q = document.getElementById('pacienteSearch').value.trim();
        if(!q) {
            loadPacientes();
            document.getElementById('resultados-busqueda').innerHTML = '';
            return;
        }
        
        // Try API search first, fallback to mock
        searchPacientesAPI(q);
        
        // Also update table with filtered results
        const results = pacientesMock.filter(p => 
            p.nombre.toLowerCase().includes(q.toLowerCase()) || 
            p.apellido.toLowerCase().includes(q.toLowerCase()) ||
            (p.documento && p.documento.toLowerCase().includes(q.toLowerCase()))
        );
        document.getElementById('pacientesTableBody').innerHTML = results.map(p => `<tr>
          <td>${p.id}</td><td>${p.nombre}</td><td>${p.apellido || p.documento}</td><td>${p.edad || '-'}</td><td>${p.telefono}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary" onclick="viewPaciente('${p.id}')"><i class="bi bi-eye"></i></button>
          </td></tr>`).join('');
    }, 300);
}

// Filter functions for citas
function filtrarCitas(){
    alert('Filtrar citas (funcionalidad pendiente)');
}

// -------------------------
// FUNCIONES AUXILIARES
// -------------------------

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
    // Crear notificación toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Agregar al contenedor de toasts
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remover del DOM después de que se oculte
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// -------------------------
// FUNCIONES DE MODALES
// -------------------------

function openModalRegistroConsulta() {
    // Cargar opciones de pacientes y médicos
    loadPacientesForSelect('consulta_paciente');
    loadMedicosForSelect('consulta_medico');
    
    // Establecer fecha actual
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('consulta_fecha').value = now.toISOString().slice(0, 16);
    
    new bootstrap.Modal(document.getElementById('modalConsulta')).show();
}

async function loadPacientesForSelect(selectId) {
    try {
        const res = await fetch(`${API_PACIENTES}`);
        if (res.ok) {
            const pacientes = await res.json();
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Seleccionar paciente</option>' +
                pacientes.map(p => `<option value="${p.id}">${p.nombre} ${p.apellido || ''} (${p.id})</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading patients for select:', error);
    }
}

async function loadMedicosForSelect(selectId) {
    try {
        const res = await fetch(`${API_MEDICOS}`);
        if (res.ok) {
            const medicos = await res.json();
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Seleccionar médico</option>' +
                medicos.map(m => `<option value="${m.id}">${m.nombre} ${m.apellido || ''} - ${m.especialidad || ''}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading doctors for select:', error);
    }
}

// -------------------------
// FUNCIONES DE GUARDADO
// -------------------------

async function saveMedico() {
    const medico = {
        nombre: document.getElementById('medico_nombre').value,
        apellido: document.getElementById('medico_apellido').value,
        especialidad: document.getElementById('medico_especialidad').value,
        telefono: document.getElementById('medico_telefono').value,
        email: document.getElementById('medico_email').value,
        documento: document.getElementById('medico_documento').value
    };
    
    try {
        const res = await fetch(`${API_MEDICOS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(medico)
        });
        
        if (res.ok) {
            showNotification("Médico creado exitosamente!");
            bootstrap.Modal.getInstance(document.getElementById('modalMedico')).hide();
            loadMedicos();
        } else {
            const errorData = await res.text();
            showNotification("Error creando médico: " + errorData, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error de conexión al crear médico", 'danger');
    }
}

async function saveCita() {
    const cita = {
        pacienteId: document.getElementById('cita_paciente').value,
        medicoId: document.getElementById('cita_medico').value,
        fecha: document.getElementById('cita_fecha').value,
        prioridad: document.getElementById('cita_prioridad').value,
        motivo: document.getElementById('cita_motivo').value,
        usuarioId: localStorage.getItem('userId'),
        rol: localStorage.getItem('rol')
    };
    
    try {
        const res = await fetch(`${API_CITAS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cita)
        });
        
        if (res.ok) {
            showNotification("Cita creada exitosamente!");
            bootstrap.Modal.getInstance(document.getElementById('modalCita')).hide();
            loadCitas();
        } else {
            const errorData = await res.text();
            showNotification("Error creando cita: " + errorData, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error de conexión al crear cita", 'danger');
    }
}

async function saveConsulta() {
    const consulta = {
        medico: { id: document.getElementById('consulta_medico').value },
        fecha: document.getElementById('consulta_fecha').value,
        diagnostico: document.getElementById('consulta_diagnostico').value,
        tratamiento: document.getElementById('consulta_tratamiento').value,
        observaciones: document.getElementById('consulta_observaciones').value
    };
    
    const pacienteId = document.getElementById('consulta_paciente').value;
    
    try {
        const res = await fetch(`${API_PACIENTES}/${pacienteId}/consultas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(consulta)
        });
        
        if (res.ok) {
            showNotification("Consulta registrada exitosamente!");
            bootstrap.Modal.getInstance(document.getElementById('modalConsulta')).hide();
            loadConsultas();
        } else {
            const errorData = await res.text();
            showNotification("Error registrando consulta: " + errorData, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification("Error de conexión al registrar consulta", 'danger');
    }
}

// -------------------------
// INICIALIZACIÓN
// -------------------------

document.addEventListener('DOMContentLoaded', async function() {
    const ok = await ensureAuth();
    if(!ok) return;
    
    document.querySelectorAll('.sidebar .nav-link').forEach(a => {
        a.addEventListener('click', (ev) => {
            ev.preventDefault();
            const s = a.getAttribute('data-section');
            if(s) showSection(s);
        });
    });

    // Create Patient Form Handler
    const formCrear = document.getElementById('form-crear-paciente');
    if (formCrear) {
        formCrear.addEventListener('submit', async (e) => {
            e.preventDefault();
            const paciente = {
                nombre: document.getElementById('crear-nombre').value,
                apellido: document.getElementById('crear-apellido').value,
                edad: parseInt(document.getElementById('crear-edad').value) || null,
                telefono: document.getElementById('crear-telefono').value,
                direccion: document.getElementById('crear-direccion').value,
            };
            
            try {
                const res = await fetch(API_PACIENTES, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(paciente)
                });
                
                if (res.ok) {
                    showNotification("Paciente creado exitosamente!");
                    formCrear.reset();
                    listarPacientes();
                    // Update stats
                    const currentStats = getCurrentStats();
                    setStats({...currentStats, pacientes: currentStats.pacientes + 1});
                } else {
                    const errorData = await res.text();
                    showNotification("Error creando paciente: " + errorData, 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification("Error de conexión al crear paciente", 'danger');
                // Fallback to mock behavior
                savePacienteMock();
            }
        });
    }
    
    // Cargar dashboard con datos reales
    await loadDashboard();
    showSection('dashboard');
});
