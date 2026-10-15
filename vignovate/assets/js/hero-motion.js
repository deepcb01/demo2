/* VIGNOVATE home hero: headline placement and 3D motion (owner-designed) */
(function () {
/* ---------- headline: each word sized/placed to the reference geometry ---------- */
const stage = document.getElementById('vxStage');
const words = document.querySelectorAll('#vxTitle .vx-w');
const CAP_TOP = 237, CAP_H = 225;           // reference px (1672 x 941)

function placeHeadline() {
  if (!stage || !words.length) return;
  const u = stage.clientWidth / 1672;
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '700 100px "Big Shoulders", Anton, Impact, sans-serif';
  const probe = ctx.measureText('H');
  const capRatio = (probe.actualBoundingBoxAscent || 73) / 100;       // cap height per 1px font-size
  const fs = (CAP_H * u) / capRatio;
  const fa = probe.fontBoundingBoxAscent / 100, fd = probe.fontBoundingBoxDescent / 100;
  const baseline = ((1 - (fa + fd)) / 2 + fa) * fs;                    // line-height:1 box
  const glyphTop = baseline - capRatio * fs;
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  if (mobile) {
    /* phones: three stacked lines, left aligned, large and readable */
    const W = stage.clientWidth;
    const capH = Math.min(W * 0.2, 96), mfs = capH / capRatio;
    const mBase = ((1 - (fa + fd)) / 2 + fa) * mfs, mTop = mBase - capRatio * mfs;
    const gap = capH * 1.12;
    words.forEach((w, i) => {
      w.style.fontSize = mfs + 'px'; w.style.transform = 'none';
      w.style.left = '20px'; w.style.top = (44 + i * gap - mTop) + 'px';
    });
    return;
  }
  words.forEach((w) => {
    w.style.fontSize = fs + 'px';
    w.style.transform = 'none';
    const natural = w.getBoundingClientRect().width;
    const sx = natural ? (parseFloat(w.dataset.w) * u) / natural : 1;
    w.style.left = parseFloat(w.dataset.x) * u + 'px';
    w.style.top = (CAP_TOP * u - glyphTop) + 'px';
    w.style.transform = `scaleX(${sx})`;
  });
}
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(placeHeadline);
if (window.ResizeObserver && stage) new ResizeObserver(placeHeadline).observe(stage);
placeHeadline();

/* ---------- 3D motion ---------- */
const layerV = document.getElementById('vxLayerV');
const layerM = document.getElementById('vxLayerM');
const vStack = document.getElementById('vxStack');
const glow = document.getElementById('vxGlow');
const hero = document.getElementById('vxHero');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const amp = reduce ? 0.35 : 1;     // gentler if the visitor's system asks for reduced motion

if (layerV && vStack && layerM) {
  /* thickness: stack darkened copies behind the front image so the V reads as a solid slab when it rotates */
  const front = vStack.querySelector('.vx-vs-front');
  const SLICES = 6;
  const slices = [];
  const buildSlices = (darkSrc) => {
    for (let i = SLICES; i >= 1; i--) {
      const c = front.cloneNode(false);
      c.className = 'vx-vs-slice'; c.setAttribute('aria-hidden', 'true'); c.dataset.i = i;
      if (darkSrc) c.src = darkSrc;
      else c.style.filter = 'brightness(0.4)';
      vStack.insertBefore(c, front); slices.push(c);
    }
  };
  const makeDark = () => {
    let dark = null;
    try {
      const cv = document.createElement('canvas');
      cv.width = front.naturalWidth; cv.height = front.naturalHeight;
      const cx = cv.getContext('2d');
      cx.drawImage(front, 0, 0);
      cx.globalCompositeOperation = 'source-atop';
      cx.fillStyle = 'rgba(0,0,0,0.62)';
      cx.fillRect(0, 0, cv.width, cv.height);
      dark = cv.toDataURL('image/png');
    } catch (e) { dark = null; }
    buildSlices(dark);
  };
  if (front.complete && front.naturalWidth) makeDark(); else front.addEventListener('load', makeDark, { once: true });

  const p = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', (e) => { p.x = e.clientX / innerWidth - 0.5; p.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    p.x = Math.max(-0.5, Math.min(0.5, e.gamma / 50)); p.y = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 80));
  }, { passive: true });
  let visible = true;
  if (window.IntersectionObserver) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(hero);

  const t0 = performance.now();
  (function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = (now - t0) / 1000;
    p.sx += (p.x - p.sx) * 0.07; p.sy += (p.y - p.sy) * 0.07;
    const u = Math.max(stage.clientWidth / 1672, 0.2);
    hero.style.setProperty('--zu', (u * 1).toFixed(3) + 'px');
    const scroll = Math.min(window.scrollY, 700);

    /* idle motion (always on) + pointer tilt */
    const yaw   = (Math.sin(t * 0.7) * 11 + p.sx * 26) * amp;
    const pitch = (Math.cos(t * 0.55) * 4 - p.sy * 14) * amp;
    const roll  = Math.sin(t * 0.4) * 1.2 * amp;
    const floatY = Math.sin(t * 1.1) * 14 * u * amp;
    const floatX = Math.cos(t * 0.6) * 6 * u * amp;

    layerV.style.transform =
      `perspective(${900 * u * 2.2}px) translate3d(${floatX - p.sx * 20 * u}px, ${floatY - scroll * 0.07}px, 0) rotateY(${yaw}deg) rotateX(${pitch}deg) rotateZ(${roll}deg)`;

    /* slab thickness: each copy sits deeper in z */
    for (let k = 0; k < slices.length; k++) { const sl = slices[k]; sl.style.transform = `translateZ(${(-(+sl.dataset.i) * 6 + 6) * u}px)`; }

    layerM.style.transform = `translate3d(${(-Math.sin(t * 0.7) * 6 - p.sx * 18) * u * amp}px, ${(p.sy * 6 + Math.sin(t * 0.9) * 2) * u * amp + scroll * 0.04}px, 0) scale(1.015)`;
    if (glow) glow.style.opacity = (0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2))).toFixed(3);
  })(performance.now());
}

})();
