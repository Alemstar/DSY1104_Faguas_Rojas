
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
        // actualizar contador del carrito si existe
        function updateCartCount() {
            try {
                const el = document.getElementById('cart-count');
                if (!el) return;
                const raw = localStorage.getItem('carrito');
                const cart = raw ? JSON.parse(raw) : [];
                const total = cart.reduce((s, i) => s + (i.qty || 0), 0);
                el.textContent = total;
            } catch (e) {
                // ignore
            }
        }
        updateCartCount();
        window.addEventListener('storage', (e) => { if (e.key === 'carrito') updateCartCount(); });
        window.addEventListener('updateCartCount', updateCartCount);

            // Make header cart buttons navigate to carrito.html
            document.querySelectorAll('.btn-icon').forEach(btn => {
                try {
                    const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    if (aria.includes('carrito') || aria.includes('cart')) {
                        btn.addEventListener('click', (ev) => { ev.preventDefault(); window.location.href = './carrito.html'; });
                    }
                } catch (e) { /* ignore */ }
            });

});
