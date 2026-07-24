# Vercel Deployment Guide

This monorepo contains both frontend and backend for Wissen-Haus and deploys to Vercel.

## Repository Structure

```
wissenhaus/
├── redesign/              # Frontend (Static HTML/CSS/JS)
│   ├── index.html
│   ├── *.html            (119 pages)
│   ├── assets/
│   │   ├── css/styles.css
│   │   ├── js/
│   │   └── img/
│   └── sitemap.xml
│
├── backend/              # Backend API (Node.js Express)
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/
│   ├── package.json
│   ├── .env.example
│   ├── vercel.json       # Backend deployment config
│   └── RESEND_SETUP.md
│
├── docs/                 # Documentation
│   ├── MONOREPO_SETUP.md
│   ├── FORM_SUBMISSION_FIX.md
│   └── ...
│
├── vercel.json           # Frontend deployment config
├── .vercelignore         # Ignore files for frontend deployment
└── README.md
```

## Frontend Deployment (Vercel)

### Automatic Deployment

The frontend automatically deploys to Vercel on every push to `main` branch.

**Configuration File:** `vercel.json`

**Key Settings:**
- Output Directory: `/redesign`
- Build Command: Static (no build needed)
- Clean URLs: Enabled (removes .html extensions)
- Trailing Slashes: Disabled

**Features:**
- Catch-all routing to index.html (SPA support)
- Security headers (X-Content-Type-Options, X-Frame-Options, etc)
- Caching strategy (1 hour cache for assets)
- Sitemap.xml content-type configuration

### Manual Deployment

```bash
# Deploy frontend only
vercel deploy --name wissen-haus --prod

# View deployment logs
vercel logs
```

### Environment Variables

Frontend doesn't require environment variables (all config is client-side).

Backend API URL is hardcoded in:
- `redesign/assets/js/volunteer-form-backend-only.js`

To switch between production and local backend:
```javascript
// Production
const backendUrl = 'https://wissenhaus-backend.vercel.app/api/submissions';

// Local development
const backendUrl = 'http://localhost:3000/api/submissions';
```

## Backend Deployment (Separate Vercel Project)

### Setup New Vercel Project for Backend

1. **Create new Vercel project:**
   ```bash
   vercel project add wissenhaus-backend
   ```

2. **Point to backend directory:**
   - Project Root: `/backend`
   - Framework: Node.js
   - Build Command: (leave empty or use default)
   - Output Directory: (leave empty)

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   DATABASE_URL=postgresql://user:password@host/db
   JWT_SECRET=your-secret-key
   RESEND_API_KEY=re_your_api_key
   CORS_ORIGIN=https://wissenhaus.org
   NODE_ENV=production
   PORT=3000
   ```

4. **Configure Git Integration:**
   - Connect to GitHub
   - Set root directory to `/backend`
   - Enable "Auto Deploy from Git"

### Manual Backend Deployment

```bash
# From root directory
cd backend
npm install
npm start

# Deploy to Vercel
vercel deploy --prod
```

### Environment Variables Setup

**In `.env.example`:**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@host/db
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:8001,https://wissenhaus.org
RESEND_API_KEY=re_your_api_key
```

**In Vercel Dashboard:**
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add each variable with appropriate scope (Production, Preview, Development)

### Backend API Endpoints

- `POST /api/submissions` - Form submissions
- `POST /api/auth/login` - User authentication
- `GET /api/courses` - List courses
- `GET /api/community/threads` - Community threads

See `backend/src/routes/` for all endpoints.

## Deployment Checklist

### Before Deployment

- [ ] All changes committed to `main` branch
- [ ] `.env` files are NOT tracked in git
- [ ] No secrets in code
- [ ] Frontend HTML files in `/redesign`
- [ ] Backend files in `/backend`
- [ ] Backend dependencies in `backend/package.json`

### Frontend Deployment

- [ ] Verify `vercel.json` points to `/redesign`
- [ ] Check `.vercelignore` excludes backend
- [ ] Test locally: `cd redesign && python3 -m http.server 8000`
- [ ] Push to `main` branch
- [ ] Monitor Vercel dashboard for build status

### Backend Deployment

- [ ] Backend Vercel project created and linked
- [ ] All environment variables set in Vercel dashboard
- [ ] Database is accessible from Vercel (firewall rules)
- [ ] Test locally: `cd backend && npm install && npm start`
- [ ] Push backend updates
- [ ] Verify API endpoints are responding

## Troubleshooting

### Frontend Issues

**Site not showing updated content:**
```bash
# Clear Vercel cache
vercel env list --force
vercel deploy --force --prod
```

**404 on pages other than index.html:**
- Check `vercel.json` has catch-all route
- Verify `.vercelignore` is correct

**CORS errors from backend:**
- Check backend CORS_ORIGIN environment variable
- Ensure frontend URL matches CORS_ORIGIN

### Backend Issues

**Database connection fails:**
```bash
# Check connection string
echo $DATABASE_URL
# Verify database is accessible from Vercel IP
```

**API returns 404:**
- Check `backend/vercel.json` routing configuration
- Verify function exists in `backend/src/index.js`

**Email sending fails:**
```bash
# Check Resend API key
echo $RESEND_API_KEY
# Verify key is valid in Resend dashboard
```

**Timeout errors (30 second limit):**
- Optimize long-running operations
- Use async/await properly
- Check for missing promise handling

### Logs

**Frontend logs:**
```bash
vercel logs https://wissen-haus-*.vercel.app
```

**Backend logs:**
```bash
vercel logs https://wissenhaus-backend-*.vercel.app
```

## Performance Optimization

### Frontend

- CSS is minified: `redesign/assets/css/styles.css`
- JS files loaded asynchronously
- Images optimized (PNG, JPG)
- Caching headers set for 1 hour

### Backend

- Database connection pooling
- API response compression
- Request validation
- Error handling with proper status codes

## Security

### Frontend Security Headers
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection

### Backend Security
- CORS configured for allowed origins only
- JWT tokens for authentication
- Environment variables for secrets
- Input validation on all routes

### Environment Variable Security
- Never commit `.env` files
- Use Vercel dashboard for production secrets
- Rotate secrets regularly
- Keep keys minimal permissions

## Rollback

### Rollback Frontend

1. **From Vercel Dashboard:**
   - Go to Deployments
   - Find previous working deployment
   - Click "Promote to Production"

2. **From Git:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### Rollback Backend

```bash
# Via Vercel dashboard
# Or via git
git revert <commit-hash>
cd backend
npm install
vercel deploy --prod
```

## Monitoring

### Check Deployment Status

```bash
vercel status
vercel projects list
```

### Monitor Performance

- Vercel Analytics dashboard
- Database query logs
- Backend error logs
- Frontend browser console

### Alerts

Configure in Vercel dashboard:
- Build failures
- Performance degradation
- Error rate thresholds

## Related Documentation

- See `docs/MONOREPO_SETUP.md` for local development
- See `backend/RESEND_SETUP.md` for email configuration
- See `docs/FORM_SUBMISSION_FIX.md` for form troubleshooting
