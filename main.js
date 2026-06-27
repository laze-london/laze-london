// Laze homepage — small progressive-enhancement helpers.

// ===== Global contact component =====
// One source of truth for the contact form. Injected wherever a page has
// <div data-contact></div>, before the form handler below runs.
(function injectContact() {
  const mount = document.querySelector('[data-contact]');
  if (!mount) return;
  mount.outerHTML = `
    <section class="contact" id="contact">
      <div class="container contact-inner">
        <div class="section-title">
          <h2 class="h2">Contact</h2>
          <p class="contact-sub">Send a message about your piece. I'll get back to you within a few days.</p>
        </div>
        <form class="form" id="contactForm" novalidate>
          <div class="form-row">
            <div class="field"><label for="firstName">First name</label><input type="text" id="firstName" name="firstName" autocomplete="given-name" /></div>
            <div class="field"><label for="lastName">Last name</label><input type="text" id="lastName" name="lastName" autocomplete="family-name" /></div>
          </div>
          <div class="form-row form-row--stack">
            <div class="field"><label for="email">Email</label><input type="email" id="email" name="email" autocomplete="email" required /></div>
            <div class="field"><label for="phone">Phone number</label><input type="tel" id="phone" name="phone" autocomplete="tel" /></div>
          </div>
          <div class="field"><label for="message">Message</label><textarea id="message" name="message" rows="4" placeholder="Type your message…"></textarea></div>
          <div class="form-actions">
            <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
            <button type="submit" class="btn">Send</button>
          </div>
        </form>
      </div>
    </section>`;
})();

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

// About section: build the independent-swaying leaf strips. The artwork is
// pre-sliced into vertical strips; each gets its own amplitude/duration/phase
// so the plants drift apart instead of moving as one. Skipped for reduced motion.
const aboutSection = document.querySelector('.about');
if (aboutSection && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const STRIPS = [
    { img: 'assets/leaf-0.png', left: 0,     width: 23.82, amp: '1.3deg',  dur: '7.5s',  delay: '0s' },
    { img: 'assets/leaf-1.png', left: 16.18, width: 27.64, amp: '1.9deg',  dur: '9s',    delay: '-3.2s' },
    { img: 'assets/leaf-2.png', left: 36.18, width: 27.64, amp: '1.05deg', dur: '8.2s',  delay: '-1.5s' },
    { img: 'assets/leaf-3.png', left: 56.18, width: 27.64, amp: '1.7deg',  dur: '10.5s', delay: '-4.6s' },
    { img: 'assets/leaf-4.png', left: 76.18, width: 23.82, amp: '1.45deg', dur: '8.8s',  delay: '-2.3s' },
  ];
  const layer = document.createElement('div');
  layer.className = 'about-leaves';
  layer.setAttribute('aria-hidden', 'true');
  STRIPS.forEach((s) => {
    const el = document.createElement('span');
    el.className = 'leaf';
    el.style.left = s.left + '%';
    el.style.width = s.width + '%';
    el.style.backgroundImage = `url(${s.img})`;
    el.style.setProperty('--amp', s.amp);
    el.style.animationDuration = s.dur;
    el.style.animationDelay = s.delay;
    layer.appendChild(el);
  });
  aboutSection.insertBefore(layer, aboutSection.firstChild);
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

// Product page: tabs (Details / Shipping / Returns)
document.querySelectorAll('.tabs').forEach((tabs) => {
  const menu = [...tabs.querySelectorAll('.tab')];
  const panes = [...tabs.querySelectorAll('.tab-pane')];
  menu.forEach((tab) => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab');
      menu.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      panes.forEach((p) => { p.hidden = p.getAttribute('data-pane') !== name; });
    });
  });
});

// Product page: variant selection
document.querySelectorAll('.variants').forEach((group) => {
  const opts = [...group.querySelectorAll('.variant-opt')];
  opts.forEach((opt) => {
    opt.addEventListener('click', () => {
      if (opt.disabled) return;
      opts.forEach((o) => o.classList.toggle('is-selected', o === opt));
    });
  });
});

// Add to Cart / Buy Now — no store yet, so send the visitor to the contact form.
document.querySelectorAll('[data-enquire]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const c = document.getElementById('contact');
    if (c) c.scrollIntoView({ behavior: 'smooth' });
  });
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
