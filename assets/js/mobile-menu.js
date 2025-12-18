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
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const submenu = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            if (!submenu) return;

            this.classList.toggle('active');

            if (submenu.classList.contains('open')) {
                // Close submenu
                submenu.style.maxHeight = '0px';
                submenu.classList.remove('open');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            } else {
                // Open submenu - temporarily remove max-height to measure
                submenu.style.maxHeight = 'none';
                const height = submenu.scrollHeight;
                submenu.style.maxHeight = '0px';

                // Force reflow then animate
                submenu.offsetHeight;
                submenu.style.maxHeight = height + 'px';
                submenu.classList.add('open');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Close menu on link click (optional but good UX)
    const links = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    links.forEach(link => {
        link.addEventListener('click', function () {
            toggleMenu();
        });
    });
});
