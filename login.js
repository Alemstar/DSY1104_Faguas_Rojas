const form = document.getElementById('login-form');
const feedback = document.getElementById('login-feedback');

function showMessage(msg, ok = true) {
  if (feedback) {
    feedback.textContent = msg;
    feedback.style.color = ok ? '#2e7d32' : '#c62828';
  } else {
    alert(msg);
  }
}

function validateEmail(email) {
  // simple regex
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
  // initialize state
  updateButtonState();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!validateEmail(email)) { showMessage('Email inválido', false); return; }
    if (!password || password.length < 4 || password.length > 10) { showMessage('Password debe tener entre 4 y 10 caracteres', false); return; }

    // éxito: guardar sesión en localStorage
    try {
      localStorage.setItem('sesionIniciada', JSON.stringify({ email: email, at: new Date().toISOString() }));
    } catch (e) { /* ignore */ }

    showMessage('Sesión iniciada correctamente', true);
    // limpiar formulario
    form.reset();
    // intentar guardar nombre y apellidos desde usuariosMock (si existe)
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuariosMock') || '[]');
      const found = usuarios.find(u => u.email === email) || null;
      const payload = { email: email, at: new Date().toISOString() };
      if (found) { payload.nombre = found.nombre; payload.apellidos = found.apellidos; }
      localStorage.setItem('sesionIniciada', JSON.stringify(payload));
    } catch (e) { /* ignore */ }

    // refresh badge and redirect to home after short delay
    renderSessionBadge();
    setTimeout(() => { window.location.href = './index.html'; }, 600);
  });
});

// Session badge UI
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
  } catch (e) { /* ignore */ }
}

// render on load
document.addEventListener('DOMContentLoaded', renderSessionBadge);
