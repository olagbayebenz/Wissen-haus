# Wissen-Haus Frontend Deployment Guide

Production deployment strategy for the static site + backend integration.

---

## Current Architecture

**Frontend**: Static HTML/CSS/JS (79 pages, no build step)  
**Storage**: localStorage for user data (temporary during development)  
**Backend**: Express.js + PostgreSQL (Phase 1 complete, not yet deployed)

---

## Deployment Options

### Option 1: Netlify (Recommended for Frontend Only)

**Pros**: Free tier, auto-deploys from GitHub, custom domain support, edge functions  
**Cons**: No backend integration yet

**Setup**:
1. Push code to GitHub (already done)
2. Sign up at [netlify.com](https://netlify.com)
3. Connect repository
4. Build settings:
   - Build command: (leave empty - static site)
   - Publish directory: `redesign/`
5. Deploy

**Custom Domain**:
```
// Point your domain to Netlify nameservers
// Netlify auto-generates HTTPS certificate
```

---

### Option 2: AWS S3 + CloudFront (CDN)

**Pros**: Low cost at scale, global CDN, serverless  
**Cons**: Slightly more setup

**Setup**:
```bash
# 1. Create S3 bucket
aws s3 mb s3://wissenhaus-web

# 2. Upload files
aws s3 sync redesign/ s3://wissenhaus-web/ --acl public-read

# 3. Enable static hosting
aws s3 website s3://wissenhaus-web/ \
  --index-document index.html \
  --error-document index.html

# 4. Create CloudFront distribution
# - Point to S3 bucket
# - Enable HTTPS
# - Cache TTL: 3600s
```

---

### Option 3: Vercel (GitHub Integration)

**Pros**: Real-time deploys, preview URLs, edge functions  
**Cons**: Limited free tier

**Setup**:
1. Sign up at [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Configure:
   - Framework: Static
   - Root directory: `redesign/`
4. Deploy

---

### Option 4: Railway (Full Stack Ready)

**Pros**: Can deploy both frontend + backend from one repo  
**Cons**: Requires structured project layout

**Setup for Frontend Only**:
```yaml
# railway.json
{
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "startCommand": ""
  }
}
```

---

## Recommended Production Setup

**Stage 1: Frontend (Now)**
- Deploy static site to **Netlify** (easiest, free)
- Domain: `wissenhaus.org` or `wissenhaus.app`
- HTTPS: Auto-configured

**Stage 2: Backend (After Phase 1 complete)**
- Deploy Express API to **Railway** or **Fly.io**
- Database: PostgreSQL on AWS RDS or Railway
- API URL: `api.wissenhaus.org`

**Stage 3: Full Integration**
- Update frontend API endpoints from `localhost:3000` to `api.wissenhaus.org`
- Migrate localStorage → backend persistence
- Set up Redis for sessions

---

## Pre-Deployment Checklist

### Frontend
- [ ] All 79 pages tested and working
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] All images optimized (< 100KB each)
- [ ] No console errors
- [ ] No broken links
- [ ] `robots.txt` configured for SEO
- [ ] `sitemap.xml` generated
- [ ] Favicon set
- [ ] Meta tags present (og:image, description, etc.)
- [ ] GA/analytics configured (if needed)

### Performance
- [ ] Pages load in < 3 seconds
- [ ] Images lazy-loaded
- [ ] CSS/JS minified (or served as-is, site is small)
- [ ] No unused assets in `/assets/`

### Security
- [ ] No credentials in code
- [ ] CORS headers configured
- [ ] CSP headers configured
- [ ] No hardcoded API keys

---

## Environment Configuration

### Frontend .env (if using build step)
```
REACT_APP_API_URL=https://api.wissenhaus.org
REACT_APP_ENV=production
```

### For Static Site
Edit `/assets/js/config.js`:
```javascript
const API_URL = 'https://api.wissenhaus.org';
const ENV = 'production';
```

---

## Monitoring & Analytics

### Error Tracking
```javascript
// In layouts before </body>
<script src="https://cdn.sentry.io/..."></script>
<script>
  Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
</script>
```

### Page Analytics
```javascript
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## Netlify Deploy Configuration

**File**: `netlify.toml` (place in repo root)

```toml
[build]
  command = ""
  publish = "redesign"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## CI/CD Pipeline (GitHub Actions)

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for broken links
        run: |
          cd redesign
          find . -name "*.html" -exec grep -l 'href=' {} \; | \
          xargs grep -oh 'href="[^"]*"' | \
          sort | uniq | grep -v "^http" | \
          grep -v "javascript:" | \
          while read href; do
            file="${href#href=\"}"
            file="${file%\"}"
            if [ ! -f "$file" ] && [ ! -d "$file" ]; then
              echo "Broken link: $href"
              exit 1
            fi
          done
      
      - name: Validate HTML
        run: |
          sudo apt-get install -y tidy
          cd redesign
          find . -name "*.html" -exec tidy -q {} \;
      
      - name: Check image optimization
        run: |
          cd redesign/assets/img
          ls -lS | awk '$5 > 100000 {print $0; exit 1}'

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './redesign'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub ${{ github.sha }}"
          enable-pull-request-comment: true
          enable-commit-comment: true
          overwrites-pull-request-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Post-Deployment

### Custom Domain Setup
1. Get domain from Namecheap, GoDaddy, or similar
2. On Netlify: Site settings → Domain management → Add custom domain
3. Update nameservers at registrar

### DNS Configuration
```
A record: wissenhaus.org → Netlify IP
CNAME: www → wissenhaus.org.netlify.app
```

### SSL Certificate
- Netlify: Auto-generated Let's Encrypt cert (free)
- Renews automatically
- Force HTTPS in Netlify settings

### Monitoring
1. Enable Netlify analytics
2. Set up Sentry for errors
3. Monitor performance (Lighthouse)

---

## Rollback Plan

If deployment breaks:
```bash
# Netlify: Previous deploy auto-archived
# Click "Deployments" → select previous → "Restore"

# Manual fallback:
git revert <bad-commit-hash>
git push origin main
# CI/CD auto-deploys
```

---

## Next Steps

1. **Today**: Deploy static site to Netlify
2. **This week**: Set up custom domain + monitoring
3. **Next phase**: Deploy backend API to Railway
4. **Week after**: Migrate localStorage → backend storage

---

## Deployment Checklist (Copy & Paste)

- [ ] All pages tested locally
- [ ] Responsive design verified
- [ ] Images optimized
- [ ] No console errors
- [ ] No broken links
- [ ] robots.txt / sitemap.xml configured
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Deploy settings configured (publish: redesign/)
- [ ] GitHub Actions workflow added
- [ ] Custom domain purchased
- [ ] Domain pointing to Netlify
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking (Sentry) setup
- [ ] Monitoring dashboard live

---

**Status**: ✅ Frontend ready for deployment  
**Estimated deployment time**: 15 minutes (Netlify one-click)  
**Next: Deploy to production**
