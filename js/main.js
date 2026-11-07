/* M&J Måleri – effekter och interaktion */
(function () {
  var doc = document;
  var root = doc.documentElement;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------- Loggan målas fram (SVG path animation) ---------- */
  function startLogo() { setTimeout(function () { root.classList.add('mj-go'); }, 250); }
  if (doc.visibilityState === 'hidden') {
    var onVis = function () {
      if (doc.visibilityState === 'visible') { doc.removeEventListener('visibilitychange', onVis); startLogo(); }
    };
    doc.addEventListener('visibilitychange', onVis);
  } else { startLogo(); }

  /* ---------- Våra arbeten: kortet växer + vitt stänk vid klick ---------- */
  function mjInteractions(doc, reduced) {
    var lb = doc.getElementById('lb');
    var box = doc.getElementById('lb-card');
    var img = doc.getElementById('lb-img');
    var title = doc.getElementById('lb-title');
    var closeBtn = doc.getElementById('lb-close');
    var current = null;
    var busy = false;
    var offs = [];
    function on(el, ev, fn, opt) { if (!el) return; el.addEventListener(ev, fn, opt); offs.push(function () { el.removeEventListener(ev, fn, opt); }); }
    function fit(ar) {
      var parts = String(ar).split('/');
      var ratio = parseFloat(parts[0]) / parseFloat(parts[1]) || 4 / 3;
      var maxW = Math.min(window.innerWidth * 0.88, 760);
      var maxH = window.innerHeight * 0.8 - 24;
      var w = Math.min(maxW, maxH * ratio);
      box.style.width = (w + 24) + 'px';
      img.style.aspectRatio = ar;
    }
    function fromCard(card) {
      var r = card.getBoundingClientRect();
      var t = box.getBoundingClientRect();
      var s = r.width / t.width;
      var tx = (r.left + r.width / 2) - (t.left + t.width / 2);
      var ty = (r.top + r.height / 2) - (t.top + t.height / 2);
      return 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
    }
    function open(card) {
      if (busy || !lb) return;
      current = card;
      img.src = card.getAttribute('data-src');
      img.alt = card.getAttribute('data-title');
      title.textContent = card.getAttribute('data-title');
      fit(card.getAttribute('data-ar') || '4 / 3');
      lb.classList.add('lb-open');
      card.style.visibility = 'hidden';
      if (reduced) { closeBtn.focus(); return; }
      box.style.transition = 'none';
      box.style.transform = fromCard(card);
      void box.offsetWidth;
      box.style.transition = 'transform .55s cubic-bezier(.2,.8,.2,1)';
      box.style.transform = 'none';
      setTimeout(function () { try { closeBtn.focus({ preventScroll: true }); } catch (e) {} }, 560);
    }
    function close() {
      if (!current || busy) return;
      var card = current;
      if (reduced) { lb.classList.remove('lb-open'); card.style.visibility = ''; current = null; return; }
      busy = true;
      box.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1)';
      box.style.transform = fromCard(card);
      setTimeout(function () {
        lb.classList.remove('lb-open');
        box.style.transition = 'none';
        box.style.transform = 'none';
        card.style.visibility = '';
        current = null;
        busy = false;
      }, 460);
    }
    Array.prototype.forEach.call(doc.querySelectorAll('.hs-card'), function (card) {
      on(card, 'click', function () { open(card); });
    });
    on(lb, 'click', close);
    on(box, 'click', function (e) { e.stopPropagation(); });
    on(closeBtn, 'click', function (e) { e.stopPropagation(); close(); });
    on(window, 'keydown', function (e) { if (e.key === 'Escape') close(); });
    /* Vitt färgstänk vid varje klick, på dator och mobil */
    on(doc, 'click', function (e) {
      if (reduced || (!e.clientX && !e.clientY)) return;
      var d = doc.createElement('div');
      d.className = 'splat';
      d.style.left = (e.clientX - 18) + 'px';
      d.style.top = (e.clientY - 18) + 'px';
      d.innerHTML = '<svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true"><path fill="#FFFFFF" d="M18 9c3 0 4 3 6 2s4 2 3 4-0 4 2 5-1 4-3 4-2 3-5 3-3-2-5-2-4-1-4-3 2-3 0-5 1-4 3-4 1-4 3-4z"/><circle fill="#FFFFFF" cx="31" cy="7" r="2"/><circle fill="#FFFFFF" cx="5" cy="29" r="1.8"/><circle fill="#FFFFFF" cx="32" cy="27" r="1.4"/><circle fill="#FFFFFF" cx="7" cy="6" r="1.2"/></svg>';
      doc.body.appendChild(d);
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 700);
    }, true);
    return function () { offs.forEach(function (f) { f(); }); };
  }
  mjInteractions(doc, reduced);

  /* ---------- Testa en färg på ditt rum ---------- */
  var roomText = [
    ['Varmvit', 'Ljusgrå soffa, beige detaljer och linne. Lugnt och tidlöst.'],
    ['Salviagrön', 'Linnefärgad soffa med terrakotta. Mjukt och naturnära.'],
    ['Dimblå', 'Mörkgrå soffa med vitt och sand. Svalt och stilrent.'],
    ['Terrakotta', 'Konjaksbrun läder och olivgrönt. Varmt och ombonat.'],
    ['Skogsgrön', 'Krämvit soffa med senap och mässing. Djupt och exklusivt.']
  ];
  var roomImgs = doc.querySelectorAll('.room-img');
  var chips = doc.querySelectorAll('.room-chip');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var i = +chip.getAttribute('data-i');
      Array.prototype.forEach.call(roomImgs, function (im, j) { im.style.opacity = j === i ? 1 : 0; });
      Array.prototype.forEach.call(chips, function (c, j) {
        var on = j === i;
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
        c.style.borderColor = on ? '#1C1A1A' : '#E5DED3';
        c.style.transform = 'translateY(' + (on ? -4 : 0) + 'px)';
      });
      doc.getElementById('room-name').textContent = roomText[i][0];
      doc.getElementById('room-desc').textContent = roomText[i][1];
    });
  });

  /* ---------- Reduced motion: lugn sida utan effekter ---------- */
  if (reduced) {
    root.classList.add('hs-static');
    Array.prototype.forEach.call(doc.querySelectorAll('.tw'), function (el) { el.textContent = el.getAttribute('data-tw'); });
    var v0 = doc.querySelector('video.hero-img');
    if (v0) { v0.removeAttribute('autoplay'); v0.pause(); }
    return;
  }

  /* ---------- Hero-video ---------- */
  var v = doc.querySelector('video.hero-img');
  if (v) {
    v.muted = true;
    v.defaultPlaybackRate = 2.1;
    v.playbackRate = 2.1;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Typewriter under huvudrubriken ---------- */
  var ht = doc.querySelector('.tw-hero');
  if (ht) {
    var full = ht.getAttribute('data-tw') || '';
    var n = 0;
    ht.textContent = '';
    ht.classList.add('tw-caret');
    var step = function () {
      n++;
      ht.textContent = full.slice(0, n);
      if (n < full.length) setTimeout(step, 45);
      else setTimeout(function () { ht.classList.remove('tw-caret'); }, 1200);
    };
    setTimeout(step, 700);
  }

  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Scroll reveal ---------- */
  root.classList.add('rv-ready');
  var rvEls = doc.querySelectorAll('.rv');
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(rvEls, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(rvEls, function (el) { el.classList.add('in'); });
  }

  /* ---------- Verktygen faller ner (drop-in), varje gång ---------- */
  var stage = doc.querySelector('.tools-stage');
  if (stage && hasIO) {
    root.classList.add('tools-ready');
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.intersectionRatio >= 0.35) stage.classList.add('drop');
        else if (!en.isIntersecting) stage.classList.remove('drop');
      });
    }, { threshold: [0, 0.35] }).observe(stage);
  }

  /* ---------- Typewriter i "Så går det till" ---------- */
  var zone = doc.querySelector('.tw-zone');
  if (zone) {
    var twT = [];
    var cols = Array.prototype.map.call(zone.querySelectorAll('.tw-col'), function (c) {
      return Array.prototype.slice.call(c.querySelectorAll('.tw'));
    });
    var stopTw = function () {
      twT.forEach(clearTimeout); twT = [];
      cols.forEach(function (els) { els.forEach(function (el) { el.textContent = ''; el.classList.remove('tw-caret'); }); });
    };
    var startTw = function () {
      stopTw();
      cols.forEach(function (els) {
        var i = 0;
        var next = function () {
          if (i >= els.length) return;
          var el = els[i++];
          var text = el.getAttribute('data-tw') || '';
          var k = 0;
          el.classList.add('tw-caret');
          var tick = function () {
            k++;
            el.textContent = text.slice(0, k);
            if (k < text.length) twT.push(setTimeout(tick, 28));
            else { el.classList.remove('tw-caret'); twT.push(setTimeout(next, 180)); }
          };
          tick();
        };
        next();
      });
    };
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) startTw(); else stopTw(); });
      }, { threshold: 0.35 }).observe(zone);
    } else {
      cols.forEach(function (els) { els.forEach(function (el) { el.textContent = el.getAttribute('data-tw'); }); });
    }
  }

  /* ---------- Våra arbeten: scroll-driven horizontal scroll ---------- */
  var pin = doc.querySelector('.hs-pin');
  var mv = doc.querySelector('.hs-move');
  var travel = 0;
  function onHs() {
    if (!pin || !mv) return;
    var total = pin.offsetHeight - window.innerHeight;
    var prog = total > 0 ? Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / total)) : 0;
    mv.style.transform = 'translateX(' + (-prog * travel) + 'px)';
  }
  function hsLayout() {
    if (!pin || !mv) return;
    travel = Math.max(0, mv.scrollWidth - window.innerWidth * 0.92);
    pin.style.height = (window.innerHeight + travel) + 'px';
    onHs();
  }
  if (pin && mv) {
    hsLayout();
    window.addEventListener('resize', hsLayout);
    window.addEventListener('scroll', onHs, { passive: true });
    window.addEventListener('load', hsLayout);
  }

  /* ---------- Parallax på hero-videon ---------- */
  var heroMedia = doc.querySelector('.hero-img');
  var raf = 0;
  if (heroMedia) {
    var onPar = function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var y = Math.min(window.scrollY || 0, 900);
        heroMedia.style.transform = 'translateY(' + (y * 0.25) + 'px) scale(1.08)';
      });
    };
    window.addEventListener('scroll', onPar, { passive: true });
    onPar();
  }
})();
