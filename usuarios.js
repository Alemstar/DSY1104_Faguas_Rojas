const form = document.getElementById('form-usuario');
const notificacion = document.getElementById('notificacion');
const usuarios = [];

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  const errores = [];

  // Validaciones básicas
  if (datos.email !== datos.emailConfirm) errores.push('❌ Los correos no coinciden.');
  if (datos.password !== datos.passwordConfirm) errores.push('❌ Las contraseñas no coinciden.');

  const dominioValido = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(datos.email);
  if (!dominioValido) errores.push('❌ Dominio de correo no permitido.');

  const nacimiento = new Date(datos.fechaNacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumpleHoy = hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() === nacimiento.getDate();
  if (isNaN(nacimiento.getTime()) || edad < 0 || edad > 120) errores.push('❌ Fecha de nacimiento inválida.');

  if (datos.password.length < 4 || datos.password.length > 10) {
    errores.push('❌ La contraseña debe tener entre 4 y 10 caracteres.');
  }

  if (!datos.region || !datos.comuna) errores.push('❌ Región y comuna son obligatorias.');

  if (errores.length > 0) {
    notificacion.textContent = errores.join('\n');
    notificacion.style.color = 'red';
    return;
  }

  // Flags
  const flags = {};
  if (edad >= 50) flags.flag50 = true;
  if (datos.codigoPromo === 'FELICES50') flags.flag10 = true;
  if ((datos.email.endsWith('@duoc.cl') || datos.email.endsWith('@profesor.duoc.cl')) && cumpleHoy) {
    flags.flagCumple = true;
  }

  // Guardado mock
  usuarios.push({
    nombre: datos.nombre.trim(),
    email: datos.email.trim(),
    edad,
    region: datos.region,
    comuna: datos.comuna,
    telefono: datos.telefono,
    codigoPromo: datos.codigoPromo,
    ...flags
  });

  notificacion.textContent = `✅ ${datos.nombre} ha sido registrado correctamente.`;
  notificacion.style.color = 'green';
  form.reset();
});
