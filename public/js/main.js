// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => observer.observe(el));

// Smooth anchor scroll (supports #section and /#section)
function scrollToHash(hash) {
  if (!hash || hash === '#') return;
  const id = hash.replace(/^\/?#/, '');
  const target = document.getElementById(id);
  if (target) {
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  }
}

document.querySelectorAll('a[href*="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    const hashMatch = href.match(/#(.+)$/);
    if (!hashMatch) return;

    const id = hashMatch[1];
    const hash = '#' + id;
    const target = document.getElementById(id);
    const onHomepage = window.location.pathname === '/';

    if (href.startsWith('#') && target) {
      e.preventDefault();
      scrollToHash(hash);
      return;
    }

    if (onHomepage && target && href.startsWith('/#')) {
      e.preventDefault();
      history.replaceState(null, '', '/' + hash);
      scrollToHash(hash);
    }
  });
});

// Scroll to hash on page load (e.g. after form redirect or section routes)
function scrollOnLoad() {
  const section = document.body.dataset.scrollSection;
  if (section) {
    setTimeout(() => scrollToHash('#' + section), 100);
    return;
  }
  if (window.location.hash) {
    setTimeout(() => scrollToHash(window.location.hash), 100);
  }
}

window.addEventListener('load', scrollOnLoad);

// Contact form (AJAX + fallback redirect alerts)
const contactForm = document.getElementById('contactForm');
const successAlert = document.getElementById('formAlertSuccess');
const errorAlert = document.getElementById('formAlertError');

function hideFormAlerts() {
  successAlert?.classList.remove('visible');
  errorAlert?.classList.remove('visible');
}

function showFormAlert(type, message) {
  hideFormAlerts();
  const alert = type === 'success' ? successAlert : errorAlert;
  if (alert) {
    if (message) alert.textContent = message;
    alert.classList.add('visible');
  }
}

function setSubmitState(btn, state, message) {
  if (!btn) return;
  btn.disabled = state === 'loading' || state === 'success';
  btn.classList.toggle('is-success', state === 'success');
  btn.textContent = message;
  btn.style.opacity = state === 'loading' ? '0.7' : '1';
}

function validateContactForm(form) {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const service = form.service.value.trim();
  const budget = form.budget.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !service || !budget || !message) {
    return 'Please fill in all fields correctly and try again.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (message.length < 10) {
    return 'Please provide a bit more detail about your project.';
  }

  return null;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormAlerts();

    const btn = contactForm.querySelector('.form-submit');
    const validationError = validateContactForm(contactForm);

    if (validationError) {
      showFormAlert('error', validationError);
      return;
    }

    setSubmitState(btn, 'loading', 'Sending…');

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(new FormData(contactForm)),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showFormAlert('success', data.message);
        setSubmitState(btn, 'success', "✓ Message Sent! We'll reply within 24h.");
        contactForm.reset();
        history.replaceState(null, '', '/contact');
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      showFormAlert('error', data.message || 'Something went wrong. Please try again.');
      setSubmitState(btn, 'idle', 'Send Message →');
    } catch {
      showFormAlert(
        'error',
        'Network error. Please try again or email us at hello@nadevstudio.com.'
      );
      setSubmitState(btn, 'idle', 'Send Message →');
    }
  });
}

// URL query param banners (fallback when JS disabled / direct redirect)
function handleFormAlerts() {
  const params = new URLSearchParams(window.location.search);
  const submitBtn = document.querySelector('#contactForm .form-submit');

  if (params.get('sent') === 'true') {
    showFormAlert('success', "Message sent successfully! We'll get back to you within 24 hours.");
    setSubmitState(submitBtn, 'success', "✓ Message Sent! We'll reply within 24h.");
    history.replaceState(null, '', '/contact');
  }

  if (params.get('error')) {
    const messages = {
      validation: 'Please fill in all fields correctly and try again.',
      send: 'Something went wrong. Please try again or email us at hello@nadevstudio.com.',
    };
    showFormAlert('error', messages[params.get('error')] || messages.validation);
    setSubmitState(submitBtn, 'idle', 'Send Message →');
    history.replaceState(null, '', '/contact');
  }
}

handleFormAlerts();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
