/* ========================================
   MAIN.JS - Site Functionality
   ========================================
   Mobile menu toggle and other interactions.
   Keep this file lean.
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------
     MOBILE MENU & SUBMENU
     (Handled by navigation.js)
     ---------------------------------------- */

  /* ----------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
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
