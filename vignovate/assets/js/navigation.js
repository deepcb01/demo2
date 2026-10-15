/* VIGNOVATE — accessible full-screen menu */
(function () {
  'use strict';
  var btn = document.getElementById('menuBtn');
  var ov = document.getElementById('overlay');
  var closeBtn = document.getElementById('menuClose');
  if (!btn || !ov || !closeBtn) return;
  var lastFocus = null;
  function focusables() { return ov.querySelectorAll('a[href],button:not([disabled])'); }
  function open() {
    lastFocus = document.activeElement;
    ov.classList.add('open'); ov.removeAttribute('aria-hidden');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', function (e) {
    if (!ov.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') { /* keep focus inside the menu */
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', function (m) { if (m.matches && ov.classList.contains('open')) close(); });
})();
