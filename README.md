# BU3 website — plain HTML / CSS / JavaScript

It has **two pages**:

| Page | What it is |
|---|---|
| `index.html` | The BU3 **home page**: hero, statement + numbers, "What we do", manager card, all members, closing banner, footer |
| `member.html?member=amal-hamdi` | One member's **portfolio** (the part after `member=` is the member's `slug` in `data.js`). The home page links to every member. |

## How to run it
Double-click `index.html`. No install, no build step.
Tip: in VS Code, the **Live Server** extension reloads the page every time you save.
(You need an internet connection for the Montserrat font; without it the page still works with a default font.)

## The files

| File | What it does | When you edit it |
|---|---|---|
| `index.html` | Structure of the home page | To add/remove/reorder a home section |
| `member.html` | Structure of the member page | To change the portfolio layout |
| `style.css` | **All** colors, fonts, layout, animations, phone layout. Member styles first, **home styles at the end** (section 7) | To change the look |
| `data.js` | **All content**: members, projects, skills, experience, events, certifications + home info (email, menu links, "What we do" cards, current challenge) | **Most often** |
| `common.js` | Helpers + icons + scrolling banner + fade-in, shared by both pages | Rarely |
| `home.js` | Builds the home page from `data.js` + its interactions (phone menu, pause button, sticky header, back-to-top) | To change home behavior |
| `member.js` | Same, for the member page (scenes, tabs, pop-ups) | To change portfolio behavior |
| `images/` | Photos and logos | To change pictures |

Script order in each HTML file matters: `data.js` → `common.js` → `home.js` (or `member.js`).

## ⚠️ Two logo files to add ------------------------FIXED------------------------
The logos are hosted by Lovable and are **not** in your GitHub project. Open each link in your browser, save the image, and put it in the `images/` folder with the exact name:

1. `images/bu3-logo.png` — https://bu3-member-spotlight.lovable.app/__l5e/assets-v1/579819ac-42b3-4a4e-aee6-10e5068effd8/bu3-logo.png
2. `images/jeeniso-logo.png` — https://bu3-member-spotlight.lovable.app/__l5e/assets-v1/84ed6e9d-7c92-4370-9457-bcead9871cb3/jeeniso-logo.png

Until you do, the BU3 logo shows as a small 64px version (`images/favicon.png`, a bit blurry in the big hero) and the JEENISo emblem in the footer is simply hidden.

## Where to put the photos
Two photos are already wired in. Save each file in `images/` with the exact name below. Until a file exists the page looks normal (no broken image), then the photo appears by itself.

| Photo | File name | What to use |
|---|---|---|
| **Team photo** behind "BUSINESS UNIT 03." in the hero | `images/team-photo.jpg` | Landscape, at least 1920 × 1080 px, all members together. Keep the file under ~400 KB (compress it on squoosh.app). |
| **Manager portrait** on the right of the "Leading the unit" card | `images/oussama-berrehouma.jpg` | Portrait (about 4:5), at least 900 × 1100 px, face in the upper third (the photo is cropped from the top). |
---------------------------------------------------------------------------WAITING FOR THE TEAM(EYA)
- **Different file name or type?** Change the path in `data.js`: `site.heroPhoto` for the team photo, `photo:` on the manager's line for the portrait. Use `''` to turn a photo off.
- **Transparent PNG cut-out for the manager:** use a `.png` (and change the path). The big gold outlined initials then appear *behind* the person, which looks great.
- **Text hard to read on the team photo?** In `style.css`, section 8, make `--home-hero-wash` stronger (raise the last number, for example `.78` to `.85`). To change which part of the photo stays visible when it is cropped (phones especially), edit `--home-hero-focus` (for example `center 20%`).
- On a phone the team photo is cropped to its middle, so keep the group centered.

## Common edits

**Change the contact email, years or current challenge:** `site` in `data.js` (the hero pill, the stats and the footer update by themselves).

**Add a menu link:** add a line to `navigation` in `data.js`. It appears in the header and in the footer. The `href` must match an `id` in `index.html`.

**Add a member:** copy one line of `members` in `data.js`. The home page cards, the counters ("8 members", "7 creative members + 1 manager") and the members pop-up update automatically.

**Write a biography:** fill `biography: ''` and `description: ''` for that member in `data.js`.

**Add social links:** put items in `socials` in `data.js` (example is in the comment). The footer list appears only when it has items.

**Change the main blue:** `--primary` at the top of `style.css`.

**Change the "What we do" photos:** `capabilities` in `data.js` (put the picture in `images/`).

## What is not built yet
The **Challenges** section is only an anchor (`id="challenges"`, the small sparkle divider in `index.html`). The menu, the hero pill and two cards already link to it. When you build it, add the data to `data.js` (like `capabilities`), the HTML between the "What we do" and "Leadership" sections, and the styles at the end of `style.css`.

## Ideas to go further
1. Build the Challenges section (timeline + Executive Bureau reviews).
2. Make the manifesto words light up one after the other (add a `transition-delay` per word in `renderManifesto()`).
3. Add a search box that filters the member cards.
4. Give each member their own photo (`photo: 'images/amal.jpg'` in `data.js`, then use it in `member.js`).
5. Load the members from a JSON file with `fetch()` (needs Live Server, not a double-click).
