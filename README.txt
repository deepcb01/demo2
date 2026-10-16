VIGNOVATE WEBSITE  -  AI Innovation Company
=============================================
Static multi-page site: plain HTML, CSS and JavaScript. No build step, no framework, no external fonts or CDNs.

1. STRUCTURE
  index.html, services.html, portfolio.html, about.html, contact.html, privacy-policy.html, terms.html, 404.html
  services/        9 service pages (6 core AI, 3 supporting: web, technical SEO, creative)
  case-studies/    8 concept projects (demonstration only, not client work)
  assets/css       styles.css, responsive.css, animations.css
  assets/js        config.js (contact details, form settings), main.js, navigation.js, portfolio.js, contact.js, hero-motion.js (home hero motion)
  assets/logos, icons, images, fonts
  sitemap.xml, robots.txt, manifest.json, CNAME (vignovate.in), scripts/check-site.js

2. PREVIEW LOCALLY
  Unzip, open a terminal in the folder, run:  python3 -m http.server 8000   then open http://localhost:8000
  (Opening files by double-click works for most pages, but a local server is recommended.)

3. DEPLOY TO GITHUB PAGES
  a) Create a GitHub repository and upload the CONTENTS of this folder to the repository root.
  b) Settings > Pages > Source: "Deploy from a branch", branch main, folder / (root). Save.
  c) The CNAME file already contains vignovate.in.

4. CUSTOM DOMAIN (vignovate.in)
  At your domain registrar add these DNS records:
    A     @    185.199.108.153
    A     @    185.199.109.153
    A     @    185.199.110.153
    A     @    185.199.111.153
    CNAME www  <your-github-username>.github.io
  In Settings > Pages enter vignovate.in as the custom domain and tick "Enforce HTTPS" once the certificate is issued (can take a while).
  If you publish on a different address, replace https://vignovate.in in canonical tags, sitemap.xml, robots.txt, og tags and JSON-LD.

5. SEARCH CONSOLE
  Add the property https://vignovate.in (DNS TXT verification is easiest), submit https://vignovate.in/sitemap.xml, then use URL Inspection on the home page.

6. CONTACT FORM
  GitHub Pages cannot receive form posts. By default the form prepares an email (mailto) and offers WhatsApp; it never claims a message was sent.
  To get real submissions, create an endpoint with a form provider (e.g. Formspree) and put its URL in assets/js/config.js (formEndpoint). Do not place secret keys in this site.

7. CHECK BEFORE LAUNCH (owner to verify)
  - Privacy Policy and Terms are general drafts: have them reviewed for your jurisdiction.
  - Technology lists and service descriptions: confirm they match what you actually deliver.
  - Case studies are labelled concept projects; there are no client logos, testimonials or measured results. Add real ones only when they exist.
  - Both vignovate@gmail.com (clickable, receives all enquiries; set in assets/js/config.js) and founder@vignovate.in (plain text, not clickable) are shown. Confirm both mailboxes work.
  - Fonts: Outfit (headlines), Instrument Sans (body), Geist Mono (labels), all SIL Open Font License, bundled in assets/fonts (no external requests).

8. CHECKS
  node scripts/check-site.js   verifies internal links and assets, unique titles/descriptions, one H1 per page, canonical tags and sitemap coverage.

9. HOME HERO NOTES
  The home hero is the owner-designed layout (assets/css/hero.css, assets/js/hero-motion.js). Its V and rock are the images
  assets/images/hero-v.webp and hero-mountain.webp. The V was cut out of the supplied artwork; the rock was cut from a screenshot
  of the design, so it is lower resolution. Replace hero-mountain.webp with the original rock render (transparent WebP/PNG,
  1672 x 251 or larger, same proportions) for a sharper result. Motion pauses off-screen and is reduced for reduced-motion users.
  The hero headline uses Outfit; each word is sized to fit its slot in the composition (see assets/js/hero-motion.js).

10. TESTS PERFORMED (headless Chromium, desktop 1440 / tablet 820 / phone 390)
  - scripts/check-site.js: internal links and assets, unique titles and descriptions, one H1 per page, canonical tags, sitemap coverage: passed.
  - JSON-LD blocks parse as valid JSON (syntax only; not run through Google's Rich Results Test).
  - No console errors and no horizontal overflow on any page at 390 and 1440 wide; no broken images on the portfolio page.
  - Home hero: loads, motion runs, menu opens/closes (Escape), "Explore our capabilities" scrolls to the section.
  - Contact form: validation messages, service pre-selection from links, and the mailto/WhatsApp fallback behaviour.
  - Portfolio filters, 404 page (on a simple local server).

11. NOT TESTED / REMAINING
  - Not run: Lighthouse or Core Web Vitals, real phones, Safari/Firefox, screen readers, Google Rich Results Test, GitHub Pages itself.
  - The contact form cannot deliver messages until a form provider URL is added (section 6).
  - Keyword volumes were not researched: topic choices are logical, not data-driven. Use Search Console after launch.
  - hero-mountain.webp is cut from a screenshot (lower resolution); replace with the original render.
  - Privacy and Terms are drafts and have no "owner to verify" notes.
