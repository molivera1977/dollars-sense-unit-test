/* ═══════════════════════════════════════════════════════
   STORY AUDIO — a small 🔊 beside each paragraph of the story pictures. Tap it and the
   student's own Chromebook reads that paragraph off the picture, out loud.
   Same file in dollars-sense-review and dollars-sense-unit-test (keep the copies the same).

   Marcos 11/3: "Is there any way to have the story read aloud from the picture like putting a
   speaker next to each paragraph?" … "For my lower kids, they would be needed on both the review
   and test i feel." … "perhaps make the speaker button smaller" … "i dont want to record them.
   Why can't you?" (A computer voice needs the words as text, and the article is published text
   that is never copied into a file. So the words are read off the picture in the student's own
   browser at the moment they tap, the way a screen reader does, and are never stored.)

   Load it after data/story-paragraphs.js and before the page's own script. The page calls
   StoryAudio.attach(<the .story-scroll that holds the page figures>) once it has built them, and
   its stopActiveSpeech() calls StoryAudio.stop(), so a question being read, a new question,
   another screen or leaving the site ends the story reading too.

   · A 20 px 🔊 sits in a thin strip beside the picture — the left strip for the left column, the
     right strip for the right column — level with the piece's first line, so no button covers a
     word. Tap it: ⏳ while the reader gets ready (the first tap downloads ocr/, about 7 MB, once),
     then the piece lights up and each word lights as it is said (the voice's charIndex → lightAt,
     like every read-aloud on the sites). Tap ⏹ to stop.
   · "🔊 Listen to page N" beside the page label reads the page's pieces in order.
   · The site's reading voice: the device's default English voice at READ_RATE (0.82).
   · It uses the page's voice, so next-waits.js holds Next while a piece is read, as it does for
     any 🔊 a student taps.

   What it proves: the words the reader found were said. Not that the child listened, and not
   that every word was read right: the reader (Tesseract) found 590 words on pages 58–61 with 8
   it was less than 80% sure of, all of them read right on a check on 11/3.
═══════════════════════════════════════════════════════ */
(function () {
  var PARTS = window.STORY_PARAGRAPHS || [];
  var PIC = window.STORY_PICTURE || { w: 1028, h: 1340 };
  var SAY = window.STORY_SAY || {};
  var OCR = 'ocr/';
  var SCALE = 2;          // a piece is read at twice the picture's size: sharper letters, fewer misreads
  var MIN_SURE = 20;      // a mark the reader is less sure of than this (a dot, an edge of a picture) is not said
  var engine = null;      // Promise of the reader, made on the first tap
  var reads = {};         // piece id → Promise of its words: [{ text, x0, y0, x1, y1 }] in picture pixels
  var run = null;         // { list, i, btn, root, token }
  var token = 0;

  var CSS =
    '.sa-wrap{position:relative}' +
    '.sa-wrap.sa-has-l{padding-left:24px}.sa-wrap.sa-has-r{padding-right:24px}' +
    '.sa-box{position:relative}' +
    '.sa-hl{position:absolute;border-radius:4px;pointer-events:none;transition:box-shadow .2s}' +
    '.sa-hl.on{box-shadow:0 0 0 3px #f1c40f;background:rgba(255,235,59,.10)}' +
    '.sa-word{position:absolute;display:block;padding:0;border-radius:3px;pointer-events:none}' +
    '.sa-word.hl{background:rgba(255,193,7,.55);padding:0}' +
    '.sa-btn{position:absolute;width:20px;height:20px;padding:0;margin-top:-1px;border:1.5px solid #1a3a6b;border-radius:50%;' +
      'background:#fff;font-size:10px;line-height:16px;text-align:center;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.25)}' +
    '.sa-btn.sa-L{left:1px}.sa-btn.sa-R{right:1px}' +
    '.sa-btn:hover,.sa-btn:focus-visible{background:#eef3ff}' +
    '.sa-btn.sa-on,.sa-page.sa-on{background:#f1c40f;border-color:#b7950b}' +
    '.sa-page{margin:0 0 5px 6px;font:inherit;font-size:.74rem;font-weight:800;padding:2px 10px;border-radius:8px;' +
      'border:2px solid #c7d7fb;background:#fff;color:#1a3a6b;cursor:pointer;vertical-align:top}' +
    '.sa-page:hover{background:#eef3ff}' +
    '.sa-wait{cursor:progress}';

  function addStyle() {
    if (document.getElementById('sa-style')) return;
    var s = document.createElement('style');
    s.id = 'sa-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function pct(n, of) { return (n / of * 100).toFixed(3) + '%'; }
  function place(el, x0, y0, x1, y1) {
    el.style.left = pct(x0, PIC.w);
    el.style.top = pct(y0, PIC.h);
    el.style.width = pct(x1 - x0, PIC.w);
    el.style.height = pct(y1 - y0, PIC.h);
  }

  /* ── the 🔊 buttons ── */
  function attach(root) {
    if (!root || !window.speechSynthesis) return;
    addStyle();
    Array.prototype.forEach.call(root.querySelectorAll('.story-page'), function (fig) {
      if (fig.querySelector('.sa-box')) return;
      var page = Number(fig.getAttribute('data-page'));
      var parts = PARTS.filter(function (p) { return p.page === page; });
      var img = fig.querySelector('img');
      if (!parts.length || !img) return;
      var wrap = document.createElement('div');
      var box = document.createElement('div');
      wrap.className = 'sa-wrap';
      box.className = 'sa-box';
      if (parts.some(function (p) { return p.side === 'L'; })) wrap.classList.add('sa-has-l');
      if (parts.some(function (p) { return p.side === 'R'; })) wrap.classList.add('sa-has-r');
      img.parentNode.insertBefore(wrap, img);
      box.appendChild(img);
      wrap.appendChild(box);
      parts.forEach(function (p) {
        p.box.forEach(function (b) {
          var hl = document.createElement('div');
          hl.className = 'sa-hl';
          hl.setAttribute('data-part', p.id);
          place(hl, b[0], b[1], b[2], b[3]);
          box.appendChild(hl);
        });
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sa-btn sa-' + p.side;
        btn.setAttribute('data-part', p.id);
        btn.setAttribute('data-label', '🔊');
        btn.setAttribute('aria-label', 'Listen to page ' + page + ', part ' + p.id.split('-')[1]);
        btn.title = 'Listen to this part';
        btn.textContent = '🔊';
        btn.style.top = pct(p.box[0][1], PIC.h);
        btn.addEventListener('click', function () { toggle([p], btn); });
        wrap.appendChild(btn);
      });
      var label = fig.querySelector('.story-page-label');
      var pb = document.createElement('button');
      pb.type = 'button';
      pb.className = 'sa-page';
      pb.setAttribute('data-label', '🔊 Listen to page ' + page);
      pb.textContent = pb.getAttribute('data-label');
      pb.addEventListener('click', function () { toggle(parts, pb); });
      if (label) label.insertAdjacentElement('afterend', pb);
      else fig.insertBefore(pb, wrap);
    });
  }

  /* ── the reader (Tesseract, in ocr/), loaded on the first tap ── */
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }
  function getEngine() {
    if (!engine) {
      engine = loadScript(OCR + 'tesseract.min.js?v=7.0.0').then(function () {
        return window.Tesseract.createWorker('eng', 1, {
          workerPath: OCR + 'worker.min.js?v=7.0.0', corePath: OCR, langPath: OCR, gzip: true
        });
      });
      engine.catch(function () { engine = null; });   // a load that failed is tried again on the next tap
    }
    return engine;
  }
  function pictureReady(img) {
    return img.complete && img.naturalWidth ? Promise.resolve() : new Promise(function (ok, fail) {
      img.addEventListener('load', ok, { once: true });
      img.addEventListener('error', fail, { once: true });
    });
  }
  function readPiece(p, img) {
    if (reads[p.id]) return reads[p.id];
    var words = [];
    reads[p.id] = Promise.all([getEngine(), pictureReady(img)]).then(function (got) {
      var worker = got[0];
      var k = img.naturalWidth / PIC.w;   // the picture file may be a different size than the coordinates
      return (p.read || p.box).reduce(function (chain, b) {
        return chain.then(function () {
          var c = document.createElement('canvas');
          c.width = Math.round((b[2] - b[0]) * SCALE);
          c.height = Math.round((b[3] - b[1]) * SCALE);
          var ctx = c.getContext('2d');
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, b[0] * k, b[1] * k, (b[2] - b[0]) * k, (b[3] - b[1]) * k, 0, 0, c.width, c.height);
          return worker.recognize(c, {}, { blocks: true }).then(function (res) {
            (res.data.blocks || []).forEach(function (bl) { bl.paragraphs.forEach(function (pa) { pa.lines.forEach(function (li) {
              li.words.forEach(function (w) {
                if (w.confidence < MIN_SURE || !/[A-Za-z0-9]/.test(w.text)) return;
                words.push({ text: w.text,
                  x0: b[0] + w.bbox.x0 / SCALE, y0: b[1] + w.bbox.y0 / SCALE,
                  x1: b[0] + w.bbox.x1 / SCALE, y1: b[1] + w.bbox.y1 / SCALE });
              });
            }); }); });
          });
        });
      }, Promise.resolve()).then(function () { return words; });
    });
    reads[p.id].catch(function () { delete reads[p.id]; });
    return reads[p.id];
  }

  /* ── one see-through box over each word, so the word lights as it is said ── */
  function wordSpans(p, words) {
    var box = run.root.querySelector('.story-page[data-page="' + p.page + '"] .sa-box');
    var have = box ? box.querySelectorAll('.sa-word[data-part="' + p.id + '"]') : [];
    if (have.length === words.length) return Array.prototype.slice.call(have);
    Array.prototype.forEach.call(have, function (e) { e.remove(); });
    return words.map(function (w) {
      var sp = document.createElement('span');
      sp.className = 'wrd sa-word';   // .wrd: stopActiveSpeech() clears its highlight with every other read-aloud's
      sp.setAttribute('data-part', p.id);
      place(sp, w.x0 - 2, w.y0 - 2, w.x1 + 2, w.y1 + 2);
      if (box) box.appendChild(sp);
      return sp;
    });
  }
  function sayWord(t) {   // one word for one word (lightAt counts words by the spaces)
    var bare = t.replace(/^[^A-Za-z0-9$]+|[^A-Za-z0-9]+$/g, '');
    return Object.prototype.hasOwnProperty.call(SAY, bare) ? t.replace(bare, SAY[bare]) : t;
  }
  function speak(words, spans, done) {
    var u = new SpeechSynthesisUtterance(words.map(function (w) { return sayWord(w.text); }).join(' '));
    if (typeof english === 'function') english(u); else u.lang = 'en-US';
    u.rate = typeof READ_RATE === 'number' ? READ_RATE : 0.82;
    u.onboundary = function (e) {
      if (e.name === 'word' && typeof lightAt === 'function') lightAt(spans, u.text, e.charIndex);
    };
    u.onend = done;
    if (typeof addHighlightFallback === 'function') addHighlightFallback(u, spans);   // also ends on voices that never say "end"
    else u.onerror = done;
    window.speechSynthesis.speak(u);
  }

  /* ── playing ── */
  function toggle(list, btn) {
    var again = run && run.btn === btn;
    if (typeof window.stopActiveSpeech === 'function') window.stopActiveSpeech();   // the question voice stops (and this)
    else { window.speechSynthesis.cancel(); stop(); }
    if (again) return;
    run = { list: list, i: 0, btn: btn, root: btn.closest('.story-scroll') || document, token: ++token };
    btn.classList.add('sa-on');
    readNext();
  }
  function light(id, on) {
    Array.prototype.forEach.call(run.root.querySelectorAll('.sa-hl[data-part="' + id + '"]'), function (e) {
      e.classList.toggle('on', on);
    });
  }
  function showPiece(id) {   // a piece not fully in the story box comes up to a third of the way down it
    var root = run.root;
    var hl = root.querySelector('.sa-hl[data-part="' + id + '"]');
    if (!hl || !root.getBoundingClientRect || root === document) return;
    var r = root.getBoundingClientRect(), h = hl.getBoundingClientRect();
    if (h.top >= r.top + 10 && h.bottom <= r.bottom - 10) return;
    root.scrollTo({ top: root.scrollTop + (h.top - r.top) - Math.max(10, (r.height - h.height) / 3), behavior: 'smooth' });
  }
  function label(waiting) {
    var page = run.btn.classList.contains('sa-page');
    run.btn.classList.toggle('sa-wait', waiting);
    run.btn.textContent = waiting ? (page ? '⏳ Getting ready…' : '⏳') : (page ? '⏹ Stop' : '⏹');
  }
  function imgOf(p) {
    return run.root.querySelector('.story-page[data-page="' + p.page + '"] img');
  }
  function readNext() {
    var mine = run.token;
    var p = run.list[run.i];
    var img = imgOf(p);
    light(p.id, true);
    showPiece(p.id);
    label(!reads[p.id]);
    readPiece(p, img).then(function (words) {
      if (!run || run.token !== mine) return;
      label(false);
      var after = run.list[run.i + 1];
      if (after) readPiece(after, imgOf(after)).catch(function () {});   // read the next piece while this one is said
      speak(words, wordSpans(p, words), function () {
        if (!run || run.token !== mine) return;
        light(p.id, false);
        run.i++;
        if (run.i < run.list.length) readNext(); else stop();
      });
    }, function () {
      if (!run || run.token !== mine) return;
      var btn = run.btn;
      stop();
      btn.title = 'The reader could not start. Tap to try again.';
    });
  }
  function stop() {
    Array.prototype.forEach.call(document.querySelectorAll('.sa-hl.on'), function (e) { e.classList.remove('on'); });
    if (run) {
      run.btn.classList.remove('sa-on', 'sa-wait');
      run.btn.textContent = run.btn.getAttribute('data-label');
    }
    run = null;
  }

  window.StoryAudio = {
    attach: attach,
    stop: stop,
    playing: function () { return run ? run.list[run.i].id : null; },
    parts: PARTS
  };
})();
