/* ==========================================================================
   Portfolio interactions
   GSAP + ScrollTrigger for scroll choreography, Lenis for smooth scrolling.
   Everything is visible without JS; animations only add motion on top.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const SVGNS = 'http://www.w3.org/2000/svg';
  const pad = n => String(n).padStart(2, '0');

  /* Projects shown on the globe. lat/lon place each point on the sphere;
     bg/accent are the colours the page fades to while that project is in front. */
  const PROJECTS = [
    { id: 'argus', name: 'ARGUS', event: 'Averis × Monash Hackathon', badge: 'Hackathon certificate', award: true,
      line: 'Seven parallel agents and a confidence gate modelled on the fruit fly brain verify shipping documents. Scored 1.0000 on a 520-email benchmark.',
      bg: '#0d0b07', accent: '#f5a524', lat: 22, lon: 0 },
    { id: 'verity', name: 'Verity', event: 'MUBA Hacks 2026 · Sui & Gonka', badge: 'Hackathon certificate', award: true,
      line: 'Certifies AI agents with three judge models and tests in three languages, then stores the proof on Sui and Walrus.',
      bg: '#070c14', accent: '#4da2ff', lat: -18, lon: 62 },
    { id: 'helix', name: 'HelixMC', event: 'Minecraft network', badge: 'Velocity network',
      line: 'A multi-server network with a hub and Rust-style survival, running on plugins I wrote myself.',
      bg: '#06100f', accent: '#34d5c8', lat: 34, lon: 124 },
    { id: 'spotify', name: 'Spotify HUD', event: 'Fabric mod · Minecraft 26.2', badge: 'Mod',
      line: 'A now-playing HUD with playback controls and Spotify sign-in, all inside Minecraft.',
      bg: '#07100a', accent: '#1ed760', lat: -26, lon: 184 },
    { id: 'finance', name: 'Finance tracker', event: 'Built for my brother', badge: 'Web app',
      line: 'A budgeting app that keeps a Google Sheet as its database, so everything stays editable by hand.',
      bg: '#0c0a12', accent: '#b79cff', lat: 12, lon: 244 },
    { id: 'scp', name: 'SCP Horror', event: 'Unity 6 · First-person horror', badge: 'In development', dev: true,
      line: 'A first-person horror game set in the SCP universe, in active development.',
      bg: '#0e0606', accent: '#ff3b30', lat: -8, lon: 302 }
  ];

  let lenis = null;

  // Build the SVG diagrams first so they exist with or without animation.
  buildArgus();
  buildHelix();
  hudProgress();
  copyEmail();

  // Untouched copies of each project visual, reused at the top of the case studies.
  const snapshots = {};
  $$('.chapter').forEach(ch => { const st = $('.stage', ch); if (st) snapshots[ch.id] = st.cloneNode(true); });

  const G = initGlobe();
  const D = initDeep();

  if (!hasGSAP) {
    $('.loader')?.remove();
    G?.start();
    D?.openFromHash();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(root, { '--bg': '#0a0c0f', '--accent': '#7c9bff' });

  /* ---------------- smooth scroll ---------------- */
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; }
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.6 }) : (target === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  }));

  /* ---------------- split text ---------------- */
  const splits = new Map();
  $$('[data-split]').forEach(el => splits.set(el, splitWords(el)));

  /* ---------------- reduced motion: show everything, stop here ---------------- */
  if (reduced) {
    $('.loader')?.remove();
    themeSwitching();
    railTracking();
    G?.start();
    D?.openFromHash();
    return;
  }

  /* ---------------- loader -> hero intro ---------------- */
  const introEls = ['.nav', '.hero__eyebrow', '.globe__headline', '.globe__card', '.globe__dots', '.globe__hint', '.globe-hero .hero__scroll'];
  gsap.set(introEls, { autoAlpha: 0, y: 24 });

  const counter = { v: 0 };
  const loaderTl = gsap.timeline({ onComplete: () => { $('.loader')?.remove(); if (!document.body.classList.contains('deep-open')) lenis?.start(); } });
  loaderTl
    .to(counter, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { $('#loaderNum').textContent = Math.round(counter.v); } })
    .to('.loader__bar span', { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
    .to('.loader__inner', { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
    .to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.15')
    .add(() => G?.start(), '-=0.7')
    .to(introEls, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.4')
    .add(() => { initScroll(); D?.openFromHash(); });

  cursor();
  magnetic();

  /* ======================================================================== */
  function initScroll() {
    themeSwitching();
    railTracking();
    navBehaviour();
    marquee();

    // reading progress
    gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // globe UI drifts away as you scroll past; scrolling back up restores the globe's colours
    gsap.fromTo(['.globe__intro', '.globe__card', '.globe__dots', '.globe__hint'], { y: 0, autoAlpha: 1 },
      { y: -90, autoAlpha: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.globe-hero', start: 'top top', end: '65% top', scrub: true } });
    ScrollTrigger.create({ trigger: '.globe-hero', start: 'top top', end: 'bottom 55%', onEnterBack: () => G?.applyTheme() });

    // about: words light up as you read
    const about = $('[data-highlight]');
    const words = splitHighlight(about);
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: about, start: 'top 78%', end: 'bottom 42%', scrub: true } });
    gsap.from('.about__card', { y: 50, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about__grid', start: 'top 85%' } });

    // section titles
    ['.work-intro__title', '.contact__title'].forEach(sel => {
      const el = $(sel);
      gsap.from(splits.get(el), { yPercent: 110, duration: 1.1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    gsap.from('.work-intro__line span', { scaleX: 0, ease: 'none', scrollTrigger: { trigger: '.work-intro', start: 'top 70%', end: 'bottom 50%', scrub: true } });
    gsap.from(['.contact__row', '.contact__links li'], { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.contact__row', start: 'top 90%' } });
    gsap.from('.workshop__row', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.workshop', start: 'top 85%' } });

    // project chapters
    $$('.chapter').forEach(ch => {
      const text = $('.chapter__text', ch);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ch, start: 'top 68%', toggleActions: 'play none none reverse' } });
      tl.from($$('.chapter__meta, .chapter__event', text), { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' })
        .from(splits.get($('.chapter__title', text)), { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, '-=0.5')
        .from($$('.chapter__desc, .redact, .chapter__stats, .tags, .chapter__links', text), { y: 28, autoAlpha: 0, stagger: 0.09, duration: 0.8, ease: 'power3.out' }, '-=0.8');

      ScrollTrigger.create({ trigger: ch, start: 'top 60%', once: true, onEnter: () => $$('.chapter__stats [data-count]', ch).forEach(countUp) });

      // stage: clip-in reveal + parallax drift
      const stage = $('.stage', ch);
      gsap.fromTo(stage, { clipPath: 'inset(14% 10% 14% 10% round 22px)', scale: 0.92 },
        { clipPath: 'inset(0% 0% 0% 0% round 22px)', scale: 1, ease: 'none', scrollTrigger: { trigger: ch, start: 'top 90%', end: 'top 25%', scrub: 1 } });
      gsap.fromTo(stage, { y: 70 }, { y: -70, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    argusScroll();
    verityScroll();
    helixScroll();
    spotifyScroll();
    financeScroll();
    scpScroll();

    ScrollTrigger.refresh();
  }

  /* ---------------- per-project visuals ---------------- */
  function scrubTl(trigger, start = 'top 75%', end = 'center 45%') {
    return gsap.timeline({ scrollTrigger: { trigger, start, end, scrub: 1 } });
  }

  function argusScroll() {
    const svg = $('#argusSvg');
    const wires = $$('.ag-wire', svg);
    wires.forEach(w => { const L = w.getTotalLength(); gsap.set(w, { strokeDasharray: L, strokeDashoffset: L }); });
    const scoreEl = $('.ag-out .score', svg);
    const sc = { v: 0 };
    scrubTl('#argus')
      .from($$('.ag-doc', svg), { x: -30, autoAlpha: 0, stagger: 0.15, duration: 0.4 })
      .to($$('.ag-wire--in', svg), { strokeDashoffset: 0, stagger: 0.02, duration: 0.6 })
      .from($$('.ag-node', svg), { scale: 0, transformOrigin: 'center', stagger: 0.05, duration: 0.3 }, '-=0.5')
      .to($$('.ag-wire--mid', svg), { strokeDashoffset: 0, stagger: 0.02, duration: 0.5 })
      .from($$('.ag-gate .ring', svg), { scale: 0, svgOrigin: '420 220', stagger: 0.08, duration: 0.4 }, '-=0.2')
      .from($('.ag-gate .core', svg), { scale: 0, svgOrigin: '420 220', duration: 0.3 })
      .to($$('.ag-wire--out', svg), { strokeDashoffset: 0, duration: 0.3 })
      .from($$('.ag-out > *', svg), { autoAlpha: 0, y: 10, stagger: 0.05, duration: 0.3 })
      .to(sc, { v: 1, duration: 0.4, onUpdate: () => { scoreEl.textContent = sc.v.toFixed(4); } }, '<');
  }

  function verityScroll() {
    scrubTl('#verity')
      .from('.vt__agent', { y: -30, autoAlpha: 0, duration: 0.4 })
      .from('.vt__langs span', { scale: 0, stagger: 0.1, duration: 0.2 })
      .from('.vt__judge', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.4 })
      .from('.vt__bar i', { scaleX: 0, stagger: 0.1, duration: 0.5 })
      .from('.vt__verdict', { scale: 0.85, autoAlpha: 0, duration: 0.35 })
      .from('.vt__chain > *', { x: 40, autoAlpha: 0, stagger: 0.1, duration: 0.35 });
  }

  function helixScroll() {
    const svg = $('#helixSvg');
    $$('.hx-link', svg).forEach(l => { const L = l.getTotalLength(); gsap.set(l, { strokeDasharray: L, strokeDashoffset: L }); });
    scrubTl('#helix')
      .from($$('.hx-player', svg), { x: -20, autoAlpha: 0, stagger: 0.08, duration: 0.3 })
      .to($$('.hx-link--in', svg), { strokeDashoffset: 0, stagger: 0.05, duration: 0.4 })
      .from($('.hx-node.main', svg), { scale: 0.6, autoAlpha: 0, svgOrigin: '195 220', duration: 0.35 })
      .to($$('.hx-link--out', svg), { strokeDashoffset: 0, stagger: 0.06, duration: 0.45 })
      .from($$('.hx-node.srv', svg), { x: 30, autoAlpha: 0, stagger: 0.1, duration: 0.35 }, '-=0.3')
      .from($$('.hx-plugin', svg), { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.35 })
      .from($$('.hx-packet', svg), { autoAlpha: 0, duration: 0.2 });
  }

  function spotifyScroll() {
    gsap.fromTo('.mc', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#spotify', start: 'top bottom', end: 'center center', scrub: true } });
    scrubTl('#spotify', 'top 65%', 'center 55%')
      .from('.hud', { x: -40, autoAlpha: 0, duration: 0.5 })
      .from('.mc__hotbar', { y: 30, autoAlpha: 0, duration: 0.4 }, '<0.1');
  }

  function financeScroll() {
    scrubTl('#finance')
      .from('.fin__row', { x: -24, autoAlpha: 0, stagger: 0.08, duration: 0.3 })
      .from('.fin__total', { y: 20, autoAlpha: 0, duration: 0.3 }, '-=0.2')
      .from('.fin__bars i', { scaleY: 0, stagger: 0.08, duration: 0.4 });
  }

  function scpScroll() {
    gsap.timeline({ scrollTrigger: { trigger: '#scp', start: 'top 55%', end: 'center 40%', scrub: 1 } })
      .to('.door__half--l', { xPercent: -100, ease: 'power2.in' }, 0)
      .to('.door__half--r', { xPercent: 100, ease: 'power2.in' }, 0)
      .from('.door__behind', { scale: 1.25, autoAlpha: 0.2, ease: 'none' }, 0);
    gsap.from('.redact mark', { scaleX: 0, transformOrigin: 'left', stagger: 0.15, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.redact', start: 'top 85%' } });
  }

  /* ---------------- page-level behaviour ---------------- */
  function themeSwitching() {
    $$('[data-theme-bg]').forEach(sec => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: self => {
          if (!self.isActive) return;
          gsap.to(root, { '--bg': sec.dataset.themeBg, '--accent': sec.dataset.themeAccent, duration: reduced ? 0 : 0.9, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    });
  }

  function railTracking() {
    const rail = $('.rail');
    ScrollTrigger.create({ trigger: '#argus', endTrigger: '#scp', start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: rail, className: 'is-visible' } });
    $$('.chapter').forEach(ch => {
      const link = $(`[data-rail="${ch.id}"]`);
      ScrollTrigger.create({ trigger: ch, start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: link, className: 'is-active' } });
    });
  }

  function navBehaviour() {
    const nav = $('.nav');
    let last = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        nav.classList.toggle('is-solid', y > 40);
        nav.classList.toggle('is-hidden', y > 400 && self.direction === 1 && y > last);
        last = y;
      }
    });
  }

  function marquee() {
    const track = $('.marquee__track');
    track.innerHTML += track.innerHTML; // seamless loop
    $$('span', track).forEach((s, i) => { if (i >= track.children.length / 2) s.setAttribute('aria-hidden', 'true'); });
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });
    let boost = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: 'power2.out' });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const v = self.getVelocity() / 300;
        boost(gsap.utils.clamp(-6, 6, (self.direction === 1 ? 1 : -1) * (1 + Math.abs(v))));
      }
    });
    ScrollTrigger.addEventListener('scrollEnd', () => boost(1));
  }

  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = pre + o.v.toFixed(dec) + suf; } });
  }

  /* ---------------- cursor + magnetic ---------------- */
  function cursor() {
    if (!finePointer) return;
    const c = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__ring em');
    const dx = gsap.quickSetter(dot, 'x', 'px'), dy = gsap.quickSetter(dot, 'y', 'px');
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    window.addEventListener('pointermove', e => { c.classList.add('is-on'); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('a, button, [data-cursor]');
      c.classList.toggle('is-hover', !!t);
      const txt = t?.dataset.cursor;
      c.classList.toggle('is-label', !!txt);
      if (txt) label.textContent = txt;
    });
    document.documentElement.addEventListener('pointerleave', () => c.classList.remove('is-on'));
  }

  function magnetic() {
    if (!finePointer) return;
    $$('[data-magnetic]').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------------- theme helper ---------------- */
  function setTheme(bg, accent, instant) {
    if (hasGSAP && !reduced && !instant) gsap.to(root, { '--bg': bg, '--accent': accent, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
    else { root.style.setProperty('--bg', bg); root.style.setProperty('--accent', accent); }
  }
  function toRGB(str) {
    str = (str || '').trim();
    if (str[0] === '#') {
      const h = str.length === 4 ? str.slice(1).split('').map(c => c + c).join('') : str.slice(1, 7);
      return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
    }
    const m = str.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [124, 155, 255];
  }

  /* ---------------- globe hero ---------------- */
  function initGlobe() {
    const cv = $('#globeCanvas'); if (!cv) return null;
    const ctx = cv.getContext('2d');
    const section = $('#globe');
    const n = PROJECTS.length;
    const DEG = Math.PI / 180;
    const DUR = 6500; // ms per project before auto-advancing

    // evenly spread points on a unit sphere (Fibonacci lattice)
    const N = 1800, GA = Math.PI * (3 - Math.sqrt(5));
    const P = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), t = i * GA;
      P[i * 3] = Math.cos(t) * r; P[i * 3 + 1] = y; P[i * 3 + 2] = Math.sin(t) * r;
    }
    const SX = new Float32Array(N), SY = new Float32Array(N), SZ = new Float32Array(N), NEAR = new Float32Array(N);
    const vec = (lat, lon) => [Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.cos(lon * DEG)];
    const marks = PROJECTS.map(p => vec(p.lat, p.lon));
    const arc = (a, b, steps) => {
      const d = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(d), so = Math.sin(om) || 1;
      const out = [];
      for (let k = 0; k <= steps; k++) {
        const t = k / steps, s1 = Math.sin((1 - t) * om) / so, s2 = Math.sin(t * om) / so, lift = 1 + 0.14 * Math.sin(Math.PI * t);
        out.push([(a[0] * s1 + b[0] * s2) * lift, (a[1] * s1 + b[1] * s2) * lift, (a[2] * s1 + b[2] * s2) * lift]);
      }
      return out;
    };
    const ring = marks.map((m, i) => arc(m, marks[(i + 1) % n], 48));

    const first = PROJECTS[0];
    const S = {
      yaw: -first.lon * DEG + 1.4, pitch: first.lat * DEG - 0.5, tYaw: -first.lon * DEG, tPitch: first.lat * DEG,
      zoom: 0.55, tZoom: 0.55, alpha: 0, tAlpha: 0, active: 0, travel: 1, path: null,
      elapsed: 0, running: false, visible: true, drag: null
    };
    const reasons = new Set();
    let w = 0, h = 0, cx = 0, cy = 0, R = 0, last = performance.now(), raf = null, resumeTimer = null;
    const screen = PROJECTS.map(() => ({ x: 0, y: 0, z: -1 }));

    const card = $('#globeCard'), timer = $('#gTimer');
    const swapEls = $$('.globe__swap > *');
    const dotsWrap = $('#gDots');
    PROJECTS.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" data-i="${i}">${p.name}</button>`;
      dotsWrap.append(li);
    });
    const dots = $$('button', dotsWrap);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const desk = w > 900;
      cx = desk ? w * 0.62 : w / 2;
      cy = desk ? h * 0.5 : h * 0.4;
      R = desk ? Math.min(h * 0.37, w * 0.27) : Math.min(w * 0.44, h * 0.25);
    }

    function project(x, y, z, cyw, syw, cp, sp, r, out) {
      const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
      out[0] = cx + x1 * r; out[1] = cy - (y * cp - z1 * sp) * r; out[2] = y * sp + z1 * cp;
      return out;
    }

    function draw(now) {
      ctx.clearRect(0, 0, w, h);
      if (S.alpha < 0.01) return;
      const [ar, ag, ab] = toRGB(getComputedStyle(root).getPropertyValue('--accent'));
      const acc = a => `rgba(${ar},${ag},${ab},${a})`;
      const r = R * S.zoom;
      const wob = reduced ? 0 : Math.sin(now * 0.00035) * 0.05;
      const yaw = S.yaw + wob, cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(S.pitch), sp = Math.sin(S.pitch);
      ctx.globalAlpha = S.alpha;

      // halo + body
      let g = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.6);
      g.addColorStop(0, acc(0.14)); g.addColorStop(1, acc(0));
      ctx.fillStyle = g; ctx.fillRect(cx - r * 1.7, cy - r * 1.7, r * 3.4, r * 3.4);
      g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,0.07)'); g.addColorStop(1, 'rgba(255,255,255,0.012)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = acc(0.28); ctx.lineWidth = 1; ctx.stroke();

      // dots
      const am = marks[S.active], o = [0, 0, 0];
      for (let i = 0; i < N; i++) {
        const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
        project(x, y, z, cyw, syw, cp, sp, r, o);
        SX[i] = o[0]; SY[i] = o[1]; SZ[i] = o[2];
        NEAR[i] = x * am[0] + y * am[1] + z * am[2];
      }
      const batch = (fill, test, size) => {
        ctx.fillStyle = fill; ctx.beginPath();
        for (let i = 0; i < N; i++) if (test(i)) { const s = size(i); ctx.rect(SX[i] - s / 2, SY[i] - s / 2, s, s); }
        ctx.fill();
      };
      batch('rgba(236,234,229,0.06)', i => SZ[i] <= 0, () => 1);
      batch('rgba(236,234,229,0.28)', i => SZ[i] > 0 && SZ[i] < 0.55 && NEAR[i] < 0.9, i => 1 + SZ[i] * 1.2);
      batch('rgba(236,234,229,0.55)', i => SZ[i] >= 0.55 && NEAR[i] < 0.9, i => 1 + SZ[i] * 1.4);
      batch(acc(0.95), i => SZ[i] > 0 && NEAR[i] >= 0.9, i => 1.4 + SZ[i] * 1.6);

      // connecting arcs
      const line = (pts, upto, style, width) => {
        ctx.strokeStyle = style; ctx.lineWidth = width; ctx.beginPath();
        let pen = false;
        const end = Math.max(1, Math.round(upto * (pts.length - 1)));
        for (let k = 0; k <= end; k++) {
          project(pts[k][0], pts[k][1], pts[k][2], cyw, syw, cp, sp, r, o);
          if (o[2] > -0.08) { pen ? ctx.lineTo(o[0], o[1]) : ctx.moveTo(o[0], o[1]); pen = true; } else pen = false;
        }
        ctx.stroke();
        return o;
      };
      ctx.setLineDash([3, 5]);
      ring.forEach(pts => line(pts, 1, 'rgba(236,234,229,0.16)', 1));
      ctx.setLineDash([]);
      if (S.path && S.travel < 0.995) {
        const head = line(S.path, S.travel, acc(0.9), 1.6);
        if (head[2] > -0.08) { ctx.fillStyle = acc(1); ctx.beginPath(); ctx.arc(head[0], head[1], 3.2, 0, Math.PI * 2); ctx.fill(); }
      }

      // project markers
      ctx.font = '500 11px "Geist Mono", ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      marks.forEach((m, i) => {
        project(m[0], m[1], m[2], cyw, syw, cp, sp, r, o);
        const sc = screen[i]; sc.x = o[0]; sc.y = o[1]; sc.z = o[2];
        if (o[2] <= 0.02) return;
        const fade = Math.min(1, o[2] * 2.5);
        if (i === S.active) {
          const ph = reduced ? 0.5 : (now % 1800) / 1800;
          ctx.strokeStyle = acc((1 - ph) * 0.8 * fade); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(o[0], o[1], 6 + ph * 26, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = acc(fade); ctx.beginPath(); ctx.arc(o[0], o[1], 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0a0c0f'; ctx.beginPath(); ctx.arc(o[0], o[1], 2.2, 0, Math.PI * 2); ctx.fill();
          // leader line + label
          const lx = o[0] + 28, ly = o[1] - 28;
          ctx.strokeStyle = acc(0.7 * fade); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(o[0] + 7, o[1] - 7); ctx.lineTo(lx, ly); ctx.lineTo(lx + 16, ly); ctx.stroke();
          ctx.fillStyle = `rgba(236,234,229,${fade})`;
          ctx.fillText(PROJECTS[i].name.toUpperCase(), lx + 22, ly);
        } else {
          ctx.fillStyle = `rgba(236,234,229,${0.75 * fade})`;
          ctx.beginPath(); ctx.arc(o[0], o[1], 3.5, 0, Math.PI * 2); ctx.fill();
          if (o[2] > 0.35) { ctx.fillStyle = `rgba(139,147,156,${fade * 0.9})`; ctx.fillText(PROJECTS[i].name, o[0] + 10, o[1]); }
        }
      });
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      raf = null;
      const dt = Math.min(64, now - last); last = now;
      const k = reduced ? 1 : 1 - Math.pow(1 - 0.045, dt / 16.7);
      if (!S.drag) {
        const d = Math.atan2(Math.sin(S.tYaw - S.yaw), Math.cos(S.tYaw - S.yaw));
        S.yaw += d * k; S.pitch += (S.tPitch - S.pitch) * k;
      }
      const k2 = reduced ? 1 : 1 - Math.pow(1 - 0.06, dt / 16.7);
      S.zoom += (S.tZoom - S.zoom) * k2; S.alpha += (S.tAlpha - S.alpha) * k2;
      S.travel += (1 - S.travel) * (reduced ? 1 : 1 - Math.pow(1 - 0.035, dt / 16.7));
      if (S.running && !reasons.size && !reduced) {
        S.elapsed += dt;
        if (S.elapsed >= DUR) go(S.active + 1);
      }
      timer.style.transform = `scaleX(${Math.min(1, S.elapsed / DUR)})`;
      draw(now);
      if (S.visible) raf = requestAnimationFrame(frame);
    }
    const loop = () => { if (!raf && S.visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    function target(i) { S.tYaw = -PROJECTS[i].lon * DEG; S.tPitch = PROJECTS[i].lat * DEG; }

    function fillCard(i) {
      const p = PROJECTS[i];
      $('#gNum').innerHTML = `${pad(i + 1)} <i>/ ${pad(n)}</i>`;
      const b = $('#gBadge'); b.textContent = p.badge; b.className = 'badge' + (p.award ? ' badge--award' : '') + (p.dev ? ' badge--dev' : '');
      $('#gEvent').textContent = p.event; $('#gTitle').textContent = p.name; $('#gLine').textContent = p.line;
    }

    function go(i, instant) {
      i = ((i % n) + n) % n;
      S.elapsed = 0;
      if (i === S.active) return;
      S.path = arc(marks[S.active], marks[i], 64); S.travel = 0;
      S.active = i;
      target(i);
      dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
      if (hasGSAP && !reduced && !instant) {
        gsap.timeline()
          .to(swapEls, { y: -14, autoAlpha: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in', onComplete: () => fillCard(i) })
          .fromTo(swapEls, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
      } else fillCard(i);
      applyTheme();
    }

    function applyTheme() {
      if (window.scrollY > section.offsetHeight * 0.55 || document.body.classList.contains('deep-open')) return;
      const p = PROJECTS[S.active]; setTheme(p.bg, p.accent);
    }

    const pause = why => reasons.add(why);
    const resume = why => { reasons.delete(why); };

    // controls
    $('#gNext').addEventListener('click', () => go(S.active + 1));
    $('#gPrev').addEventListener('click', () => go(S.active - 1));
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
    $('#gExplore').addEventListener('click', e => {
      const sc = screen[S.active];
      D?.open(PROJECTS[S.active].id, sc.z > 0 ? { x: sc.x, y: sc.y } : { x: e.clientX, y: e.clientY });
    });
    if (finePointer) {
      card.addEventListener('pointerenter', () => pause('hover'));
      card.addEventListener('pointerleave', () => resume('hover'));
    }
    document.addEventListener('keydown', e => {
      if (document.body.classList.contains('deep-open') || window.scrollY > section.offsetHeight * 0.5) return;
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') go(S.active + 1);
      if (e.key === 'ArrowLeft') go(S.active - 1);
    });

    // drag to spin, click a point to jump to it
    cv.addEventListener('pointerdown', e => {
      S.drag = { x: e.clientX, y: e.clientY, yaw: S.yaw, pitch: S.pitch, moved: 0, id: e.pointerId };
      cv.classList.add('is-dragging'); pause('drag'); clearTimeout(resumeTimer);
    });
    cv.addEventListener('pointermove', e => {
      const d = S.drag; if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
      if (d.moved > 4 && !cv.hasPointerCapture(e.pointerId)) cv.setPointerCapture(e.pointerId);
      S.yaw = d.yaw + dx * 0.006;
      S.pitch = Math.max(-1.2, Math.min(1.2, d.pitch + dy * 0.004));
    });
    const release = (e, cancelled) => {
      const d = S.drag; if (!d || d.id !== e.pointerId) return;
      S.drag = null; cv.classList.remove('is-dragging'); resume('drag');
      if (!cancelled && d.moved < 6) {
        const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
        let best = -1, bd = 30;
        screen.forEach((s, i) => { if (s.z > 0.02) { const dd = Math.hypot(s.x - px, s.y - py); if (dd < bd) { bd = dd; best = i; } } });
        if (best >= 0) { best === S.active ? $('#gExplore').click() : go(best); }
        return;
      }
      // hold the dragged view for a moment, then glide back to the current project
      S.tYaw = S.yaw; S.tPitch = S.pitch; pause('spun');
      resumeTimer = setTimeout(() => { target(S.active); resume('spun'); }, 2200);
    };
    cv.addEventListener('pointerup', e => release(e, false));
    cv.addEventListener('pointercancel', e => release(e, true));

    new IntersectionObserver(([en]) => {
      S.visible = en.isIntersecting;
      S.visible ? (resume('offscreen'), loop()) : pause('offscreen');
    }).observe(section);
    document.addEventListener('visibilitychange', () => document.hidden ? pause('tab') : resume('tab'));
    window.addEventListener('resize', debounce(resize, 150));

    resize();
    dots[0].setAttribute('aria-current', 'true');
    loop();

    return {
      start() { S.running = true; S.tZoom = 1; S.tAlpha = 1; target(S.active); applyTheme(); loop(); },
      go, pause, resume, applyTheme,
      zoom(z) { S.tZoom = z; S.tAlpha = z > 1.5 ? 0 : 1; },
      get active() { return S.active; }
    };
  }

  /* ---------------- case-study overlay ---------------- */
  function initDeep() {
    const deep = $('#deep'); if (!deep) return null;
    const scroller = $('#deepScroll');
    const cases = {};
    $$('.case', deep).forEach(a => { cases[a.dataset.case] = a; });
    const ids = PROJECTS.map(p => p.id);
    const anim = hasGSAP && !reduced;
    let current = null, lastFocus = null, isOpen = false, savedTheme = null;

    function fillVisual(id) {
      const box = $('.case__visual', cases[id]);
      if (box.firstElementChild || !snapshots[id]) return;
      const c = snapshots[id].cloneNode(true);
      c.querySelectorAll('svg[id]').forEach(n => n.removeAttribute('id'));
      box.append(c);
    }

    function show(id) {
      current = id;
      Object.values(cases).forEach(a => { a.hidden = a.dataset.case !== id; });
      fillVisual(id);
      const i = ids.indexOf(id), p = PROJECTS[i];
      $('#deepCount').textContent = `${pad(i + 1)} / ${pad(ids.length)}`;
      $('#deepNextName').textContent = PROJECTS[(i + 1) % ids.length].name;
      scroller.scrollTop = 0;
      setTheme(p.bg, p.accent);
      G?.go(i, true);
    }

    function reveal(art, delay) {
      if (!anim) return;
      gsap.from(art.querySelectorAll('.case__head > *, .case__visual, .case__stats, .case__block'),
        { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out', delay, clearProps: 'transform,opacity,visibility' });
    }

    function open(id, origin, push = true) {
      if (!cases[id] || isOpen) return;
      isOpen = true;
      lastFocus = document.activeElement;
      savedTheme = [getComputedStyle(root).getPropertyValue('--bg').trim(), getComputedStyle(root).getPropertyValue('--accent').trim()];
      document.body.classList.add('deep-open');
      $$('main, .nav, .footer, .rail').forEach(el => { el.inert = true; });
      lenis?.stop();
      G?.pause('deep'); G?.zoom(2.6);
      show(id);
      deep.hidden = false;
      if (push) history.pushState({ deep: id }, '', '#case-' + id);
      if (anim) {
        const x = origin?.x ?? innerWidth / 2, y = origin?.y ?? innerHeight / 2, big = Math.hypot(innerWidth, innerHeight) * 1.1;
        gsap.fromTo(deep, { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${big}px at ${x}px ${y}px)`, duration: 1.05, ease: 'expo.inOut', onComplete: () => gsap.set(deep, { clearProps: 'clipPath' }) });
        reveal(cases[id], 0.45);
      }
      $('#deepClose').focus({ preventScroll: true });
    }

    function switchTo(id) {
      if (!isOpen || id === current) return;
      history.replaceState({ deep: id }, '', '#case-' + id);
      if (!anim) return show(id);
      gsap.to(scroller, { autoAlpha: 0, y: -24, duration: 0.3, ease: 'power2.in', onComplete: () => {
        show(id);
        gsap.fromTo(scroller, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' });
        reveal(cases[id], 0.05);
      } });
    }
    const next = () => switchTo(ids[(ids.indexOf(current) + 1) % ids.length]);

    function close(fromHistory) {
      if (!isOpen) return;
      isOpen = false;
      if (!fromHistory && location.hash.startsWith('#case-')) history.replaceState(null, '', location.pathname + location.search);
      const done = () => {
        deep.hidden = true;
        document.body.classList.remove('deep-open');
        $$('main, .nav, .footer, .rail').forEach(el => { el.inert = false; });
        lenis?.start();
        G?.resume('deep'); G?.zoom(1);
        if (window.scrollY < ($('#globe')?.offsetHeight || 0) * 0.55) G?.applyTheme();
        else if (savedTheme) setTheme(savedTheme[0], savedTheme[1]);
        lastFocus?.focus?.({ preventScroll: true });
      };
      if (anim) gsap.to(deep, { autoAlpha: 0, duration: 0.45, ease: 'power2.out', onComplete: () => { gsap.set(deep, { clearProps: 'opacity,visibility' }); done(); } });
      else done();
    }

    $('#deepClose').addEventListener('click', () => close());
    $('#deepNext').addEventListener('click', next);
    $('#deepNextBig').addEventListener('click', next);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
    $$('[data-deep]').forEach(b => b.addEventListener('click', e => open(b.dataset.deep, { x: e.clientX, y: e.clientY })));
    window.addEventListener('popstate', () => {
      const id = location.hash.startsWith('#case-') ? location.hash.slice(6) : null;
      if (id && cases[id]) isOpen ? switchTo(id) : open(id, null, false);
      else if (isOpen) close(true);
    });

    return {
      open,
      openFromHash() { const id = location.hash.startsWith('#case-') ? location.hash.slice(6) : null; if (id && cases[id]) open(id, null, false); }
    };
  }

  /* ---------------- helpers ---------------- */
  function splitWords(el) {
    const words = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
            w.append(wi); frag.append(w); words.push(wi);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return words;
  }

  function splitHighlight(el) {
    const parts = el.textContent.trim().split(/\s+/);
    el.innerHTML = parts.map(p => `<span class="hw">${p}</span>`).join(' ');
    return $$('.hw', el);
  }

  function debounce(fn, ms) { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; }

  /* ---------------- SVG builders (run without GSAP too) ---------------- */
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent?.appendChild(n);
    return n;
  }

  function buildArgus() {
    const svg = $('#argusSvg'); if (!svg) return;
    const docs = [{ y: 104, label: 'SI', out: 156 }, { y: 240, label: 'BL', out: 292 }];
    docs.forEach(d => {
      const g = el('g', { class: 'ag-doc' }, svg);
      el('rect', { x: 24, y: d.y, width: 90, height: 104, rx: 8 }, g);
      [22, 36, 50, 64, 78].forEach((o, i) => el('line', { x1: 38, x2: i % 2 ? 84 : 100, y1: d.y + o + 8, y2: d.y + o + 8 }, g));
      const t = el('text', { x: 38, y: d.y + 22 }, g); t.textContent = d.label;
    });
    const nodes = Array.from({ length: 7 }, (_, i) => 52 + i * 56);
    nodes.forEach((y, i) => {
      docs.forEach(d => {
        const p = el('path', { class: 'ag-wire ag-wire--in', d: `M114 ${d.out} C 190 ${d.out}, 190 ${y}, 258 ${y}`, id: `agw-${i}-${d.label}` }, svg);
        p.setAttribute('stroke-opacity', d.label === 'SI' ? '.5' : '.3');
      });
      el('path', { class: 'ag-wire ag-wire--mid', d: `M282 ${y} C 350 ${y}, 350 220, 380 220`, id: `agm-${i}` }, svg);
    });
    nodes.forEach((y, i) => {
      const g = el('g', { class: 'ag-node' }, svg);
      el('circle', { cx: 270, cy: y, r: 12 }, g);
      el('circle', { cx: 270, cy: y, r: 3.5, style: 'fill: var(--accent); stroke: none' }, g);
      const t = el('text', { x: 270, y: y - 18, 'text-anchor': 'middle' }, g); t.textContent = `agent ${String(i + 1).padStart(2, '0')}`;
    });
    const gate = el('g', { class: 'ag-gate' }, svg);
    [44, 32, 21].forEach((r, i) => el('circle', { class: 'ring', cx: 420, cy: 220, r, 'stroke-opacity': [0.3, 0.55, 0.9][i], 'stroke-width': 1.2 }, gate));
    el('circle', { class: 'core', cx: 420, cy: 220, r: 9 }, gate);
    if (!reduced) {
      [0, 1.1].forEach(delay => {
        const h = el('circle', { class: 'halo', cx: 420, cy: 220, r: 12 }, gate);
        el('animate', { attributeName: 'r', values: '12;56', dur: '2.2s', begin: `${delay}s`, repeatCount: 'indefinite' }, h);
        el('animate', { attributeName: 'stroke-opacity', values: '.8;0', dur: '2.2s', begin: `${delay}s`, repeatCount: 'indefinite' }, h);
      });
    }
    const gt = el('text', { x: 420, y: 290, 'text-anchor': 'middle' }, gate); gt.textContent = 'confidence gate';
    el('path', { class: 'ag-wire ag-wire--out', d: 'M464 220 L 506 220' }, svg);
    const out = el('g', { class: 'ag-out' }, svg);
    el('circle', { cx: 522, cy: 220, r: 16 }, out);
    el('path', { class: 'check', d: 'M514 220 l6 6 l10 -12' }, out);
    const s = el('text', { class: 'score', x: 420, y: 370, 'text-anchor': 'middle' }, out); s.textContent = '1.0000';
    const sl = el('text', { x: 420, y: 392, 'text-anchor': 'middle' }, out); sl.textContent = 'score · 520-email benchmark';
    // travelling pulses
    if (!reduced) {
      [0, 2, 4, 6].forEach((i, k) => {
        [`agw-${i}-${k % 2 ? 'BL' : 'SI'}`, `agm-${i}`].forEach((id, j) => {
          const c = el('circle', { class: 'ag-pulse', r: 2.6 }, svg);
          const m = el('animateMotion', { dur: '2.4s', repeatCount: 'indefinite', begin: `${k * 0.55 + j * 1.2}s` }, c);
          el('mpath', { href: `#${id}` }, m);
        });
      });
    }
  }

  function buildHelix() {
    const svg = $('#helixSvg'); if (!svg) return;
    const players = [150, 220, 290];
    const servers = [
      { y: 70, name: 'Hub', sub: 'lobby' },
      { y: 186, name: 'Survival 1', sub: 'rust-style' },
      { y: 302, name: 'Survival 2', sub: 'rust-style' }
    ];
    players.forEach((y, i) => el('path', { class: 'hx-link hx-link--in', id: `hxi-${i}`, d: `M70 ${y} C 105 ${y}, 105 220, 140 220` }, svg));
    servers.forEach((s, i) => el('path', { class: 'hx-link hx-link--out', id: `hxo-${i}`, d: `M250 220 C 300 220, 300 ${s.y + 34}, 350 ${s.y + 34}` }, svg));

    players.forEach(y => {
      const g = el('g', { class: 'hx-player' }, svg);
      el('circle', { cx: 52, cy: y, r: 18 }, g);
      el('rect', { x: 46, y: y - 9, width: 12, height: 12 }, g);
      el('rect', { x: 44, y: y + 4, width: 16, height: 7, opacity: 0.6 }, g);
    });
    const label = el('text', { x: 52, y: 336, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': 10 }, svg); label.textContent = 'PLAYERS';

    const v = el('g', { class: 'hx-node main' }, svg);
    el('rect', { x: 140, y: 186, width: 110, height: 68, rx: 10 }, v);
    el('rect', { class: 'px', x: 154, y: 200, width: 8, height: 8 }, v);
    const vt = el('text', { x: 154, y: 228 }, v); vt.textContent = 'Velocity';
    const vs = el('text', { class: 'sub', x: 154, y: 244 }, v); vs.textContent = 'proxy';

    servers.forEach(s => {
      const g = el('g', { class: 'hx-node srv' }, svg);
      el('rect', { x: 350, y: s.y, width: 150, height: 68, rx: 10 }, g);
      [0, 1, 2].forEach(k => el('rect', { class: 'px', x: 476 - k * 11, y: s.y + 14, width: 7, height: 7, opacity: 1 - k * 0.3 }, g));
      const t = el('text', { x: 366, y: s.y + 32 }, g); t.textContent = s.name;
      const st = el('text', { class: 'sub', x: 366, y: s.y + 50 }, g); st.textContent = s.sub;
    });

    [{ x: 140, name: 'HelixSpawn · ~1.1k LOC' }, { x: 350, name: 'LoopManager' }].forEach(p => {
      const g = el('g', { class: 'hx-plugin' }, svg);
      const wdt = p.name.length * 6.6 + 24;
      el('rect', { x: p.x, y: 396, width: wdt, height: 26, rx: 13 }, g);
      const t = el('text', { x: p.x + 12, y: 413 }, g); t.textContent = p.name;
    });
    const pl = el('text', { x: 140, y: 384, fill: 'var(--muted)', 'font-size': 10 }, svg); pl.textContent = 'CUSTOM PLUGINS';

    if (!reduced) {
      players.forEach((_, i) => {
        const c = el('circle', { class: 'hx-packet', r: 3 }, svg);
        const m = el('animateMotion', { dur: '1.8s', repeatCount: 'indefinite', begin: `${i * 0.6}s` }, c);
        el('mpath', { href: `#hxi-${i}` }, m);
      });
      servers.forEach((_, i) => {
        const c = el('circle', { class: 'hx-packet', r: 3 }, svg);
        const m = el('animateMotion', { dur: '1.8s', repeatCount: 'indefinite', begin: `${0.9 + i * 0.6}s` }, c);
        el('mpath', { href: `#hxo-${i}` }, m);
      });
    }
  }

  function hudProgress() {
    if (!$('.hud')) return;
    const total = 204; let s = 47;
    const tick = () => {
      s = (s + 1) % total;
      $$('.hud__bar i').forEach(b => { b.style.width = (s / total * 100) + '%'; });
      $$('.hud__time span:first-child').forEach(n => { n.textContent = `${Math.floor(s / 60)}:${pad(s % 60)}`; });
    };
    tick();
    if (!reduced) setInterval(tick, 1000);
  }

  function copyEmail() {
    const btn = $('#copyEmail'), hint = $('#copyHint'); if (!btn) return;
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        hint.textContent = 'Copied to clipboard ✓';
      } catch {
        const r = document.createRange(); r.selectNodeContents($('.contact__email-text'));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        hint.textContent = 'Selected. Press Ctrl+C to copy';
      }
      setTimeout(() => { hint.textContent = 'Click to copy'; }, 2400);
    });
  }
})();
