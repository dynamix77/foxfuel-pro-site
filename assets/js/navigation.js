/**
 * MOBILE NAVIGATION - Touch-Aware Implementation
 * Fixes responsiveness issues on Android devices (e.g., Pixel 8 Pro)
 */

const MobileMenu = {
    touchHandled: false,
    isOpen: false,

    init() {
        this.menu = document.querySelector('.mobile-menu');
        this.toggle = document.querySelector('.nav-mobile-toggle');
        this.overlay = document.querySelector('.mobile-menu-overlay');
        this.body = document.body;

        if (!this.toggle || !this.menu) return;

        this.bindEvents();
        this.setupSubmenus();
    },

    bindEvents() {
        // Toggle Button
        this.addTouchAwareListener(this.toggle, () => this.toggleMenu());

        // Overlay (Close on click/touch outside)
        if (this.overlay) {
            this.addTouchAwareListener(this.overlay, () => this.closeMenu());
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    },

    /**
     * Touch-aware event listener to fix Android responsiveness
     */
    addTouchAwareListener(element, callback) {
        // Touch start - set the flag
        element.addEventListener('touchstart', (e) => {
            this.touchHandled = true;
        }, { passive: true });

        // Touch end - handle if flag set
        element.addEventListener('touchend', (e) => {
            if (this.touchHandled) {
                e.preventDefault();
                this.touchHandled = false;
                callback();
            }
        });

        // Click - fallback for non-touch, skip if touch was handled
        element.addEventListener('click', (e) => {
            if (!this.touchHandled) {
                callback();
            }
            // Reset flag for subsequent clicks
            this.touchHandled = false;
        });
    },

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('active');
        this.toggle.classList.add('is-active');
        if (this.overlay) this.overlay.classList.add('active');
        this.body.style.overflow = 'hidden';
        this.toggle.setAttribute('aria-expanded', 'true');
    },

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.toggle.classList.remove('is-active');
        if (this.overlay) this.overlay.classList.remove('active');
        this.body.style.overflow = '';
        this.toggle.setAttribute('aria-expanded', 'false');
    },

    setupSubmenus() {
        const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

        submenuToggles.forEach(btn => {
            this.addTouchAwareListener(btn, () => {
                const parent = btn.closest('.mobile-has-submenu');
                if (!parent) return;

                const submenu = parent.querySelector('.mobile-submenu');
                const isOpen = parent.classList.contains('open');

                // Close other submenus (Accordion style)
                document.querySelectorAll('.mobile-has-submenu.open').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('open');
                    }
                });

                // Toggle current
                if (isOpen) {
                    parent.classList.remove('open');
                } else {
                    parent.classList.add('open');
                }
            });
        });
    }
};

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
});
