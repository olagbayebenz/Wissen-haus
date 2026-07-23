(async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm');

  window.supabase = createClient(
    'https://unahrcvjcxykrazdtixt.supabase.co',
    'sb_publishable_QQ-q8Ly2qxnaiuF_tslPIA_m2mTJ19m'
  );
})();
