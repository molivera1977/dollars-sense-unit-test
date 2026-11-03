/* ═══════════════════════════════════════════════════════
   DOLLARS AND SENSE — checks the REVIEW and TEST question banks together.
     node tools/check-banks.js            (from dollars-sense-unit-test)
   Exits 1 on any problem:
   · each form: 24 vocab, 20 article questions (P01–P10 + five A/B pairs), 24 CLOZE; every list word
     once in vocab and once in CLOZE; no repeated choice;
   · THE VOCABULARY (Marcos 11/3: "Make 24 of Used Right and 24 Endings. Split those for Review 1 and
     Review 2. Then make new ones for the test. Half Used Right and half Endings."): each form 12 Used
     Right (four sentences that all use the word) + 12 Endings (a start with the word underlined, four
     endings); Set 2 asks each word the other kind from Set 1; the test's sentences and starts are new —
     no Used Right sentence or Endings start is on two forms;
   · the review and the test ask the same ids; article and CLOZE items with different sentences and stems;
   · REVIEW SET 2 (data/banks-2.js, the review's second try — Marcos 11/3: "can the kids get different
     questions?"): the same checks, plus new CLOZE and article stems, and a different right sentence in
     every Part B than Set 1's and the test's;
   · THE REVIEW MATCHES THE TEST (Marcos 11/3: "when i talk about easiest to hardest I meant more
     for Math" — a reading review is a matching form of its test, as The Talent Show's was). At every
     item the two are the same level —
       vocabulary: the same kinds (12 Used Right + 12 Endings, 4 choices each);
       CLOZE: how many wrong choices are the same part of speech as the answer;
       article questions: lvl (1 detail in the article's words · 2 one small step · 3 inference /
       conclusion / author's purpose) and trap (wrong choices that are real details from another
       part of the article);
   · no sentence repeats one the class already saw: the vocab lists, the paper and site vocab
     practice, and the homework CLOZE (Wonders Homework/Dollars and Sense/content);
   · NOT EVEN CLOSE (Marcos 11/3: "make sure the Used Right and Endings are different from homework and
     vocab practice"): no vocabulary sentence, start or ending shares 4 words in a row with anything in
     those files, or 3+ of its main words and 40% of them with one line.
   The article itself is not stored in a file (Marcos's pages are pictures), so quotes in the
   Part B choices were checked by hand against pages 58–61.
═══════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HERE = path.resolve(__dirname, '..');
const REVIEW = process.env.REVIEW_DIR || path.join(HERE, '..', 'dollars-sense-review');
const TEST = process.env.TEST_DIR || HERE;
const CONTENT = process.env.CONTENT_DIR || path.join(HERE, '..', 'Wonders Homework', 'Dollars and Sense', 'content');   // CONTENT_DIR: the pre-push copy has no neighbors

const load = (dir, extra) => {
  const box = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(dir, 'data', 'banks.js'), 'utf8'), box);
  if (extra) vm.runInNewContext(fs.readFileSync(path.join(dir, 'data', extra), 'utf8'), box);   // uses banks.js's dsUsedRight() / dsEnding()
  return box.window;
};
const read = f => JSON.parse(fs.readFileSync(path.join(CONTENT, f), 'utf8'));
const WORDS = [...read('vocab1.json').words, ...read('vocab2.json').words];   // word k = WORDS[k-1]
const defOf = w => w.definition.replace(/\.$/, '').replace(/^./, c => c.toLowerCase());
const byWord = Object.fromEntries(WORDS.map(w => [w.word, w]));
const byDef = Object.fromEntries(WORDS.map(w => [defOf(w), w]));
const num = id => Number(id.slice(1));
const norm = t => String(t).replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[“”"’'.,!?:;]/g, '').replace(/_+/g, '').replace(/\s+/g, ' ').trim();

const problems = [];
const bad = msg => problems.push(msg);

function checkForm(name, b) {
  // vocabulary
  const v = b.VOCAB_BANK;
  if (v.length !== 24) bad(`${name}: ${v.length} vocab items (want 24)`);
  const seen = new Set();
  const kinds = { used: 0, ending: 0 };
  v.forEach(it => {
    const k = wordOf(it.id);
    const w = WORDS[k - 1];
    if (!w) { bad(`${name} ${it.id}: no list word ${k}`); return; }
    if (seen.has(k)) bad(`${name} ${it.id}: word "${w.word}" asked twice`);
    seen.add(k);
    if (it.choices.length !== 4 || new Set(it.choices).size !== 4) bad(`${name} ${it.id}: needs 4 different choices`);
    if (!(it.answer >= 0 && it.answer < it.choices.length)) bad(`${name} ${it.id}: no answer`);
    const has = t => new RegExp(`\\b${w.word}\\b`, 'i').test(t);
    const kind = kindOf(it);
    if (kind === 'used') {
      if (it.q !== `Which sentence uses <b>${w.word}</b> the right way?`) bad(`${name} ${it.id}: the Used Right question does not name "${w.word}"`);
      it.choices.forEach(c => { if (!has(c)) bad(`${name} ${it.id}: a Used Right sentence does not use "${w.word}"`); });
    } else if (kind === 'ending') {
      if (!new RegExp(`<u>${w.word}</u>`, 'i').test(it.q)) bad(`${name} ${it.id}: "${w.word}" is not underlined in the start`);
    } else bad(`${name} ${it.id}: neither Used Right nor Endings`);
    if (kinds[kind] != null) kinds[kind]++;
  });
  if (seen.size !== 24) bad(`${name}: vocab covers ${seen.size} of 24 words`);
  if (kinds.used !== 12 || kinds.ending !== 12) bad(`${name}: ${kinds.used} Used Right + ${kinds.ending} Endings (want 12 + 12)`);
  // article questions
  const p = b.COMP_BANK;
  const ids = p.map(q => q.id).join(',');
  const want = Array.from({ length: 20 }, (_, i) => `P${String(i + 1).padStart(2, '0')}`).join(',');
  if (ids !== want) bad(`${name}: article question ids are ${ids}`);
  p.forEach(q => {
    if (q.choices.length !== 4 || new Set(q.choices).size !== 4) bad(`${name} ${q.id}: needs 4 different choices`);
    if (!(q.lvl >= 1 && q.lvl <= 3) || !(q.trap >= 0 && q.trap <= 3)) bad(`${name} ${q.id}: lvl/trap missing`);
    if (!/\(pages? 5[89]|\(pages? 6[01]/.test(q.q) && !/^Part B/.test(q.q)) bad(`${name} ${q.id}: no page named`);
    if (/^Part B/.test(q.q) && !q.choices.every(c => /^“.*”$/.test(c))) bad(`${name} ${q.id}: a Part B choice is not a quoted sentence`);
  });
  if (JSON.stringify(b.COMP_PAIRS) !== JSON.stringify([['P11','P12'],['P13','P14'],['P15','P16'],['P17','P18'],['P19','P20']])) bad(`${name}: COMP_PAIRS changed`);
  // CLOZE
  const c = b.CLOZE_BANK;
  if (c.length !== 24) bad(`${name}: ${c.length} CLOZE items (want 24)`);
  c.forEach((it, i) => {
    const w = WORDS[num(it.id) - 1];
    if (num(it.id) !== i + 1) bad(`${name} ${it.id}: out of order`);
    if (it.q.split('__________').length !== 2) bad(`${name} ${it.id}: needs one 10-line blank`);
    if (it.choices.length !== 3 || new Set(it.choices).size !== 3) bad(`${name} ${it.id}: needs 3 different choices`);
    if (it.choices[it.answer] !== w.word) bad(`${name} ${it.id}: answer is not "${w.word}"`);
    it.choices.forEach(ch => { if (!byWord[ch]) bad(`${name} ${it.id}: choice "${ch}" is not a list word`); });
  });
}

const wordOf = id => { const n = num(id); return n > 24 ? n - 24 : n; };
const kindOf = it => /^Which sentence uses <b>/.test(it.q) ? 'used' : /Which ending makes the most sense\?(<\/span>)?$/.test(it.q) ? 'ending' : null;
const startOf = it => it.q.replace(/<span class="say-stop".*$/, '').replace(/<br>.*$/, '');   // an Endings start, without its question
const vocabSentences = it => kindOf(it) === 'used' ? it.choices : [startOf(it)];   // what a form's vocabulary says

const review = load(REVIEW, 'banks-2.js');
const test = load(TEST);
const set2 = { VOCAB_BANK: review.VOCAB_BANK_2, COMP_BANK: review.COMP_BANK_2, CLOZE_BANK: review.CLOZE_BANK_2, COMP_PAIRS: review.COMP_PAIRS };
checkForm('REVIEW', review);
checkForm('TEST', test);
checkForm('REVIEW SET 2', set2);
// Set 2 asks every word the other kind from Set 1 (one id per word on every form)
{
  const s1 = Object.fromEntries(review.VOCAB_BANK.map(q => [q.id, q]));
  set2.VOCAB_BANK.forEach(q => {
    if (!s1[q.id]) bad(`SET 2 ${q.id}: not on Set 1 (each word keeps its id)`);
    else if (kindOf(q) === kindOf(s1[q.id])) bad(`SET 2 ${q.id}: word ${wordOf(q.id)} is the same kind as on Set 1 (${kindOf(q)})`);
  });
}

// same ids, new wording (article and CLOZE; vocabulary sentences are checked below)
for (const bank of ['VOCAB_BANK', 'COMP_BANK', 'CLOZE_BANK']) {
  const r = Object.fromEntries(review[bank].map(q => [q.id, q]));
  const t = Object.fromEntries(test[bank].map(q => [q.id, q]));
  const rIds = Object.keys(r).sort().join(), tIds = Object.keys(t).sort().join();
  if (rIds !== tIds) bad(`${bank}: the review and the test ask different ids`);
  Object.keys(r).forEach(id => {
    if (!t[id]) return;
    const definitionItem = bank === 'VOCAB_BANK';   // "Which sentence uses x the right way?" names the word on purpose; its sentences are checked below
    const partB = /^Part B/.test(r[id].q);                             // so is "Which sentence … best supports …?"
    if (partB && r[id].choices[r[id].answer] === t[id].choices[t[id].answer]) bad(`${bank} ${id}: the test's Part B has the review's right sentence`);
    if (!definitionItem && !partB && norm(r[id].q) === norm(t[id].q)) bad(`${bank} ${id}: the test repeats the review's question`);
  });
}

// THE REVIEW MATCHES THE TEST, item by item
const samePos = it => {
  const right = it.choices[it.answer];
  const pos = (byWord[right] || byDef[right]).pos;
  return it.choices.filter((c, i) => i !== it.answer && (byWord[c] || byDef[c]).pos === pos).length;
};
const report = [];
for (const bank of ['CLOZE_BANK']) {   // the vocabulary's level: the same kinds on every form (checkForm)
  const t = Object.fromEntries(test[bank].map(q => [q.id, q]));
  review[bank].forEach(rq => {
    const tq = t[rq.id];
    if (!tq) return;
    const a = samePos(rq), b = samePos(tq);
    report.push(`${rq.id} ${a}=${b}`);
    if (a !== b) bad(`${bank} ${rq.id}: the review is ${a > b ? 'harder' : 'easier'} than the test (${a} vs ${b} same-kind wrong choices)`);
  });
}
// Set 2 matches the test too: CLOZE and article by id
const tCloze = Object.fromEntries(test.CLOZE_BANK.map(q => [q.id, q])), rCloze = Object.fromEntries(review.CLOZE_BANK.map(q => [q.id, q]));
set2.CLOZE_BANK.forEach(q => {
  const tq = tCloze[q.id];
  if (!tq) { bad(`SET 2 ${q.id}: not on the test`); return; }
  const a = samePos(q), b = samePos(tq);
  report.push(`2:${q.id} ${a}=${b}`);
  if (a !== b) bad(`SET 2 ${q.id}: ${a > b ? 'harder' : 'easier'} than the test (${a} vs ${b} same-kind wrong choices)`);
  [['Set 1', rCloze[q.id]], ['the test', tq]].forEach(([n, o]) => { if (o && norm(o.q) === norm(q.q)) bad(`SET 2 ${q.id}: repeats ${n}'s sentence`); });
});
const tComp = Object.fromEntries(test.COMP_BANK.map(q => [q.id, q])), rComp = Object.fromEntries(review.COMP_BANK.map(q => [q.id, q]));
set2.COMP_BANK.forEach(q => {
  const tq = tComp[q.id], rq = rComp[q.id];
  if (!tq || !rq) { bad(`SET 2 ${q.id}: not on the test and Set 1`); return; }
  if (q.lvl !== tq.lvl) bad(`SET 2 ${q.id}: level ${q.lvl} is not the test's ${tq.lvl}`);
  if (q.trap !== tq.trap) bad(`SET 2 ${q.id}: ${q.trap} trap choices, the test ${tq.trap}`);
  const right = o => o.choices[o.answer];
  if (/^Part B/.test(q.q)) {
    [['Set 1', rq], ['the test', tq]].forEach(([n, o]) => { if (right(o) === right(q)) bad(`SET 2 ${q.id}: the right sentence is ${n}'s`); });
  } else {
    [['Set 1', rq], ['the test', tq]].forEach(([n, o]) => { if (norm(o.q) === norm(q.q)) bad(`SET 2 ${q.id}: repeats ${n}'s question`); });
  }
});

const tc = Object.fromEntries(test.COMP_BANK.map(q => [q.id, q]));
review.COMP_BANK.forEach(rq => {
  const tq = tc[rq.id];
  if (!tq) return;
  if (rq.lvl !== tq.lvl) bad(`COMP ${rq.id}: the review's level ${rq.lvl} is not the test's ${tq.lvl}`);
  if (rq.trap !== tq.trap) bad(`COMP ${rq.id}: the review has ${rq.trap} trap choices, the test ${tq.trap}`);
});

// nothing the class already saw
const seenBefore = new Map();
const note = (t, where) => seenBefore.set(norm(t), where);
WORDS.forEach(w => note(w.sentence, 'a vocab list sentence'));
fs.readdirSync(CONTENT).filter(f => /^(homework\d+|secondread|practice\d+|site\d+)\.json$/.test(f)).forEach(f => {
  const j = read(f);
  (j.cloze || []).forEach(i => note(i.sentence, f));
  (j.sections || []).forEach(s => (s.items || []).forEach(i => i.sentence && note(i.sentence, f)));
  (j.usedRight || []).forEach(i => note(i.sentence, f));
  (j.endings || []).forEach(i => note(i.stem, f));
});
// not even close to the homework or the Vocab Practice: the vocabulary's sentences, starts and endings
{
  const STOP = new Set('a an the and or but so to of in on at for with is was are were be it its he she they his her their my our we i you your that this as by from has had have will can not no do did when then than there what which who'.split(' '));
  const toks = t => String(t).replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
  const runs = t => { const w = toks(t), g = new Set(); for (let i = 0; i + 4 <= w.length; i++) g.add(w.slice(i, i + 4).join(' ')); return g; };
  const mainWords = t => new Set(toks(t).filter(w => !STOP.has(w)));
  const sources = [];
  const walk = (x, f) => { if (typeof x === 'string') { if (toks(x).length >= 4) sources.push({ f, text: x, runs: runs(x), main: mainWords(x) }); }
    else if (Array.isArray(x)) x.forEach(y => walk(y, f)); else if (x && typeof x === 'object') Object.values(x).forEach(y => walk(y, f)); };
  fs.readdirSync(CONTENT).filter(f => f.endsWith('.json')).forEach(f => walk(read(f), f));
  [['REVIEW', review], ['TEST', test], ['REVIEW SET 2', set2]].forEach(([name, b]) => b.VOCAB_BANK.forEach(it => {
    const pieces = kindOf(it) === 'used' ? it.choices : [startOf(it).replace(/_+/g, ''), ...it.choices];
    pieces.forEach(piece => {
      const r = runs(piece), m = mainWords(piece);
      sources.forEach(src => {
        const shared = [...src.runs].filter(x => r.has(x));
        const both = [...m].filter(x => src.main.has(x)).length;
        const overlap = both / (new Set([...m, ...src.main]).size || 1);
        if (shared.length) bad(`${name} ${it.id}: "${piece}" shares "${shared[0]}" with ${src.f}`);
        else if (both >= 3 && overlap >= 0.4) bad(`${name} ${it.id}: "${piece}" is close to ${src.f}: "${src.text.slice(0, 80)}"`);
      });
    });
  }));
}

const onForms = new Map();
[['REVIEW', review], ['TEST', test], ['REVIEW SET 2', set2]].forEach(([name, b]) => {
  const said = [...b.VOCAB_BANK.flatMap(it => vocabSentences(it).map(t => [it.id, t])), ...b.CLOZE_BANK.map(it => [it.id, it.q])];
  said.forEach(([id, t]) => {   // a vocabulary sentence or start, or a CLOZE sentence, is on one form only
    const sentence = norm(t);
    if (seenBefore.has(sentence)) bad(`${name} ${id}: the sentence repeats ${seenBefore.get(sentence)}`);
    if (onForms.has(sentence)) bad(`${name} ${id}: the same sentence is on ${onForms.get(sentence)}`);
    onForms.set(sentence, `${name} ${id}`);
  });
});

if (process.argv.includes('--report')) console.log(report.join('  '));
if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ Dollars and Sense banks OK — review Set 1, review Set 2 and test: 24 vocab, 20 article, 24 CLOZE each; vocabulary 12 Used Right + 12 Endings on every form, Set 2 each word the other kind, the test's all new; every other item on the review (Set 1 and Set 2) at the same level as the test; no sentence the class already saw, and the vocabulary not even close to the homework or Vocab Practice.`);
