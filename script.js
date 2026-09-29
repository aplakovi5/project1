/**
 * NovaTech Landing Page - Interactive Script
 * Clean, Semantic, Accessible Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --- 1. DOM Elements Selection --- */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('mainNavigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastClose = document.getElementById('toastClose');
  const backToTopBtn = document.getElementById('backToTop');
  const featureCards = document.querySelectorAll('.feature-card');

  /* --- 2. Mobile Navigation Toggle --- */
  if (navToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => {
      toggleMenu();
    });

    // Close menu when clicking on any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* --- 3. Header Scroll Elevation & Back To Top Visibility --- */
  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blurred background upgrade
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --- 4. Active Navigation Link Spy via IntersectionObserver --- */
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const targetNav = link.getAttribute('data-nav');
            if (targetNav === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* --- 5. Interactive Glow Card Effect for Features --- */
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --- 6. Form Validation & Interactive Feedback --- */
  if (contactForm) {
    const formFields = {
      name: {
        input: document.getElementById('userName'),
        error: document.getElementById('nameError'),
        validate: (val) => val.trim().length >= 2,
        message: 'გთხოვთ შეიყვანოთ თქვენი სახელი (მინიმუმ 2 სიმბოლო)'
      },
      email: {
        input: document.getElementById('userEmail'),
        error: document.getElementById('emailError'),
        validate: (val) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val.trim());
        },
        message: 'გთხოვთ შეიყვანოთ ვალიდური ელ-ფოსტის მისამართი'
      },
      subject: {
        input: document.getElementById('userSubject'),
        error: document.getElementById('subjectError'),
        validate: (val) => val && val.trim() !== '',
        message: 'გთხოვთ აირჩიოთ თემა / მიმართულება'
      },
      message: {
        input: document.getElementById('userMessage'),
        error: document.getElementById('messageError'),
        validate: (val) => val.trim().length >= 8,
        message: 'შეტყობინება უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან'
      },
      consent: {
        input: document.getElementById('userConsent'),
        error: document.getElementById('consentError'),
        validate: (val, input) => input.checked,
        message: 'გთხოვთ დაეთანხმოთ მონაცემთა დამუშავების პოლიტიკას'
      }
    };

    // Helper to validate single field
    const validateField = (fieldKey) => {
      const field = formFields[fieldKey];
      if (!field || !field.input) return true;

      const isValid = field.validate(field.input.value, field.input);
      if (!isValid) {
        field.input.classList.add('is-invalid');
        if (field.error) field.error.textContent = field.message;
      } else {
        field.input.classList.remove('is-invalid');
        if (field.error) field.error.textContent = '';
      }
      return isValid;
    };

    // Live validation on blur & input
    Object.keys(formFields).forEach(key => {
      const field = formFields[key];
      if (field.input) {
        field.input.addEventListener('blur', () => validateField(key));
        field.input.addEventListener('input', () => {
          if (field.input.classList.contains('is-invalid')) {
            validateField(key);
          }
        });
        if (field.input.type === 'checkbox') {
          field.input.addEventListener('change', () => validateField(key));
        }
      }
    });

    // Form Submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.keys(formFields).forEach(key => {
        const valid = validateField(key);
        if (!valid) isFormValid = false;
      });

      if (!isFormValid) {
        // Focus first invalid input
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulated sending process
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        // Success handling
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Show Toast Notification
        showToast('შეტყობინება წარმატებით გაიგზავნა!', 'მადლობა, NovaTech-ის წარმომადგენელი უმოკლეს ვადაში დაგიკავშირდებათ.');

        // Reset form
        contactForm.reset();
        Object.keys(formFields).forEach(key => {
          formFields[key].input.classList.remove('is-invalid');
          if (formFields[key].error) formFields[key].error.textContent = '';
        });
      }, 1000);
    });
  }

  /* --- 7. Toast Notification Handler --- */
  let toastTimer = null;

  const showToast = (title, message) => {
    if (!toastNotification) return;

    const titleEl = document.getElementById('toastTitle');
    const msgEl = document.getElementById('toastMessage');

    if (titleEl && title) titleEl.textContent = title;
    if (msgEl && message) msgEl.textContent = message;

    toastNotification.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hideToast();
    }, 4500);
  };

  const hideToast = () => {
    if (toastNotification) {
      toastNotification.classList.remove('active');
    }
  };

  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }
});
