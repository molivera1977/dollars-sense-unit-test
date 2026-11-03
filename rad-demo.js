/* ═══════════════════════════════════════════════════════
   R.A.D. FILL-IN — WORKED EXAMPLE (narrated, with typing)
   Marcos 10/21: "give them a directions video for a different question and
   show what's expected" · "perhaps you narrate and just show what needs to be
   written" · "i like the idea of the typing animation".
   - Sits above the test's written questions; nothing is required.
   - At rest it shows the FINISHED example (boxes filled, whole answer typed).
   - ▶ Play clears it, then reads each step aloud and lights that part; the
     missing words are typed into their boxes and the whole answer into the
     big box. ⏹ Stop puts the finished example back.
   - The practice question is NOT on the test.
   RadDemo.mount(container) → { stop }
═══════════════════════════════════════════════════════ */
(function () {
  const STORY = 'Leo planted tomato seeds in May. Every day, he gave the seeds water. By July, his tomatoes were red and big.';
  const QUESTION = 'How did Leo take care of his garden? Use details from the story.';
  const R_LINE = 'Leo took care of his garden.';
  const A_PARTS = ['Leo planted tomato ', { box: 'seeds' }, ' and gave them ', { box: 'water' }, ' every day.'];
  const D_PARTS = ['By July, his tomatoes were ', { box: 'red' }, ' and big.'];
  const WHOLE = 'Leo took care of his garden. Leo planted tomato seeds and gave them water every day. By July, his tomatoes were red and big.';

  // Each step: the part that lights up, story words that light up, what is said, then what is typed
  const STEPS = [
    { part: 'question', say: 'Here is an example. This question is not on your test. First, read the question.' },
    { part: 'story', say: 'Then read the story.' },
    { part: 'R', say: 'R is done for you. Read it.' },
    { part: 'A', words: ['seeds:1'], say: 'In A, a box means a word is missing. Find it in the story. Leo planted tomato seeds. Type seeds in the box.', type: { box: 0 } },
    { part: 'A', words: ['water:1'], say: 'Find the next missing word. He gave the seeds water. Type water in the box.', type: { box: 1 } },
    { part: 'D', words: ['red:1'], say: 'In D, find the missing word. His tomatoes were red. Type red in the box.', type: { box: 2 } },
    { part: 'built', say: 'Look. Your whole R.A.D. answer shows in the green box.' },
    { part: 'retype', say: 'Last, type your whole answer in the big box. Type all three parts, R, A, and D. You type it yourself. You cannot copy and paste.', type: { retype: true } },
    { part: null, say: 'That is what to do on each written question. Now it is your turn.' }
  ];
  const BOX_MS = 170;      // per letter in a box
  const RETYPE_MS = 45;    // per letter in the big box

  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let n = 0;
  const line = parts => parts.map(p => typeof p === 'string' ? esc(p)
    : `<span class="demo-box" data-word="${esc(p.box)}" data-i="${n++}">${esc(p.box)}</span>`).join('');
  // each story word is tagged word:occurrence (seeds:1, seeds:2) so a step lights only the one it means
  const seen = {};
  const story = STORY.split(' ').map(w => {
    const key = w.replace(/[.,]/g, '').toLowerCase();
    seen[key] = (seen[key] || 0) + 1;
    return `<span class="demo-w" data-w="${esc(key)}:${seen[key]}">${esc(w)}</span>`;
  }).join(' ');

  function mount(container) {
    n = 0;
    container.classList.add('rad-demo');
    container.innerHTML = `
      <div class="rad-demo-head">
        <button type="button" class="lgs-btn demo-play" id="demo-play">▶ Play</button>
        <div>
          <div class="rad-demo-title">⭐ Example: what to do</div>
          <div class="rad-demo-note">Press Play to watch and listen. This example is <strong>not</strong> on your test.</div>
        </div>
      </div>
      <div class="rad-demo-caption" id="demo-caption" aria-live="polite"></div>
      <div class="rad-demo-stage">
        <div class="demo-part" data-part="question"><span class="demo-label">❓ Question:</span> ${esc(QUESTION)}</div>
        <div class="demo-part" data-part="story"><span class="demo-label">📖 Story:</span> ${story}</div>
        <div class="demo-part rad-step rad-step-R" data-part="R"><span class="rad-letter">R</span> <b>Restate</b> <span class="demo-tag">done for you</span><div class="demo-line demo-given">${esc(R_LINE)}</div></div>
        <div class="demo-part rad-step rad-step-A" data-part="A"><span class="rad-letter">A</span> <b>Answer</b> <span class="demo-tag">type the missing words</span><div class="demo-line">${line(A_PARTS)}</div></div>
        <div class="demo-part rad-step rad-step-D" data-part="D"><span class="rad-letter">D</span> <b>Detail</b> <span class="demo-tag">type the missing word</span><div class="demo-line">${line(D_PARTS)}</div></div>
        <div class="demo-part rad-built" data-part="built"><div class="rad-built-label">📝 Your R.A.D. answer:</div><div class="rad-built-text" id="demo-built"></div></div>
        <div class="demo-part rad-retype" data-part="retype"><div class="rad-retype-label">✍️ Type your whole R.A.D. answer in the big box.</div><div class="demo-retype" id="demo-retype"></div></div>
      </div>`;

    const $ = sel => container.querySelector(sel);
    const caption = $('#demo-caption');
    const playBtn = $('#demo-play');
    const boxes = [...container.querySelectorAll('.demo-box')];
    const retype = $('#demo-retype');
    let runId = 0, timers = [];

    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const light = (part, words) => {
      container.querySelectorAll('.demo-part').forEach(el => el.classList.toggle('demo-focus', el.dataset.part === part));
      container.querySelectorAll('.demo-w').forEach(el => el.classList.toggle('demo-found', !!words && words.includes(el.dataset.w)));
    };
    const built = () => {
      let i = 0;
      const fill = parts => parts.map(p => typeof p === 'string' ? p : (boxes[i++].textContent || '_____')).join('');
      $('#demo-built').textContent = `${R_LINE} ${fill(A_PARTS)} ${fill(D_PARTS)}`;
    };
    // At rest: the finished example
    const finished = () => {
      boxes.forEach(b => { b.textContent = b.dataset.word; b.classList.remove('demo-typing'); });
      retype.textContent = WHOLE; retype.classList.remove('demo-typing');
      built(); light(null, null);
    };
    const stop = () => {
      runId++; timers.forEach(clearTimeout); timers = [];
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      caption.textContent = ''; caption.classList.remove('on');
      playBtn.textContent = '▶ Play';
      finished();
    };

    function say(text, done, id) {
      caption.textContent = text; caption.classList.add('on');
      const synth = window.speechSynthesis;
      let over = false;
      const finish = () => { if (!over && id === runId) { over = true; later(done, 250); } };
      if (!synth || !window.SpeechSynthesisUtterance) { later(finish, text.split(' ').length * 420); return; }
      const u = new SpeechSynthesisUtterance(text);
      english(u); u.rate = 0.82;
      u.onend = finish; u.onerror = finish;
      later(finish, text.split(' ').length * 650 + 2500);   // some devices never fire onend
      synth.speak(u);
    }
    function typeInto(el, text, ms, done, id) {
      el.classList.add('demo-typing');
      let k = 0;
      const tick = () => {
        if (id !== runId) return;
        k++; el.textContent = text.slice(0, k);
        if (el.classList.contains('demo-box')) built();
        if (k < text.length) later(tick, ms);
        else { el.classList.remove('demo-typing'); later(done, 450); }
      };
      later(tick, ms);
    }
    function run(i, id) {
      if (id !== runId) return;
      if (i >= STEPS.length) { stop(); return; }
      const s = STEPS[i];
      light(s.part, s.words);
      say(s.say, () => {
        const next = () => run(i + 1, id);
        if (!s.type) return next();
        if (s.type.retype) typeInto(retype, WHOLE, RETYPE_MS, next, id);
        else typeInto(boxes[s.type.box], boxes[s.type.box].dataset.word, BOX_MS, next, id);
      }, id);
    }

    playBtn.addEventListener('click', () => {
      if (playBtn.textContent.startsWith('⏹')) { stop(); return; }
      stop();
      boxes.forEach(b => { b.textContent = ''; });
      retype.textContent = '';
      built();
      playBtn.textContent = '⏹ Stop';
      run(0, runId);
    });
    finished();
    return { stop };
  }

  window.RadDemo = { mount, WHOLE, STEPS };
})();
