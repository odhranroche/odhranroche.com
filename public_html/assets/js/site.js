/* odhranroche.com — site behaviour. Each block checks that its elements exist, so this one file is safe on every page. */
(function () {
  // Garden illustration (homepage): hover or focus a circle, or its highlighted word in the lead
  // paragraph, to highlight that circle. The note text comes from the circle's data-note attribute.
  var fig = document.getElementById('garden');
  if (fig) {
    var note = document.getElementById('garden-note');
    var nodes = fig.querySelectorAll('.node[data-key]');
    var marks = document.querySelectorAll('[data-topic]');
    var set = function (key) {
      if (key) { fig.setAttribute('data-active', key); } else { fig.removeAttribute('data-active'); }
      marks.forEach(function (m) { m.classList.toggle('is-on', m.getAttribute('data-topic') === key); });
      if (!note) { return; }
      note.textContent = '';
      var node = key && fig.querySelector('.node[data-key="' + key + '"]');
      if (node) {
        var title = document.createElement('b');
        title.textContent = node.getAttribute('data-note-title') + ':';
        note.append(title, ' ' + node.getAttribute('data-note'));
      }
    };
    var bind = function (el, key) {
      el.addEventListener('mouseenter', function () { set(key); });
      el.addEventListener('mouseleave', function () { set(null); });
      el.addEventListener('focus', function () { set(key); });
      el.addEventListener('blur', function () { set(null); });
    };
    nodes.forEach(function (n) { bind(n, n.getAttribute('data-key')); });
    marks.forEach(function (m) { bind(m, m.getAttribute('data-topic')); });
  }

  // Ladybug (homepage): click her and she flies away. With reduced motion she simply goes.
  var bug = document.getElementById('ladybug');
  if (bug) {
    bug.addEventListener('click', function () {
      if (bug.classList.contains('is-flying')) { return; }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { bug.style.display = 'none'; return; }
      bug.addEventListener('animationend', function (e) {
        if (e.target === bug) { bug.style.display = 'none'; }
      });
      bug.classList.add('is-flying');
    });
  }

  // Logos and brand icons: show the fallback until the image file exists.
  document.querySelectorAll('.logo-tile img, .icon-btn img, .social-link img').forEach(function (img) {
    var fail = function () {
      var box = img.parentNode;
      box.classList.add(box.classList.contains('logo-tile') ? 'no-logo' : 'no-icon');
    };
    if (img.complete && img.naturalWidth === 0) { fail(); }
    img.addEventListener('error', fail);
  });

  // Copy email: copies on click and announces "Copied"; if copying isn't allowed, selects the address instead.
  document.querySelectorAll('.copy-email').forEach(function (btn) {
    var addr = btn.getAttribute('data-email');
    var status = btn.querySelector('.done');
    var timer;
    var flash = function () {
      btn.classList.add('copied');
      if (status) { status.textContent = 'Copied'; }
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.classList.remove('copied');
        if (status) { status.textContent = ''; }
      }, 1800);
    };
    var select = function () {
      var r = document.createRange();
      r.selectNodeContents(btn.firstElementChild);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    };
    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(flash, select);
      } else { select(); }
    });
  });

  // Header hairline once the page has scrolled.
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Image viewer: screenshots open in a dialog. Without JavaScript the link opens the image itself.
  var shots = document.querySelectorAll('.shot a');
  if (shots.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'viewer';
    dlg.setAttribute('aria-label', 'Enlarged image');
    // Slides from a slideshow also get Previous and Next buttons (and the arrow keys) in the viewer.
    dlg.innerHTML = '<div class="viewer-inner"><button class="btn viewer-close" type="button">Close</button><img alt=""><p></p>' +
      '<div class="viewer-nav" hidden><button class="btn" type="button" data-vprev>Previous<span class="visually-hidden"> slide</span></button>' +
      '<span class="viewer-count" aria-live="polite"></span><button class="btn" type="button" data-vnext>Next<span class="visually-hidden"> slide</span></button></div></div>';
    document.body.appendChild(dlg);
    var big = dlg.querySelector('img');
    var cap = dlg.querySelector('p');
    var nav = dlg.querySelector('.viewer-nav');
    var vcount = dlg.querySelector('.viewer-count');
    var opener = null;
    var deck = null;
    var showImage = function (a) {
      opener = a;
      var img = a.querySelector('img');
      var fc = a.closest('figure') && a.closest('figure').querySelector('figcaption');
      big.src = a.getAttribute('href');
      big.alt = img ? img.alt : '';
      cap.textContent = fc ? fc.textContent : '';
      if (deck) { vcount.textContent = 'Slide ' + (deck.slideIndex() + 1) + ' of ' + deck.slideTotal; }
    };
    var step = function (by) {
      if (!deck) { return; }
      deck.slideGo(deck.slideIndex() + by);
      var a = deck.querySelector('.slide:not([hidden]) a');
      if (a) { showImage(a); }
    };
    dlg.querySelector('.viewer-close').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('[data-vprev]').addEventListener('click', function () { step(-1); });
    dlg.querySelector('[data-vnext]').addEventListener('click', function () { step(1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
    dlg.addEventListener('close', function () { if (opener) { opener.focus(); } });
    shots.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var d = a.closest('.slideshow');
        deck = d && d.slideGo ? d : null;
        nav.hidden = !deck;
        showImage(a);
        dlg.showModal();
      });
    });
  }

  // Slideshow: one slide at a time, moved with the Previous and Next buttons or the arrow keys.
  // It loops at either end. Without JavaScript every slide shows and the buttons stay hidden.
  document.querySelectorAll('.slideshow').forEach(function (show) {
    var slides = show.querySelectorAll('.slide');
    var controls = show.querySelector('.slideshow-controls');
    var count = show.querySelector('.slideshow-count');
    if (slides.length < 2 || !controls) { return; }
    var current = 0;
    var go = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.hidden = n !== current; });
      if (count) { count.textContent = 'Slide ' + (current + 1) + ' of ' + slides.length; }
    };
    show.querySelector('[data-prev]').addEventListener('click', function () { go(current - 1); });
    show.querySelector('[data-next]').addEventListener('click', function () { go(current + 1); });
    show.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    });
    // Let the image viewer move through this slideshow too.
    show.slideGo = go;
    show.slideIndex = function () { return current; };
    show.slideTotal = slides.length;
    controls.hidden = false;
    go(0);
  });

  // Experience menu: the button opens and closes it (CSS also opens it on mouse hover).
  // It closes on Escape, on a click outside it, and when keyboard focus leaves it.
  document.querySelectorAll('.nav-group').forEach(function (group) {
    var trig = group.querySelector('.nav-trigger');
    var setOpen = function (open) {
      group.classList.toggle('is-open', open);
      trig.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    trig.addEventListener('click', function () { setOpen(!group.classList.contains('is-open')); });
    document.addEventListener('click', function (e) { if (!group.contains(e.target)) { setOpen(false); } });
    group.addEventListener('focusout', function (e) { if (e.relatedTarget && !group.contains(e.relatedTarget)) { setOpen(false); } });
    group.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && group.classList.contains('is-open')) { setOpen(false); trig.focus(); }
    });
  });

  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
