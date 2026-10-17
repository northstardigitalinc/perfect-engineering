/* ═══════════════════════════════════════════
   PEL Theme System — Light / Dark Toggle
   + Performance: rAF-throttled scroll
═══════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── 1. APPLY SAVED THEME BEFORE PAINT (no flash) ── */
  var saved = localStorage.getItem('pel-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  /* ── 2. THEME TOGGLE LOGIC ── */
  function toggleTheme() {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';

    /* Smooth cross-fade */
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', next);
    localStorage.setItem('pel-theme', next);

    setTimeout(function() {
      html.classList.remove('theme-transitioning');
    }, 350);
  }

  /* Wire up all .theme-toggle buttons (present after DOMContentLoaded) */
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      btn.addEventListener('click', toggleTheme);
    });
  });

  /* ── 3. rAF-THROTTLED SCROLL DISPATCHER ── */
  /* Replace all individual scroll listeners with one shared dispatcher
     so we only do one layout read per frame. */
  var scrollRAF = null;
  var scrollCallbacks = [];

  window.addEventListener('scroll', function() {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(function() {
      scrollRAF = null;
      var sy = window.scrollY;
      for (var i = 0; i < scrollCallbacks.length; i++) {
        try { scrollCallbacks[i](sy); } catch(e) {}
      }
    });
  }, { passive: true });

  /* Public: other scripts call pelScroll.add(fn) instead of window.addEventListener('scroll') */
  window.pelScroll = {
    add: function(fn) { scrollCallbacks.push(fn); }
  };

})();
