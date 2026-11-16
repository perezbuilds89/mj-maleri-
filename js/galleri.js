/* M&J Måleri – Före & efter-galleriet */
(function () {
  var doc = document;
  var grid = doc.querySelector('.g-grid');
  if (!grid) return;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.g-card'));

  /* ---------- FÖRE | EFTER (toggle) ---------- */
  function setToggle(scope, tgButtons, efter) {
    scope.classList.toggle('is-efter', efter);
    Array.prototype.forEach.call(tgButtons, function (b) {
      b.setAttribute('aria-pressed', (b.getAttribute('data-v') === 'efter') === efter ? 'true' : 'false');
    });
  }
  cards.forEach(function (card) {
    var btns = card.querySelectorAll('.g-tg button');
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener('click', function () { setToggle(card, btns, b.getAttribute('data-v') === 'efter'); });
    });
  });

  /* ---------- Filter (med mjuk omsortering via View Transitions) ---------- */
  var fbtns = doc.querySelectorAll('.g-filter button');
  function applyFilter(cat) {
    var run = function () {
      grid.classList.toggle('is-filtered', cat !== 'alla');
      cards.forEach(function (c) { c.hidden = !(cat === 'alla' || c.getAttribute('data-cat') === cat); });
      Array.prototype.forEach.call(fbtns, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-f') === cat ? 'true' : 'false'); });
      parallax();
    };
    if (doc.startViewTransition && !reduced) doc.startViewTransition(run); else run();
  }
  Array.prototype.forEach.call(fbtns, function (b) {
    b.addEventListener('click', function () { applyFilter(b.getAttribute('data-f')); });
  });

  /* ---------- Mild parallax i mittenraden (bara dator) ---------- */
  var AMP = 45;
  var raf = 0;
  function parallax() {
    var on = !reduced && window.innerWidth > 700 && !grid.classList.contains('is-filtered');
    var gTop = grid.getBoundingClientRect().top;
    var vh = window.innerHeight;
    cards.forEach(function (c) {
      var d = +c.getAttribute('data-par') || 0;
      if (!on || !d) { c.style.translate = ''; return; }
      var top = gTop + c.offsetTop;
      var p = (vh - top) / (vh + c.offsetHeight);
      p = Math.max(0, Math.min(1, p)) - 0.5;
      c.style.translate = '0 ' + (p * 2 * AMP * d).toFixed(1) + 'px';
    });
  }
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; parallax(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  parallax();

  /* ---------- Förstoring: kortet växer fram ---------- */
  var lb = doc.getElementById('g-lb');
  var box = doc.getElementById('g-lb-card');
  var frame = box.querySelector('.g-lb-frame');
  var fo = doc.getElementById('g-lb-fo');
  var ef = doc.getElementById('g-lb-ef');
  var title = doc.getElementById('g-lb-title');
  var closeBtn = doc.getElementById('g-lb-close');
  var lbBtns = box.querySelectorAll('.g-tg button');
  var current = null;
  var busy = false;

  function fit(ar) {
    var parts = String(ar).split('/');
    var ratio = parseFloat(parts[0]) / parseFloat(parts[1]) || 4 / 3;
    var desk = window.innerWidth > 700;
    var maxW = Math.min(window.innerWidth * 0.88, desk ? 1100 : 760);
    var maxH = window.innerHeight * (desk ? 0.9 : 0.8) - 24;
    var w = Math.min(maxW, maxH * ratio);
    box.style.width = (w + 24) + 'px';
    frame.style.aspectRatio = ar;
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
    if (busy) return;
    current = card;
    var single = card.classList.contains('is-single');
    var imgs = card.querySelectorAll('.g-frame img');
    lb.classList.toggle('is-single', single);
    fo.src = imgs[0].getAttribute('src'); fo.alt = imgs[0].alt;
    if (single) { ef.removeAttribute('src'); ef.alt = ''; }
    else { ef.src = imgs[1].getAttribute('src'); ef.alt = imgs[1].alt; }
    setToggle(box, lbBtns, card.classList.contains('is-efter'));
    title.textContent = card.getAttribute('data-title');
    fit(card.getAttribute('data-ar') || '3 / 4');
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
    /* kortet i griden visar samma läge som förstoringen */
    if (!card.classList.contains('is-single')) setToggle(card, card.querySelectorAll('.g-tg button'), box.classList.contains('is-efter'));
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
      try { card.querySelector('.g-open').focus({ preventScroll: true }); } catch (e) {}
    }, 460);
  }
  cards.forEach(function (card) {
    card.querySelector('.g-open').addEventListener('click', function () { open(card); });
  });
  Array.prototype.forEach.call(lbBtns, function (b) {
    b.addEventListener('click', function () { setToggle(box, lbBtns, b.getAttribute('data-v') === 'efter'); });
  });
  lb.addEventListener('click', close);
  box.addEventListener('click', function (e) { e.stopPropagation(); });
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
