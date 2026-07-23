import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://unahrcvjcxykrazdtixt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYWhyY3ZqY3h5a3JhemR0aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTUxOTIsImV4cCI6MjA2NTAzMTE5Mn0.tHN2z5F9C9fZ6K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y'
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({
    user: { id: data.user.id, email: data.user.email, name },
    message: 'Sign up successful'
  });
};
