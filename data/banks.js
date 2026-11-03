/* ═══════════════════════════════════════════════════════
   DOLLARS AND SENSE — TEST QUESTION BANKS (built 2026-11-03)
   Written new for this year's class (Marcos 10/21: never last year's test or review).
   Same words and same parts of the article as the review, with different sentences
   and stems. Every item is as hard as its review item: the review and the test are
   matching forms (Marcos 11/3: the easiest-to-hardest rule is for math; a reading review
   matches its test, as The Talent Show's did). tools/check-banks.js checks it:
   vocabulary and CLOZE choices are the same kind of word as the answer, and the
   article questions use real details from the wrong part of the article as wrong answers.
     VOCAB_BANK  24 items, each word once, NEW (Marcos 11/3: "Then make new ones for the test. Half Used
                 Right and half Endings."): 12 Used Right + 12 Endings, the review's two kinds, no sentence
                 copied from the review
     COMP_BANK   P01–P10 article details (in the article's own words) · P11–P20 Part A / Part B pairs
     CLOZE_BANK  C01–C24 (same word per id on both; new sentence)
   answer = index into choices (choices are shuffled at run time).
   page = the article page (58–61) the story panel opens to.
   The teacher dashboard reads this file (REVIEW_FILES) — keep ids stable.
═══════════════════════════════════════════════════════ */

/* Vocabulary (Marcos 11/3: "Make 24 of Used Right and 24 Endings. Split those for Review 1 and Review 2.
   Then make new ones for the test. Half Used Right and half Endings."): the Vocab Practice's two kinds,
   with four choices. Used Right: four sentences, one uses the word the right way. Endings: the start of
   a sentence with the word underlined, and four endings, one that fits what the word means. */
function dsUsedRight(word) { return `Which sentence uses <b>${word}</b> the right way?`; }
function dsEnding(stem, word) {
  const underlined = stem.replace(new RegExp('\\b' + word + '\\b', 'i'), m => `<u>${m}</u>`);
  return `${underlined} __________<br>Which ending makes the most sense?`;
}

window.VOCAB_BANK = [
  /* ── USED RIGHT: WHICH SENTENCE USES THE WORD THE RIGHT WAY? (12 words) ── */
  { id:"V01", q:dsUsedRight("desire"), choices:["Wei's desire to fly planes made him hide every time a plane flew by.", "Wei's desire to fly planes made him read every book about pilots.", "Jada showed her desire for the red bike by never looking at it.", "The desire for a snack made Ty say he never wanted to eat again."], answer:1 },
  { id:"V04", q:dsUsedRight("company"), choices:["That company earns money by printing books and selling them.", "That company is the cloud shaped like a rabbit.", "Our company is the soup we had for dinner.", "The company sells nothing and makes nothing, so it is a busy business."], answer:0 },
  { id:"V06", q:dsUsedRight("routine"), choices:["Lia's routine is something brand new that she tries each day and never repeats.", "Lia's routine is the blue backpack she carries.", "Before every test, Lia follows her routine: sharpen her pencil, drink water, and take a deep breath.", "Lia did her routine once and then never again."], answer:2 },
  { id:"V08", q:dsUsedRight("undertaking"), choices:["Fixing every bike in the neighborhood became Ray's summer undertaking.", "Ray's undertaking was to blink once, and he finished before lunch started.", "Turning on the light was a giant undertaking that needed a team of workers.", "An undertaking is a small snack you eat in the car."], answer:0 },
  { id:"V10", q:dsUsedRight("traditionally"), choices:["The class traditionally used the new computers for the first time today.", "Our team traditionally won its first game ever last night.", "For many years, the town has traditionally rung a bell at noon on the first day of spring.", "I put the traditionally in my lunch box."], answer:2 },
  { id:"V12", q:dsUsedRight("expanded"), choices:["The animal shelter expanded and built a new room for cats.", "The animal shelter expanded when it closed two of its rooms.", "My savings expanded after I spent all my money.", "The ice cube expanded as it melted into a tiny drop."], answer:0 },
  { id:"V13", q:dsUsedRight("pleased"), choices:["Ben felt pleased when he dropped his ice cream on the ground.", "Mrs. Lee was pleased with how well we read the play.", "The kids were pleased, so they frowned and walked away sadly.", "Grandma was pleased that her favorite cup broke."], answer:1 },
  { id:"V16", q:dsUsedRight("motto"), choices:["Our class picked “Be kind” as its motto and wrote it on the door.", "The motto is the slide on the playground.", "Her motto was a song that lasted for one whole hour.", "Dad's motto is the car he drives to work."], answer:0 },
  { id:"V17", q:dsUsedRight("funds"), choices:["The scouts saved funds, which are the paper clips they found.", "The scouts saved their funds so they could buy tents for camp.", "The funds were the trees we planted by the gym.", "We raised funds for the trip by giving away all our money."], answer:1 },
  { id:"V20", q:dsUsedRight("location"), choices:["The store moved to a new location on Main Street.", "Her location is how tall she is.", "Her location is a song she likes to sing.", "The location is how happy I feel."], answer:0 },
  { id:"V22", q:dsUsedRight("foundation"), choices:["A foundation is the tallest mountain in our state.", "The foundation took money away from people in need.", "A foundation paid to put new trees along every street in town.", "The foundation is my baby sister's blanket."], answer:2 },
  { id:"V24", q:dsUsedRight("necessity"), choices:["For a long car trip, a full tank of gas is a necessity.", "You never need a helmet, which is why it is a necessity.", "My necessity is something I do not need at all.", "A necessity is a thing you can always leave behind."], answer:0 },
  /* ── ENDINGS: WHICH ENDING MAKES THE MOST SENSE? (the other 12 words) ── */
  { id:"V26", q:dsEnding("When the farm stand added up its bottom line in the fall, it learned", "bottom line"), choices:["how many tractors it owned.", "what color the barn was.", "whether it made or lost money that year.", "how many cows lived next door."], answer:2 },
  { id:"V27", q:dsEnding("When the old man dropped his groceries, the compassionate boy", "compassionate"), choices:["walked past and laughed.", "kicked a can down the street.", "took one of his apples.", "helped him pick them up."], answer:3 },
  { id:"V29", q:dsEnding("Before buying a rug, Mom wanted to measure the floor, so she", "measure"), choices:["swept the floor clean.", "stretched a long tape across the room and read the numbers.", "painted the walls.", "sat down to rest."], answer:1 },
  { id:"V31", q:dsEnding("When the class ran out of paper, the inventive students", "inventive"), choices:["stopped working and went home.", "waited for someone to bring more.", "cried until lunch.", "made notebooks out of old cereal boxes."], answer:3 },
  { id:"V33", q:dsEnding("To model its next stuffed animal on a real giraffe, the toy company made it", "model"), choices:["short and round like a ball.", "tall, with a long neck and brown spots.", "look like nothing anyone has seen.", "bright blue with no neck at all."], answer:1 },
  { id:"V35", q:dsEnding("The school's innovative idea for lunch was to", "innovative"), choices:["serve the same food it had served for 50 years.", "do lunch the old way, with nothing changed.", "copy the menu from last year.", "let kids order their lunch on a tablet the day before."], answer:3 },
  { id:"V38", q:dsEnding("Grandpa started an enterprise when he", "enterprise"), choices:["went to bed early.", "tied his shoes.", "opened a shop that fixes bikes.", "ate a sandwich."], answer:2 },
  { id:"V39", q:dsEnding("Instead of selling her old books, Aunt Rose donated them to a charity, and now", "charity"), choices:["she has more money.", "nobody can ever read them.", "the books are back on her shelf.", "kids who have no books can read them."], answer:3 },
  { id:"V42", q:dsEnding("Getting a library card is a process: first", "process"), choices:["you take every book home at once.", "you skip all the steps.", "you fill out a form, and then the library makes your card.", "you get the card before you ask for it."], answer:2 },
  { id:"V43", q:dsEnding("To design a new costume for the play, Mr. Ruiz", "design"), choices:["bought the first costume he saw.", "put the costume in the wash.", "gave the costume to a friend.", "drew sketches of how each part would look."], answer:3 },
  { id:"V45", q:dsEnding("Because the soccer player was exceptional, she", "exceptional"), choices:["missed every kick.", "scored more goals than anyone on the team.", "was no better than anyone else.", "never touched the ball."], answer:1 },
  { id:"V47", q:dsEnding("Sam spent $5 on supplies and sold his crafts for $12, so his profit", "profit"), choices:["was $17.", "was $5.", "was $12.", "was $7."], answer:3 },
];

window.COMP_BANK = [
  /* ── PART I: ARTICLE DETAILS (the article's own words) ──────────── */
  { id:"P01", page:59, lvl:1, trap:3, q:"Blake Mycoskie had started and run four businesses. What did he want a break from? (page 59)", choices:["his usual routine","his shoe company","his work at a restaurant","his life in Argentina"], answer:0 },
  { id:"P02", page:59, lvl:1, trap:2, q:"Where did Mycoskie travel in 2006? (page 59)", choices:["to Argentina, in South America","to Hollywood, Florida","to a Hard Rock Cafe hotel","to a city in the United States"], answer:0 },
  { id:"P03", page:59, lvl:1, trap:3, q:"In the poor villages Mycoskie visited, what did very few of the children have? (page 59)", choices:["shoes","eyeglasses","T-shirts","schools"], answer:0 },
  { id:"P04", page:59, lvl:1, trap:3, q:"Mycoskie started the business using his own money. What did he name it? (page 59)", choices:["TOMS: Shoes for Tomorrow","Love All, Serve All","Hearts and Soles","Giving Back Rocks"], answer:0 },
  { id:"P05", page:59, lvl:1, trap:3, q:"What is TOMS’ innovative one-for-one program? (page 59)", choices:["TOMS gives away one pair of shoes for every pair that is purchased.","TOMS gives one T-shirt to charity for every shirt that is sold.","TOMS gives away one pair of eyeglasses every year.","TOMS gives one dollar to a foundation for every store."], answer:0 },
  { id:"P06", page:60, lvl:1, trap:2, q:"The company has expanded. What does it sell now besides shoes? (page 60)", choices:["eyeglasses","T-shirts","hats","rock music"], answer:0 },
  { id:"P07", page:60, lvl:1, trap:3, q:"In 1990, the Hard Rock Cafe company launched a new enterprise. What was it? (page 60)", choices:["charity","a shoe company","a line of eyeglasses","a high school"], answer:0 },
  { id:"P08", page:60, lvl:1, trap:3, q:"What is the motto of the Hard Rock Cafe company? (page 60)", choices:["Love All, Serve All","Shoes for Tomorrow","Giving Back Rocks","Hearts and Soles"], answer:0 },
  { id:"P09", page:60, lvl:1, trap:3, q:"How does the process for the Hard Rock Cafe T-shirts start? (page 60)", choices:["Rock stars design the art that goes on the shirts.","The shirts are sold on the Internet.","Employees raise money for their community.","Students from two high schools draw the art."], answer:0 },
  { id:"P10", page:61, lvl:1, trap:3, q:"Look at the graph on page 61. Which charity was number 5, with the least money of the five? (page 61)", choices:["YMCA of the USA","United Way Worldwide","Feeding America","The Salvation Army"], answer:0 },
  /* ── PART II: INFERENCES, CONCLUSIONS, AND EVIDENCE (A/B pairs) ── */
  { id:"P11", page:59, lvl:3, trap:0, q:"Part A: What can the reader conclude about how TOMS helps others? (page 59)", choices:["When people buy TOMS shoes, children in need get shoes too.","TOMS sells shoes only to people in Argentina.","TOMS gives shoes away only once a year.","TOMS pays children to make its shoes."], answer:0 },
  { id:"P12", page:59, lvl:2, trap:3, q:"Part B: Which sentence from page 59 best supports the answer to Part A?", choices:["“TOMS gives away one pair of shoes for every pair that is purchased.”","“The slip-on shoes are modeled on shoes that are traditionally worn by Argentine workers.”","“He named it TOMS: Shoes for Tomorrow.”","“For this inventive new undertaking, Mycoskie started the business using his own money.”"], answer:0 },
  { id:"P13", page:60, lvl:3, trap:0, q:"Part A: What can the reader infer about Mycoskie’s plan for his life before TOMS? (page 60)", choices:["He planned to make money first and give it away later.","He planned to give money away first and make money later.","He planned to work in a restaurant his whole life.","He planned to never start another business."], answer:0 },
  { id:"P14", page:60, lvl:2, trap:3, q:"Part B: Which sentence from page 60 best supports the answer to Part A?", choices:["“I always thought I would spend the first half of my life making money and the second half giving it away.”","“Mycoskie is pleased and surprised.”","“The company has expanded to sell eyeglasses.”","“The company runs restaurants and hotels.”"], answer:0 },
  { id:"P15", page:60, lvl:3, trap:0, q:"Part A: What can the reader conclude about the ways Hard Rock Cafe helps others? (page 60)", choices:["The company helps others in more than one way.","The company helps others only by selling T-shirts.","The company helps others only in Florida.","The company stopped helping others after 1990."], answer:0 },
  { id:"P16", page:60, lvl:3, trap:3, q:"Part B: Which sentence from page 60 best supports the answer to Part A?", choices:["“One way the company raises funds for charity is by selling a line of T-shirts.”","“Then the shirts are sold on the Internet.”","“Have you ever seen a Hard Rock Cafe?”","“The process starts with rock stars designing the art that goes on the shirts.”"], answer:0 },
  { id:"P17", page:61, lvl:3, trap:0, q:"Part A: Why did the author most likely include the graph on page 61? (page 61)", choices:["to show that many people and businesses give money to help others","to show how much money TOMS made from selling shoes","to show which Hard Rock Cafe sold the most T-shirts","to show how to start a new charity"], answer:0 },
  { id:"P18", page:61, lvl:3, trap:3, q:"Part B: Which sentence from page 61 best supports the answer to Part A?", choices:["“Individuals as well as businesses are committed to helping people in need.”","“If you own a business, making a profit is a necessity.”","“The foundation grants wishes to children with serious medical problems.”","“Helping others is good business!”"], answer:0 },
  { id:"P19", page:61, lvl:3, trap:0, q:"Part A: The Essential Question asks, “How can starting a business help others?” What answer does the article give? (pages 59–61)", choices:["A business can share what it makes or earns to help people in need.","A business can help others only if it is very small.","A business helps others by keeping all of its money.","A business can help others only by selling food."], answer:0 },
  { id:"P20", page:61, lvl:3, trap:3, q:"Part B: Which sentence from page 61 best supports the answer to Part A?", choices:["“Every day companies are thinking of innovative ways to give back to their community.”","“If you own a business, making a profit is a necessity.”","“The restaurant in Hollywood, Florida, worked with some exceptional students from two Florida high schools.”","“This graph shows the American charities that got the most donations in 2016 and how much money they raised.”"], answer:0 },
];

window.COMP_PAIRS = [['P11','P12'], ['P13','P14'], ['P15','P16'], ['P17','P18'], ['P19','P20']];

window.CLOZE_BANK = [
  { id:"C01", q:"Ever since he saw the race cars, Jamal has had a strong __________ to learn how engines work.", choices:["location","desire","motto"], answer:1 },
  { id:"C02", q:"The farmers market checked its __________ at the end of the summer to see how much money it made.", choices:["motto","location","bottom line"], answer:2 },
  { id:"C03", q:"The __________ coach stayed after practice to help the player who was sad about losing.", choices:["compassionate","inventive","pleased"], answer:0 },
  { id:"C04", q:"Grandpa worked for a __________ that made trains for forty years.", choices:["motto","company","process"], answer:1 },
  { id:"C05", q:"Before planting, we will __________ how wide the garden is so we know how many seeds to buy.", choices:["design","model","measure"], answer:2 },
  { id:"C06", q:"The zookeeper has the same daily __________: feed the lions, clean the pens, and check the water.", choices:["routine","location","foundation"], answer:0 },
  { id:"C07", q:"The __________ students used cardboard and string to build a working elevator for their toys.", choices:["compassionate","inventive","pleased"], answer:1 },
  { id:"C08", q:"Writing and printing a whole class newspaper was a big __________ for our team.", choices:["motto","location","undertaking"], answer:2 },
  { id:"C09", q:"The students will __________ their bridge on the famous Golden Gate Bridge, with tall towers and long cables.", choices:["model","measure","expanded"], answer:0 },
  { id:"C10", q:"My grandmother __________ makes rice and beans on Sunday, just as her mother did.", choices:["exceptional","traditionally","compassionate"], answer:1 },
  { id:"C11", q:"The __________ shoes light up and count your steps, which no shoes did before.", choices:["compassionate","pleased","innovative"], answer:2 },
  { id:"C12", q:"The museum __________ its dinosaur room, so now it holds twice as many bones.", choices:["expanded","measure","design"], answer:0 },
  { id:"C13", q:"The principal was __________ to see every class lined up quietly for the fire drill.", choices:["compassionate","pleased","innovative"], answer:1 },
  { id:"C14", q:"Building birdhouses to sell at the fair was Carlos’s new __________.", choices:["location","motto","enterprise"], answer:2 },
  { id:"C15", q:"The bakery gives its extra bread to __________ so that hungry families can have it.", choices:["charity","profit","routine"], answer:0 },
  { id:"C16", q:"Our classroom __________, “Try your best,” hangs above the door.", choices:["process","motto","location"], answer:1 },
  { id:"C17", q:"The town is collecting __________ to fix the old playground.", choices:["process","desire","funds"], answer:2 },
  { id:"C18", q:"Making paper is a long __________: you soak old paper, mash it, and let it dry flat.", choices:["process","location","motto"], answer:0 },
  { id:"C19", q:"An artist will __________ the new mural by drawing a plan of the whole wall first.", choices:["measure","design","expanded"], answer:1 },
  { id:"C20", q:"Please write down the __________ of the party so we can find the right house.", choices:["motto","process","location"], answer:2 },
  { id:"C21", q:"Ana is the most __________ artist in our school, and her drawings look almost like photographs.", choices:["exceptional","compassionate","pleased"], answer:0 },
  { id:"C22", q:"The __________ gives money every year to help children who are sick.", choices:["motto","foundation","process"], answer:1 },
  { id:"C23", q:"The bike shop paid for its parts and workers and still had a __________ at the end of the month.", choices:["motto","routine","profit"], answer:2 },
  { id:"C24", q:"A helmet is a __________ when you ride a bike, because it keeps your head safe.", choices:["necessity","desire","motto"], answer:0 },
];
