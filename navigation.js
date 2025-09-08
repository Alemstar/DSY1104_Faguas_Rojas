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

        // Render user name / actions in header (replace Iniciar sesión | Registrar usuario)
        function escapeHtml(str) {
            return String(str || '').replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s]);
        }

        function renderUserActions() {
            try {
                const container = document.querySelector('.acciones-usuario');
                if (!container) return;
                const raw = localStorage.getItem('sesionIniciada');
                const s = raw ? JSON.parse(raw) : null;
                if (s && (s.nombre || s.apellidos || s.email)) {
                    const nombre = escapeHtml(s.nombre || '');
                    const apellidos = escapeHtml(s.apellidos || '');
                    const label = (nombre || apellidos) ? `${nombre} ${apellidos}` : escapeHtml(s.email);
                    container.innerHTML = '';

                    const nameEl = document.createElement('span');
                    nameEl.className = 'user-name';
                    nameEl.tabIndex = 0;
                    nameEl.textContent = label;
                    nameEl.style.cursor = 'pointer';
                    nameEl.style.fontWeight = '600';
                    container.appendChild(nameEl);

                    // pop-up element (created once)
                    let popup = document.getElementById('user-popup');
                    if (!popup) {
                        popup = document.createElement('div');
                        popup.id = 'user-popup';
                        popup.setAttribute('role', 'dialog');
                        popup.setAttribute('aria-hidden', 'true');
                        popup.style.display = 'none';
                        document.body.appendChild(popup);
                    }

                    function showPopup() {
                        popup.innerHTML = '';
                        popup.style.display = 'block';
                        popup.setAttribute('aria-hidden', 'false');
                        // position near header right
                        popup.style.position = 'fixed';
                        popup.style.top = '3.8rem';
                        popup.style.right = '1rem';
                        popup.style.background = 'var(--surface)';
                        popup.style.border = '1px solid var(--border)';
                        popup.style.padding = '.6rem';
                        popup.style.borderRadius = '8px';
                        popup.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        popup.style.zIndex = '9999';

                        const info = document.createElement('div');
                        info.textContent = label;
                        info.style.marginBottom = '.5rem';
                        info.style.fontWeight = '600';
                        popup.appendChild(info);

                        const perfilBtn = document.createElement('button');
                        perfilBtn.type = 'button';
                        perfilBtn.textContent = 'Ver perfil';
                        perfilBtn.className = 'btn-primary';
                        perfilBtn.style.padding = '.4rem .6rem';
                        perfilBtn.style.marginBottom = '.5rem';
                        perfilBtn.style.display = 'block';
                        perfilBtn.style.width = '100%';
                        perfilBtn.addEventListener('click', (ev) => {
                            ev.preventDefault();
                            window.location.href = './perfil.html';
                            hidePopup();
                        });
                        popup.appendChild(perfilBtn);

                        const logoutBtn = document.createElement('button');
                        logoutBtn.type = 'button';
                        logoutBtn.textContent = 'Cerrar sesión';
                        logoutBtn.className = 'btn-primary';
                        logoutBtn.style.padding = '.4rem .6rem';
                        logoutBtn.addEventListener('click', (ev) => {
                            ev.preventDefault(); ev.stopPropagation();
                            const prevY = window.scrollY || window.pageYOffset || 0;
                            try { localStorage.removeItem('sesionIniciada'); } catch (e) {}
                            hidePopup();
                            renderUserActions();
                            // restore scroll to avoid jumping to footer
                            window.scrollTo(0, prevY);
                            // move focus back to brand (home link) to keep viewport stable
                            const brand = document.querySelector('.brand');
                            if (brand && typeof brand.focus === 'function') brand.focus();
                        });
                        popup.appendChild(logoutBtn);
                    }

                    function hidePopup() {
                        if (!popup) return;
                        popup.style.display = 'none';
                        popup.setAttribute('aria-hidden', 'true');
                    }

                    nameEl.addEventListener('click', (ev) => { ev.stopPropagation(); showPopup(); });
                    nameEl.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); showPopup(); } });

                    // close on outside click or ESC
                    document.addEventListener('click', (e) => { const popupEl = document.getElementById('user-popup'); if (popupEl && !popupEl.contains(e.target) && e.target !== nameEl) hidePopup(); });
                    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePopup(); });

                } else {
                    container.innerHTML = `<a href="/login.html" class="link-usuario">Iniciar sesión</a><span>|</span><a href="/registro.html" class="link-usuario">Registrar usuario</a>`;
                    container.querySelectorAll('a').forEach(a => a.addEventListener('click', (ev) => { /* let default navigation occur */ }));
                }
            } catch (e) { /* ignore */ }
        }

        renderUserActions();
        // update when session changes in other tabs
        window.addEventListener('storage', (e) => { if (e.key === 'sesionIniciada') renderUserActions(); });

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
