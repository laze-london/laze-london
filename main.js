// Laze homepage — small progressive-enhancement helpers.

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Services: swap the preview image on hover/focus
const serviceImg = document.getElementById('serviceImg');
document.querySelectorAll('.service').forEach((el) => {
  const src = el.getAttribute('data-img');
  if (!src || !serviceImg) return;
  const swap = () => { serviceImg.src = src; };
  el.addEventListener('mouseenter', swap);
  el.addEventListener('focus', swap);
});

// Contact form — no backend yet. Validate + show a friendly note.
// To make this actually send, point `action` at a service like Formspree.
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      status.textContent = 'Please enter a valid email.';
      form.email.focus();
      return;
    }
    status.textContent = 'Thanks — this demo form isn’t wired up yet.';
    form.reset();
  });
}
