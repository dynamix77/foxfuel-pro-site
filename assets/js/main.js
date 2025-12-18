/* ========================================
   MAIN.JS - Site Functionality
   ========================================
   Mobile menu toggle and other interactions.
   Keep this file lean.
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

  /* ----------------------------------------
     MOBILE MENU TOGGLE
     ---------------------------------------- */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const body = document.body;

  function openMenu() {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    body.classList.add('menu-open');
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    body.classList.remove('menu-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      const isOpen = menuToggle.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when clicking overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  /* ----------------------------------------
     MOBILE SUBMENU TOGGLES
     ---------------------------------------- */
  const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

  submenuToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const parent = this.parentElement;
      const submenu = parent.querySelector('.mobile-submenu');
      const isOpen = parent.classList.contains('open');

      // Close all other submenus
      document.querySelectorAll('.mobile-has-submenu.open').forEach(function(item) {
        if (item !== parent) {
          item.classList.remove('open');
        }
      });

      // Toggle current submenu
      if (isOpen) {
        parent.classList.remove('open');
      } else {
        parent.classList.add('open');
      }
    });
  });

  /* ----------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          closeMenu();
        }
      }
    });
  });

  /* ----------------------------------------
     HEADER SCROLL BEHAVIOR (Optional)
     ---------------------------------------- */
  // Uncomment to add shadow on scroll
  /*
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
  */

});
