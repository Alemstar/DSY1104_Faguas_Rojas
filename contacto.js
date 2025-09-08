// contacto.js
// Validación de formulario de contacto según reglas de negocio

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactoForm');
  const mensaje = document.getElementById('mensajeContacto');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const comentario = form.comentario.value.trim();

    // Validaciones
    if (!nombre || nombre.length > 100) {
      mostrarMensaje('El nombre es requerido y debe tener máximo 100 caracteres.', false);
      return;
    }
    if (!correo || correo.length > 100) {
      mostrarMensaje('El correo es requerido y debe tener máximo 100 caracteres.', false);
      return;
    }
    if (!/^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo)) {
      mostrarMensaje('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.', false);
      return;
    }
    if (!comentario || comentario.length > 500) {
      mostrarMensaje('El comentario es requerido y debe tener máximo 500 caracteres.', false);
      return;
    }
    // Simular envío interno
    mostrarMensaje('¡Mensaje enviado correctamente!', true);
    form.reset();
  });

  function mostrarMensaje(msg, exito) {
    mensaje.textContent = msg;
    mensaje.style.display = 'block';
    mensaje.style.color = exito ? 'green' : 'red';
    setTimeout(() => mensaje.style.display = 'none', 3500);
  }
});
