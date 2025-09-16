async function doLogin(e){
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const spinner = document.getElementById('loginSpinner');
    
    // Validación básica
    if (!username || !password) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    // Verificar que los elementos existen
    if (!btn) {
        console.error('Botón de login no encontrado');
        return;
    }
    
    setLoading(true, btn, spinner);
    clearErrors();
    
    try{
        const res = await fetch('http://localhost:8080/api/auth/login',{
            method:'POST', 
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username,password})
        });
        
        if(!res.ok){
            const errorData = await res.text();
            throw new Error(errorData || 'Credenciales inválidas');
        }
        
        const me = await res.json();
        localStorage.setItem('token', me.token || '');
        localStorage.setItem('username', me.username || username);
        localStorage.setItem('userId', me.id || '');
        localStorage.setItem('rol', me.rol || '');
        
        // Mostrar mensaje de éxito
        showSuccess(`¡Bienvenido, ${me.username}!`);
        
        // Redirigir según rol
        setTimeout(() => {
            if(me.rol === 'ADMIN') window.location.href = 'admin-panel.html';
            else if(me.rol === 'MEDICO') window.location.href = 'medico.html';
            else window.location.href = 'paciente.html';
        }, 1000);
        
    }catch(err){
        console.error('Login error:', err);
        showError('Error: ' + err.message);
    }finally{
        setLoading(false, btn, spinner);
    }
}

async function doRegister(e){
    e.preventDefault();
    const ruser = document.getElementById('r_username').value.trim();
    const rpass = document.getElementById('r_password').value;
    const rrol = document.getElementById('r_rol').value;
    const rbtn = document.getElementById('registerBtn');
    const rspinner = document.getElementById('registerSpinner');
    
    // Validaciones
    if (!ruser || !rpass || !rrol) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    if (rpass.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Verificación de términos removida temporalmente
    
    // Verificar que los elementos existen
    if (!rbtn) {
        console.error('Botón de registro no encontrado');
        return;
    }
    
    setLoading(true, rbtn, rspinner);
    clearErrors();
    
    try{
        const res = await fetch('http://localhost:8080/api/auth/register',{
            method:'POST', 
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ username: ruser, password: rpass, rol: rrol })
        });
        
        if(!res.ok){
            const errorData = await res.text();
            throw new Error(errorData || 'No se pudo registrar');
        }
        
        // Auto-login después del registro
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method:'POST', 
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ username: ruser, password: rpass })
        });
        
        if(!loginRes.ok){
            throw new Error('Cuenta creada, pero no se pudo iniciar sesión automáticamente');
        }
        
        const me = await loginRes.json();
        localStorage.setItem('username', me.username || ruser);
        localStorage.setItem('userId', me.id || '');
        localStorage.setItem('rol', me.rol || rrol);
        
        showSuccess(`¡Cuenta creada exitosamente! Bienvenido, ${me.username}`);
        
        setTimeout(() => {
            if(me.rol === 'ADMIN') window.location.href = 'admin-panel.html';
            else if(me.rol === 'MEDICO') window.location.href = 'medico.html';
            else window.location.href = 'paciente.html';
        }, 1000);
        
    }catch(err){
        console.error('Register error:', err);
        showError('Error: ' + err.message);
    }finally{
        setLoading(false, rbtn, rspinner);
    }
}

// Funciones auxiliares
function setLoading(loading, btn, spinner) {
    if (!btn) return; // Verificar que el botón existe
    
    btn.disabled = loading;
    if (loading) {
        if (spinner) {
            spinner.classList.remove('d-none');
        }
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
    } else {
        if (spinner) {
            spinner.classList.add('d-none');
        }
        // Restaurar texto original del botón
        if (btn.id === 'loginBtn') {
            btn.innerHTML = 'Ingresar';
        } else {
            btn.innerHTML = 'Crear cuenta';
        }
    }
}

function showError(message) {
    // Ocultar todos los mensajes primero
    clearErrors();
    
    // Mostrar error en el tab activo
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
        const errorDiv = activeTab.querySelector('.alert-danger');
        if (errorDiv) {
            errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${message}`;
            errorDiv.classList.remove('d-none');
            
            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                errorDiv.classList.add('d-none');
            }, 5000);
        }
    }
}

function showSuccess(message) {
    // Ocultar todos los mensajes primero
    clearErrors();
    
    // Mostrar éxito en el tab activo
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
        const successDiv = activeTab.querySelector('.alert-success');
        if (successDiv) {
            successDiv.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
            successDiv.classList.remove('d-none');
            
            // Auto-ocultar después de 3 segundos
            setTimeout(() => {
                successDiv.classList.add('d-none');
            }, 3000);
        }
    }
}

function clearErrors() {
    // Ocultar todos los mensajes de error y éxito
    const errorDivs = document.querySelectorAll('.alert-danger');
    const successDivs = document.querySelectorAll('.alert-success');
    
    errorDivs.forEach(div => div.classList.add('d-none'));
    successDivs.forEach(div => div.classList.add('d-none'));
    
    // Limpiar validaciones de Bootstrap
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(inputId + 'Toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'bi bi-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'bi bi-eye';
    }
}

function init(){
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if(token && username){ 
        // Verificar si el usuario está logueado usando el token
        const authToken = token.startsWith('Bearer ') ? token : 'Bearer ' + token;
        fetch('http://localhost:8080/api/auth/me', {
            headers: { 'Authorization': authToken }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Usuario no válido');
        })
        .then(me => {
            if(me.rol === 'ADMIN') window.location.href = 'admin-panel.html';
            else if(me.rol === 'MEDICO') window.location.href = 'medico.html';
            else window.location.href = 'paciente.html';
        })
        .catch(() => {
            localStorage.clear();
        });
    }
}

// Manejar hash para mostrar tab de registro
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    // Si hay hash #tab-register, mostrar tab de registro
    if (window.location.hash === '#tab-register') {
        const registerTab = new bootstrap.Tab(document.getElementById('register-tab'));
        registerTab.show();
    }
    
    // Validación en tiempo real
    document.getElementById('r_password').addEventListener('input', function() {
        const password = this.value;
        const feedback = document.getElementById('r_passwordError');
        
        if (password.length > 0 && password.length < 6) {
            this.classList.add('is-invalid');
            feedback.textContent = 'La contraseña debe tener al menos 6 caracteres';
        } else {
            this.classList.remove('is-invalid');
        }
    });
});

