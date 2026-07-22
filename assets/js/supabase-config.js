(async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm');

  window.supabase = createClient(
    'https://unahrcvjcxykrazdtixt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYWhyY3ZqY3h5a3JhemR0aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTUxOTIsImV4cCI6MjA2NTAzMTE5Mn0.tHN2z5F9C9fZ6K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y'
  );
})();
