/* =====================================================================
   DATA — this is the file you will edit the most.
   ---------------------------------------------------------------------
   Everything the website displays about people and projects lives here.
   You do NOT need to touch the HTML files to add a member or a project.
   Both pages use this file:  index.html (home)  and  member.html (portfolio).

   Rules for editing a list:
   - Each item is an object { ... } separated by commas.
   - Text goes between quotes ' '.
   - Don't forget the comma between items!
   ===================================================================== */


/* ---------- MEMBERS ----------
   slug        : used in the URL (member.html?member=slug). Lowercase, no spaces.
   firstName   : shown in the big title
   lastName    : shown in the big title (keep the final dot, it's part of the design)
   role        : shown in pop-ups
   caption     : small text on the photo
   biography   : "My story" text (leave '' to show "coming soon")
   description : "About me" text (leave '' to show "coming soon")
   isManager   : true -> gold theme (optional)
   accent      : 'pink' -> pink theme (optional)
   photo       : path to a portrait in images/ (optional). Used by the manager
                 card on the home page. If the file does not exist yet, a
                 placeholder with the member's initials is shown instead.
*/
const members = [
  { slug: 'oussama-berrehouma', firstName: 'Oussama', lastName: 'BERREHOUMA.', role: 'Business Unit Manager', caption: 'Leading BU3 in the right direction.', isManager: true, photo: 'images/oussama-berrehouma.jpg', biography: '', description: '' },
  { slug: 'alaeddine-ouni', firstName: 'Alaeddine', lastName: 'OUNI.', role: 'Creative member', caption: 'Curious mind. Hands-on maker.', biography: '', description: '' },
  { slug: 'amal-hamdi', firstName: 'Amal', lastName: 'HAMDI.', role: 'Creative member', caption: 'Ideas with intention.', accent: 'pink', biography: '', description: '' },
  { slug: 'eya-haouari', firstName: 'Eya', lastName: 'HAOUARI.', role: 'Creative member', caption: 'Stories waiting to be built.', accent: 'pink', biography: '', description: '' },
  { slug: 'hamdi-karmai', firstName: 'Hamdi', lastName: 'KARMAI.', role: 'Creative member', caption: 'From sketch to something real.', biography: '', description: '' },
  { slug: 'farah-haj-fraj', firstName: 'Farah', lastName: 'HAJ FRAJ.', role: 'Creative member', caption: 'Making connections visible.', accent: 'pink', biography: '', description: '' },
  { slug: 'momen-nsiri', firstName: 'Momen', lastName: 'NSIRI.', role: 'Creative member', caption: 'Energy, ideas, momentum.', biography: '', description: '' },
  { slug: 'mohamed-aziz-mili', firstName: 'Mohamed Aziz', lastName: 'MILI.', role: 'Creative member', caption: 'Curious mind. Hands-on maker.', biography: '', description: '' },
];

// Which member is shown when the page is opened without ?member=...
const DEFAULT_MEMBER_SLUG = 'oussama-berrehouma';

// Find a member by slug (returns undefined if not found)
function getMember(slug) {
  return members.find(function (m) { return m.slug === slug; });
}


/* ---------- PROJECTS ----------
   The first project is shown in scene 02 of the hero, the second in scene 03.
   image: path to a picture inside the images/ folder.
*/
const projects = [
  { id: 'concept', title: 'Beyond the ordinary', category: 'Creative direction', image: 'images/creative-concepts.jpg', description: 'A visual concept exploring how shared ideas become a distinctive creative identity.', tags: ['Moodboards', 'Visual storytelling', 'Design'], status: 'Completed', role: 'Concept contributor', period: '2026 · Sample project' },
  { id: 'collective', title: 'The idea collective', category: 'Collaborative project', image: 'images/creative-workshop.jpg', description: 'An idea-to-prototype session bringing different perspectives around one table.', tags: ['Ideation', 'Collaboration', 'Prototyping'], status: 'In progress', role: 'Creative collaborator', period: '2026 · Sample project' },
];


/* ---------- SKILLS ("My playground") ---------- */
const skills = [
  { name: 'Creative thinking', tags: ['Ideation', 'Research', 'Storytelling'] },
  { name: 'Design & expression', tags: ['Moodboards', 'Visual design', 'Prototyping'] },
  { name: 'Making it happen', tags: ['Collaboration', 'Project planning', 'Communication'] },
];


/* ---------- EXPERIENCE / EVENTS / CERTIFICATIONS ----------
   These 3 lists feed the tabs in the "More than projects." section.
*/
const experiences = [
  { title: 'Creative contributor', organization: 'Business Unit 3 · JEENISo', period: '2025 — Present', description: 'Exploring ideas, shaping concepts, and building projects with the collective.' },
  { title: 'Project collaborator', organization: 'Independent creative project', period: '2026', description: 'From first sketches to a shared visual concept, with a small creative team.' },
];

const events = [
  { title: 'Ideas in motion', type: 'Creative workshop', date: 'May 2026', image: 'images/creative-workshop.jpg', description: 'A day of brainstorming, exchanging perspectives, and turning ideas into concepts.', participation: 'Participant' },
  { title: 'Design together', type: 'Community meetup', date: 'March 2026', image: 'images/creative-concepts.jpg', description: 'Meeting fellow creatives and exploring visual storytelling through hands-on exercises.', participation: 'Attendee' },
];

const certifications = [
  { title: 'Design thinking foundations', area: 'Creative problem-solving', year: '2026', description: 'Sample entry for a course covering research, ideation, and prototyping. Issuer and credential have not been provided.' },
  { title: 'Creative project management', area: 'Planning & collaboration', year: '2026', description: 'Sample entry for learning about organizing creative work. Issuer and credential have not been provided.' },
];


/* =====================================================================
   HOME PAGE DATA  (used by index.html through home.js)
   ===================================================================== */

/* ---------- SITE INFO ----------
   email / location : shown in the footer and on the "Say hello" buttons
   edition          : the years shown in the hero, the stats and the footer
   challenge        : the "current challenge" pill at the bottom of the hero
   manifesto        : the big statement in "The unit" section
   heroPhoto        : the team photo shown behind "BUSINESS UNIT 03" in the hero.
                      Save your photo with this name in images/ (or change the path).
                      Set it to '' to turn the photo off. Nothing is shown while the file is missing.
   heroPhotoAlt     : text read by screen readers for that photo
*/
const site = {
  email: 'businessunit3.jeeniso.eniso@gmail.com',
  location: 'National School of Engineering of Sousse · JEENISo Association',
  edition: { start: 2026, end: 2027 },
  heroPhoto: 'images/team-photo.jpg',
  heroPhotoAlt: 'All the members of Business Unit 3 together',
  challenge: { week: '02', title: 'Web design & its conception', status: 'In progress' },
  manifesto: 'We are a creative center where ideas are born, projects take shape, and curious minds move forward together.'
};

/* ---------- NAVIGATION ----------
   Used for the header menu AND the footer links.
   href: '#id' scrolls to the section with that id in index.html.
*/
const navigation = [
  { label: 'The unit', href: '#unit' },
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Challenges', href: '#challenges' },
  { label: 'Members', href: '#members' },
  { label: 'Contact', href: '#contact' }
];

/* ---------- SOCIAL LINKS ----------
   Empty on purpose: the footer shows the list only when it has items.
   Example:  { label: 'Instagram', href: 'https://www.instagram.com/your-page' }
*/
const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/businessunit3.eniso?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw==' }
];

/* ---------- "WHAT WE DO" CARDS ---------- */
const capabilities = [
  { title: 'Ideas', text: 'Where every project begins.', image: 'images/creative-concepts.jpg', alt: 'Creative concept objects and visual experiments', href: '#challenges' },
  { title: 'Projects', text: 'Ideas made real, together.', image: 'images/robot-rover.jpg', alt: 'A collaborative rover prototype', href: '#challenges' },
  { title: 'Experiences', text: 'Events, growth and shared moments.', image: 'images/engineering-lab.jpg', alt: 'Students collaborating in a hands-on workshop', href: '#members' }
];

/* ---------- COUNTS (calculated, never typed by hand) ----------
   They update by themselves when you add or remove a member above.
*/
const unitCounts = {
  total: members.length,
  creative: members.filter(function (m) { return !m.isManager; }).length,
  managers: members.filter(function (m) { return m.isManager; }).length
};

// "Mohamed Aziz" + "MILI." -> "MM"   (the big outlined letters on the member cards)
function memberInitials(firstName, lastName) {
  return (firstName.trim().charAt(0) + lastName.trim().charAt(0)).toUpperCase();
}
