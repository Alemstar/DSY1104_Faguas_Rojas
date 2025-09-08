// perfil.js
// Lógica para formulario de perfil, validación, persistencia y mensajes

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('perfilForm');
    const mensajeExito = document.getElementById('mensajeExito');
    const beneficiosList = document.getElementById('beneficiosList');

    // Cargar datos guardados
    const datos = JSON.parse(localStorage.getItem('perfilUsuario')) || {
        nombre: '',
        direccion: '',
        categorias: [],
        beneficios: ['Descuento 10%', 'Envío gratis', 'Regalo sorpresa'] // ejemplo
    };

    document.getElementById('nombre').value = datos.nombre;
    document.getElementById('direccion').value = datos.direccion;
    Array.from(document.getElementById('categorias').options).forEach(opt => {
        opt.selected = datos.categorias.includes(opt.value);
    });

    // Mostrar flags de beneficios
    beneficiosList.innerHTML = '';
    datos.beneficios.forEach(flag => {
        const li = document.createElement('li');
        li.textContent = flag;
        beneficiosList.appendChild(li);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Validaciones
        const nombre = document.getElementById('nombre').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const categorias = Array.from(document.getElementById('categorias').selectedOptions).map(opt => opt.value);

        if (nombre.length < 2 || nombre.length > 50) {
            mostrarMensaje('El nombre debe tener entre 2 y 50 caracteres.', false);
            return;
        }
        if (direccion.length < 5 || direccion.length > 100) {
            mostrarMensaje('La dirección debe tener entre 5 y 100 caracteres.', false);
            return;
        }
        // Guardar en localStorage
        const nuevoPerfil = {
            nombre,
            direccion,
            categorias,
            beneficios: datos.beneficios
        };
        localStorage.setItem('perfilUsuario', JSON.stringify(nuevoPerfil));
        // Actualizar también los datos de sesión si existen
        let sesion = JSON.parse(localStorage.getItem('sesionIniciada')) || {};
        if (sesion) {
            sesion.nombre = nombre;
            // Si hay campo apellidos en el formulario, aquí se puede agregar
            localStorage.setItem('sesionIniciada', JSON.stringify(sesion));
        }
        // Refrescar el nombre mostrado en el perfil
        document.getElementById('perfilNombre').textContent = sesion.apellidos ? `${nombre} ${sesion.apellidos}` : nombre;
        mostrarMensaje('¡Cambios guardados exitosamente!', true);
    });

    function mostrarMensaje(msg, exito) {
        mensajeExito.textContent = msg;
        mensajeExito.style.display = 'block';
        mensajeExito.style.color = exito ? 'green' : 'red';
        setTimeout(() => mensajeExito.style.display = 'none', 3000);
    }
});
