# Form Submission Error - Diagnosis & Fix

If mentor/trainer/operations applications are failing to submit, here are the common causes and solutions.

## Common Error: "Row Level Security" or "No rows returned"

This happens when Supabase has **Row Level Security (RLS)** enabled on the `submissions` table, which blocks anonymous access by default.

## Solution 1: Disable RLS on submissions table (Quick Fix - Dev Only)

**⚠️ WARNING: Only for development. Not recommended for production.**

1. Go to Supabase Dashboard
2. Navigate to **Tables → submissions**
3. Click **Security** tab
4. Toggle **"Enable RLS"** → OFF
5. Click **Save**

This allows anyone to insert data without authentication.

## Solution 2: Create RLS Policies (Recommended - Production Safe)

1. Go to Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL to allow anonymous inserts:

```sql
-- Allow anonymous users to insert into submissions
CREATE POLICY "Enable insert for all users" ON submissions
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to read their own submissions (optional)
CREATE POLICY "Enable read for email owner" ON submissions
  FOR SELECT USING (true);
```

4. Click **Run**

This creates policies that allow:
- Anyone to INSERT submissions
- Anyone to READ submissions (optional, can be restricted)

## Solution 3: Use Backend API Only (Most Secure)

If you want the most secure approach:

1. **Update HTML files** to use the backend-only form handler:

```html
<!-- Instead of: -->
<script src="assets/js/volunteer-form.js"></script>

<!-- Use: -->
<script src="assets/js/volunteer-form-backend-only.js"></script>
```

2. This way:
   - All data goes through your backend API
   - Supabase credentials never exposed to frontend
   - RLS policies not needed (backend has server-side access)
   - More control and logging

## Troubleshooting Steps

### 1. Check Browser Console
Open browser DevTools (F12 → Console) and look for:
- "Supabase library not loaded" → Scripts not loading properly
- "Supabase configuration not loaded" → Config script failing
- "Row Level Security" error → RLS policies blocking access

### 2. Test Supabase Connection
Add this to browser console:

```javascript
// Test if Supabase is loaded
console.log('Supabase:', window.supabase);
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Try creating a client
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Client created:', client);
```

### 3. Verify Database Schema
In Supabase Dashboard → **Table Editor**:

- Table name: `submissions` ✓
- Columns:
  - `id` (SERIAL PRIMARY KEY)
  - `type` (VARCHAR)
  - `name` (VARCHAR)
  - `email` (VARCHAR)
  - `phone` (VARCHAR, nullable)
  - `data` (TEXT)
  - `status` (VARCHAR, default 'pending')
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### 4. Check Network Tab
Open DevTools → **Network** tab, submit form, and look for:
- Supabase request → Check response for RLS errors
- Backend API request → Should see 201 response

## Error Messages & Meanings

| Error | Cause | Fix |
|-------|-------|-----|
| "new row violates row-level security policy" | RLS policy blocks insert | Enable RLS policy or disable RLS |
| "Supabase library not loaded" | CDN not loading | Check internet connection, try refreshing |
| "Supabase configuration not loaded" | Config script failed | Check browser console for errors |
| "404 Not Found" | Backend URL wrong | Verify backend URL in volunteer-form.js |
| "CORS error" | Cross-origin issue | Verify backend CORS settings |

## File Locations

### Current Implementation (Supabase Direct)
- `redesign/assets/js/volunteer-form.js` - Form handler with Supabase
- `redesign/assets/js/supabase-config.js` - Supabase credentials

### Alternative Implementation (Backend API)
- `redesign/assets/js/volunteer-form-backend-only.js` - Form handler using backend

## Recommended Setup

**For Production:**
1. Use `volunteer-form-backend-only.js` (more secure)
2. Enable RLS with proper policies
3. Backend handles all database access

**For Development:**
1. Use `volunteer-form.js` (easier to test)
2. Disable RLS temporarily
3. Still works with backend email notifications

## Testing the Fix

After implementing a solution:

1. Open mentor/trainer/operations application page
2. Fill in the form completely
3. Submit
4. Should see "Thank you" message
5. Check Supabase Dashboard → submissions table
6. Should see your submission appear within seconds

## Backend Email Setup

Regardless of which form handler you use, make sure:

1. Backend API is running/deployed
2. `RESEND_API_KEY` is set in backend `.env`
3. Resend account is active

The backend will send confirmation and admin notification emails automatically.

## Need More Help?

Check logs:
- **Frontend**: Browser Console (F12)
- **Backend**: Vercel Logs
- **Database**: Supabase Activity Tab
