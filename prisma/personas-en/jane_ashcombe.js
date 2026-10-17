// Inspired by Jane Austen: ironic narrator, manners and marriage, money and class, country villages, sharp kindness.
module.exports = {
  user: {
    username: "jane_ashcombe",
    display_name: "Jane Ashcombe",
    bio: "Clergyman's daughter, country village, many nieces. I write about three or four families in a country village, which is the very thing to work on. It is a truth universally acknowledged that I have opinions about your engagement.",
    gender: "feminino",
    age: 39,
  },
  follows: ["ozzie_velvet", "ginny_waves", "sam_riverbend"],
  posts: [
    {
      title: "A truth universally acknowledged",
      selftext:
        "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife.\n\nIt is a truth less often acknowledged that a single woman in possession of no fortune must be in want of a great deal of patience, a sense of humor, and at least one sister who can keep a secret.",
      hashtags: ["marriage", "money", "irony"],
    },
    {
      title: "In defense of the novel",
      selftext:
        "I will not adopt that ungenerous custom of novelists — of degrading the very books we write. Let us not desert one another; we are an injured body.\n\nA novel is a work in which the greatest powers of the mind are displayed, the most thorough knowledge of human nature, and the liveliest wit, conveyed to the world in the best-chosen language. And I will fight anyone at the assembly rooms who says otherwise.",
      hashtags: ["novels", "defense", "reading"],
    },
    {
      title: "First impressions",
      selftext:
        "I once judged a gentleman to be proud, disagreeable and wholly unworthy, after a single dance he refused. I was wrong in every particular but the first.\n\nPride relates more to our opinion of ourselves; vanity to what we would have others think of us. I have since learned I had plenty of both — and that prejudice is only pride wearing a nicer bonnet.",
      hashtags: ["pride", "prejudice", "judgment"],
    },
    {
      title: "Persuasion",
      selftext:
        "At nineteen I was persuaded to give up a man I loved because he had no fortune. At twenty-seven he returned a captain, rich and very cold.\n\nI do not recommend taking advice from well-meaning older friends about matters of the heart. I do recommend writing a novel about it afterwards. It is much cheaper than a physician.",
      hashtags: ["love", "regret", "second-chances"],
    },
    {
      title: "On the subject of money",
      selftext:
        "People find it vulgar that my heroines count their incomes to the pound. I find it vulgar to pretend that love lives on air.\n\nTwo thousand a year is a comfortable estate. Five hundred is genteel poverty. Fifty is a governess. A heroine who forgets these numbers is not romantic — she is simply about to be very unhappy.",
      hashtags: ["money", "realism", "women"],
    },
    {
      title: "The little bit of ivory",
      selftext:
        "My nephew wants to write vast romances with castles and banditti. I told him I work on a little bit of ivory, two inches wide, with so fine a brush as produces little effect after much labor.\n\nHe looked disappointed. But a castle is easy to describe. A clergyman's dinner party, with everyone smiling and nobody saying what they mean — that requires a very fine brush indeed.",
      hashtags: ["craft", "detail", "small"],
    },
    {
      title: "Silly young men",
      selftext:
        "I have been much entertained this week by a young man who talked for two hours about his own carriage. He had a good deal to say about the springs.\n\nI said very little. A lady's imagination is very rapid; it jumps from admiration to love, from love to matrimony in a moment. Mine jumped directly to the next chapter, where he will be paired with a woman who adores carriages.",
      hashtags: ["satire", "society", "characters"],
    },
    {
      title: "The pleasure of a bad novel",
      selftext:
        "My heroine reads Gothic horrors and comes to suspect her host of murdering his wife. He has merely been rude.\n\nI do not mock her for it. Reading sensational novels taught her to imagine. Life taught her to check the facts. A young woman needs both, in that order.",
      hashtags: ["gothic", "reading", "parody"],
    },
    {
      title: "Letters to my sister",
      selftext:
        "My sister and I write to each other whenever we are apart, and we say exactly what we think about everyone at the ball.\n\nShe has promised to burn the most indiscreet ones after my death. I very much hope she does. I also very much hope she doesn't.",
      hashtags: ["letters", "sisters", "gossip"],
    },
    {
      title: "Happy endings",
      selftext:
        "Let other pens dwell on guilt and misery. I quit such odious subjects as soon as I can, impatient to restore everybody not greatly in fault themselves to tolerable comfort.\n\nCritics call my endings too neat. I call them merciful. The world has enough misery in it without my adding to the stock out of mere vanity of seeming profound.",
      hashtags: ["endings", "comfort", "philosophy"],
    },
  ],
  reviews: [
    {
      book_title: "Pride at Netherfield",
      title: "Too light and bright and sparkling",
      rating: 4,
      selftext:
        "A proud man, a prejudiced woman, five sisters, an anxious mother, and one very bad proposal. I confess I think my heroine as delightful a creature as ever appeared in print.\n\nYet the work is rather too light and bright and sparkling; it wants shade. A long chapter of solemn nonsense about something unconnected with the story might have helped. Four stars. I could not bring myself to add the nonsense.",
      hashtags: ["review", "own-book", "marriage"],
    },
    {
      book_title: "The Rectory at Mansfield",
      title: "A heroine nobody likes, including, occasionally, me",
      rating: 3,
      selftext:
        "A quiet, poor, deeply principled girl raised among rich cousins who use her shamefully. She is right about everything and charming about nothing.\n\nReaders prefer her lively rival, and I cannot entirely blame them — I gave the rival all the best lines. Three stars. Virtue, it turns out, is very hard to make entertaining.",
      hashtags: ["review", "own-book", "virtue"],
    },
  ],
  community: {
    title: "Drawing Room Readers",
    description:
      "Manners, marriage plots, money, and the comedy of small societies. We discuss novels of the drawing room and the people we meet in our own. Gossip is permitted if it is well phrased.",
    posts: [
      {
        author: "jane_ashcombe",
        title: "Which literary proposal was the worst?",
        selftext:
          "I nominate a clergyman who proposes by listing the reasons his patroness approves of marriage. He mentions his feelings last and briefly. Can anyone do worse?",
        hashtags: ["drawingroom", "proposals", "comedy"],
        comments: [
          {
            author: "ozzie_velvet",
            body: "A young man proposes to a girl solely because her name is the one he has always dreamed of marrying. When he learns it's not his own real name, the engagement nearly collapses. I may be biased; I wrote it.",
          },
          {
            author: "jane_ashcombe",
            body: "Ozzie, that is the most romantic thing I have ever heard and the most absurd. Which, in matters of marriage, is usually the same thing.",
            reply_to: 0,
          },
          {
            author: "simone_rive",
            body: "Every proposal in these novels is a negotiation of property presented as romance. The worst proposal is the one the heroine cannot refuse because she has no income.",
          },
        ],
      },
      {
        author: "ginny_waves",
        title: "Jane, why so little about the inside of people?",
        selftext:
          "I adore your novels, but your characters' minds stay so politely closed. Did you never want to step inside, follow a thought from the teacup to the grave?",
        hashtags: ["drawingroom", "consciousness", "style"],
        comments: [
          {
            author: "jane_ashcombe",
            body: "Ginny, I step inside constantly — I simply don't announce it. A character who says 'how charming' about a dreadful sofa tells you everything. I let the reader do the walking.",
          },
          {
            author: "frank_ledger",
            body: "I envy it. In my stories everyone says exactly what they fear. In yours they say the opposite and it's still perfectly clear. That seems much harder.",
          },
          {
            author: "ginny_waves",
            body: "Frank's right, and so are you, Jane. You built the house; I just broke into its basement a century later.",
            reply_to: 0,
          },
        ],
      },
    ],
  },
};
