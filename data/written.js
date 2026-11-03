/* ═══════════════════════════════════════════════════════
   DOLLARS AND SENSE — TEST · WRITTEN RESPONSE (#21, #22)
   R.A.D. FILL-IN (Marcos 10/21): like the R.A.D. review homework, but with
   boxes to type in — "no lines that need to be deleted".
   - r = the Restate line, printed in full (nothing to type).
   - a, d = the Answer and Detail sentences. Each {…} is a box the student
     fills with words found on the cited story page. "a|b" = forms accepted
     as matching the story (the sheet row reports "boxes that match").
   - Graded by the teacher (not auto-scored). Box words come from the cited page
     (Dollars and Sense had no review homework with blanks).
═══════════════════════════════════════════════════════ */
window.WRITTEN_DIRECTIONS = 'Each answer is a R.A.D. answer with some words missing. R is done for you. Find the missing words in the story and type them in the boxes. Then type your whole R.A.D. answer in the big box.';

/* What each letter means — the same names as the R.A.D. Online Quiz */
window.RAD_STEPS = [
  { key: 'R', name: 'Restate', tip: 'This part is done for you. Read it.' },
  { key: 'A', name: 'Answer',  tip: 'Find the missing words in the story. Type them in the boxes.' },
  { key: 'D', name: 'Detail',  tip: 'Find the missing words that tell more. Type them in the boxes.' }
];

window.WRITTEN_PROMPTS = [
  {
    id: 'W1',
    label: 'Question 21',
    prompt: 'How did Blake Mycoskie’s trip to Argentina lead to TOMS? Use details from page 59.',
    r: 'Blake Mycoskie’s trip to Argentina led to TOMS.',
    a: 'In Argentina, Mycoskie visited poor {villages|village} where very few of the {children|kids} had shoes.',
    d: 'Mycoskie started the business using his own {money}, and TOMS gives away one pair of shoes for every pair that is {purchased|bought}.'
  },
  {
    id: 'W2',
    label: 'Question 22',
    prompt: 'The Essential Question asks, “How can starting a business help others?” How does Hard Rock Cafe help others? Use details from pages 60 and 61.',
    r: 'Hard Rock Cafe helps others.',
    a: 'The company raises {funds|money} for charity by selling a line of {T-shirts|shirts}.',
    d: 'A Hard Rock Cafe in Hollywood, Florida, worked with students to raise money for the Make-A-Wish {Foundation}, which grants {wishes|wish} to children with serious medical problems.'
  }
];
