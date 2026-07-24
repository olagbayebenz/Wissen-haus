# Wissen-Haus Monorepo

A comprehensive platform for youth empowerment and career development in Nigeria.

**Live:** https://wissenhaus.org

## Quick Start

### For Developers

```bash
# Clone repository
git clone https://github.com/olagbayebenz/Wissen-haus.git
cd wissenhaus

# Frontend development
cd redesign
python3 -m http.server 8000
# Open http://localhost:8000

# Backend development (separate terminal)
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

### For Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**
```bash
# Frontend (Vercel)
git push origin main
# Auto-deploys via Vercel integration

# Backend (if separate Vercel project)
cd backend
vercel deploy --prod
```

## Repository Structure

```
wissenhaus/
├── redesign/           # Frontend (119 HTML pages, static)
│   ├── index.html     # Homepage
│   ├── assets/        # CSS, JS, images
│   └── sitemap.xml
│
├── backend/           # Backend API (Node.js Express)
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic (Resend emails)
│   │   └── db/        # Database setup
│   └── package.json
│
├── docs/              # Documentation
│   ├── MONOREPO_SETUP.md
│   ├── FORM_SUBMISSION_FIX.md
│   └── ...
│
└── DEPLOYMENT_GUIDE.md  # ← Read this for Vercel setup
```

## Features

### Frontend
- ✓ 119+ interactive pages
- ✓ Career assessment tool
- ✓ Mentor/trainer/operations applications
- ✓ Course modules with certificates
- ✓ Community forum
- ✓ Impact stories & testimonials
- ✓ Mobile responsive
- ✓ SEO optimized (sitemap.xml)

### Backend
- ✓ Form submissions API
- ✓ Authentication (JWT)
- ✓ Email notifications (Resend)
- ✓ Course progress tracking
- ✓ Community threads
- ✓ Database (PostgreSQL on Supabase)

## Architecture

### Frontend (Vercel Static)
- **Framework:** Static HTML/CSS/JavaScript
- **Hosting:** Vercel (`/redesign` directory)
- **Build:** No build step required
- **Deployment:** Automatic on `git push`

### Backend (Vercel Serverless)
- **Framework:** Node.js Express
- **Hosting:** Vercel Functions (`/backend` directory)
- **Database:** PostgreSQL (Supabase)
- **Deployment:** Manual or Git integration

## Configuration

### Environment Variables

**Backend (`.env`):**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
RESEND_API_KEY=...
CORS_ORIGIN=https://wissenhaus.org
```

**Frontend:** No environment variables needed (URL hardcoded in JavaScript)

See `backend/.env.example` for full template.

## Key Files

| File | Purpose |
|------|---------|
| `vercel.json` | Frontend deployment config |
| `backend/vercel.json` | Backend deployment config |
| `.vercelignore` | Files to exclude from frontend deploy |
| `redesign/sitemap.xml` | SEO sitemap (40 URLs) |
| `backend/RESEND_SETUP.md` | Email setup guide |

## Deployment Status

- **Frontend:** ✓ Live on Vercel
- **Backend:** Deploy separately (see DEPLOYMENT_GUIDE.md)
- **Database:** Supabase PostgreSQL
- **Email:** Resend service

## Common Tasks

### Add a new page

1. Create `redesign/new-page.html`
2. Test locally: `cd redesign && python3 -m http.server 8000`
3. Add to sitemap.xml if important for SEO
4. Push to `main` branch (auto-deploys)

### Modify form submission

1. Edit form HTML in `redesign/*.html`
2. Update handler: `redesign/assets/js/volunteer-form-backend-only.js`
3. Update backend: `backend/src/routes/submissions.js`
4. Test locally with both servers running
5. Deploy both (frontend auto, backend manual or Git)

### Update styling

1. Edit `redesign/assets/css/styles.css`
2. Test: `cd redesign && python3 -m http.server 8000`
3. Push (auto-deploys)

### Deploy backend changes

```bash
cd backend
npm install  # If dependencies changed
npm start    # Test locally
vercel deploy --prod  # Deploy
```

## Documentation

| Document | Contents |
|----------|----------|
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete Vercel setup + troubleshooting |
| [docs/MONOREPO_SETUP.md](docs/MONOREPO_SETUP.md) | Local development guide |
| [docs/FORM_SUBMISSION_FIX.md](docs/FORM_SUBMISSION_FIX.md) | Form debugging |
| [backend/RESEND_SETUP.md](backend/RESEND_SETUP.md) | Email configuration |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase) |
| Email | Resend |
| Hosting | Vercel |
| Auth | JWT |
| Version Control | Git + GitHub |

## Performance

- **Frontend:** Static hosting (CDN cached)
- **Backend:** Serverless functions (auto-scaling)
- **Database:** Connection pooling via Supabase
- **Caching:** 1-hour cache headers on static assets

## Security

- ✓ Environment variables for secrets
- ✓ CORS configured for frontend only
- ✓ Security headers (XSS, clickjacking protection)
- ✓ JWT token authentication
- ✓ Input validation on backend
- ✓ No secrets in version control

## Monitoring

Monitor deployments via Vercel dashboard:
- https://vercel.com/dashboard

Monitor logs:
```bash
vercel logs https://wissenhaus.org
vercel logs https://wissenhaus-backend.vercel.app
```

## Support

**Issues?** Check:
1. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Troubleshooting section
2. Browser console (F12) for frontend errors
3. Vercel logs for backend errors
4. Database connection in Supabase dashboard

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally (both servers)
4. Commit: `git commit -m "Feature: description"`
5. Push: `git push origin feature/name`
6. Create PR on GitHub

## License

Proprietary - Wissen-Haus Youth Empowerment Foundation

## Links

- **Website:** https://wissenhaus.org
- **GitHub:** https://github.com/olagbayebenz/Wissen-haus
- **Backend Repo:** Merged into main repo (`/backend`)

---

**Last Updated:** July 24, 2026

For the most up-to-date setup instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
