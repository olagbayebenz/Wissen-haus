// Check if user is authenticated; redirect to login if not
(function() {
  'use strict';

  const currentPage = document.body.getAttribute('data-page');
  const protectedPages = ['community', 'jobs', 'internships', 'scholarships', 'competitions', 'softskills'];

  if (protectedPages.includes(currentPage)) {
    const user = JSON.parse(localStorage.getItem('wh_currentUser') || 'null');

    if (!user) {
      // Redirect to community landing page for community hub, login for others
      const redirectUrl = currentPage === 'community' ? 'community-landing.html' : 'login.html';
      window.location.href = redirectUrl;
      return;
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
