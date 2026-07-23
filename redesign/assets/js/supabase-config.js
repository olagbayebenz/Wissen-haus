const SUPABASE_URL = 'https://unahrcvjcxykrazdtixt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYWhyY3ZqY3h5a3JhemR0aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Mzg2OTksImV4cCI6MjEwMDIxNDY5OX0.LyrUDJ653J9lerpjFxHN_XdMTvM6nPTZbq1t2ZClJfI';

// Supabase will be initialized via window.supabase after CDN loads
function getSupabase() {
  if (!window.supabase) {
    console.error('Supabase library not loaded');
    return null;
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
