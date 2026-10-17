/* =====================================================================
   BU3 MEMBER SPOTLIGHT — JAVASCRIPT
   ---------------------------------------------------------------------
   This file reads the data from data.js and:
     1. picks which member to show (from the URL: ?member=slug)
     2. fills the page with that member's info
     3. makes everything interactive (scenes, tabs, pop-ups, buttons)

   Sections of this file:
     A. Small helper functions
     B. Icons
     C. Choose the member + page setup
     D. Hero scenes
     E. Static sections (story, skills, strip)
     F. Experience / Events / Certifications tabs
     G. Pop-ups (dialogs)
     H. Buttons (pause, share, copy email, scrolling)
     I. Start everything
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
   In index.html, <i data-icon="mail"></i> is replaced by this SVG.
   --------------------------------------------------------------------- */
const ICONS = {
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
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

// Replace every <i data-icon="..."> in the page by the real SVG
function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach(function (placeholder) {
    placeholder.outerHTML = icon(placeholder.dataset.icon, placeholder.dataset.class);
  });
}


/* ---------------------------------------------------------------------
   C. CHOOSE THE MEMBER + PAGE SETUP
   --------------------------------------------------------------------- */

// Read ?member=something from the address bar
const slugFromUrl = new URLSearchParams(window.location.search).get('member');

// Use that member, or the default one from data.js
const member = getMember(slugFromUrl) || getMember(DEFAULT_MEMBER_SLUG) || members[0];

// "Mohamed Aziz MILI" (without the final dot)
const fullName = member.firstName + ' ' + member.lastName.replace('.', '');

// The 3 hero scenes: person / ideas / possibilities
const frames = [
  { image: 'images/member-portrait.jpg', alt: 'Illustrative portrait of ' + fullName, label: 'The person', title: member.firstName, subtitle: member.lastName, number: '01', caption: member.caption },
  { image: projects[0].image, alt: projects[0].title, label: 'The ideas', title: 'Fresh ideas.', subtitle: 'New stories.', number: '02', caption: 'Creative direction / Beyond the ordinary' },
  { image: projects[1].image, alt: projects[1].title, label: 'The possibilities', title: 'Made to', subtitle: 'connect.', number: '03', caption: 'Collaboration / The idea collective' }
];

let currentScene = 0;   // which scene is showing (0, 1 or 2)
let paused = false;     // are the animations paused?

// Page title, theme color class, header label
function setupPage() {
  document.title = fullName + ' · BU3 Creative Portfolio | JEENISo';

  const page = $('page');
  if (member.isManager) page.classList.add('manager-portfolio');   // gold theme
  if (member.accent === 'pink') page.classList.add('pink-portfolio'); // pink theme

  $('spotlight-label').textContent = member.isManager ? 'MANAGER SPOTLIGHT' : 'MEMBER SPOTLIGHT';
  $('unit-description').textContent =
    fullName + ' · ' + member.role + ' of Business Unit 3. ' +
    'A JEENISo creative center where ideas become projects, experiences, and shared possibilities.';
}


/* ---------------------------------------------------------------------
   D. HERO SCENES
   --------------------------------------------------------------------- */

// Build the 3 tabs at the bottom of the hero (only once)
function buildSceneTabs() {
  let html = '';
  frames.forEach(function (frame, i) {
    html += '<button class="btn btn-ghost scene-tab" role="tab" data-scene="' + i + '">' +
      '<span>0' + (i + 1) + '</span>' + escapeHTML(frame.label) + '</button>';
  });
  $('scene-tabs').innerHTML = html;

  // One click listener for all tabs
  $('scene-tabs').addEventListener('click', function (event) {
    const tab = event.target.closest('[data-scene]');
    if (tab) showScene(Number(tab.dataset.scene));
  });
}

// Show scene number 0, 1 or 2
function showScene(index) {
  currentScene = index;
  const frame = frames[index];

  // Photo
  const photo = $('main-photo');
  photo.src = frame.image;
  photo.alt = frame.alt;
  photo.className = 'main-photo ' + (index === 0 ? 'portrait-frame' : 'object-frame');

  // Texts
  $('photo-index').textContent = frame.number + ' / 03';
  $('photo-caption').textContent = frame.caption;
  $('photo-action').setAttribute('aria-label', index === 0 ? 'About ' + member.firstName : 'Open featured project');

  if (index === 0) {
    $('title-eyebrow').textContent = member.isManager ? 'BUSINESS UNIT MANAGER' : 'A CREATIVE MIND IN MOTION';
  } else {
    $('title-eyebrow').textContent = 'IDEAS MADE REAL';
  }
  $('title-heading').innerHTML = escapeHTML(frame.title) + '<br /><span>' + escapeHTML(frame.subtitle) + '</span>';

  // Highlight the active tab
  document.querySelectorAll('.scene-tab').forEach(function (tab, i) {
    tab.classList.toggle('is-active', i === index);
    tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });

  // Replay the entrance animations
  replayAnimation($('stage-photo'));
  replayAnimation($('main-photo'));
  replayAnimation($('stage-title'));
}

// The round arrow button on the photo
function onPhotoAction() {
  if (currentScene === 0) {
    $('dialog-unit').showModal();
  } else {
    openProject(projects[currentScene - 1]);
  }
}


/* ---------------------------------------------------------------------
   E. STATIC SECTIONS (story, skills, scrolling strip, members list)
   --------------------------------------------------------------------- */

// Biography + About me (show "coming soon" when empty)
function renderStory() {
  fillStory('biography', member.biography, 'Biography coming soon.');
  fillStory('description', member.description, 'Personal description coming soon.');
}

function fillStory(elementId, text, placeholder) {
  const element = $(elementId);
  const hasText = text && text.trim() !== '';
  element.textContent = hasText ? text.trim() : placeholder;
  element.className = hasText ? 'member-story-copy' : 'member-story-copy member-story-placeholder';
}

// "My playground" list
function renderSkills() {
  let html = '';
  skills.forEach(function (skill, i) {
    html += '<div class="toolkit-row">' +
      '<span>0' + (i + 1) + '</span>' +
      '<div><h3>' + escapeHTML(skill.name) + '</h3><p>' + escapeHTML(skill.tags.slice(0, 3).join(' / ')) + '</p></div>' +
      icon('arrow-up-right') +
      '</div>';
  });
  $('toolkit-list').innerHTML = html;
}

// "THINK. BUILD. REPEAT." strip: the same text 4 times so the loop looks endless
function renderStrip() {
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += '<span>THINK. <span>BUILD.</span> REPEAT. ' + icon('arrow-up-right') + ' JEENISo BU3 <span> / </span></span>';
  }
  $('kinetic-track').innerHTML = html;
}

// List of all members inside the "Members" pop-up
function renderMembersList() {
  let html = '';
  members.forEach(function (m) {
    const name = m.firstName + ' ' + m.lastName.replace('.', '');
    html += '<a class="member-link' + (m.isManager ? ' member-link-manager' : '') + '" href="?member=' + encodeURIComponent(m.slug) + '">' +
      '<span class="member-link-dot" aria-hidden="true"></span>' +
      '<span class="member-link-name">' + escapeHTML(name) +
      (m.isManager ? '<span class="member-link-role">' + escapeHTML(m.role) + '</span>' : '') +
      '</span>' + icon('arrow-up-right') + '</a>';
  });
  $('members-list').innerHTML = html;
}


/* ---------------------------------------------------------------------
   F. EXPERIENCE / EVENTS / CERTIFICATIONS TABS
   --------------------------------------------------------------------- */
const categories = ['Experience', 'Events attended', 'Certifications'];
let currentCategory = 'Experience';

// How many items does each tab have? (shown as a small number)
function countFor(category) {
  if (category === 'Experience') return experiences.length;
  if (category === 'Events attended') return events.length;
  return certifications.length;
}

function renderBackgroundTabs() {
  let html = '';
  categories.forEach(function (category) {
    const selected = category === currentCategory;
    html += '<button class="btn btn-ghost background-tab' + (selected ? ' selected' : '') + '" role="tab" ' +
      'aria-selected="' + selected + '" data-category="' + escapeHTML(category) + '">' +
      escapeHTML(category) + '<span>' + pad(countFor(category)) + '</span></button>';
  });
  $('background-tabs').innerHTML = html;
}

function renderBackgroundPanel() {
  let html = '';

  if (currentCategory === 'Experience') {
    experiences.forEach(function (item, i) {
      html += '<article class="experience-line">' +
        '<span class="experience-order">0' + (i + 1) + '</span>' +
        '<div>' +
        '<p class="experience-period">' + escapeHTML(item.period) + '</p>' +
        '<h3>' + escapeHTML(item.title) + '</h3>' +
        '<p class="experience-org">' + escapeHTML(item.organization) + '</p>' +
        '<p class="experience-summary">' + escapeHTML(item.description) + '</p>' +
        '</div>' +
        '<span class="sample-caption">Sample</span>' +
        '</article>';
    });
  }

  if (currentCategory === 'Events attended') {
    html += '<div class="member-event-grid">';
    events.forEach(function (item, i) {
      html += '<article class="member-event">' +
        '<div class="member-event-photo">' +
        '<img src="' + escapeHTML(item.image) + '" alt="Illustrative ' + escapeHTML(item.type.toLowerCase()) + '" loading="lazy" width="1200" height="800" />' +
        '<button class="btn btn-ghost btn-icon" data-event="' + i + '" aria-label="View ' + escapeHTML(item.title) + '">' + icon('arrow-up-right') + '</button>' +
        '</div>' +
        '<div class="event-meta"><span>' + escapeHTML(item.type) + ' / ' + escapeHTML(item.participation) + '</span><span>' + escapeHTML(item.date) + '</span></div>' +
        '<h3>' + escapeHTML(item.title) + '</h3>' +
        '</article>';
    });
    html += '</div>';
  }

  if (currentCategory === 'Certifications') {
    certifications.forEach(function (item, i) {
      html += '<article class="certificate-line">' +
        icon('award', 'certificate-icon') +
        '<div>' +
        '<p class="experience-period">' + escapeHTML(item.area) + ' / ' + escapeHTML(item.year) + '</p>' +
        '<h3>' + escapeHTML(item.title) + '</h3>' +
        '<p class="sample-caption">Sample · credential not supplied</p>' +
        '</div>' +
        '<button class="btn btn-ghost btn-icon" data-cert="' + i + '" aria-label="View ' + escapeHTML(item.title) + '">' + icon('arrow-up-right') + '</button>' +
        '</article>';
    });
  }

  $('background-panel').innerHTML = html;
  $('background-panel').setAttribute('aria-label', currentCategory);
  replayAnimation($('background-panel'));
}

function setupBackgroundTabs() {
  renderBackgroundTabs();
  renderBackgroundPanel();

  // Click on a tab
  $('background-tabs').addEventListener('click', function (event) {
    const tab = event.target.closest('[data-category]');
    if (!tab) return;
    currentCategory = tab.dataset.category;
    renderBackgroundTabs();
    renderBackgroundPanel();
  });

  // Click on an arrow button inside the panel (event or certification)
  $('background-panel').addEventListener('click', function (event) {
    const eventButton = event.target.closest('[data-event]');
    const certButton = event.target.closest('[data-cert]');
    if (eventButton) openDetail(events[Number(eventButton.dataset.event)]);
    if (certButton) openDetail(certifications[Number(certButton.dataset.cert)]);
  });
}


/* ---------------------------------------------------------------------
   G. POP-UPS (dialogs)
   <dialog> is a built-in HTML element: dialog.showModal() opens it,
   dialog.close() closes it. Esc closes it automatically.
   --------------------------------------------------------------------- */

// Project pop-up (filled with the project's info)
function openProject(project) {
  if (!project) return;
  let tags = '';
  project.tags.forEach(function (tag) { tags += '<span>' + escapeHTML(tag) + '</span>'; });

  $('project-body').innerHTML =
    '<button class="dlg-close" data-close aria-label="Close">' + icon('x') + '</button>' +
    '<img class="dlg-image" src="' + escapeHTML(project.image) + '" alt="' + escapeHTML(project.title) + '" />' +
    '<p class="dlg-meta">' + escapeHTML(project.category) + ' / ' + escapeHTML(project.status) + '</p>' +
    '<h2 class="dlg-title">' + escapeHTML(project.title) + '</h2>' +
    '<p class="dlg-desc">' + escapeHTML(project.description) + '</p>' +
    '<p class="dlg-note">' + escapeHTML(project.role) + ' · ' + escapeHTML(project.period) + '</p>' +
    '<div class="dlg-tags">' + tags + '</div>';

  $('dialog-project').showModal();
}

// Event / certification pop-up (image is optional)
function openDetail(item) {
  if (!item) return;
  $('detail-body').innerHTML =
    '<button class="dlg-close" data-close aria-label="Close">' + icon('x') + '</button>' +
    (item.image ? '<img class="dlg-image" src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.title) + '" />' : '') +
    '<h2 class="dlg-title">' + escapeHTML(item.title) + '</h2>' +
    '<p class="dlg-desc">' + escapeHTML(item.description) + '</p>' +
    '<p class="sample-caption">Illustrative entry, not a verified member record.</p>';

  $('dialog-detail').showModal();
}

// Close any pop-up with its X button or by clicking outside of it
function setupDialogs() {
  document.querySelectorAll('dialog.dlg').forEach(function (dialog) {
    dialog.addEventListener('click', function (event) {
      const clickedBackdrop = event.target === dialog;
      const clickedCloseButton = event.target.closest('[data-close]');
      if (clickedBackdrop || clickedCloseButton) dialog.close();
    });
  });
}


/* ---------------------------------------------------------------------
   H. BUTTONS
   --------------------------------------------------------------------- */

// Pause / resume all animations
function togglePause() {
  paused = !paused;
  $('page').classList.toggle('motion-paused', paused);
  const button = $('motion-toggle');
  button.innerHTML = icon(paused ? 'play' : 'pause');
  const label = paused ? 'Resume animation' : 'Pause animation';
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
}

// Copy this page's link
async function sharePage() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    $('share-button').innerHTML = icon('check');
    flash($('share-status'), 2500);
    setTimeout(function () { $('share-button').innerHTML = icon('share-2'); }, 2500);
  } catch (error) {
    $('dialog-contact').showModal();   // copying isn't possible: open the contact pop-up instead
  }
}

// Copy the contact email
async function copyEmail() {
  try {
    await navigator.clipboard.writeText('contact@jeeniso.com');
    $('copy-fail').hidden = true;
    flash($('copy-ok'), 2500);
  } catch (error) {
    $('copy-fail').hidden = false;
  }
}

// Connect every button to its action
function setupButtons() {
  // Header
  $('home-button').addEventListener('click', function () {
    showScene(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('open-members').addEventListener('click', function () { $('dialog-members').showModal(); });
  $('open-contact-header').addEventListener('click', function () { $('dialog-contact').showModal(); });

  // Hero
  $('open-unit').addEventListener('click', function () { $('dialog-unit').showModal(); });
  $('scroll-to-work').addEventListener('click', function () { scrollToId('work'); });
  $('photo-action').addEventListener('click', onPhotoAction);
  $('motion-toggle').addEventListener('click', togglePause);

  // Section navigation bar (buttons have data-scroll="section-id")
  document.querySelectorAll('[data-scroll]').forEach(function (button) {
    button.addEventListener('click', function () { scrollToId(button.dataset.scroll); });
  });

  // Contact + footer
  $('copy-email').addEventListener('click', copyEmail);
  $('open-contact-outro').addEventListener('click', function () { $('dialog-contact').showModal(); });
  $('share-button').addEventListener('click', sharePage);

  // Inside the "unit" pop-up
  $('unit-to-work').addEventListener('click', function () {
    $('dialog-unit').close();
    scrollToId('work');
  });
}

// Fade-in on scroll: elements with class "reveal" get class "in-view" when visible
function setupReveal() {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (element) { observer.observe(element); });
}


/* ---------------------------------------------------------------------
   I. START EVERYTHING
   --------------------------------------------------------------------- */
function init() {
  injectIcons();
  setupPage();
  buildSceneTabs();
  showScene(0);
  renderStrip();
  renderStory();
  renderSkills();
  setupBackgroundTabs();
  renderMembersList();
  setupDialogs();
  setupButtons();
  setupReveal();
}

init();
