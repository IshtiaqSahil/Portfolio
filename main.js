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

  // Build the SVG diagrams first so they exist with or without animation.
  buildArgus();
  buildHelix();
  hudProgress();
  copyEmail();

  if (!hasGSAP) {
    $('.loader')?.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(root, { '--bg': '#0a0c0f', '--accent': '#7c9bff' });

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
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
    drawHeroStatic();
    return;
  }

  /* ---------------- loader -> hero intro ---------------- */
  const heroWords = splits.get($('.hero__title'));
  gsap.set(heroWords, { yPercent: 110 });
  gsap.set(['.hero__eyebrow', '.hero__foot', '.nav'], { autoAlpha: 0, y: 20 });

  const counter = { v: 0 };
  const loaderTl = gsap.timeline({ onComplete: () => { $('.loader')?.remove(); lenis?.start(); } });
  loaderTl
    .to(counter, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { $('#loaderNum').textContent = Math.round(counter.v); } })
    .to('.loader__bar span', { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
    .to('.loader__inner', { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
    .to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.15')
    .add(() => initScroll(), '-=0.6')
    .to(heroWords, { yPercent: 0, duration: 1.2, stagger: 0.06, ease: 'expo.out' }, '-=0.55')
    .to(['.nav', '.hero__eyebrow'], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=1')
    .to('.hero__foot', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8')
    .add(() => $$('.hero__stats [data-count]').forEach(countUp), '-=0.8');

  heroCanvas();
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

    // hero drifts away
    gsap.to('.hero__inner', { yPercent: -18, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

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

  /* ---------------- hero flow-field canvas ---------------- */
  function heroCanvas() {
    const cv = $('#heroCanvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    let w, h, dpr, parts = [], running = true, t = 0;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(700, Math.round((w * h) / 1900));
      parts = Array.from({ length: n }, spawn);
    }
    function spawn() { return { x: Math.random() * w, y: Math.random() * h, life: 60 + Math.random() * 140, age: 0 }; }
    function field(x, y) {
      return (Math.sin(x * 0.0032 + t * 0.6) * Math.cos(y * 0.0041 - t * 0.4) + Math.sin((x + y) * 0.0017 + t * 0.25)) * Math.PI;
    }
    function frame() {
      if (!running) return;
      t += 0.004;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      const accent = getComputedStyle(root).getPropertyValue('--accent').trim() || '#7c9bff';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const p of parts) {
        const a = field(p.x, p.y);
        let vx = Math.cos(a) * 1.1, vy = Math.sin(a) * 1.1;
        const mx = p.x - mouse.x, my = p.y - mouse.y, d2 = mx * mx + my * my;
        if (d2 < 22000) { const f = (22000 - d2) / 22000 * 3; const d = Math.sqrt(d2) || 1; vx += (mx / d) * f; vy += (my / d) * f; }
        ctx.moveTo(p.x, p.y);
        p.x += vx; p.y += vy; p.age++;
        ctx.lineTo(p.x, p.y);
        if (p.age > p.life || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) Object.assign(p, spawn());
      }
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));
    $('.hero').addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    $('.hero').addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([en]) => { const was = running; running = en.isIntersecting; if (running && !was) requestAnimationFrame(frame); }).observe(cv);
    requestAnimationFrame(frame);
  }

  function drawHeroStatic() {
    const cv = $('#heroCanvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight;
    ctx.fillStyle = 'rgba(124,155,255,.25)';
    for (let i = 0; i < 400; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
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
    const bar = $('#hudProgress'), now = $('#hudNow'); if (!bar) return;
    const total = 204; let s = 47;
    const tick = () => {
      s = (s + 1) % total;
      bar.style.width = (s / total * 100) + '%';
      now.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
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
