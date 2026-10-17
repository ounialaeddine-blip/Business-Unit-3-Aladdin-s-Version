/* =====================================================================
   COMMON.JS — code shared by BOTH pages (home + member page)
   ---------------------------------------------------------------------
   Loaded before home.js / member.js, so everything defined here can be
   used in those files without importing anything.

   Contents:
     A. Small helper functions
     B. Icons (inline SVG)
     C. Scrolling banner  ("THINK. BUILD. REPEAT.")
     D. Fade-in on scroll (.reveal)
   ===================================================================== */


/* ---------------------------------------------------------------------
   A. SMALL HELPER FUNCTIONS
   --------------------------------------------------------------------- */

// Shortcut: $('my-id') is the same as document.getElementById('my-id')
function $(id) {
  return document.getElementById(id);
}

// Makes text safe to put inside HTML (so a "<" in a biography can't break the page)
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 1 -> "01", 2 -> "02" ...
function pad(number) {
  return String(number).padStart(2, '0');
}

// Restart a CSS animation (used when the scene or tab changes)
function replayAnimation(element) {
  element.style.animation = 'none';
  void element.offsetWidth;        // forces the browser to "notice" the change
  element.style.animation = '';
}

// Smoothly scroll to a section by its id
function scrollToId(id) {
  const target = $(id);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}

// Briefly show an element (used for "Link copied" messages)
function flash(element, milliseconds) {
  element.hidden = false;
  setTimeout(function () { element.hidden = true; }, milliseconds);
}


/* ---------------------------------------------------------------------
   B. ICONS
   Small SVG drawings (from the free "Lucide" icon set).
   icon('mail') returns the SVG code as text.
   In the HTML, <i data-icon="mail"></i> is replaced by this SVG
   (add data-class="my-class" to give the SVG a CSS class).

   The four-point sparkle comes from the BU3 logo. It is used as a small
   decoration: <i data-sparkle></i>  or  sparkle() in JavaScript.
   --------------------------------------------------------------------- */
const ICONS = {
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
  'menu': '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'share-2': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'award': '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

function icon(name, className) {
  return '<svg class="' + (className || '') + '" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (ICONS[name] || '') + '</svg>';
}

// The sparkle is a filled shape (not a line drawing like the icons above)
function sparkle(className) {
  return '<svg class="home-sparkle ' + (className || '') + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 0C13.5 8.5 15.5 10.5 24 12C15.5 13.5 13.5 15.5 12 24C10.5 15.5 8.5 13.5 0 12C8.5 10.5 10.5 8.5 12 0Z"/></svg>';
}

// Replace every <i data-icon="..."> and <i data-sparkle> in the page by the real SVG
function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach(function (placeholder) {
    placeholder.outerHTML = icon(placeholder.dataset.icon, placeholder.dataset.class);
  });
  document.querySelectorAll('[data-sparkle]').forEach(function (placeholder) {
    placeholder.outerHTML = sparkle(placeholder.dataset.class);
  });
}


/* ---------------------------------------------------------------------
   C. SCROLLING BANNER ("THINK. BUILD. REPEAT.")
   The same text is repeated 4 times so the loop looks endless.
   useSparkle = true  -> home page (sparkle between the words)
   useSparkle = false -> member page (arrow between the words)
   --------------------------------------------------------------------- */
function renderStrip(trackId, useSparkle) {
  const separator = useSparkle ? sparkle() : icon('arrow-up-right');
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += '<span>THINK. <span>BUILD.</span> REPEAT. ' + separator + ' JEENISo BU3 <span> / </span></span>';
  }
  $(trackId).innerHTML = html;
}


/* ---------------------------------------------------------------------
   D. FADE-IN ON SCROLL
   Elements with class "reveal" get class "in-view" when they become
   visible (the CSS does the animation). Call this AFTER the page content
   has been built, otherwise generated elements are not watched.
   --------------------------------------------------------------------- */
function setupReveal(root) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  (root || document).querySelectorAll('.reveal').forEach(function (element) { observer.observe(element); });
}
