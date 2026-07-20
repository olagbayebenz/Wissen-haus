/* ============================================================
   Wissen-Haus, interactions v2
   Single-source header/footer injection + rich motion.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || '';

  /* ---------- Nav model (edit here, applies to every page) ---------- */
  var NAV = [
    { key: 'about', label: 'About', menu: [
      ['about.html', 'About Overview', 'Explore all about sections'],
      ['about-story.html', 'Our Story', 'The Wissen-Haus journey'],
      ['founder.html', 'Meet the Founder', 'Learn about Benz Olagbaye'],
      ['contact.html', 'Contact', 'Get in touch with us']
    ]},
    { key: 'programmes', label: 'Programmes', menu: [
      ['programmes.html', 'All Programmes', 'The full overview'],
      ['bootcamp.html', 'Career Bootcamp', 'Skills for JS3-SS1 students'],
      ['podcast.html', 'Opportunity Blueprint', 'Our flagship podcast'],
      ['impact-content.html', 'Impact Content', 'Social-impact storytelling'],
      ['programmes.html#events', 'Events', 'Bootcamps, cafés & more']
    ]},
    { key: 'community', label: 'Community', menu: [
      ['community.html', 'Community Hub', 'Where youth grow together'],
      ['community.html#opportunities', 'Opportunity Hub', 'Scholarships, jobs & grants'],
      ['community.html#learning', 'Learning Library', 'Free courses & toolkits']
    ]},
    { key: 'careers', label: 'Careers', href: 'careers.html' },
    { key: 'policy', label: 'Policy', href: 'policy-research.html' },
    { key: 'involved', label: 'Get Involved', menu: [
      ['volunteer.html', 'Volunteer', 'Mentor & give your time'],
      ['partner.html', 'Partner With Us', 'For institutions'],
      ['donate.html', 'Donate', 'Fuel the mission']
    ]}
  ];
  // which nav group is "active" for a given page
  var ACTIVE = { about:'about', 'about-story':'about', founder:'about', impact:'about', 'impact-stories':'programmes', contact:'about', programmes:'programmes',
    bootcamp:'programmes', podcast:'programmes', 'impact-content':'programmes',
    community:'community', careers:'careers', policy:'policy',
    volunteer:'involved', partner:'involved', donate:'involved', jobs:'community',
    internships:'community', scholarships:'community', competitions:'community' };
  var activeKey = ACTIVE[page] || '';

  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- Build header ---------- */
  function buildHeader() {
    var linksHtml = NAV.map(function (item) {
      var isActive = item.key === activeKey ? ' active' : '';
      if (item.menu) {
        var mega = item.menu.map(function (m) {
          return '<a href="' + m[0] + '"><span class="mega-t">' + m[1] + '</span><span class="mega-d">' + m[2] + '</span></a>';
        }).join('');
        return '<li class="has-menu"><button class="nav-link' + isActive + '" aria-expanded="false" aria-haspopup="true">' + item.label + CHEV + '</button><div class="mega">' + mega + '</div></li>';
      }
      return '<li><a class="nav-link' + isActive + '" href="' + item.href + '">' + item.label + '</a></li>';
    }).join('');

    return '' +
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<div class="scroll-progress"><span></span></div>' +
      '<header class="site-header"><div class="wrap wrap-wide"><nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="index.html"><img src="assets/img/logo.png" alt="Wissen-Haus logo"><span>Wissen-Haus<small>Youth Empowerment</small></span></a>' +
        '<ul class="nav-links">' + linksHtml + '</ul>' +
        '<div class="nav-cta"><a href="volunteer.html" class="btn btn--ghost btn--sm mag">Get Involved</a><a href="donate.html" class="btn btn--sm mag">Donate</a></div>' +
        '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</nav></div></header>';
  }

  /* ---------- Build mobile menu ---------- */
  function buildMobile() {
    var groups = NAV.map(function (item) {
      if (item.menu) {
        var inner = item.menu.map(function (m) { return '<a href="' + m[0] + '">' + m[1] + '</a>'; }).join('');
        return '<div class="m-group"><button class="m-acc" aria-expanded="false">' + item.label + CHEV + '</button><div class="m-panel"><div class="m-panel-inner">' + inner + '</div></div></div>';
      }
      return '<a class="m-link" href="' + item.href + '">' + item.label + '</a>';
    }).join('');
    return '<div class="mobile-menu" id="mobileMenu"><nav>' + groups +
      '<div class="m-cta"><a class="btn btn--outline-light" href="volunteer.html">Get Involved</a><a class="btn btn--light" href="donate.html">Donate</a></div>' +
      '</nav></div>';
  }

  /* ---------- Build footer ---------- */
  function buildFooter() {
    return '' +
    '<footer class="site-footer"><div class="wrap wrap-wide"><div class="footer-top">' +
      '<div class="footer-brand"><a class="brand" href="index.html"><img src="assets/img/logo.png" alt="Wissen-Haus logo"><span>Wissen-Haus<small>Youth Empowerment</small></span></a>' +
        '<p>Bridging the skills gap in Nigeria, equipping young people with practical guidance, mentorship and global exposure for economic independence.</p>' +
        '<div class="footer-social">' +
          '<a href="https://www.instagram.com/wissen_haus" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' +
          '<a href="https://www.linkedin.com/company/wissen-haus-empowerment-foundation" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.4 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21h-4z"/></svg></a>' +
        '</div></div>' +
      '<div class="footer-col"><h5>Explore</h5><a href="about.html">About Us</a><a href="programmes.html">Programmes</a><a href="community.html">Community Hub</a><a href="jobs.html">Remote Jobs</a><a href="internships.html">Internships</a><a href="scholarships.html">Scholarships</a><a href="competitions.html">Competitions</a><a href="impact-stories.html">Impact Stories</a><a href="policy-research.html">Policy &amp; Research</a></div>' +
      '<div class="footer-col"><h5>Get Involved</h5><a href="volunteer.html">Volunteer</a><a href="careers.html">Careers</a><a href="partner.html">Partner With Us</a><a href="membership.html">Membership</a><a href="donate.html">Donate</a><a href="contact.html">Contact</a></div>' +
      '<div class="footer-col"><h5>Contact</h5><a href="#">Ibadan, Nigeria</a><a href="mailto:info@wissenhaus.org">info@wissenhaus.org</a><a href="tel:+234800947736">+234 800 WISSEN</a></div>' +
    '</div></div>' +
    '<div class="footer-mega" aria-hidden="true">WISSEN-HAUS</div>' +
    '<div class="wrap wrap-wide"><div class="footer-bottom"><span>© <span data-year>2025</span> Wissen-Haus Youth Empowerment Foundation. All rights reserved.</span><span>Empowering youth · Educating for all · Opportunity for all</span></div></div>' +
    '</footer>' +
    '<button class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M6 11l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
  }

  /* ---------- Inject chrome ---------- */
  document.body.insertAdjacentHTML('afterbegin', buildHeader() + buildMobile());
  document.body.insertAdjacentHTML('beforeend', buildFooter());

  /* ---------- Header behaviour ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 12); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Desktop dropdown: click to toggle (hover handled by CSS) */
  document.querySelectorAll('.has-menu').forEach(function (li) {
    var btn = li.querySelector('.nav-link');
    var mega = li.querySelector('.mega');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = !mega.classList.contains('open');
      document.querySelectorAll('.mega.open').forEach(function (m) { m.classList.remove('open'); });
      mega.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-menu')) {
      document.querySelectorAll('.mega.open').forEach(function (m) { m.classList.remove('open'); });
      document.querySelectorAll('.nav-link[aria-expanded="true"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.querySelectorAll('.mega.open').forEach(function (m) { m.classList.remove('open'); }); });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // accordions
    menu.querySelectorAll('.m-acc').forEach(function (acc) {
      acc.addEventListener('click', function () {
        var grp = acc.closest('.m-group');
        var panel = grp.querySelector('.m-panel');
        var open = grp.classList.toggle('open');
        acc.setAttribute('aria-expanded', open);
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      });
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll progress ---------- */
  var progress = document.querySelector('.scroll-progress span');
  if (progress) {
    var updateProg = function () {
      var h = document.documentElement;
      var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      progress.style.width = (scrolled * 100) + '%';
    };
    updateProg();
    window.addEventListener('scroll', updateProg, { passive: true });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 700); }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---------- Smooth in-page anchors ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a) return;
    var url = a.getAttribute('href');
    var hash = url.indexOf('#') > -1 ? url.slice(url.indexOf('#')) : '';
    if (!hash || hash === '#') return;
    var samePage = url.indexOf('#') === 0 || url.split('#')[0] === '' || url.split('#')[0] === location.pathname.split('/').pop();
    if (samePage) {
      var target = document.querySelector(hash);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    }
  });

  /* ---------- Reveal on scroll (reveal, reveal--*, stagger) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal--blur, .stagger');
  if ('IntersectionObserver' in window && revealEls.length && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero headline word reveal ---------- */
  document.querySelectorAll('.reveal-words').forEach(function (el) {
    if (reduce) { el.classList.add('in'); return; }
    var html = el.innerHTML;
    // wrap each word (preserve <br>)
    var parts = html.split(/(<br\s*\/?>)/i);
    el.innerHTML = parts.map(function (p) {
      if (/<br/i.test(p)) return p;
      return p.split(/\s+/).filter(Boolean).map(function (w) {
        return '<span class="wl"><span class="w">' + w + '</span></span>';
      }).join(' ');
    }).join('');
    var words = el.querySelectorAll('.w');
    words.forEach(function (w, i) { w.style.transitionDelay = (0.35 + i * 0.08) + 's'; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
  });

  /* ---------- Count-up ---------- */
  var nums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && nums.length) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io2.unobserve(el);
        if (reduce) { el.textContent = (+el.dataset.count).toLocaleString('en-US') + (el.dataset.suffix || ''); return; }
        var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dur = 1600, start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---------- Parallax media ---------- */
  var parallaxEls = document.querySelectorAll('.parallax');
  if (parallaxEls.length && !reduce) {
    var ticking = false;
    var runParallax = function () {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.speed || '0.12');
        var offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(runParallax); ticking = true; } }, { passive: true });
    runParallax();
  }

  /* ---------- Tilt on cards ---------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      var inner = card.querySelector('.tilt-inner') || card;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = 'perspective(900px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { inner.style.transform = ''; });
    });

    /* ---------- Magnetic buttons ---------- */
    document.querySelectorAll('.mag, .btn--lg').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.25;
        var my = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (reduce) return;
      var r = btn.getBoundingClientRect();
      var span = document.createElement('span');
      span.className = 'ripple';
      span.style.left = (e.clientX - r.left) + 'px';
      span.style.top = (e.clientY - r.top) + 'px';
      span.style.width = span.style.height = Math.max(r.width, r.height) / 9 + 'px';
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 650);
    });
  });

  /* ---------- Demo forms ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var original = btn ? btn.innerHTML : '';
      if (btn) { btn.innerHTML = "Thank you, we'll be in touch ✓"; btn.disabled = true; }
      form.reset();
      setTimeout(function () { if (btn) { btn.innerHTML = original; btn.disabled = false; } }, 3400);
    });
  });

  /* ---------- Year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Page intro (home only) ---------- */
  var intro = document.querySelector('.page-intro');
  if (intro && !reduce) {
    window.addEventListener('load', function () { setTimeout(function () { intro.classList.add('done'); }, 1050); });
    setTimeout(function () { intro.classList.add('done'); }, 2200);
  } else if (intro) { intro.classList.add('done'); }
})();
