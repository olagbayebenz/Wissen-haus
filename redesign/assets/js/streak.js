// Display streak badge on protected pages
(function() {
  'use strict';

  const protectedPages = ['community', 'jobs', 'internships', 'scholarships', 'competitions', 'softskills'];
  const currentPage = document.body.getAttribute('data-page');

  if (!protectedPages.includes(currentPage)) return;

  const user = JSON.parse(localStorage.getItem('wh_currentUser') || 'null');
  if (!user) return;

  const streak = parseInt(localStorage.getItem('wh_streak') || '0');

  const badge = document.createElement('div');
  badge.id = 'streakBadge';
  badge.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--green-800), var(--green-900));
    color: #fff;
    padding: 12px 18px;
    border-radius: 24px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(15, 45, 29, 0.25);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  `;
  badge.innerHTML = `
    <span style="font-size: 1.2rem;">🔥</span>
    <span>Member • ${streak} day streak</span>
  `;

  badge.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px)';
    this.style.boxShadow = '0 6px 16px rgba(15, 45, 29, 0.35)';
  });

  badge.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 12px rgba(15, 45, 29, 0.25)';
  });

  badge.addEventListener('click', function() {
    showStreakModal(user, streak);
  });

  document.body.appendChild(badge);

  function showStreakModal(user, streak) {
    const modal = document.createElement('div');
    modal.id = 'streakModal';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      background: #fff;
      border-radius: var(--radius-lg);
      padding: 32px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    `;

    card.innerHTML = `
      <div style="font-size: 3.5rem; margin-bottom: 16px;">🔥</div>
      <h2 style="margin: 0 0 8px; color: var(--ink); font-size: 1.5rem;">${streak} Day Streak!</h2>
      <p style="color: var(--ink-60); margin: 0 0 12px;">Welcome back, ${user.name}!</p>
      <p style="color: var(--ink-60); margin: 0 0 24px; font-size: 0.9rem;">Keep visiting every day to grow your streak and unlock community achievements.</p>
      <button onclick="this.closest('#streakModal').remove()" style="padding: 12px 24px; background: var(--green-800); color: #fff; border: none; border-radius: var(--radius); cursor: pointer; font-weight: 600; font-size: 1rem;">Got it!</button>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line);">
        <small style="color: var(--ink-60); cursor: pointer;" onclick="logout()" style="text-decoration: underline;">Sign out</small>
      </div>
    `;

    modal.appendChild(card);
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
  }

  function logout() {
    localStorage.removeItem('wh_currentUser');
    localStorage.removeItem('wh_visitDate');
    localStorage.removeItem('wh_streak');
    window.location.href = 'login.html';
  }

  // Expose logout globally
  window.logout = logout;
})();
