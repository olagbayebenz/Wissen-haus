// Universal form submission handler for applications and signups
(function() {
  'use strict';

  // Handle all forms with data-demo attribute
  const forms = document.querySelectorAll('form[data-demo]');

  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Determine submission type based on form context
        const pageType = document.body.getAttribute('data-page') || 'unknown';

        data.type = pageType; // volunteer, jobs, etc
        data.submittedAt = new Date().toISOString();

        // Send to backend
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wh_authToken') || ''}`,
          ...API_CONFIG.headers
        };

        const response = await fetch(`${API_CONFIG.baseUrl}/submissions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Submission failed');
        }

        // Show success message
        showSuccessMessage(form, data.firstName || 'Thank you');

        // Reset form
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Redirect after 2 seconds
        setTimeout(() => {
          // Determine where to redirect based on page type
          let redirectUrl = 'index.html';
          if (pageType === 'volunteer') redirectUrl = 'volunteer.html';
          if (pageType === 'jobs') redirectUrl = 'jobs.html';
          if (pageType === 'internships') redirectUrl = 'internships.html';

          window.location.href = redirectUrl;
        }, 2000);

      } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage(form, error.message);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  });

  // Success message modal
  function showSuccessMessage(form, name) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div style="font-size: 3rem; margin-bottom: 16px">✅</div>
        <h2 style="color: var(--green-800); margin: 0 0 12px; font-size: 1.5rem">Application Received!</h2>
        <p style="color: var(--ink-60); margin: 0 0 8px;">Thank you, ${name}!</p>
        <p style="color: var(--ink-60); margin: 0; font-size: 0.95rem;">We've received your submission and will review it shortly. You'll be contacted at the email address provided.</p>
        <p style="color: var(--ink-40); margin: 12px 0 0; font-size: 0.85rem;">Redirecting in 2 seconds...</p>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Error message alert
  function showErrorMessage(form, message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      background: #fee;
      color: #c33;
      padding: 12px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid #c33;
    `;
    errorDiv.textContent = message;

    const existingError = form.querySelector('[style*="background: #fee"]');
    if (existingError) existingError.remove();

    form.insertBefore(errorDiv, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
  }

})();
