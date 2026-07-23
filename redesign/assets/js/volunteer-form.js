document.addEventListener('DOMContentLoaded', async function() {
  const form = document.querySelector('form[data-demo]');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
      // Validate Supabase is loaded
      if (!window.supabase) {
        throw new Error('Supabase library not loaded');
      }
      if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
        throw new Error('Supabase configuration not loaded');
      }

      // Initialize Supabase
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Get form data
      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        experience: formData.get('experience')
      };

      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email) {
        throw new Error('Missing required fields: First Name, Last Name, Email');
      }

      // Determine application type from page content
      let applicationType = 'mentor';
      const pageTitle = document.querySelector('h1')?.textContent || '';
      if (pageTitle.includes('Teach skills')) {
        applicationType = 'trainer';
      } else if (pageTitle.includes('build at scale')) {
        applicationType = 'operations';
      }

      // Collect expertise/areas if present
      const expertiseInputs = form.querySelectorAll('input[name="expertise"]');
      const areasInputs = form.querySelectorAll('input[name="areas"]');

      const expertise = Array.from(expertiseInputs)
        .filter(input => input.checked)
        .map(input => input.value);

      const areas = Array.from(areasInputs)
        .filter(input => input.checked)
        .map(input => input.value);

      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';

      // Build data object
      const submissionData = {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        experience: data.experience
      };

      if (expertise.length > 0) {
        submissionData.expertise = expertise;
      }
      if (areas.length > 0) {
        submissionData.areas = areas;
      }

      // Insert into submissions table
      const { data: result, error } = await supabase
        .from('submissions')
        .insert([
          {
            type: applicationType,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone || null,
            data: JSON.stringify(submissionData),
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // Trigger backend email sending (async, non-blocking)
      try {
        const backendUrl = 'https://wissenhaus-backend.vercel.app/api/submissions';
        fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            city: data.city,
            experience: data.experience,
            type: applicationType,
            expertise: expertise.length > 0 ? expertise : undefined,
            areas: areas.length > 0 ? areas : undefined
          })
        }).catch(err => console.log('Backend email notification skipped:', err.message));
      } catch (err) {
        console.log('Backend email notification error (non-critical):', err);
      }

      // Success message
      alert('Thank you for your application! We will review it and be in touch soon.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

    } catch (err) {
      console.error('Form submission error:', err);
      alert('Error: ' + err.message + '\n\nPlease check the console for details.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
