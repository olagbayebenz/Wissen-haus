# Wissen-Haus Backend Architecture Plan

**Status**: Frontend 95% complete, requires backend infrastructure for production launch

---

## Phase Overview

| Phase | Timeline | Priority | Status |
|-------|----------|----------|--------|
| **Phase 1: Foundation** | Weeks 1-2 | CRITICAL | Planning |
| **Phase 2: Data Layer** | Weeks 3-4 | CRITICAL | Planning |
| **Phase 3: API Layer** | Weeks 5-6 | HIGH | Planning |
| **Phase 4: Testing & Deployment** | Weeks 7-8 | HIGH | Planning |

---

## Current State (Frontend-Only)

### What Works Without Backend
- ✅ Static pages (home, about, programmes, impact, policy, etc.)
- ✅ Course modules with locally-stored progress
- ✅ Discussion threads in localStorage
- ✅ Authentication state in localStorage
- ✅ Course certificates generated client-side
- ✅ Opportunity listings from local JSON file

### What Breaks in Production
- ❌ User data not persistent across devices
- ❌ Forms don't submit anywhere (volunteer, partnership applications)
- ❌ Discussion threads lost on browser clear
- ❌ No way to update opportunities except manual JSON edits
- ❌ No user management/admin dashboard
- ❌ No email notifications
- ❌ No analytics or reporting

---

## Phase 1: Foundation (Weeks 1-2)

### 1.1 Technology Stack

**Recommendation**: Node.js + Express (lightweight, mirrors existing static setup)

```
Frontend: HTML/CSS/JS (existing)
Backend: Node.js + Express
Database: PostgreSQL (structured user/course data) + Redis (sessions)
Storage: AWS S3 or similar (certificates, uploads)
Hosting: AWS EC2, Railway, or Fly.io
```

### 1.2 Core Services

**3 Independent Microservices**:

1. **Auth Service** - User registration, login, JWT tokens
2. **Course Service** - Module progress, quiz submissions, certificates
3. **Community Service** - Discussion threads, user posts
4. **Opportunities Service** - Jobs, internships, scholarships (can be scheduled)

### 1.3 Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Course Progress
CREATE TABLE course_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  course_id VARCHAR,
  module_id INT,
  completed_at TIMESTAMP,
  quiz_score INT,
  UNIQUE(user_id, course_id, module_id)
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  course_id VARCHAR,
  certificate_id VARCHAR UNIQUE,
  issued_at TIMESTAMP,
  certificate_data JSON
);

-- Community Threads
CREATE TABLE threads (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  title VARCHAR NOT NULL,
  category VARCHAR,
  content TEXT,
  views INT DEFAULT 0,
  created_at TIMESTAMP
);

-- Community Posts (replies)
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  thread_id UUID REFERENCES threads,
  user_id UUID REFERENCES users,
  content TEXT,
  created_at TIMESTAMP
);

-- Form Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  type VARCHAR (volunteer_mentor | volunteer_trainer | volunteer_ops | partnership),
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  data JSON,
  created_at TIMESTAMP
);
```

---

## Phase 2: Data Layer (Weeks 3-4)

### 2.1 Database Setup

**Tasks**:
1. Set up PostgreSQL instance (AWS RDS or local dev)
2. Run migrations to create schema above
3. Set up Redis for session management
4. Create backup strategy

**Deliverable**: Production database with versioned migrations

### 2.2 Data Migration from Frontend

**Current Frontend Storage**:
- `wh_currentUser` → `users` table
- `wh_courseProgress` → `course_progress` table
- `wh_communityThreads` → `threads` + `posts` tables

**Migration Strategy**:
- Export browser localStorage from each user device
- Validate and clean data
- Bulk insert into PostgreSQL
- Run integrity checks

**Note**: This requires user cooperation or batch import from known test accounts

---

## Phase 3: API Layer (Weeks 5-6)

### 3.1 REST API Endpoints

**Authentication**
```
POST   /api/auth/register          { email, password, name }
POST   /api/auth/login             { email, password }
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me                (requires JWT)
```

**Courses**
```
GET    /api/courses/{id}/progress     (requires auth)
POST   /api/courses/{id}/module/{n}/quiz   { answers }
GET    /api/certificates/{id}
POST   /api/certificates/{id}/download
```

**Community**
```
GET    /api/threads
POST   /api/threads                { title, category, content }
GET    /api/threads/{id}
POST   /api/threads/{id}/posts     { content }
GET    /api/threads/{id}/posts
```

**Forms**
```
POST   /api/submissions/volunteer  { type, name, email, phone, ... }
POST   /api/submissions/partnership
POST   /api/submissions/contact
```

**Opportunities** (optional - can stay with static JSON)
```
GET    /api/opportunities?type=job&eligibility=nigeria
POST   /api/opportunities/sync     (admin - pull from external APIs)
```

### 3.2 Frontend Integration Changes

**Update JavaScript to use APIs instead of localStorage**:

- `auth.js`: Switch from localStorage to JWT tokens in Authorization header
- `courseData.js`: No change (still static module definitions)
- `main.js` for course pages: POST quiz results to `/api/courses/{id}/module/{n}/quiz` instead of localStorage
- `community-threads.html`: POST/GET threads from API instead of localStorage
- `opportunities.js`: Already using local JSON, can migrate to API when ready

---

## Phase 4: Testing & Deployment (Weeks 7-8)

### 4.1 Testing

**Backend Testing**:
- Unit tests for auth, course, community services
- Integration tests for API endpoints
- Database migration tests

**Frontend Testing**:
- Integration tests (API + frontend)
- User session tests
- Form submission tests

**Recommendation**: Jest for backend, Cypress/Playwright for frontend

### 4.2 Deployment

**Recommended Platform**: Railway or Fly.io (simple Node.js deployment)

```
1. Push code to GitHub
2. Connect to Railway/Fly.io
3. Set environment variables
4. Deploy backend
5. Update frontend API endpoints
6. Run smoke tests
7. Monitor logs
```

**Environment Variables to Set**:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<random-secret>
NODE_ENV=production
S3_BUCKET=wissen-haus-certificates
SMTP_PASSWORD=<email-service-password>
```

---

## Critical Implementation Details

### Authentication (JWT-based)
- Frontend sends email + password to `/api/auth/login`
- Backend returns JWT token (expires in 24h) + refresh token (7 days)
- Frontend stores JWT in memory (not localStorage to prevent XSS)
- All subsequent API calls include: `Authorization: Bearer <token>`
- Refresh token automatically renews JWT before expiry

### Course Progress Sync
- When user submits quiz → POST to `/api/courses/{id}/module/{n}/quiz`
- Backend stores score, updates `course_progress` table
- Backend checks if all 10 modules complete → auto-issues certificate
- Frontend polls `/api/certificates/{id}` to show certificate when ready
- Certificate data stored in PostgreSQL, regenerable anytime

### Community Threads
- GET `/api/threads` → returns all threads, sorted by creation
- POST `/api/threads` → creates new thread, increments user's thread count
- GET `/api/threads/{id}` → increments view count, returns thread + posts
- POST `/api/threads/{id}/posts` → adds reply, notifies thread author

### Form Submissions
- POST `/api/submissions/volunteer` → stores in `submissions` table
- No validation error on frontend (accepts any data)
- Backend validates emails, phone numbers, filters spam
- Admin dashboard shows all submissions with export to CSV

---

## Migration Checklist

### Before Going Live

- [ ] Database schema created and tested
- [ ] All REST API endpoints implemented and tested
- [ ] Frontend updated to use APIs instead of localStorage
- [ ] User authentication flow working end-to-end
- [ ] Course progress sync working
- [ ] Certificate generation working
- [ ] Community threads sync working
- [ ] Form submissions being stored
- [ ] Email notifications set up (volunteer applications, etc.)
- [ ] Admin dashboard created for submission review
- [ ] Backup strategy documented
- [ ] Load testing (aim for 100 concurrent users)
- [ ] Security audit (OWASP top 10)
- [ ] SSL certificate installed
- [ ] Monitoring & alerting set up

### Data Integrity

- [ ] Migrated existing user data from localStorage
- [ ] Verified all course progress intact
- [ ] Verified all threads/posts migrated
- [ ] Verified certificate IDs unchanged

---

## Optional Enhancements (Post-Launch)

**Low Priority**:
- Email notifications when new opportunities posted
- User profiles with avatar uploads
- Leaderboards (most active mentors, etc.)
- LinkedIn API integration for direct share
- PDF generation for certificates (instead of print-to-PDF)
- Mobile app (React Native)
- Analytics dashboard

**Medium Priority**:
- Opportunity API integration (live pull from RemoteOK, etc.)
- Admin dashboard for managing users, courses, opportunities
- Internship module (currently missing from data)
- Automated opportunity scraping

---

## Estimated Effort

- **Phase 1 (Foundation)**: 40-60 hours (planning + setup)
- **Phase 2 (Data)**: 20-30 hours (schema + migration)
- **Phase 3 (API)**: 80-120 hours (endpoints + frontend integration)
- **Phase 4 (Testing)**: 40-60 hours (tests + deployment)

**Total**: 180-270 hours (~5-7 weeks, 1 full-time developer)

---

## Next Steps

1. **Approve tech stack** (Node.js + Express + PostgreSQL)
2. **Set up dev environment** (local PostgreSQL, Redis)
3. **Create GitHub repo** for backend code
4. **Assign developer** to Phase 1 (foundation)
5. **Plan go-live date** (set deadline for all phases)

---

**Prepared**: July 20, 2026  
**Version**: 1.0
