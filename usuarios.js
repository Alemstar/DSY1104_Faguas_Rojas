
const form = document.getElementById('form-usuario');
const notificacion = document.getElementById('notificacion');
const usuarios = JSON.parse(localStorage.getItem('usuariosMock') || '[]');

function validarCampo(input, validador, mensaje) {
  input.addEventListener('input', () => {
    if (!validador(input.value)) {
      input.setCustomValidity(mensaje);
    } else {
      input.setCustomValidity('');
    }
    input.reportValidity();
  });
}

const emailInput = document.getElementById('email');
validarCampo(emailInput, v => v.length <= 100 && /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(v), 'Email inválido o dominio no permitido');

const passwordInput = document.getElementById('password');
validarCampo(passwordInput, v => v.length >= 4 && v.length <= 10, 'Password debe tener entre 4 y 10 caracteres');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  const errores = [];

  if (!datos.nombre?.trim()) errores.push('❌ Nombre es obligatorio.');
  if (!datos.apellidos?.trim()) errores.push('❌ Apellidos son obligatorios.');
  if (!datos.email?.trim() || datos.email.length > 100 || !/@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(datos.email)) errores.push('❌ Email inválido o dominio no permitido.');
  if (!datos.fechaNacimiento) errores.push('❌ Fecha de nacimiento es obligatoria.');
  if (!datos.password || datos.password.length < 4 || datos.password.length > 10) errores.push('❌ Password debe tener entre 4 y 10 caracteres.');

  // Calcular edad
  let edad = null;
  let cumpleHoy = false;
  if (datos.fechaNacimiento) {
    const nacimiento = new Date(datos.fechaNacimiento);
    const hoy = new Date();
    edad = hoy.getFullYear() - nacimiento.getFullYear();
    if (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    cumpleHoy = hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() === nacimiento.getDate();
    if (isNaN(nacimiento.getTime()) || edad < 0 || edad > 120) errores.push('❌ Fecha de nacimiento inválida.');
  }

  // Flags
  const flags = {};
  if (edad !== null && edad >= 50) flags.flag50 = true;
  if (datos.codigoPromo === 'FELICES50') flags.flag10 = true;
  if ((datos.email?.endsWith('@duoc.cl') || datos.email?.endsWith('@profesor.duoc.cl')) && cumpleHoy) flags.flagCumple = true;

  if (errores.length > 0) {
    notificacion.textContent = errores.join('\n');
    notificacion.style.color = 'red';
    return;
  }

  // Guardado mock en localStorage
  const usuario = {
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    email: datos.email.trim(),
    fechaNacimiento: datos.fechaNacimiento,
    edad,
    password: datos.password,
    codigoPromo: datos.codigoPromo,
    ...flags
  };
  usuarios.push(usuario);
  localStorage.setItem('usuariosMock', JSON.stringify(usuarios));

  notificacion.textContent = `✅ ${usuario.nombre} ha sido registrado correctamente.`;
  notificacion.style.color = 'green';
  form.reset();
});
