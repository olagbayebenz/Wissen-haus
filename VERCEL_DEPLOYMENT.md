# Vercel Deployment Guide - Wissen-Haus

**Current Status:** ✓ Optimized for Vercel deployment

## Repository Structure

```
wissenhaus/
├── redesign/              ← FRONTEND (deployed to Vercel)
│   ├── *.html            (119 pages)
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   └── sitemap.xml
│
├── backend/               ← BACKEND (separate Vercel project)
│   ├── src/
│   ├── package.json
│   └── vercel.json.bak
│
├── docs/                  ← Documentation
├── README.md              ← Quick start
├── DEPLOYMENT_GUIDE.md    ← Detailed setup
├── vercel.json            ← Frontend deployment config
└── sitemap.xml            ← SEO
```

## Frontend Deployment (Vercel)

### Configuration

**File:** `vercel.json`
```json
{
  "outputDirectory": "redesign"
}
```

**What it does:**
- Tells Vercel to serve `/redesign` directory
- Uses Vercel defaults for everything else
- No build step (static files)
- Auto-deploys on git push

### Setup

1. **Connect to Vercel:**
   ```bash
   vercel login
   vercel link
   ```

2. **Configure Project:**
   - Framework: Static
   - Root Directory: (leave empty or default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: (leave empty)

3. **Deploy:**
   ```bash
   git push origin main
   # Auto-deploys via GitHub integration
   ```

### Status

✓ Frontend is ready for Vercel
✓ No build step needed
✓ All 119 HTML pages included
✓ Assets properly organized

## Backend Deployment (Separate Project)

### Setup Backend Vercel Project

1. **Create new Vercel project:**
   ```bash
   cd backend
   vercel login
   vercel link --project wissenhaus-backend
   ```

2. **Configure:**
   - Root Directory: `/backend`
   - Framework: Node.js
   - Build Command: (empty or `npm install`)
   - Output Directory: (empty)
   - Start Command: `npm start`

3. **Set Environment Variables:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   RESEND_API_KEY=re_...
   CORS_ORIGIN=https://wissenhaus.org
   NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   cd backend
   vercel deploy --prod
   ```

## Quick Deploy Checklist

### Frontend
- [ ] `vercel.json` exists (checked ✓)
- [ ] `outputDirectory` points to `redesign`
- [ ] No build command needed
- [ ] GitHub connected to Vercel
- [ ] Push to main branch
- [ ] Vercel auto-deploys

### Backend
- [ ] Separate Vercel project created
- [ ] Root directory set to `/backend`
- [ ] All env vars configured
- [ ] `backend/vercel.json.bak` has correct config
- [ ] Manual deploy or Git integration enabled

## Environment Variables

### Backend Required Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Security
JWT_SECRET=your-secret-key-here
NODE_ENV=production

# Email
RESEND_API_KEY=re_your_api_key

# CORS
CORS_ORIGIN=https://wissenhaus.org

# Server
PORT=3000
```

### Frontend
No environment variables needed (hardcoded URLs in JavaScript)

## Deployment Files Structure

| File | Purpose |
|------|---------|
| `vercel.json` | Frontend deployment config |
| `backend/vercel.json.bak` | Backend template (configure in dashboard) |
| `.vercelignore` | Exclude files from frontend deploy |
| `.gitignore` | Exclude .env and dependencies |

## What's Excluded from Deployment

✓ `node_modules/` (auto-installed by Vercel)
✓ `.env` files (configure in Vercel dashboard)
✓ `docs/` (documentation only)
✓ `backend/` (separate project)
✓ `.git` (version control only)

## Verification Steps

### 1. Check Repository Structure
```bash
# Root should only have:
ls -1
backend/
docs/
redesign/
DEPLOYMENT_GUIDE.md
README.md
sitemap.xml
vercel.json
```

### 2. Verify Frontend Files
```bash
# Should have 119+ HTML files
ls redesign/*.html | wc -l

# Should have assets
ls -R redesign/assets/
```

### 3. Verify Backend Setup
```bash
# Should have src directory and package.json
ls backend/
cd backend && npm install
```

### 4. Test Locally Before Deploying
```bash
# Frontend
cd redesign && python3 -m http.server 8000

# Backend (in another terminal)
cd backend && npm start
```

## Troubleshooting

### Build Error: "Cannot find module"
- Check `redesign/` directory has all files
- Verify no symlinks are broken
- Check `.vercelignore` isn't excluding needed files

### 404 on pages
- Verify `outputDirectory: redesign` in vercel.json
- Check HTML files exist in `redesign/` directory
- Vercel should show build logs with any issues

### Static files not loading
- Check `redesign/assets/` directory exists
- Verify CSS/JS paths are relative (not absolute)
- Check browser DevTools Network tab for 404s

### Backend API not responding
- Verify separate Vercel project is deployed
- Check environment variables are set
- Verify CORS_ORIGIN includes frontend URL
- Check function logs in Vercel dashboard

## Performance Optimization

✓ **Static assets:** Served by Vercel CDN
✓ **No build step:** Instant deployments
✓ **Clean directory:** Only necessary files
✓ **Separated backend:** Independent scaling
✓ **Minimal config:** Fewer failure points

## Next Steps

1. **Deploy Frontend:**
   ```bash
   git push origin main
   ```

2. **Deploy Backend:**
   - Create separate Vercel project
   - Set environment variables
   - Run: `cd backend && vercel deploy --prod`

3. **Verify Deployment:**
   - Check https://wissenhaus.org loads
   - Test forms submit to backend
   - Check Vercel dashboard for errors

## Reference

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Integration:** https://vercel.com/github
- **Environment Variables:** Vercel Dashboard → Settings → Environment Variables
- **Logs:** Vercel Dashboard → Deployments → View Logs

## Summary

✓ Repository cleaned and optimized
✓ Frontend ready for Vercel static deployment
✓ Backend ready for serverless deployment
✓ Configuration minimal and valid
✓ No build step needed for frontend
✓ All files properly organized

**Status: READY FOR DEPLOYMENT**
