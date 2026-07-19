// Check if user is authenticated; redirect to login if not
(function() {
  'use strict';

  const currentPage = document.body.getAttribute('data-page');
  const protectedPages = ['community', 'jobs', 'internships', 'scholarships', 'competitions', 'softskills'];

  // Paid courses: require membership
  const paidPages = ['careerlunch', 'aiforstu', 'finliteracy', 'workplace'];
  const allProtectedPages = [...protectedPages, ...paidPages];

  if (allProtectedPages.includes(currentPage)) {
    const user = JSON.parse(localStorage.getItem('wh_currentUser') || 'null');

    if (!user) {
      // Redirect to community landing page for community hub, login for others
      const redirectUrl = currentPage === 'community' ? 'community-landing.html' : 'login.html';
      window.location.href = redirectUrl;
      return;
    }

    // Check membership for paid pages
    if (paidPages.includes(currentPage)) {
      const membershipExpiry = localStorage.getItem('wh_membershipExpiry');
      const now = new Date();

      if (!membershipExpiry || new Date(membershipExpiry) < now) {
        // Show upgrade modal
        document.body.innerHTML = `
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0F2D1D 0%, #1a4d36 100%); padding: 20px;">
            <div style="background: white; padding: 60px 40px; border-radius: 16px; max-width: 500px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3)">
              <h1 style="color: #0F2D1D; margin: 0 0 16px; font-size: 2rem">Premium Course</h1>
              <p style="color: #666; font-size: 1.05rem; margin: 0 0 32px; line-height: 1.6">This course requires an active membership. Upgrade now to unlock lifetime access to all 4 premium courses.</p>

              <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin: 32px 0">
                <div style="font-size: 2.5rem; font-weight: 900; color: #0F2D1D; margin-bottom: 8px">£10</div>
                <div style="color: #666; margin-bottom: 24px">One-time membership<br>Valid for 1 year</div>
                <ul style="text-align: left; color: #666; line-height: 1.8; margin: 0; padding: 0 0 0 20px">
                  <li>✓ 4 premium courses</li>
                  <li>✓ 40 modules total</li>
                  <li>✓ Certificates for LinkedIn</li>
                  <li>✓ Downloadable resources</li>
                </ul>
              </div>

              <button onclick="upgradeMembership()" style="width: 100%; padding: 16px; background: #0F2D1D; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; margin-bottom: 12px">
                Upgrade to Premium
              </button>
              <a href="community.html" style="display: inline-block; padding: 12px 24px; color: #0F2D1D; text-decoration: none; font-weight: 600">← Back to Community</a>
            </div>
          </div>
          <script>
            function upgradeMembership() {
              const expiryDate = new Date();
              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              localStorage.setItem('wh_membershipExpiry', expiryDate.toISOString());
              window.location.href = window.location.pathname;
            }
          </script>
        `;
        return;
      }
    }

    // Update visit date for streak tracking
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = localStorage.getItem('wh_visitDate');

    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastVisit === yesterdayStr) {
        const currentStreak = parseInt(localStorage.getItem('wh_streak') || '1');
        localStorage.setItem('wh_streak', (currentStreak + 1).toString());
      } else {
        localStorage.setItem('wh_streak', '1');
      }

      localStorage.setItem('wh_visitDate', today);
    }
  }
})();
