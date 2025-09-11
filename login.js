const form = document.getElementById('login-form');
const feedback = document.getElementById('login-feedback');

function showMessage(msg, ok = true) {
  if (feedback) {
    feedback.textContent = msg;
    feedback.style.color = ok ? '#2e7d32' : '#c62828';
    
    // Si es un error de usuario no encontrado, agregar enlace al registro
    if (!ok && msg.includes('Usuario no encontrado')) {
      const registerLink = document.createElement('a');
      registerLink.href = './registro.html';
      registerLink.textContent = ' Ir al registro';
      registerLink.style.color = '#1976d2';
      registerLink.style.textDecoration = 'underline';
      feedback.appendChild(registerLink);
    }
  } else {
    alert(msg);
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!form) return;
  const submitBtn = document.getElementById('login-submit');
  const emailInput = form.email;
  const passwordInput = form.password;

  function updateButtonState() {
    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value || '';
    const valid = validateEmail(emailVal) && passVal.length >= 4 && passVal.length <= 10;
    if (submitBtn) {
      submitBtn.disabled = !valid;
      submitBtn.classList.toggle('btn-glow', valid);
    }
  }

  emailInput.addEventListener('input', updateButtonState);
  passwordInput.addEventListener('input', updateButtonState);
  updateButtonState();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    
    // Deshabilitar botón durante procesamiento
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verificando...';
    }
    
    if (!validateEmail(email)) { 
      showMessage('Email inválido', false);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
      return;
    }
    if (!password || password.length < 4 || password.length > 10) { 
      showMessage('Password debe tener entre 4 y 10 caracteres', false);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
      return;
    }

    // Verificar credenciales
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuariosMock') || '[]');
      const usuario = usuarios.find(u => u.email === email);
      
      if (!usuario) {
        showMessage('Usuario no encontrado. Por favor regístrate primero.', false);
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
          }
        }, 1500);
        return;
      }
      
      if (usuario.password !== password) {
        showMessage('Contraseña incorrecta. Inténtalo de nuevo.', false);
        passwordInput.value = '';
        passwordInput.focus();
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
          }
        }, 1500);
        return;
      }

      // Login exitoso
      const payload = { 
        email: email, 
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        at: new Date().toISOString() 
      };
      localStorage.setItem('sesionIniciada', JSON.stringify(payload));
      
      showMessage('Sesión iniciada correctamente', true);
      form.reset();
      renderSessionBadge();
      setTimeout(() => { window.location.href = './index.html'; }, 600);
      
    } catch (e) {
      showMessage('Error al verificar credenciales', false);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
    }
  });
});

function renderSessionBadge() {
  try {
    const s = JSON.parse(localStorage.getItem('sesionIniciada') || 'null');
    let badge = document.getElementById('session-badge');
    if (!s) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'session-badge';
      badge.setAttribute('aria-live','polite');
      badge.style.position = 'fixed';
      badge.style.right = '1rem';
      badge.style.bottom = '1rem';
      badge.style.background = 'rgba(93,64,55,0.95)';
      badge.style.color = 'white';
      badge.style.padding = '0.5rem 0.75rem';
      badge.style.borderRadius = '999px';
      badge.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
      badge.style.fontWeight = '600';
      badge.style.zIndex = '9999';
      document.body.appendChild(badge);
    }
    const name = (s.nombre && s.apellidos) ? `${s.nombre} ${s.apellidos}` : (s.email || 'Usuario');
    badge.textContent = name;
  } catch (e) { }
}

document.addEventListener('DOMContentLoaded', renderSessionBadge);
