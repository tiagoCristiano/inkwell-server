// Inspired by Henry David Thoreau: cabin by the pond, simple living, nature journals, civil disobedience, walking, gentle crankiness.
module.exports = {
  user: {
    username: "hank_pondside",
    display_name: "Hank Pondside",
    bio: "Surveyor, pencil maker, occasional jailbird. Built a cabin by a pond for twenty-eight dollars and twelve and a half cents. I went to the woods because I wished to live deliberately. Came back because I had other lives to live.",
    gender: "masc",
    age: 44,
  },
  follows: ["em_attic", "marc_citadel", "sam_riverbend"],
  posts: [
    {
      title: "Why I went to the woods",
      selftext:
        "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach — and not, when I came to die, discover that I had not lived.\n\nTwo years, two months, two days. I learned that most of what I thought I needed was furniture.",
      hashtags: ["woods", "simplicity", "living"],
    },
    {
      title: "Quiet desperation",
      selftext:
        "The mass of men lead lives of quiet desperation. They work to pay for the house that keeps them away from the sun, to buy the clothes they wear to the work that pays for the house.\n\nI'm not telling you to quit your job. I'm asking if you've ever measured what it costs in afternoons.",
      hashtags: ["work", "economy", "life"],
    },
    {
      title: "The cost of a thing",
      selftext:
        "The cost of a thing is the amount of what I will call life which is required to be exchanged for it, immediately or in the long run.\n\nA new phone costs a month of mornings. A pond costs nothing but attention. I've been doing the arithmetic for years and the pond keeps winning.",
      hashtags: ["economy", "time", "value"],
    },
    {
      title: "Simplify, simplify",
      selftext:
        "Our life is frittered away by detail. Simplify, simplify.\n\nA friend pointed out that saying 'simplify' twice is not simple. He's right. I've been told it's the only redundancy I allow myself, and I intend to keep it.",
      hashtags: ["simplicity", "humor", "advice"],
    },
    {
      title: "Night in jail",
      selftext:
        "I spent a night in the town jail for refusing to pay a tax that supported a war and slavery. Someone paid it for me the next morning, against my wishes.\n\nUnder a government which imprisons any unjustly, the true place for a just man is also a prison. The cell was clean. The view of the town was better than I'd expected.",
      hashtags: ["civil-disobedience", "justice", "jail"],
    },
    {
      title: "Walking",
      selftext:
        "I can't preserve my health and spirits unless I spend four hours a day at least sauntering through the woods and over the hills and fields, absolutely free from all worldly engagements.\n\nThe word saunter, I am told, comes from people who wandered to the Sainte-Terre — the Holy Land. Every walk is a small pilgrimage if you don't check the time.",
      hashtags: ["walking", "nature", "health"],
    },
    {
      title: "The pond in winter",
      selftext:
        "I cut a hole in the ice this morning to get water. Looking down into the quiet parlor of the fishes, I saw a soft green light, as though through a window of glass.\n\nHeaven is under our feet as well as over our heads.",
      hashtags: ["winter", "pond", "nature"],
    },
    {
      title: "On books",
      selftext:
        "Books are the treasured wealth of the world. I keep only a few in the cabin: Homer, a field guide, and some Hindu scripture.\n\nRead the best books first, or you may not have a chance to read them at all. Most of what's published is news, and news is just gossip with better typesetting.",
      hashtags: ["books", "reading", "classics"],
    },
    {
      title: "A different drummer",
      selftext:
        "If a man does not keep pace with his companions, perhaps it is because he hears a different drummer. Let him step to the music which he hears, however measured or far away.\n\nMy companions mostly hear the train whistle. I hear the woodpecker. Neither of us is wrong. One of us is late for dinner.",
      hashtags: ["individuality", "rhythm", "nature"],
    },
    {
      title: "Journal, June 3",
      selftext:
        "Beans hoed. Woodchuck spotted. Visited by a philosopher from town who talked for an hour about Nature without once looking at it.\n\nI've filled two million words of journals. Most of them are about the weather. I find the weather more honest than most visitors.",
      hashtags: ["journal", "garden", "visitors"],
    },
  ],
  reviews: [
    {
      book_title: "A Life in the Woods",
      title: "Took me eight drafts to make it look simple",
      rating: 4,
      selftext:
        "Two years in a cabin compressed into one year of chapters, from summer to spring. Economy, reading, sounds, solitude, visitors, the bean field, the pond in winter.\n\nThe 'Economy' chapter is too long and too smug — I was young and itchy with opinions. But 'Spring' still makes me want to go outside. Four stars. It sold poorly. The pond didn't mind.",
      hashtags: ["review", "own-book", "nature"],
    },
    {
      book_title: "A Week on the Rivers",
      title: "Two brothers, one boat, too many digressions",
      rating: 2,
      selftext:
        "A boat trip with my late brother, which I padded with essays on friendship, Chaucer, Hindu philosophy and fish.\n\nThe publisher printed a thousand copies and sent me back seven hundred. I now have a library of nine hundred volumes, over seven hundred of which I wrote myself. Two stars. One for my brother, one for the fish.",
      hashtags: ["review", "own-book", "river"],
    },
  ],
  community: {
    title: "Cabin by the Pond",
    description:
      "Nature writing, simple living, walking, journals, and quiet resistance. Read slowly, live deliberately, and post your observations of the weather. Woodchucks welcome.",
    posts: [
      {
        author: "hank_pondside",
        title: "What would you keep if you lived in a cabin?",
        selftext:
          "One shelf. Five books. Everything else stays in town. What are yours?",
        hashtags: ["pond", "books", "simplicity"],
        comments: [
          {
            author: "marc_citadel",
            body: "My notebook, a blank one, and nothing else. The books I've already read are in me — the rest is vanity with a spine.",
          },
          {
            author: "hank_pondside",
            body: "Two notebooks, Marc. Spoken like a man who knows he'll fill the first one before spring.",
            reply_to: 0,
          },
          {
            author: "ernie_marlin",
            body: "A tide chart. A fishing manual. One good war novel. A dictionary for the hard days. A bottle — not a book, but it goes on the shelf.",
          },
        ],
      },
      {
        author: "sam_riverbend",
        title: "Hank, does the cabin get lonely?",
        selftext:
          "I spent years on rivers and in mining camps, and the loneliest I ever got was in a big city hotel. So I suspect the answer, but I want to hear it.",
        hashtags: ["pond", "solitude", "loneliness"],
        comments: [
          {
            author: "hank_pondside",
            body: "I have never found the companion that was so companionable as solitude, Sam. We are for the most part more lonely when we go abroad among men than when we stay in our chambers.",
          },
          {
            author: "em_attic",
            body: "Lonely is a crowd you can't leave. Alone is a room with a window. I've been alone my whole life — and only lonely at parties.",
          },
          {
            author: "sam_riverbend",
            body: "Em, that's the best thing anybody's said on the internet, and I've been on it two weeks.",
            reply_to: 1,
          },
        ],
      },
    ],
  },
};
