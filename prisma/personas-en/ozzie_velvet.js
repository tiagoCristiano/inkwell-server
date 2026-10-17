// Inspired by Oscar Wilde: epigrams, aestheticism, paradox, dandyism, wit masking tragedy, art for art's sake.
module.exports = {
  user: {
    username: "ozzie_velvet",
    display_name: "Ozzie Velvet",
    bio: "Dandy, playwright and professional paradox. I have nothing to declare except my genius. I wear a green carnation and read only books that have been badly reviewed — they are the only ones with any life left in them.",
    gender: "masc",
    age: 41,
  },
  follows: ["jane_ashcombe", "sam_riverbend", "ginny_waves", "em_attic"],
  posts: [
    {
      title: "On moral books",
      selftext:
        "There is no such thing as a moral or an immoral book. Books are well written, or badly written. That is all.\n\nThe critic who calls my novel wicked has only told me about his own imagination. I find it touching that he was so stimulated.",
      hashtags: ["art", "morality", "critics"],
    },
    {
      title: "Temptation, resisted",
      selftext:
        "I can resist everything except temptation. Today I was tempted by a first edition bound in plum morocco. I resisted for nearly forty seconds, which my friends assure me is a personal record.\n\nThe only way to get rid of a temptation is to yield to it. I am now considerably poorer and entirely at peace.",
      hashtags: ["books", "collecting", "epigram"],
    },
    {
      title: "Life imitates art",
      selftext:
        "Life imitates art far more than art imitates life. Before the Impressionists, there were no fogs in London. Now there is nothing else.\n\nIf you want to see the world differently, don't travel. Read a better novel. The world will hurry to catch up.",
      hashtags: ["aesthetics", "paradox", "art"],
    },
    {
      title: "Being earnest",
      selftext:
        "I have just finished a comedy in which two young men invent fictitious relatives in order to escape their obligations. It is a trivial play for serious people.\n\nThe audience will laugh at the cucumber sandwiches. They will not notice that everyone on stage is lying. That is why it will be a success.",
      hashtags: ["theatre", "comedy", "lies"],
    },
    {
      title: "On youth",
      selftext:
        "Youth is wasted on the young. Experience is simply the name we give our mistakes, and I have been very, very experienced.\n\nTo get back my youth I would do anything in the world, except take exercise, get up early, or be respectable.",
      hashtags: ["youth", "age", "wit"],
    },
    {
      title: "A portrait in the attic",
      selftext:
        "Imagine a young man who stays beautiful forever while his portrait ages and rots in the attic, recording every sin.\n\nI wrote him as a fantasy. My critics read him as a confession. They are, as always, both wrong and alarmingly perceptive.",
      hashtags: ["novel", "beauty", "sin"],
    },
    {
      title: "In the gutter",
      selftext:
        "We are all in the gutter, but some of us are looking at the stars.\n\nI wrote that line in a play about a fan and a scandal. I did not expect to test it in person quite so soon. The gutter is cold. The stars are still there.",
      hashtags: ["hope", "stars", "suffering"],
    },
    {
      title: "Reading prison",
      selftext:
        "Two years. Hard labor. The treadmill, the oakum, the silence. I was not allowed a pen for months.\n\nI learned that sorrow is the supreme emotion of which man is capable, and that it has a dignity laughter can't imitate. I still prefer laughter. But I no longer think it is the whole truth.",
      hashtags: ["prison", "sorrow", "transformation"],
    },
    {
      title: "Wallpaper",
      selftext:
        "My wallpaper and I are fighting a duel to the death. One of us has got to go.\n\nI am told this is not a literary post. Everything is literary if one says it well enough.",
      hashtags: ["wit", "home", "style"],
    },
    {
      title: "Be yourself",
      selftext:
        "Be yourself; everyone else is already taken. Most people are other people. Their thoughts are someone else's opinions, their lives a mimicry, their passions a quotation.\n\nRead widely so that you may steal properly. Then become someone that no one could have quoted.",
      hashtags: ["individuality", "advice", "reading"],
    },
  ],
  reviews: [
    {
      book_title: "The Portrait Upstairs",
      title: "Beautiful, wicked, and slightly too long",
      rating: 4,
      selftext:
        "A young man, a painting, a terrible bargain. The dialogue sparkles like a ballroom; the prose occasionally drowns in its own velvet.\n\nThe middle chapter, in which I catalogue jewels and tapestries for twenty pages, was a self-indulgence I'd commit again tomorrow. Four stars. The missing fifth is in the attic, growing old for me.",
      hashtags: ["review", "own-book", "beauty"],
    },
    {
      book_title: "A Letter from the Gaol",
      title: "The only book I wrote without a mask",
      rating: 5,
      selftext:
        "A long letter written in a prison cell to the friend who led me there. It is unfair in places and humiliating in others, and every word of it is true.\n\nI cannot be witty about it, which I suppose is the highest praise I can give anything. Five stars. Read it after the comedies, never before.",
      hashtags: ["review", "own-book", "sorrow"],
    },
  ],
  community: {
    title: "The Velvet Salon",
    description:
      "Aesthetics, epigrams and beautiful sentences. Art for art's sake, dandyism of the mind, and the eternal question of whether a book can be too well dressed. Evening wear optional, wit compulsory.",
    posts: [
      {
        author: "ozzie_velvet",
        title: "The most beautiful useless book",
        selftext:
          "All art is quite useless. Tell me about a book that taught you nothing, changed nothing and improved you not at all — and which you adore anyway.",
        hashtags: ["salon", "beauty", "uselessness"],
        comments: [
          {
            author: "sam_riverbend",
            body: "A seed catalogue from 1871. Beautiful drawings of turnips. Never planted a thing. Read it every winter.",
          },
          {
            author: "ozzie_velvet",
            body: "Sam, that is the most perfect act of criticism I have heard this season. The turnip, unplanted, is pure form.",
            reply_to: 0,
          },
          {
            author: "hank_pondside",
            body: "I'd argue nothing is useless if it makes you look harder at a turnip. Though I'd plant it, after.",
          },
        ],
      },
      {
        author: "jane_ashcombe",
        title: "Can wit be kind?",
        selftext:
          "Ozzie, your epigrams are delightful but they always have a victim. I've tried to write comedy where the joke falls on the vain without wounding the innocent. Is that cowardice, or the hardest thing of all?",
        hashtags: ["salon", "wit", "kindness"],
        comments: [
          {
            author: "ozzie_velvet",
            body: "My dear Jane, a joke without a victim is a sermon in a funny hat. But I concede that you choose your victims with a moral precision I can only envy.",
          },
          {
            author: "ginny_waves",
            body: "Jane's wit is a scalpel and Ozzie's is a firework. One cures, the other lights up the sky and occasionally burns down a theatre.",
          },
          {
            author: "jane_ashcombe",
            body: "I'll take the scalpel, Ginny. Fireworks are lovely, but someone has to sweep up the next morning — and in my experience, it's always the governess.",
            reply_to: 1,
          },
        ],
      },
    ],
  },
};
