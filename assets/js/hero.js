/* VIGNOVATE — home hero: headline placement and layered 3D motion (pointer / device tilt, idle float, scroll parallax). */
(function () {
  'use strict';
  var stage = document.getElementById('vhStage');
  var hero = document.getElementById('vhero');
  if (!stage || !hero) return;
  var words = document.querySelectorAll('#vhTitle .vh-w');
  var mobile = window.matchMedia('(max-width: 900px)');
  var CAP_TOP = 237, CAP_H = 225;           // reference px (1672 x 941)

  /* each word sized and placed to the reference geometry (desktop only; mobile stacks the words with CSS) */
  function placeHeadline() {
    if (!words.length) return;
    if (mobile.matches) { words.forEach(function (w) { w.style.cssText = ''; }); return; }
    var u = stage.clientWidth / 1672;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '100px Anton, "Big Shoulders", Impact, sans-serif';
    var probe = ctx.measureText('H');
    var capRatio = (probe.actualBoundingBoxAscent || 73) / 100;
    var fs = (CAP_H * u) / capRatio;
    var fa = probe.fontBoundingBoxAscent / 100, fd = probe.fontBoundingBoxDescent / 100;
    var baseline = ((1 - (fa + fd)) / 2 + fa) * fs;
    var glyphTop = baseline - capRatio * fs;
    words.forEach(function (w) {
      w.style.fontSize = fs + 'px';
      w.style.transform = 'none';
      var natural = w.getBoundingClientRect().width;
      var sx = natural ? (parseFloat(w.dataset.w) * u) / natural : 1;
      w.style.left = parseFloat(w.dataset.x) * u + 'px';
      w.style.top = (CAP_TOP * u - glyphTop) + 'px';
      w.style.transform = 'scaleX(' + sx + ')';
    });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(placeHeadline);
  if (window.ResizeObserver) new ResizeObserver(placeHeadline).observe(stage);
  if (mobile.addEventListener) mobile.addEventListener('change', placeHeadline);
  placeHeadline();

  /* ---------- 3D motion ---------- */
  var layerV = document.getElementById('vhLayerV');
  var layerM = document.getElementById('vhMountain');
  var vStack = document.getElementById('vhStack');
  var glow = document.getElementById('vhGlow');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var amp = reduce ? 0 : 1;
  if (!layerV || !vStack || !layerM) return;

  /* thickness: darkened copies stacked behind the front image so the V reads as a solid slab when it turns */
  var front = vStack.querySelector('.vh-front');
  var SLICES = 6, slices = [];
  if (!reduce) {
    for (var i = SLICES; i >= 1; i--) {
      var c = front.cloneNode(false);
      c.className = 'vh-slice'; c.setAttribute('aria-hidden', 'true'); c.dataset.i = i;
      c.src = front.getAttribute('data-dark');
      c.removeAttribute('data-dark'); c.removeAttribute('fetchpriority'); c.loading = 'lazy';
      vStack.insertBefore(c, front); slices.push(c);
    }
  }

  var p = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', function (e) { p.x = e.clientX / innerWidth - 0.5; p.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null) return;
    p.x = Math.max(-0.5, Math.min(0.5, e.gamma / 50)); p.y = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 80));
  }, { passive: true });
  var visible = true;
  if (window.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);

  var t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = (now - t0) / 1000;
    p.sx += (p.x - p.sx) * 0.07; p.sy += (p.y - p.sy) * 0.07;
    var u = Math.max(stage.clientWidth / 1672, 0.2);
    if (mobile.matches) u = Math.max(layerV.clientWidth / 740, 0.2);
    hero.style.setProperty('--zu', u.toFixed(3) + 'px');
    var scroll = Math.min(window.scrollY, 700);
    var yaw = (Math.sin(t * 0.7) * 11 + p.sx * 26) * amp;
    var pitch = (Math.cos(t * 0.55) * 4 - p.sy * 14) * amp;
    var roll = Math.sin(t * 0.4) * 1.2 * amp;
    var floatY = Math.sin(t * 1.1) * 14 * u * amp;
    var floatX = Math.cos(t * 0.6) * 6 * u * amp;
    layerV.style.transform = 'perspective(' + (900 * u * 2.2) + 'px) translate3d(' + (floatX - p.sx * 20 * u * amp) + 'px,' + (floatY - scroll * 0.07 * (reduce ? 0 : 1)) + 'px,0) rotateY(' + yaw + 'deg) rotateX(' + pitch + 'deg) rotateZ(' + roll + 'deg)';
    for (var k = 0; k < slices.length; k++) { var sl = slices[k]; sl.style.transform = 'translateZ(' + ((-(+sl.dataset.i) * 6 + 6) * u) + 'px)'; }
    layerM.style.transform = 'translate3d(' + ((-Math.sin(t * 0.7) * 6 - p.sx * 18) * u * amp) + 'px,' + ((p.sy * 6 + Math.sin(t * 0.9) * 2) * u * amp + scroll * 0.04 * (reduce ? 0 : 1)) + 'px,0) scale(1.015)';
    if (glow) glow.style.opacity = (reduce ? 0.5 : 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2))).toFixed(3);
  }
  requestAnimationFrame(frame);
})();
