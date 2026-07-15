# Wissen-Haus — Website Redesign

A complete, from-scratch redesign of [wissenhaus.org](https://www.wissenhaus.org) (Wissen-Haus Youth Empowerment Foundation). Static, fast, mobile-first, and fully on-brand. **All original copy is preserved**; only the design has changed.

## How to view
Open any page in a browser, e.g. `redesign/index.html`. No build step required.
(For the Google Fonts to load and forms/animations to run, view over http or with an internet connection — everything else is self-contained.)

## Pages (11)
| File | Page |
|------|------|
| `index.html` | Home |
| `about.html` | About Us + Leadership |
| `programmes.html` | Programmes + Events + Career Hub |
| `community.html` | Community Hub (Opportunity Hub, Learning Library, Feed, Progression) |
| `impact.html` | Impact / Success Stories |
| `policy-research.html` | Policy & Research (2026 agenda timeline) |
| `volunteer.html` | Volunteer (with signup form) |
| `partner.html` | Partner With Us |
| `membership.html` | Membership / Pricing (Free + Premium) |
| `donate.html` | Donate (tiers + impact) |
| `contact.html` | Contact (form + details) |

## Design system
- `assets/css/styles.css` — single design system (tokens, components, layout, animation, dropdowns, motion)
- `assets/js/main.js` — **single source of truth for the header + footer** (injected into every page), plus all interactions
- `assets/img/` — professional, free-to-use photography (Pexels) + logo

### Interactions (v2)
- **Dropdown navigation** — desktop mega-menus (title + description per item) and mobile burger with **accordion sub-menus**. The whole nav is defined once in `main.js` (`NAV` array) and injected into every page — edit it in one place.
- Page-load intro, scroll-progress bar, back-to-top button
- Word-by-word hero headline reveal, directional + scale scroll reveals, staggered groups
- Magnetic buttons, click ripples, 3-D tilt on the hero, rotating decorative rings, parallax, shine sweep
- Animated stat count-ups, smooth in-page anchor scrolling, sticky-header state
- Fully keyboard-accessible (skip link, focus rings, Esc to close menus) and `prefers-reduced-motion` aware

### Editing the nav
All navigation lives in the `NAV` array at the top of `assets/js/main.js`. Change a label or link once and it updates on all 11 pages (desktop dropdowns + mobile accordions).

### Brand kept (per request)
- **Colors:** deep green `#0F2D1D`, brand red `#C8102E`, warm brown `#43311F`, cream paper `#FAF6EF`, gold accent `#E0A83E`
- **Type:** League Spartan (display) + IBM Plex Sans (body) + IBM Plex Mono (labels) — all matching the original brand fonts
- Direction: warm editorial-modern nonprofit — bold display headlines, big impact numbers, deep-green dark panels, red as the energetic accent.

## Notes
- The original `/our-programmes` page still showed unfinished Wix template placeholder text ("Innovative Solutions / Strategic Growth / Digital Excellence"). The redesign replaces it with the foundation's **real** programme copy (Career Bootcamp, Opportunity Blueprint, Impact Content).
- The original `/donate` page had no real content — a proper donation page was designed from scratch, on-brand. Donation buttons link to Contact as placeholders (no payment processor or bank details were invented).
- Forms are front-end demos (no backend wired up).

## Source material (in `../`)
- `../copy/` — all scraped copy (per page + `ALL-COPY.md`)
- `../screenshots/` — full-page screenshots of the original site
- `../brand.md` — extracted brand identity
