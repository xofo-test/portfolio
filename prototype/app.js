/* ==========================================================================
   Portfolio prototype interactions.
   No network requests: everything here is local UI behaviour only.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
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

  /* ---------------- Contact form (local only) ---------------- */
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    var formSuccess = document.querySelector('[data-form-success]');
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      contactForm.reset();
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.setAttribute('tabindex', '-1');
        formSuccess.focus({ preventScroll: true });
        formSuccess.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
      toast('Message captured locally — this prototype has no backend');
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
