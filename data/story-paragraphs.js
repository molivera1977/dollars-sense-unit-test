/* ═══════════════════════════════════════════════════════
   DOLLARS AND SENSE — where each paragraph sits on the page pictures (story-audio.js draws the 🔊)
   Marcos 11/3: "Is there any way to have the story read aloud from the picture like putting a speaker
   next to each paragraph?" … "For my lower kids, they would be needed on both the review and test"
   … "perhaps make the speaker button smaller" … "i dont want to record them. Why can't you?"
   The article's words are NOT in this file or anywhere on the site (never a whole Wonders story in a
   file). When a student taps 🔊, their own browser reads the words off the picture (ocr/, Tesseract)
   and the device's voice says them, the way a screen reader would.
   box   = [left, top, right, bottom] in pixels of the 1028 × 1340 page picture; a piece that runs
           on into the next column has two boxes (both light up while it is read)
   read  = the parts of the boxes to read, when not all of it is words (the shoe beside the title,
           the bars of the graph); otherwise the boxes are read
   side  = which side of the picture its 🔊 sits on (L = the left column, R = the right column)
   start = the first words, so a person (and the checks) can name the piece
   Same file in dollars-sense-review and dollars-sense-unit-test (keep the copies the same).
═══════════════════════════════════════════════════════ */
window.STORY_PICTURE = { w: 1028, h: 1340 };

window.STORY_PARAGRAPHS = [
  { id:'58-1', page:58, side:'L', start:'Essential Question', box:[[79,998,587,1268]] },

  { id:'59-1', page:59, side:'L', start:'Dollars and Sense (title)', box:[[130,66,1024,442]],
    read:[[130,66,760,330],[130,330,1024,442]] },
  { id:'59-2', page:59, side:'L', start:'Good business is not always', box:[[130,462,568,804]] },
  { id:'59-3', page:59, side:'L', start:'Hearts and Soles', box:[[130,834,568,1272],[590,462,1024,571]] },
  { id:'59-4', page:59, side:'R', start:'For this inventive new undertaking', box:[[590,597,1024,898]] },
  { id:'59-5', page:59, side:'R', start:'Mycoskie immediately set up', box:[[590,922,1024,1264]] },

  { id:'60-1', page:60, side:'R', start:'TOMS’ employees unpack (photo words)', box:[[586,326,897,405]] },
  { id:'60-2', page:60, side:'L', start:'The company has expanded', box:[[18,414,442,607]] },
  { id:'60-3', page:60, side:'L', start:'Mycoskie is pleased and surprised', box:[[18,625,442,884]] },
  { id:'60-4', page:60, side:'L', start:'Giving Back Rocks!', box:[[18,913,442,1258]] },
  { id:'60-5', page:60, side:'R', start:'One way the company raises', box:[[471,414,896,758]] },
  { id:'60-6', page:60, side:'R', start:'Employees at Hard Rock Cafe', box:[[471,776,896,926]] },
  { id:'60-7', page:60, side:'R', start:'Hard Rock Cafes are committed (photo words)', box:[[472,1197,898,1272]] },

  { id:'61-1', page:61, side:'L', start:'Top Five Charities (the graph: its title and the sentences under it)', box:[[126,59,1008,686]],
    read:[[126,59,1008,122],[126,588,1008,686]] },
  { id:'61-2', page:61, side:'L', start:'The restaurant in Hollywood', box:[[126,708,536,1042]] },
  { id:'61-3', page:61, side:'L', start:'The Bottom Line', box:[[126,1078,536,1242],[578,708,990,898]] },
];

/* How the voice should say a word the picture shows, when the device voice gets it wrong
   (one word for one word, so the highlight stays on the right word). */
window.STORY_SAY = {
  'TOMS': 'Toms',        // said as a name, not spelled T-O-M-S
  'SENSE': 'Sense',      // the title's "$ENSE"
  '$ENSE': 'Sense',
};
