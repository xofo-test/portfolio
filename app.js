/* ==========================================================================
   Portfolio prototype interactions.
   No network requests: everything here is local UI behaviour only.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------- Content renderer (data.js → DOM) ---------------- */
  var D = window.PORTFOLIO_DATA || {};

  function getPath(obj, path) {
    if (!path) return undefined;
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var SKILL_ICONS = {
    code: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 4v5"/></svg>',
    server: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 17.5h.01"/></svg>',
    database: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 18a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.3 9 3.9 3.9 0 0 1 17 18Z"/><path d="M12 13v5"/></svg>'
  };

  function renderSkillGroups() {
    var hosts = document.querySelectorAll('[data-bind-skills]');
    var groups = D.technologies && D.technologies.skillGroups;
    if (!hosts.length || !groups) return;
    for (var h = 0; h < hosts.length; h++) {
      var html = '';
      for (var g = 0; g < groups.length; g++) {
        var group = groups[g];
        var icon = SKILL_ICONS[group.icon] || SKILL_ICONS.code;
        var rows = '';
        for (var s = 0; s < group.skills.length; s++) {
          var skill = group.skills[s];
          rows += '<div class="skill-row"><span class="skill-name">' + escapeHtml(skill.name) + '</span>' +
            '<span class="skill-pct">' + escapeHtml(skill.level) + '%</span>' +
            '<div class="meter" data-level="' + Number(skill.level) + '" aria-hidden="true"><span></span></div></div>';
        }
        html += '<div class="skill-group reveal" data-reveal><div class="skill-group-head">' + icon +
          '<h3>' + escapeHtml(group.title) + '</h3></div>' + rows + '</div>';
      }
      hosts[h].innerHTML = html;
    }
  }

  function rebrandMeta() {
    var name = D.identity && D.identity.name;
    if (!name) return;
    var legacy = 'MR Tony MR';
    if (name === legacy) return;

    function swap(value) {
      return value ? value.split(legacy).join(name) : value;
    }

    document.title = swap(document.title);

    var metas = document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]');
    for (var i = 0; i < metas.length; i++) {
      var content = metas[i].getAttribute('content');
      if (content) metas[i].setAttribute('content', swap(content));
    }

    var labels = document.querySelectorAll('[aria-label]');
    for (var j = 0; j < labels.length; j++) {
      var label = labels[j].getAttribute('aria-label');
      if (label && label.indexOf(legacy) !== -1) labels[j].setAttribute('aria-label', swap(label));
    }

    var jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
    for (var k = 0; k < jsonLd.length; k++) {
      if (jsonLd[k].textContent && jsonLd[k].textContent.indexOf(legacy) !== -1) {
        jsonLd[k].textContent = swap(jsonLd[k].textContent);
      }
    }
  }

  function renderBindings() {
    var i, el, val;

    var textEls = document.querySelectorAll('[data-bind]');
    for (i = 0; i < textEls.length; i++) {
      el = textEls[i];
      val = getPath(D, el.getAttribute('data-bind'));
      if (val !== undefined) el.textContent = val;
    }

    var hrefEls = document.querySelectorAll('[data-bind-href]');
    for (i = 0; i < hrefEls.length; i++) {
      el = hrefEls[i];
      val = getPath(D, el.getAttribute('data-bind-href'));
      if (val !== undefined) el.setAttribute('href', val);
    }

    var copyEls = document.querySelectorAll('[data-bind-copy]');
    for (i = 0; i < copyEls.length; i++) {
      el = copyEls[i];
      val = getPath(D, el.getAttribute('data-bind-copy'));
      if (val !== undefined) el.setAttribute('data-copy', val);
    }

    var listEls = document.querySelectorAll('[data-bind-list]');
    for (i = 0; i < listEls.length; i++) {
      el = listEls[i];
      val = getPath(D, el.getAttribute('data-bind-list'));
      if (Array.isArray(val)) {
        var items = '';
        for (var j = 0; j < val.length; j++) items += '<li>' + escapeHtml(val[j]) + '</li>';
        el.innerHTML = items;
      }
    }

    renderSkillGroups();
    rebrandMeta();
  }

  renderBindings();

  /* ---------------- Theme ---------------- */
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeControls() {
    var isDark = root.dataset.theme !== 'light';
    var label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    var toggles = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].setAttribute('aria-label', label);
      toggles[i].setAttribute('title', label);
    }
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#070a0f' : '#f6f7fb');
  }

  syncThemeControls();

  var themeToggles = document.querySelectorAll('[data-theme-toggle]');
  for (var t = 0; t < themeToggles.length; t++) {
    themeToggles[t].addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('am-theme', next); } catch (e) { /* storage blocked */ }
      syncThemeControls();
    });
  }

  /* ---------------- Mobile navigation ---------------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.getElementById('mobileNav');

  function closeNav() {
    if (!mobileNav || mobileNav.hidden) return;
    mobileNav.hidden = true;
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      mobileNav.hidden = isOpen;
    });

    mobileNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------------- Header elevation on scroll ---------------- */
  var header = document.querySelector('[data-header]');
  function onScroll() {
    if (header) header.dataset.scrolled = window.scrollY > 6 ? 'true' : 'false';
  }
  if (header) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- Reveal + skill meters ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var meters = Array.prototype.slice.call(document.querySelectorAll('.meter[data-level]'));

  function fillMeter(meter) {
    var bar = meter.querySelector('span');
    var level = Number(meter.getAttribute('data-level')) || 0;
    if (bar) bar.style.width = Math.max(0, Math.min(100, level)) + '%';
  }

  function showNow(el) {
    el.classList.add('is-visible');
    el.style.transitionDelay = '';
  }

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    for (var r = 0; r < revealEls.length; r++) showNow(revealEls[r]);
    for (var m = 0; m < meters.length; m++) fillMeter(meters[m]);
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
        /* Drop the reveal transition once done so hover states stay snappy. */
        window.setTimeout(function () {
          el.classList.remove('reveal');
          el.style.transitionDelay = '';
        }, 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = (index % 4) * 60 + 'ms';
      revealObserver.observe(el);
    });

    var meterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fillMeter(entry.target);
        meterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    meters.forEach(function (meter) { meterObserver.observe(meter); });
  }

  /* ---------------- Project filters ---------------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-tags]'));
  var filterStatus = document.querySelector('[data-filter-status]');

  function applyFilter(filter) {
    var shown = 0;
    filterCards.forEach(function (card) {
      var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      var matches = filter === 'all' || tags.indexOf(filter) !== -1;
      card.hidden = !matches;
      if (matches) shown++;
    });
    filterButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === filter));
    });
    if (filterStatus) {
      filterStatus.textContent = shown + (shown === 1 ? ' case study' : ' case studies');
    }
  }

  if (filterButtons.length && filterCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyFilter(btn.getAttribute('data-filter'));
      });
    });
    applyFilter('all');
  }

  /* ---------------- Case study dialog ---------------- */
  var dialog = document.getElementById('caseDialog');
  var caseBody = dialog ? dialog.querySelector('[data-case-body]') : null;
  var lastCaseTrigger = null;

  function templateFor(id) {
    return document.getElementById('tpl-' + id);
  }

  function openCase(id, trigger) {
    if (!dialog || !caseBody) return;
    var tpl = templateFor(id);
    if (!tpl) return;

    caseBody.innerHTML = '';
    caseBody.appendChild(tpl.content.cloneNode(true));
    lastCaseTrigger = trigger || null;

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('dialog-open');
    caseBody.scrollTop = 0;

    if (history.replaceState) history.replaceState(null, '', '#' + id);

    var heading = caseBody.querySelector('h2');
    if (heading) {
      heading.id = 'case-dialog-title';
      heading.setAttribute('tabindex', '-1');
      dialog.setAttribute('aria-labelledby', 'case-dialog-title');
      heading.focus({ preventScroll: true });
    }
  }

  function closeCase() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      document.body.classList.remove('dialog-open');
    }
    if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
    if (lastCaseTrigger && document.contains(lastCaseTrigger)) lastCaseTrigger.focus();
  }

  if (dialog) {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-case]');
      if (!trigger) return;
      event.preventDefault();
      openCase(trigger.getAttribute('data-case'), trigger);
    });

    dialog.addEventListener('click', function (event) {
      if (event.target.closest('[data-case-close]')) {
        closeCase();
        return;
      }
      if (event.target === dialog) closeCase();
    });

    dialog.addEventListener('close', function () {
      document.body.classList.remove('dialog-open');
      if (window.location.hash) {
        if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (lastCaseTrigger && document.contains(lastCaseTrigger)) lastCaseTrigger.focus();
    });

    var initial = window.location.hash.replace('#', '');
    if (initial && templateFor(initial)) {
      window.setTimeout(function () { openCase(initial, null); }, 120);
    }
  }

  /* ---------------- Tabs (decision log) ---------------- */
  var tabGroups = document.querySelectorAll('[data-tabs]');
  for (var g = 0; g < tabGroups.length; g++) {
    (function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));

      function activate(tab, moveFocus) {
        tabs.forEach(function (item) {
          var selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
          var panel = document.getElementById(item.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
        });
        if (moveFocus) tab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { activate(tab, false); });
        tab.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
          if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
          if (event.key === 'Home') next = tabs[0];
          if (event.key === 'End') next = tabs[tabs.length - 1];
          if (!next) return;
          event.preventDefault();
          activate(next, true);
        });
      });
    })(tabGroups[g]);
  }

  /* ---------------- Toast ---------------- */
  var toastEl = document.querySelector('[data-toast]');
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    window.requestAnimationFrame(function () { toastEl.classList.add('is-visible'); });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-visible');
      window.setTimeout(function () { toastEl.hidden = true; }, 280);
    }, 2600);
  }

  /* ---------------- Copy email ---------------- */
  var copyButtons = document.querySelectorAll('[data-copy]');
  for (var c = 0; c < copyButtons.length; c++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-copy') || '';
        var done = function () { toast('Copied ' + value); };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(done).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          var helper = document.createElement('textarea');
          helper.value = value;
          helper.setAttribute('readonly', '');
          helper.style.position = 'fixed';
          helper.style.opacity = '0';
          document.body.appendChild(helper);
          helper.select();
          var ok = false;
          try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          document.body.removeChild(helper);
          toast(ok ? 'Copied ' + value : 'Copy not available — ' + value);
        }
      });
    })(copyButtons[c]);
  }

  /* ---------------- Contact form (real delivery) ---------------- */
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    var formSuccess = document.querySelector('[data-form-success]');
    var formError = document.querySelector('[data-form-error]');
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.innerHTML : '';

    function showFormMessage(alertEl, scroll) {
      if (!alertEl) return;
      alertEl.hidden = false;
      alertEl.setAttribute('tabindex', '-1');
      alertEl.focus({ preventScroll: true });
      if (scroll) alertEl.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }

    function setPending(pending) {
      if (!submitBtn) return;
      submitBtn.disabled = pending;
      submitBtn.innerHTML = pending ? 'Sending…' : submitLabel;
    }

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      /* Honeypot: silently drop bot submissions. */
      var honeypot = contactForm.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      var formData = new FormData(contactForm);
      var payload = {};
      formData.forEach(function (value, key) { if (key !== '_gotcha') payload[key] = value; });

      var endpoint = D.contactForm && D.contactForm.endpoint;

      if (endpoint) {
        setPending(true);
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json().catch(function () { return {}; });
          })
          .then(function () {
            contactForm.reset();
            showFormMessage(formSuccess, true);
            toast('Message sent — thanks!');
          })
          .catch(function () {
            showFormMessage(formError, true);
            toast('Could not send — try emailing directly instead.');
          })
          .finally(function () { setPending(false); });
      } else {
        /* mailto: fallback — opens the visitor's email client pre-filled. */
        var subject = (D.contactForm && D.contactForm.subject
          ? D.contactForm.subject
          : 'Portfolio contact — {name}')
          .replace('{name}', payload.name || '')
          .replace('{role}', payload.role || '');
        var body = 'Name: ' + (payload.name || '') + '\n' +
          'Email: ' + (payload.email || '') + '\n' +
          'Company: ' + (payload.company || '') + '\n' +
          'Role: ' + (payload.role || '') + '\n\n' +
          (payload.message || '');
        var mailto = 'mailto:' + (D.identity && D.identity.email ? D.identity.email : '') +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        window.location.href = mailto;
        contactForm.reset();
        showFormMessage(formSuccess, false);
        toast('Your email client should now open with the message');
      }
    });
  }

  /* ---------------- Print résumé ---------------- */
  var printButtons = document.querySelectorAll('[data-print]');
  for (var p = 0; p < printButtons.length; p++) {
    printButtons[p].addEventListener('click', function () { window.print(); });
  }

  /* ---------------- Footer year ---------------- */
  var years = document.querySelectorAll('[data-year]');
  for (var y = 0; y < years.length; y++) {
    years[y].textContent = String(new Date().getFullYear());
  }
})();
