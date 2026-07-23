document.addEventListener('DOMContentLoaded', async function() {
  const form = document.querySelector('form[data-demo]');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

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

    try {
      // Disable submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
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
      const { error } = await supabase
        .from('submissions')
        .insert([
          {
            type: applicationType,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            data: JSON.stringify(submissionData)
          }
        ]);

      if (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your application. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
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
        }).catch(err => console.log('Backend email notification failed (non-critical):', err));
      } catch (err) {
        console.log('Could not reach backend for email:', err);
      }

      // Success message
      alert('Thank you for your application! We will review it and be in touch soon.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('There was an error submitting your application. Please try again.');
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
