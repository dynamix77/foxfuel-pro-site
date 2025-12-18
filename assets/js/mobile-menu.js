document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    // Toggle Menu Function
    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('active');

        if (isOpen) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            body.style.overflow = ''; // Restore scrolling
        } else {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden'; // Lock scrolling
        }
    }

    // Event Listeners for Open/Close
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    // Submenu Accordion Logic
    const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

    submenuToggles.forEach(btn => {
        btn.addEventListener('click', function () {
            // Toggle current
            const submenu = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            this.classList.toggle('active');

            if (submenu.style.maxHeight) {
                submenu.style.maxHeight = null;
                submenu.classList.remove('open');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                submenu.classList.add('open');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            }

            // Optional: Close others? 
            // The prompt doesn't specify accordion behavior (one open at a time), 
            // so allowing multiple open is standard and user-friendly.
        });
    });

    // Close menu on link click (optional but good UX)
    const links = mobileMenu ? mobileMenu.querySelectorAll('a:not(.mobile-submenu-toggle)') : [];
    links.forEach(link => {
        link.addEventListener('click', function () {
            // Only close if it's not a toggle
            toggleMenu();
        });
    });
});
