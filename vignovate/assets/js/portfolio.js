/* VIGNOVATE — portfolio filtering (works without JS: all projects stay visible) */
(function () {
  'use strict';
  var buttons = document.querySelectorAll('[data-filter]');
  var items = document.querySelectorAll('[data-cat]');
  var status = document.getElementById('filterStatus');
  if (!buttons.length) return;
  function apply(f, push) {
    var shown = 0;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === f ? 'true' : 'false'); });
    items.forEach(function (it) {
      var show = f === 'all' || it.getAttribute('data-cat').split(' ').indexOf(f) > -1;
      it.classList.toggle('hide', !show);
      if (show) shown++;
    });
    if (status) status.textContent = shown + (shown === 1 ? ' concept project shown' : ' concept projects shown');
    if (push) { try { history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f); } catch (e) {} }
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-filter'), true); }); });
  var h = (location.hash || '').replace('#', '');
  if (h && document.querySelector('[data-filter="' + h + '"]')) apply(h, false);
})();
