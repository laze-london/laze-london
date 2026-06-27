// Laze homepage — small progressive-enhancement helpers.

// Smoothly shrink the logo as you scroll. We map scroll position to a 0..1
// progress var (`--shrink`) and let CSS calc() interpolate font-size/padding.
// Because it's glued to scroll position (no CSS transition), it tracks the
// scroll 1:1 with no threshold snap. rAF-throttled so it stays at 60fps.
const navbar = document.querySelector('.navbar');
if (navbar) {
  const SHRINK_OVER = 160; // px of scroll over which the logo goes full -> compact

  // The bar is position:fixed, so the page is offset down by its full-size
  // height (measured here, with --shrink forced to 0). Re-measure on resize.
  const root = document.documentElement;
  const setNavOffset = () => {
    const saved = root.style.getPropertyValue('--shrink');
    root.style.setProperty('--shrink', '0');
    root.style.setProperty('--nav-offset', navbar.offsetHeight + 'px');
    root.style.setProperty('--shrink', saved || '0');
  };
  window.addEventListener('resize', setNavOffset, { passive: true });

  // Update directly on each scroll event. Setting one custom property is
  // cheap, and the browser already throttles scroll to ~frame rate — doing it
  // inline avoids requestAnimationFrame, which can be throttled and leave the
  // logo stuck at full size (the bug that made it "disappear" under the bar).
  const update = () => {
    const p = Math.min(1, Math.max(0, window.scrollY / SHRINK_OVER));
    root.style.setProperty('--shrink', p.toFixed(4));
  };
  window.addEventListener('scroll', update, { passive: true });

  setNavOffset();
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
