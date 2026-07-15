# Wissen-Haus — Website Redesign

A complete, from-scratch redesign of the [Wissen-Haus Youth Empowerment Foundation](https://www.wissenhaus.org) website — a Nigerian nonprofit bridging the skills gap for young people through career guidance, mentorship and global exposure.

The redesign keeps the brand (deep green `#0F2D1D`, brand red `#C8102E`, League Spartan + IBM Plex Sans) and **all original copy**, rebuilt as a modern, highly-interactive, mobile-first static site.

## 🔎 View it
- Open [`redesign/index.html`](redesign/index.html) in a browser, or
- The root [`index.html`](index.html) redirects there (so GitHub Pages "deploy from root" works out of the box).

## 📁 Structure
```
.
├── index.html            # redirect → redesign/index.html (for GitHub Pages)
├── redesign/             # ⭐ the redesigned website (11 pages)
│   ├── index.html … contact.html
│   ├── assets/css/styles.css   # design system
│   ├── assets/js/main.js       # nav + all interactions (single source)
│   ├── assets/img/             # professional free photography (Pexels) + logo
│   └── README.md               # site-specific docs
├── copy/                 # all original copy scraped from the live site
├── screenshots/          # full-page screenshots of the original site
├── brand.md              # extracted brand identity (colors, fonts)
└── logo-original.png
```

## ✨ Highlights
- **11 pages:** Home, About, Programmes, Community Hub, Impact, Policy & Research, Volunteer, Partner, Membership, Donate, Contact
- **Dropdown navigation** — desktop mega-menus + mobile burger accordions (defined once in `redesign/assets/js/main.js`)
- Rich motion: scroll progress, word-by-word hero reveal, staggered reveals, magnetic buttons, tilt, parallax, count-ups, page intro, back-to-top
- Fully responsive, keyboard-accessible, `prefers-reduced-motion` aware
- Real, free-to-use photography throughout

## 🚀 Deploy with GitHub Pages
1. Repo **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
3. Save. The root `index.html` forwards visitors into `redesign/`.

> Forms and donation buttons are front-end demos (no backend wired up).
