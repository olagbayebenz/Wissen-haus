(function() {
  'use strict';

  const oppType = document.body.getAttribute('data-opp-type');
  if (!oppType) return;

  const grid = document.getElementById('oppGrid');
  if (!grid) return;

  const loading = document.getElementById('oppLoading');
  const empty = document.getElementById('oppEmpty');
  const updated = document.getElementById('oppUpdated');
  const filter = document.getElementById('eligFilter');

  let allItems = [];
  let currentFilter = 'all';

  function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  function formatDate(isoDate) {
    if (!isoDate) return 'Date unknown';
    try {
      const date = new Date(isoDate + 'T00:00:00Z');
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Date unknown';
    }
  }

  function renderGrid(items) {
    grid.innerHTML = '';

    if (!items.length) {
      loading.hidden = true;
      empty.hidden = false;
      return;
    }

    loading.hidden = true;
    empty.hidden = true;

    items.forEach(item => {
      const tags = (item.tags || []).map(t => escapeHtml(t)).join(', ');
      const html = `
        <article class="card reveal in">
          <div class="card__body">
            <span class="tl-tag">${escapeHtml(item.type.charAt(0).toUpperCase() + item.type.slice(1))}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.company)}</p>
            <span class="tag-line">${escapeHtml(item.eligibilityLabel || 'Open')} · Posted ${formatDate(item.datePosted || item.firstSeenAt)}</span>
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="textlink">Apply <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </div>
        </article>
      `;
      const el = document.createElement('div');
      el.innerHTML = html;
      grid.appendChild(el.firstElementChild);
    });

    if (updated) {
      const now = new Date();
      updated.textContent = `Last updated ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  function applyFilter() {
    const filtered = allItems.filter(item => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'local') {
        if (oppType === 'job' || oppType === 'internship') {
          return item.eligibility !== 'worldwide';
        } else if (oppType === 'scholarship') {
          return item.eligibility === 'nigeria';
        } else if (oppType === 'competition') {
          return item.eligibility !== 'worldwide';
        }
      }
      return true;
    });
    renderGrid(filtered);
  }

  if (filter) {
    const buttons = filter.querySelectorAll('[data-filter]');
    buttons.forEach(btn => {
      btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('p--active'));
        this.classList.add('p--active');
        currentFilter = this.getAttribute('data-filter');
        applyFilter();
      });
    });
  }

  async function init() {
    try {
      const res = await fetch('data/opportunities.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const data = await res.json();

      allItems = (data.items || [])
        .filter(item => item.type === oppType)
        .sort((a, b) => {
          const dateA = a.datePosted || a.firstSeenAt;
          const dateB = b.datePosted || b.firstSeenAt;
          return new Date(dateB) - new Date(dateA);
        });

      applyFilter();
    } catch (e) {
      console.error('Error loading opportunities:', e);
      loading.hidden = true;
      empty.hidden = false;
      if (empty) empty.textContent = 'Error loading opportunities. Please refresh.';
    }
  }

  init();
})();
