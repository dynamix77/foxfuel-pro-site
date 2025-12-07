/**
 * FOX FUEL B2B WEBSITE - SITE INTERACTIONS (PRODUCTION)
 *
 * Version: 1.0.0
 * Last Updated: December 2024
 *
 * Progressive enhancement JavaScript for:
 * - Homepage_PRODUCTION.html
 * - Services_Hub_PRODUCTION.html
 * - Bulk_Fuel_Delivery_PRODUCTION.html
 * - Fleet_Fueling_PRODUCTION.html
 * - Jobsite_Fueling_PRODUCTION.html
 * - Generator_Fueling_PRODUCTION.html
 *
 * Claude Skills Applied:
 * - Skill #10: WCAG 2.1 AA Keyboard/Navigation Compliance
 * - Skill #20: Customer Segment-Aware Paths
 * - Skill #23: UX Consistency Across Viewports
 * - Skill #26: Trust & Perception Safeguards
 * - Skill #29: CTA Behavior + Telemetry
 *
 * Browser Support: Modern browsers (ES6+)
 * - Chrome 60+
 * - Firefox 60+
 * - Safari 12+
 * - Edge 79+
 */

(function(window, document) {
  'use strict';

  // ========================================================================
  // CONFIGURATION & CONSTANTS
  // ========================================================================

  const CONFIG = {
    // Scroll behavior
    scrollOffset: 80, // Offset for sticky header
    scrollDuration: 800, // Smooth scroll duration (ms)

    // Sticky CTA
    stickyCTAThreshold: 0.1, // Show when 10% of hero is visible

    // Mobile breakpoint
    mobileBreakpoint: 768,

    // Analytics
    analyticsEnabled: true, // Toggle analytics tracking
    analyticsDebug: true, // Log to console instead of GA

    // Accessibility
    respectReducedMotion: true,

    // Form validation
    phonePattern: /^[\d\s\-\(\)]+$/,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  };

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  /**
   * Check if user prefers reduced motion
   * Skill #10: Accessibility - Respect user preferences
   */
  const prefersReducedMotion = () => {
    return CONFIG.respectReducedMotion &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * Debounce function for performance optimization
   */
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /**
   * Check if element is visible in viewport
   */
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  /**
   * Get computed style value
   */
  const getComputedStyleValue = (element, property) => {
    return window.getComputedStyle(element).getPropertyValue(property);
  };

  // ========================================================================
  // ANALYTICS & TELEMETRY - Skill #29: CTA Behavior + Telemetry
  // ========================================================================

  const Analytics = {
    /**
     * Initialize analytics tracking
     */
    init() {
      if (!CONFIG.analyticsEnabled) return;

      // Initialize mock dataLayer for GTM compatibility
      window.dataLayer = window.dataLayer || [];

      this.trackPageView();
      this.setupCTATracking();
      this.setupFormTracking();
      this.setupServiceJourneyTracking();
    },

    /**
     * Track page view
     */
    trackPageView() {
      const pageData = {
        event: 'pageview',
        page: {
          path: window.location.pathname,
          title: document.title,
          url: window.location.href,
          referrer: document.referrer
        },
        timestamp: new Date().toISOString()
      };

      this._push(pageData);
    },

    /**
     * Track CTA button clicks
     * Skill #29: Conversion tracking for optimization
     */
    setupCTATracking() {
      const ctaButtons = document.querySelectorAll(
        '.btn-primary, .btn-secondary, .btn-emergency, .btn-tertiary'
      );

      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const ctaData = {
            event: 'cta_click',
            cta: {
              text: button.textContent.trim(),
              type: this._getButtonType(button),
              url: button.href || button.getAttribute('data-url'),
              location: this._getElementLocation(button),
              page: window.location.pathname
            },
            timestamp: new Date().toISOString()
          };

          this._push(ctaData);
        });
      });
    },

    /**
     * Track form interactions
     */
    setupFormTracking() {
      const forms = document.querySelectorAll('form');

      forms.forEach(form => {
        // Track form start (first field interaction)
        let formStarted = false;
        const formFields = form.querySelectorAll('input, select, textarea');

        formFields.forEach(field => {
          field.addEventListener('focus', () => {
            if (!formStarted) {
              formStarted = true;
              this._push({
                event: 'form_start',
                form: {
                  id: form.id || 'unnamed',
                  name: form.getAttribute('name'),
                  action: form.action,
                  page: window.location.pathname
                },
                timestamp: new Date().toISOString()
              });
            }
          });
        });

        // Track form submission
        form.addEventListener('submit', (e) => {
          this._push({
            event: 'form_submit',
            form: {
              id: form.id || 'unnamed',
              name: form.getAttribute('name'),
              action: form.action,
              page: window.location.pathname
            },
            timestamp: new Date().toISOString()
          });
        });
      });
    },

    /**
     * Track user journey through Services Hub to contact
     * Skill #20: Customer segment-aware paths
     */
    setupServiceJourneyTracking() {
      // Track service card clicks on Services Hub
      const serviceCards = document.querySelectorAll('.service-card a');

      serviceCards.forEach(link => {
        link.addEventListener('click', () => {
          this._push({
            event: 'service_selected',
            service: {
              name: link.textContent.trim(),
              url: link.href,
              fromPage: window.location.pathname
            },
            timestamp: new Date().toISOString()
          });
        });
      });

      // Track industry pathway selections
      const pathwayCards = document.querySelectorAll('.pathway-card a');

      pathwayCards.forEach(link => {
        link.addEventListener('click', () => {
          this._push({
            event: 'industry_pathway_selected',
            pathway: {
              industry: link.closest('.pathway-card')?.querySelector('h3')?.textContent.trim(),
              service: link.textContent.trim(),
              url: link.href,
              fromPage: window.location.pathname
            },
            timestamp: new Date().toISOString()
          });
        });
      });
    },

    /**
     * Get button type from class
     */
    _getButtonType(button) {
      if (button.classList.contains('btn-primary')) return 'primary';
      if (button.classList.contains('btn-secondary')) return 'secondary';
      if (button.classList.contains('btn-emergency')) return 'emergency';
      if (button.classList.contains('btn-tertiary')) return 'tertiary';
      return 'unknown';
    },

    /**
     * Get element location on page
     */
    _getElementLocation(element) {
      const section = element.closest('section');
      if (section) {
        return section.className || section.id || 'unknown-section';
      }
      return 'page-body';
    },

    /**
     * Push event to dataLayer or console
     */
    _push(data) {
      if (CONFIG.analyticsDebug) {
        console.log('[Analytics]', data);
      } else {
        window.dataLayer.push(data);
      }
    }
  };

  // ========================================================================
  // MOBILE NAVIGATION - Skill #10: Accessible Navigation
  // ========================================================================

  const MobileNav = {
    menuButton: null,
    menu: null,
    isOpen: false,

    /**
     * Initialize mobile navigation
     */
    init() {
      this.menuButton = document.querySelector('.mobile-menu-button');
      this.menu = document.querySelector('.main-nav');

      if (!this.menuButton || !this.menu) {
        // Create mobile menu button if it doesn't exist
        this.createMobileMenuButton();
      }

      if (this.menuButton && this.menu) {
        this.setupEventListeners();
        this.checkViewportWidth();
      }
    },

    /**
     * Create mobile menu button dynamically
     */
    createMobileMenuButton() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      const headerContainer = header.querySelector('.header-container');
      if (!headerContainer) return;

      // Create button
      const button = document.createElement('button');
      button.className = 'mobile-menu-button';
      button.setAttribute('aria-label', 'Toggle navigation menu');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'main-navigation');
      button.innerHTML = `
        <span class="menu-icon" aria-hidden="true">
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </span>
      `;

      // Add to header
      const nav = headerContainer.querySelector('.main-nav');
      if (nav) {
        nav.id = 'main-navigation';
        headerContainer.insertBefore(button, nav);
        this.menuButton = button;
        this.menu = nav;
      }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Button click
      this.menuButton.addEventListener('click', () => this.toggle());

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Click outside to close
      document.addEventListener('click', (e) => {
        if (this.isOpen &&
            !this.menu.contains(e.target) &&
            !this.menuButton.contains(e.target)) {
          this.close();
        }
      });

      // Window resize handler
      window.addEventListener('resize', debounce(() => {
        this.checkViewportWidth();
      }, 250));

      // Trap focus within menu when open
      this.menu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && this.isOpen) {
          this.trapFocus(e);
        }
      });
    },

    /**
     * Toggle menu open/closed
     */
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    /**
     * Open menu
     */
    open() {
      this.isOpen = true;
      this.menu.classList.add('nav-open');
      this.menuButton.classList.add('menu-open');
      this.menuButton.setAttribute('aria-expanded', 'true');

      // Prevent body scroll on mobile
      if (window.innerWidth < CONFIG.mobileBreakpoint) {
        document.body.style.overflow = 'hidden';
      }

      // Focus first menu item
      const firstLink = this.menu.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    },

    /**
     * Close menu
     */
    close() {
      this.isOpen = false;
      this.menu.classList.remove('nav-open');
      this.menuButton.classList.remove('menu-open');
      this.menuButton.setAttribute('aria-expanded', 'false');

      // Restore body scroll
      document.body.style.overflow = '';

      // Return focus to button
      this.menuButton.focus();
    },

    /**
     * Check viewport width and adjust menu
     */
    checkViewportWidth() {
      if (window.innerWidth >= CONFIG.mobileBreakpoint) {
        // Desktop view - ensure menu is visible
        this.menu.classList.remove('nav-open');
        this.menuButton.classList.remove('menu-open');
        this.isOpen = false;
        document.body.style.overflow = '';
      }
    },

    /**
     * Trap focus within menu (accessibility)
     * Skill #10: Keyboard navigation
     */
    trapFocus(e) {
      const focusableElements = this.menu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  // ========================================================================
  // SMOOTH SCROLL - Skill #23: Enhanced UX
  // ========================================================================

  const SmoothScroll = {
    /**
     * Initialize smooth scrolling for anchor links
     */
    init() {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');

      anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href');

          // Skip empty hash or hash-only links
          if (targetId === '#' || targetId === '') return;

          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            e.preventDefault();
            this.scrollToElement(targetElement);
          }
        });
      });
    },

    /**
     * Scroll to element with offset
     */
    scrollToElement(element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - CONFIG.scrollOffset;

      // Respect reduced motion preference
      if (prefersReducedMotion()) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'auto'
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      // Update URL hash without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, `#${element.id}`);
      }

      // Focus target for keyboard users (skip to content)
      element.setAttribute('tabindex', '-1');
      element.focus();
    }
  };

  // ========================================================================
  // STICKY CTA BAR - Skill #29: Persistent Conversion
  // ========================================================================

  const StickyCTA = {
    bar: null,
    heroSection: null,
    observer: null,

    /**
     * Initialize sticky CTA bar with Intersection Observer
     */
    init() {
      this.bar = document.querySelector('.sticky-cta-bar');
      this.heroSection = document.querySelector('.hero');

      if (!this.bar || !this.heroSection) return;

      this.setupIntersectionObserver();
      this.setupFormFocusHide();
    },

    /**
     * Setup Intersection Observer for hero section
     */
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: CONFIG.stickyCTAThreshold
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Hero is visible - hide sticky CTA
            this.bar.classList.remove('sticky-visible');
          } else {
            // Hero is not visible - show sticky CTA
            this.bar.classList.add('sticky-visible');
          }
        });
      }, options);

      this.observer.observe(this.heroSection);
    },

    /**
     * Hide sticky CTA when form fields are focused on mobile
     * Skill #23: Mobile UX enhancement
     */
    setupFormFocusHide() {
      if (window.innerWidth >= CONFIG.mobileBreakpoint) return;

      const formFields = document.querySelectorAll('input, textarea, select');

      formFields.forEach(field => {
        field.addEventListener('focus', () => {
          this.bar.style.display = 'none';
        });

        field.addEventListener('blur', () => {
          this.bar.style.display = '';
        });
      });
    },

    /**
     * Cleanup observer
     */
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  };

  // ========================================================================
  // FAQ ACCORDIONS - Skill #10: Accessible Accordions
  // ========================================================================

  const Accordions = {
    /**
     * Initialize all FAQ accordions
     */
    init() {
      const faqButtons = document.querySelectorAll('.faq-item button');

      faqButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.toggle(button);
        });

        // Keyboard support (Enter and Space)
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle(button);
          }
        });
      });
    },

    /**
     * Toggle accordion item
     */
    toggle(button) {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const icon = button.querySelector('.faq-icon');

      // Close other accordions (one-at-a-time behavior)
      // Comment out the following block for allow-multiple behavior
      const allButtons = button.closest('.faq-list').querySelectorAll('.faq-item button');
      allButtons.forEach(otherButton => {
        if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
          const otherAnswerId = otherButton.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherAnswerId);
          const otherIcon = otherButton.querySelector('.faq-icon');

          otherButton.setAttribute('aria-expanded', 'false');
          otherAnswer.hidden = true;
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      // Toggle current item
      button.setAttribute('aria-expanded', !expanded);
      answer.hidden = expanded;
      if (icon) icon.textContent = expanded ? '+' : '−';

      // Smooth scroll to expanded item if it's below viewport
      if (!expanded && !isInViewport(button)) {
        setTimeout(() => {
          const buttonPosition = button.getBoundingClientRect().top;
          const offsetPosition = buttonPosition + window.pageYOffset - CONFIG.scrollOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        }, 100);
      }
    }
  };

  // ========================================================================
  // FORM VALIDATION & ENHANCEMENT - Skill #29: Conversion Optimization
  // ========================================================================

  const FormEnhancement = {
    /**
     * Initialize form enhancements
     */
    init() {
      const forms = document.querySelectorAll('form');

      forms.forEach(form => {
        this.setupValidation(form);
        this.preventDoubleSubmit(form);
        this.setupConditionalFields(form);
      });
    },

    /**
     * Setup client-side validation
     */
    setupValidation(form) {
      const submitButton = form.querySelector('[type="submit"]');

      form.addEventListener('submit', (e) => {
        let isValid = true;
        const errors = [];

        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            errors.push({
              field: field,
              message: `${this.getFieldLabel(field)} is required`
            });
          }
        });

        // Validate email fields
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          if (field.value && !CONFIG.emailPattern.test(field.value)) {
            isValid = false;
            errors.push({
              field: field,
              message: 'Please enter a valid email address'
            });
          }
        });

        // Validate phone fields
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
          if (field.value && !CONFIG.phonePattern.test(field.value)) {
            isValid = false;
            errors.push({
              field: field,
              message: 'Please enter a valid phone number'
            });
          }
        });

        // Display errors
        if (!isValid) {
          e.preventDefault();
          this.displayErrors(errors);

          // Focus first error field
          if (errors.length > 0) {
            errors[0].field.focus();
          }

          return false;
        }

        return true;
      });
    },

    /**
     * Get field label text
     */
    getFieldLabel(field) {
      const label = form.querySelector(`label[for="${field.id}"]`);
      if (label) {
        return label.textContent.replace(/\s*\*\s*$/, '').trim();
      }
      return field.name || field.id || 'This field';
    },

    /**
     * Display validation errors
     */
    displayErrors(errors) {
      errors.forEach(error => {
        // Add error class to field
        error.field.classList.add('field-error');

        // Create error message element
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = error.message;
        errorEl.setAttribute('role', 'alert');

        // Insert error message after field
        error.field.parentNode.insertBefore(errorEl, error.field.nextSibling);
      });

      // Announce errors to screen readers
      this.announceErrors(errors.length);
    },

    /**
     * Announce errors to screen readers
     * Skill #10: Accessibility
     */
    announceErrors(count) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.className = 'sr-only';
      announcement.textContent = `Form has ${count} error${count !== 1 ? 's' : ''}. Please correct and resubmit.`;

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    },

    /**
     * Prevent double submission
     * Skill #26: Trust & perception safeguards
     */
    preventDoubleSubmit(form) {
      let submitting = false;

      form.addEventListener('submit', (e) => {
        if (submitting) {
          e.preventDefault();
          return false;
        }

        // Only set submitting if validation passed
        if (!form.querySelectorAll('.field-error').length) {
          submitting = true;

          const submitButton = form.querySelector('[type="submit"]');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            submitButton.setAttribute('aria-busy', 'true');
          }

          // Re-enable after timeout (in case of network error)
          setTimeout(() => {
            submitting = false;
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Submit';
              submitButton.removeAttribute('aria-busy');
            }
          }, 10000);
        }
      });
    },

    /**
     * Setup conditional field visibility
     * Show/hide sections based on select values
     */
    setupConditionalFields(form) {
      const conditionalTriggers = form.querySelectorAll('[data-conditional-trigger]');

      conditionalTriggers.forEach(trigger => {
        const targetSelector = trigger.getAttribute('data-conditional-target');
        const showValue = trigger.getAttribute('data-conditional-value');
        const target = form.querySelector(targetSelector);

        if (!target) return;

        // Initial state
        this.updateConditionalField(trigger, target, showValue);

        // Update on change
        trigger.addEventListener('change', () => {
          this.updateConditionalField(trigger, target, showValue);
        });
      });
    },

    /**
     * Update conditional field visibility
     */
    updateConditionalField(trigger, target, showValue) {
      const currentValue = trigger.value;
      const shouldShow = currentValue === showValue;

      if (shouldShow) {
        target.style.display = '';
        target.setAttribute('aria-hidden', 'false');

        // Enable fields within
        target.querySelectorAll('input, select, textarea').forEach(field => {
          field.disabled = false;
        });
      } else {
        target.style.display = 'none';
        target.setAttribute('aria-hidden', 'true');

        // Disable fields within
        target.querySelectorAll('input, select, textarea').forEach(field => {
          field.disabled = true;
        });
      }
    }
  };

  // ========================================================================
  // IMAGE LAZY LOADING FALLBACK
  // ========================================================================

  const LazyLoading = {
    /**
     * Initialize lazy loading for browsers without native support
     */
    init() {
      // Check for native lazy loading support
      if ('loading' in HTMLImageElement.prototype) {
        return; // Browser supports native lazy loading
      }

      // Fallback for older browsers
      const images = document.querySelectorAll('img[loading="lazy"]');

      if ('IntersectionObserver' in window) {
        this.setupIntersectionObserver(images);
      } else {
        // Fallback: load all images immediately
        images.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      }
    },

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupIntersectionObserver(images) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));
    }
  };

  // ========================================================================
  // SERVICE JOURNEY TRACKING - Skill #20: Segment-Aware Paths
  // ========================================================================

  const JourneyTracking = {
    /**
     * Initialize journey tracking
     */
    init() {
      this.trackEntryPoint();
      this.trackServiceSelection();
      this.trackCTASequence();
    },

    /**
     * Track entry point to site
     */
    trackEntryPoint() {
      // Store entry page in sessionStorage
      if (!sessionStorage.getItem('foxfuel_entry_page')) {
        sessionStorage.setItem('foxfuel_entry_page', window.location.pathname);
        sessionStorage.setItem('foxfuel_entry_time', new Date().toISOString());
      }

      // Track referrer source
      if (document.referrer && !sessionStorage.getItem('foxfuel_referrer')) {
        sessionStorage.setItem('foxfuel_referrer', document.referrer);
      }
    },

    /**
     * Track service selection path
     */
    trackServiceSelection() {
      const serviceLinks = document.querySelectorAll(
        '.service-card a, .pathway-card a, .industry-card a'
      );

      serviceLinks.forEach(link => {
        link.addEventListener('click', () => {
          // Store service journey in sessionStorage
          const journey = JSON.parse(sessionStorage.getItem('foxfuel_journey') || '[]');
          journey.push({
            page: window.location.pathname,
            service: link.textContent.trim(),
            timestamp: new Date().toISOString()
          });
          sessionStorage.setItem('foxfuel_journey', JSON.stringify(journey));
        });
      });
    },

    /**
     * Track CTA sequence (which CTAs clicked in order)
     */
    trackCTASequence() {
      const ctaButtons = document.querySelectorAll(
        '.btn-primary, .btn-secondary, .btn-emergency'
      );

      ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
          const ctaSequence = JSON.parse(sessionStorage.getItem('foxfuel_cta_sequence') || '[]');
          ctaSequence.push({
            page: window.location.pathname,
            text: button.textContent.trim(),
            timestamp: new Date().toISOString()
          });
          sessionStorage.setItem('foxfuel_cta_sequence', JSON.stringify(ctaSequence));
        });
      });
    }
  };

  // ========================================================================
  // EXTERNAL LINK HANDLING - Skill #26: Trust Safeguards
  // ========================================================================

  const ExternalLinks = {
    /**
     * Initialize external link handling
     */
    init() {
      const externalLinks = document.querySelectorAll('a[href^="http"]');

      externalLinks.forEach(link => {
        const hostname = new URL(link.href).hostname;

        // Check if link is external
        if (hostname !== window.location.hostname) {
          // Add external indicator
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');

          // Add visual indicator (if not already present)
          if (!link.querySelector('.external-icon')) {
            const icon = document.createElement('span');
            icon.className = 'external-icon';
            icon.setAttribute('aria-label', '(opens in new window)');
            icon.innerHTML = ' ↗';
            link.appendChild(icon);
          }
        }
      });
    }
  };

  // ========================================================================
  // PERFORMANCE MONITORING
  // ========================================================================

  const Performance = {
    /**
     * Monitor and report performance metrics
     */
    init() {
      if (!window.performance || !CONFIG.analyticsEnabled) return;

      // Wait for page load
      window.addEventListener('load', () => {
        // Use setTimeout to ensure all metrics are available
        setTimeout(() => {
          this.reportMetrics();
        }, 0);
      });
    },

    /**
     * Report performance metrics
     */
    reportMetrics() {
      const perfData = window.performance.timing;
      const metrics = {
        event: 'performance_metrics',
        metrics: {
          pageLoadTime: perfData.loadEventEnd - perfData.navigationStart,
          domReadyTime: perfData.domContentLoadedEventEnd - perfData.navigationStart,
          serverResponseTime: perfData.responseEnd - perfData.requestStart,
          page: window.location.pathname
        },
        timestamp: new Date().toISOString()
      };

      if (CONFIG.analyticsDebug) {
        console.log('[Performance]', metrics);
      } else {
        window.dataLayer.push(metrics);
      }
    }
  };

  // ========================================================================
  // INITIALIZATION - Main Entry Point
  // ========================================================================

  /**
   * Initialize all modules when DOM is ready
   */
  const init = () => {
    console.log('[Fox Fuel] Initializing site interactions...');

    // Core functionality
    Analytics.init();
    MobileNav.init();
    SmoothScroll.init();
    StickyCTA.init();
    Accordions.init();
    FormEnhancement.init();

    // Progressive enhancements
    LazyLoading.init();
    JourneyTracking.init();
    ExternalLinks.init();
    Performance.init();

    console.log('[Fox Fuel] Site interactions initialized successfully.');

    // Expose for debugging (remove in production if needed)
    if (CONFIG.analyticsDebug) {
      window.FoxFuelDebug = {
        Analytics,
        MobileNav,
        StickyCTA,
        JourneyTracking,
        config: CONFIG
      };
    }
  };

  // ========================================================================
  // AUTO-INITIALIZATION
  // ========================================================================

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (StickyCTA.observer) {
      StickyCTA.destroy();
    }
  });

})(window, document);

/**
 * USAGE INSTRUCTIONS:
 *
 * 1. Link this file before closing </body> tag in all HTML files:
 *    <script src="/assets/js/site_interactions_PRODUCTION.js"></script>
 *
 * 2. Ensure jQuery is NOT required (vanilla JS only)
 *
 * 3. Configuration options at top of file can be adjusted per deployment
 *
 * 4. For production deployment:
 *    - Set CONFIG.analyticsDebug = false
 *    - Connect to actual Google Analytics / GTM
 *    - Minify this file
 *    - Consider code splitting for very large sites
 *
 * 5. Browser compatibility:
 *    - Modern browsers (ES6+)
 *    - For IE11 support, transpile with Babel and add polyfills
 *
 * 6. Testing checklist:
 *    - [ ] Mobile menu toggle works
 *    - [ ] Smooth scroll respects reduced motion
 *    - [ ] Sticky CTA appears/disappears correctly
 *    - [ ] FAQ accordions keyboard accessible
 *    - [ ] Form validation shows clear errors
 *    - [ ] Analytics events fire (check console in debug mode)
 *    - [ ] External links open in new tab
 *    - [ ] No console errors in any browser
 *
 * 7. Accessibility validation:
 *    - [ ] Keyboard navigation works throughout
 *    - [ ] Screen reader announces form errors
 *    - [ ] ARIA attributes update correctly
 *    - [ ] Focus management in modals/menus
 *    - [ ] Skip links function properly
 */
