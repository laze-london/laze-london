// consent.js — Cookie consent for Laze (static site, GitHub Pages).
// UK PECR / UK GDPR compliant. Vanilla JS, no libraries. All consent logic
// lives in this one file.
//
// Model: OPT-IN. Google Analytics (GA4) is the only non-essential cookie and
// it does NOT load or set any cookie until the visitor actively clicks Accept.
// The choice is stored in a first-party `laze_consent` cookie (12 months).
// A footer "Cookie settings" control re-opens the banner so the visitor can
// change or withdraw consent at any time.

(function () {
  'use strict';

  // ---- Config ---------------------------------------------------------------
  var GA_ID = 'G-K8Z70M8H6G';      // GA4 measurement ID
  var COOKIE_NAME = 'laze_consent'; // matches the Cookie Policy table
  var COOKIE_MONTHS = 12;           // 12-month expiry

  // ---- Cookie helpers -------------------------------------------------------
  function setCookie(name, value, months) {
    var d = new Date();
    d.setTime(d.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function getCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  // Expire a cookie across the path and the host/dot-host domain scopes GA uses.
  function deleteCookie(name) {
    var host = location.hostname;
    var expired = '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    document.cookie = name + expired;
    document.cookie = name + expired + ';domain=' + host;
    document.cookie = name + expired + ';domain=.' + host;
  }
  // Remove Google Analytics' own cookies (_ga, _ga_<id>, _gid, _gat…).
  function clearGaCookies() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0 ||
          n.indexOf('_gid') === 0 || n.indexOf('_gat') === 0) {
        deleteCookie(n);
      }
    });
  }

  // ---- Google Analytics (injected ONLY after consent) -----------------------
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || GA_ID.indexOf('G-') !== 0) return;
    gaLoaded = true;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
  // Stop GA from tracking and bin its cookies (used on reject / withdraw).
  function disableGA() {
    window['ga-disable-' + GA_ID] = true; // honoured by gtag if already loaded
    clearGaCookies();
  }

  // ---- Banner ---------------------------------------------------------------
  var banner, lastFocus;

  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cc-title');
    banner.setAttribute('aria-describedby', 'cc-desc');
    banner.setAttribute('tabindex', '-1');
    banner.hidden = true;
    banner.innerHTML =
      '<div class="cc-inner">' +
        '<div class="cc-text">' +
          '<p class="cc-title" id="cc-title">Cookies on laze.london</p>' +
          '<p class="cc-desc" id="cc-desc">We use essential cookies to make this ' +
          'site work and, with your consent, analytics cookies to understand how ' +
          'it’s used. See our <a href="/cookies">Cookie Policy</a> and ' +
          '<a href="/privacy">Privacy Policy</a>.</p>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn" data-consent="rejected">Reject</button>' +
          '<button type="button" class="cc-btn" data-consent="accepted">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    // Accept / Reject
    banner.querySelectorAll('[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        choose(btn.getAttribute('data-consent'));
      });
    });
    // Esc hides the banner without recording a choice (it returns next visit,
    // and is always re-openable from the footer). No cookie wall.
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideBanner();
    });
  }

  function showBanner() {
    if (!banner) buildBanner();
    lastFocus = document.activeElement;
    banner.hidden = false;
    banner.focus();
  }
  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Record a choice, act on it, and remember it for 12 months.
  function choose(value) {
    setCookie(COOKIE_NAME, value, COOKIE_MONTHS);
    if (value === 'accepted') loadGA();
    else disableGA(); // covers switching from accept -> reject
    hideBanner();
  }

  // ---- Init -----------------------------------------------------------------
  function init() {
    var consent = getCookie(COOKIE_NAME);
    if (consent === 'accepted') {
      loadGA();                 // returning visitor who opted in
    } else if (consent === 'rejected') {
      window['ga-disable-' + GA_ID] = true; // defensive; nothing to load
    } else {
      showBanner();             // no valid choice yet -> ask (before any GA)
    }
    // Footer "Cookie settings" (and any element) can re-open the banner.
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
