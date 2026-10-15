/* VIGNOVATE — shared behaviour: reveal, headline fitting, AI shortcut card */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal on scroll */
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* fit oversized headlines to their container with whatever display font is active */
  function fit() {
    document.querySelectorAll('[data-fit]').forEach(function (el) {
      var mode = el.getAttribute('data-fit');
      var avail = el.parentElement ? el.clientWidth : 0;
      if (!avail) return;
      el.style.fontSize = '100px';
      var need;
      if (mode === 'title') {
        need = 0;
        el.querySelectorAll('.ln').forEach(function (ln) { var rg = document.createRange(); rg.selectNodeContents(ln); need = Math.max(need, rg.getBoundingClientRect().width); });
        var cap = Math.min(window.innerWidth * 0.2, 400);
        var fs = Math.min(100 * avail * 0.995 / need, cap);
        el.style.fontSize = fs + 'px';
      } else {
        need = el.firstElementChild.getBoundingClientRect().width;
        el.style.fontSize = (100 * avail * 0.995 / need) + 'px';
      }
    });
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* hero AI shortcut card (a guided picker, not a live chatbot) */
  var tg = document.getElementById('aiToggle'), panel = document.getElementById('aiPanel');
  if (tg && panel) {
    function setOpen(o) { panel.classList.toggle('open', o); tg.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    tg.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); tg.focus(); } });
    document.addEventListener('click', function (e) { if (!e.target.closest('.ai-card')) setOpen(false); });
  }


  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
