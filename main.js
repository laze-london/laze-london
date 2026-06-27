// Laze homepage — small progressive-enhancement helpers.

// Smoothly shrink the logo as you scroll. We map scroll position to a 0..1
// progress var (`--shrink`) and let CSS calc() interpolate font-size/padding.
// Because it's glued to scroll position (no CSS transition), it tracks the
// scroll 1:1 with no threshold snap. rAF-throttled so it stays at 60fps.
const navbar = document.querySelector('.navbar');
const logo = navbar && navbar.querySelector('.logo');
if (navbar && logo) {
  const eyebrow = document.querySelector('.eyebrow');
  const SHRINK_OVER = 160; // px of scroll over which the logo goes full -> compact
  const SMALL_FONT = 46, SMALL_PAD = 18;
  let bigFont = 168, bigPad = 36;

  // Read the full-size values straight from CSS (responsive clamp / --pad),
  // then offset the page by the bar's full height. Everything below is plain
  // arithmetic applied as inline styles — no CSS calc(), so it renders the same
  // in every browser (Chrome, Comet, Safari, ...). Re-measure on resize.
  const measure = () => {
    logo.style.fontSize = '';
    navbar.style.paddingTop = navbar.style.paddingBottom = '';
    bigFont = parseFloat(getComputedStyle(logo).fontSize) || 168;
    bigPad = parseFloat(getComputedStyle(navbar).paddingTop) || 36;
    document.documentElement.style.setProperty('--nav-offset', navbar.offsetHeight + 'px');
  };
  const update = () => {
    const p = Math.min(1, Math.max(0, window.scrollY / SHRINK_OVER));
    logo.style.fontSize = (bigFont - (bigFont - SMALL_FONT) * p).toFixed(2) + 'px';
    const pad = (bigPad - (bigPad - SMALL_PAD) * p).toFixed(2) + 'px';
    navbar.style.paddingTop = pad;
    navbar.style.paddingBottom = pad;
    if (eyebrow) eyebrow.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
  measure();
  update();
}

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

// Services: reveal the preview image only while a service is hovered/focused,
// swapping to that service's own picture. Hidden otherwise.
const serviceImg = document.getElementById('serviceImg');
const serviceMedia = document.querySelector('.services-media');
const serviceList = document.querySelector('.services-list');
document.querySelectorAll('.service').forEach((el) => {
  const src = el.getAttribute('data-img');
  if (!src || !serviceImg) return;
  const show = () => {
    serviceImg.src = src;
    if (serviceMedia) serviceMedia.classList.add('is-visible');
  };
  el.addEventListener('mouseenter', show);
  el.addEventListener('focus', show);
});
const hide = () => serviceMedia && serviceMedia.classList.remove('is-visible');
if (serviceList) {
  serviceList.addEventListener('mouseleave', hide);
  serviceList.addEventListener('focusout', hide);
}

// Shop filters — show only products whose category matches the active tab.
const filters = document.querySelectorAll('.filter');
if (filters.length) {
  const products = document.querySelectorAll('.product');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');
      filters.forEach((b) => b.classList.toggle('is-active', b === btn));
      products.forEach((p) => {
        p.hidden = !(f === 'all' || p.getAttribute('data-category') === f);
      });
    });
  });
}

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
