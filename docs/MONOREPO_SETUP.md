# Wissen-Haus Monorepo Setup

This repository now contains both frontend and backend code in a monorepo structure.

## Directory Structure

```
wissenhaus/
├── redesign/                 # Frontend (Static HTML/CSS/JS)
│   ├── index.html           # Homepage
│   ├── mentor-application.html
│   ├── trainer-application.html
│   ├── operations-application.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   └── ...other pages
│
├── backend/                 # Backend API (Node.js Express)
│   ├── src/
│   │   ├── index.js         # Main server file
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── submissions.js
│   │   │   ├── courses.js
│   │   │   └── community.js
│   │   ├── services/        # Business logic
│   │   │   └── emailService.js (Resend integration)
│   │   ├── utils/           # Helpers
│   │   │   ├── validators.js
│   │   │   └── auth.js
│   │   └── db/              # Database
│   │       ├── connection.js
│   │       ├── schema.sql
│   │       └── migrate.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── MONOREPO_SETUP.md        # This file
├── FORM_SUBMISSION_FIX.md
└── README.md
```

## Backend API Endpoints

### Submissions
- `POST /api/submissions` - Create submission (mentor/trainer/operations)
- `POST /api/submissions/volunteer` - Volunteer application
- `POST /api/submissions/partnership` - Partnership inquiry
- `POST /api/submissions/contact` - Contact form

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course details

### Community
- `GET /api/community/threads` - List discussion threads
- `POST /api/community/threads` - Create thread

## Local Development

### Frontend Only
```bash
# Run local HTTP server for frontend
cd redesign
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Backend Only
```bash
# Install dependencies
cd backend
npm install

# Setup .env file
cp .env.example .env
# Edit .env with your settings (DATABASE_URL, RESEND_API_KEY, etc)

# Start server
npm start

# Server runs on http://localhost:3000
```

### Full Stack (Frontend + Backend)
```bash
# Terminal 1: Backend
cd backend
npm install
npm start
# Running on http://localhost:3000

# Terminal 2: Frontend
cd redesign
python3 -m http.server 8000
# Open http://localhost:8000
```

### Update Frontend URLs for Local Development

To test with local backend, update in `redesign/assets/js/volunteer-form-backend-only.js`:

```javascript
// Change this line:
const backendUrl = 'https://wissenhaus-backend.vercel.app/api/submissions';

// To this for local testing:
const backendUrl = 'http://localhost:3000/api/submissions';
```

Then commit with production URL before deploying.

## Deployment

### Frontend (Vercel)
```bash
# Frontend deploys automatically from /redesign directory
# Vercel detects vercel.json which sets outputDirectory: "redesign"
git push origin main
```

### Backend (Vercel)
```bash
# Backend code is now in /backend directory
# Create new Vercel project for backend
# Point to /backend directory as root
# Set environment variables:
#   - DATABASE_URL
#   - JWT_SECRET
#   - RESEND_API_KEY
#   - CORS_ORIGIN
# Deploy manually or via git push
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@host/db
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:8001,https://wissenhaus.org
RESEND_API_KEY=re_your_api_key
```

### Frontend
No .env needed - uses hardcoded URLs (can be updated in JS files)

## Git Workflow

```bash
# Clone monorepo
git clone https://github.com/olagbayebenz/Wissen-haus.git
cd wissenhaus

# Install both
cd backend && npm install && cd ..

# Make changes to frontend or backend
# Commit once with clear message
git add .
git commit -m "Feature: [description]"

# Push (deploys to both Vercel projects)
git push origin main
```

## Key Features

✓ Single repository for frontend + backend
✓ Unified version control and commit history
✓ Easy to coordinate changes across full stack
✓ Shared documentation and CI/CD
✓ Cleaner deployment workflow

## Frontend-Backend Communication

### Form Submissions
```javascript
// Frontend (redesign/assets/js/volunteer-form-backend-only.js)
const response = await fetch('https://wissenhaus-backend.vercel.app/api/submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Email Sending
Backend automatically sends:
1. Confirmation email to applicant
2. Notification email to admin (info@wissenhaus.org)

Uses Resend service (see backend/RESEND_SETUP.md)

## Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm start
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Database errors
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# Run migrations: npm run migrate
```

### Form not submitting
1. Check browser console (F12) for errors
2. Verify backend API is running/deployed
3. Check CORS settings in backend (CORS_ORIGIN env var)

## Useful Commands

### Backend
```bash
cd backend

npm start              # Start server
npm run migrate        # Run database migrations
npm test              # Run tests (if configured)
npm audit             # Check for vulnerabilities
```

### Frontend
```bash
cd redesign

python3 -m http.server 8000    # Serve locally
python3 -m http.server 3001    # Use different port
```

### Git
```bash
git log --oneline            # See recent commits
git diff                     # See changes
git status                   # See status
git branch -a               # See all branches
```

## Next Steps

1. **Update Backend URL** in frontend for production deployment
2. **Configure Vercel** to deploy both frontend and backend
3. **Set environment variables** on Vercel for backend
4. **Test full stack** locally before pushing
5. **Monitor logs** on Vercel after deployment

## Related Documentation

- [FORM_SUBMISSION_FIX.md](FORM_SUBMISSION_FIX.md) - Form debugging
- [backend/RESEND_SETUP.md](backend/RESEND_SETUP.md) - Email configuration
- Frontend: See comments in HTML/JS files
- Backend: See JSDoc in route files

## Support

For issues:
1. Check browser console (frontend errors)
2. Check backend logs (server errors)
3. Verify environment variables
4. Check database connection
5. Review git log for recent changes
