// Alternative form handler that uses backend API only (no Supabase frontend)
// Use this if Supabase RLS policies are blocking direct access

document.addEventListener('DOMContentLoaded', async function() {
  const form = document.querySelector('form[data-demo]');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
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

      // Send to backend API
      const backendUrl = 'https://wissenhaus-backend.vercel.app/api/submissions';
      const response = await fetch(backendUrl, {
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      // Success message
      alert('Thank you for your application! We will review it and be in touch soon.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

    } catch (err) {
      console.error('Form submission error:', err);
      alert('Error: ' + err.message + '\n\nPlease try again or contact support.');
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
