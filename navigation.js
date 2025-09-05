
// Resaltar sección activa
function highlightCurrentSection() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace('./', '/');
        if (currentPath.endsWith(linkPath)) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Manejo del menú móvil
function setupMobileMenu() {
    const navDrawer = document.querySelector('.nav-drawer');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navDrawer.open = !navDrawer.open;
        });

        // Cerrar menú al hacer clic en un enlace
        navDrawer.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', () => {
                navDrawer.open = false;
            });
        });
    }
}

// Inicializar todas las funcionalidades
document.addEventListener('DOMContentLoaded', () => {
    highlightCurrentSection();
    setupMobileMenu();

});
