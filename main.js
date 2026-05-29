/* ============================================================
   NOVU STUDIO — main.js
   ============================================================ */

/* ============================================================
   EMAILJS — CONFIGURACIÓN
   ============================================================
   Sigue estos pasos ANTES de publicar la web:

   1. Crea una cuenta gratuita en https://www.emailjs.com

   2. SERVICIO DE EMAIL:
      → "Email Services" → "Add New Service" → selecciona Gmail
      → Autoriza tu cuenta de Google
      → Dale un nombre (ej: "novu_gmail") y guarda
      → Copia el "Service ID" y pégalo en EMAILJS_SERVICE_ID abajo

   3. PLANTILLA DE EMAIL:
      → "Email Templates" → "Create New Template"
      → En el diseño de la plantilla, usa estas variables:
          De:      {{nombre}} ({{email}})
          Asunto:  Nueva consulta web — {{negocio}}
          Cuerpo:
            Nombre: {{nombre}}
            Negocio: {{negocio}}
            Teléfono: {{telefono}}
            Email: {{email}}
            Mensaje: {{mensaje}}
      → En "To Email" pon: ferrermoralejavictor@gmail.com
      → Guarda y copia el "Template ID" → pégalo en EMAILJS_TEMPLATE_ID

   4. CLAVE PÚBLICA:
      → "Account" → "API Keys" → copia "Public Key"
      → Pégala en EMAILJS_PUBLIC_KEY abajo

   ============================================================ */

const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';    // ← pega aquí tu Public Key
const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';    // ← pega aquí tu Service ID
const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';  // ← pega aquí tu Template ID

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  initHeader();
  initScrollAnimations();
  initMobileMenu();
  initContactForm();
  initSmoothScroll();
});

/* ============================================================
   HEADER — sombra al hacer scroll
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   FORMULARIO DE CONTACTO — EmailJS
   ============================================================ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form, status)) return;

    btn.textContent = 'Enviando…';
    btn.disabled    = true;
    setStatus(status, '', '');

    const params = {
      nombre:   form.nombre.value.trim(),
      negocio:  form.negocio.value.trim(),
      telefono: form.telefono.value.trim(),
      email:    form.email.value.trim(),
      mensaje:  form.mensaje.value.trim(),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
      setStatus(status, '¡Mensaje enviado! Te respondo en menos de 24h. 🙌', 'success');
      form.reset();
    } catch (err) {
      setStatus(
        status,
        'Algo salió mal. Escríbeme directamente por WhatsApp.',
        'error'
      );
      console.error('EmailJS error:', err);
    } finally {
      btn.textContent = 'Enviar mensaje';
      btn.disabled    = false;
    }
  });
}

function validateForm(form, statusEl) {
  const nombre  = form.nombre.value.trim();
  const negocio = form.negocio.value.trim();
  const email   = form.email.value.trim();

  if (!nombre) {
    setStatus(statusEl, 'Por favor, introduce tu nombre.', 'error');
    form.nombre.focus();
    return false;
  }

  if (!negocio) {
    setStatus(statusEl, 'Por favor, introduce el nombre de tu negocio.', 'error');
    form.negocio.focus();
    return false;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus(statusEl, 'Por favor, introduce un email válido.', 'error');
    form.email.focus();
    return false;
  }

  return true;
}

function setStatus(el, message, type) {
  el.textContent = message;
  el.className   = type;
}

/* ============================================================
   SMOOTH SCROLL — nav links y botones internos
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const headerH = document.getElementById('header')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
