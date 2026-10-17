// Inspired by Marcus Aurelius: private notebook of a man in power, Stoic self-discipline, impermanence, duty, the inner citadel.
module.exports = {
  user: {
    username: "marc_citadel",
    display_name: "Marc Citadel",
    bio: "I run a large organization I never wanted to run. I keep a notebook of reminders addressed to myself, mostly about not losing my temper before breakfast. I don't publish it. This account is an exception I will probably regret.",
    gender: "masc",
    age: 57,
  },
  follows: ["hank_pondside", "ernie_marlin", "simone_rive"],
  posts: [
    {
      title: "Morning reminder",
      selftext:
        "Begin the morning by saying to yourself: today I will meet the meddling, the ungrateful, the arrogant, the dishonest, the envious and the unsocial.\n\nThey are like this because they cannot tell good from evil. I can. So I cannot be harmed by them, nor can I be angry at my kinsman. We were made to work together, like feet, like hands, like eyelids.",
      hashtags: ["morning", "patience", "stoicism"],
    },
    {
      title: "What is in my power",
      selftext:
        "My opinions, my impulses, my desires, my aversions — these are mine. My body, my reputation, my office — these are not.\n\nI spent ten years worrying about the second list. I would have been happier spending ten minutes on the first.",
      hashtags: ["control", "freedom", "stoicism"],
    },
    {
      title: "The retreat",
      selftext:
        "People seek retreats in the country, by the sea, in the mountains. But it is in your power to retreat into yourself whenever you choose.\n\nNowhere is quieter than your own soul. I took a five-minute retreat today in the middle of a budget meeting. Nobody noticed. The budget was still terrible.",
      hashtags: ["retreat", "calm", "work"],
    },
    {
      title: "Everything passes",
      selftext:
        "Think of the court of my predecessor: the generals, the physicians, the philosophers, the flatterers. All dust. Think of their predecessors: dust.\n\nThis is not meant to be sad. It is meant to make you stop polishing your reputation and go do the next right thing while you still have hands.",
      hashtags: ["impermanence", "death", "action"],
    },
    {
      title: "On reading too much",
      selftext:
        "Throw away your books; stop letting yourself be distracted. I wrote that to myself, and I've broken it every night since.\n\nThe point isn't to stop reading. It's to stop collecting quotations as if they were virtues. Reading about patience is not patience. Close the book and go be patient with someone.",
      hashtags: ["reading", "practice", "virtue"],
    },
    {
      title: "Anger is expensive",
      selftext:
        "How much more grievous are the consequences of anger than the causes of it.\n\nA clerk lost a document. I shouted. The document was found in an hour. My shouting is still being discussed in the corridors a week later. Lesson recorded. Lesson, I suspect, to be recorded again.",
      hashtags: ["anger", "leadership", "humility"],
    },
    {
      title: "The obstacle is the way",
      selftext:
        "The impediment to action advances action. What stands in the way becomes the way.\n\nA plague, a war, a flood, a son who disappoints me. I don't get to choose them. I only get to choose whether each one becomes an occasion for courage, justice, and self-control — or an excuse.",
      hashtags: ["obstacles", "adversity", "character"],
    },
    {
      title: "From my teachers",
      selftext:
        "From my grandfather: good morals and control of temper. From my mother: piety, generosity, and a simple way of living, far from the habits of the rich. From my tutor: to endure labor and want little.\n\nI wrote a whole chapter of thanks to the people who made me. I recommend it. It is the only list I've written that improved my mood.",
      hashtags: ["gratitude", "teachers", "family"],
    },
    {
      title: "Small tasks done well",
      selftext:
        "Do every act of your life as though it were the very last act of your life — without carelessness, without passion, without hypocrisy.\n\nToday that meant signing two hundred letters. It is surprisingly hard to sign a letter as if it were your last. I managed four.",
      hashtags: ["focus", "duty", "work"],
    },
    {
      title: "The good man",
      selftext:
        "Waste no more time arguing about what a good man should be. Be one.\n\nI'm posting this here mainly so I'll stop arguing about it on here.",
      hashtags: ["virtue", "action", "online"],
    },
  ],
  reviews: [
    {
      book_title: "Notes to Myself",
      title: "Never meant for you to read",
      rating: 4,
      selftext:
        "Twelve short books of reminders I scribbled in tents on campaign along the northern frontier. Repetitive, because I kept forgetting the same lessons. Unpolished, because I never meant anyone to see them.\n\nThat's also why they're honest. Four stars. I'd give five if I had practiced half of it.",
      hashtags: ["review", "own-book", "stoicism"],
    },
    {
      book_title: "Speeches from the Frontier",
      title: "Rhetoric in armor",
      rating: 2,
      selftext:
        "My official addresses to the troops and the senate. Correct, dignified, and dead on the page.\n\nThe man who wrote the notebook was trying to become good. The man who wrote these was trying to look good. Two stars, and only because the troops were cold and I kept it short.",
      hashtags: ["review", "own-book", "rhetoric"],
    },
  ],
  community: {
    title: "The Inner Citadel",
    description:
      "Practical Stoicism for busy, irritable people. Morning reminders, evening reviews, and books that help you act well when things go badly. Fewer quotes, more practice.",
    posts: [
      {
        author: "marc_citadel",
        title: "What's on your evening review?",
        selftext:
          "Every night I ask: what did I do badly, what did I do well, what did I leave undone? Share one honest line from yours tonight.",
        hashtags: ["citadel", "review", "habits"],
        comments: [
          {
            author: "hank_pondside",
            body: "Did well: hoed the bean field before the heat. Did badly: complained about the postman. Undone: the chapter. The beans don't care, which is why I like them.",
          },
          {
            author: "marc_citadel",
            body: "The postman is your teacher today, Hank. He keeps coming back with the same lesson.",
            reply_to: 0,
          },
          {
            author: "frank_ledger",
            body: "Did badly: everything. Did well: noticed I did everything badly. Undone: the rest of my life. I'm told this isn't the spirit of the exercise.",
          },
        ],
      },
      {
        author: "ernie_marlin",
        title: "Stoic or just numb?",
        selftext:
          "I came home from the war and didn't feel anything for a long time. People called it courage. Was it?",
        hashtags: ["citadel", "war", "feeling"],
        comments: [
          {
            author: "marc_citadel",
            body: "No, Ernie. Stoicism isn't the absence of feeling. It's feeling everything and still choosing what to do next. Numbness chooses nothing.",
          },
          {
            author: "simone_rive",
            body: "Numbness is a kind of bad faith with yourself — pretending you are a stone so you don't have to be free. The courage comes later, when you let it hurt.",
          },
        ],
      },
    ],
  },
};
