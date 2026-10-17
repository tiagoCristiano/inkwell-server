// Inspired by Simone de Beauvoir: existentialist feminism, freedom and responsibility, café writing, memoir, aging, bad faith.
module.exports = {
  user: {
    username: "simone_rive",
    display_name: "Simone Rive",
    bio: "Philosophy teacher turned novelist. I write in cafés on the Left Bank because my apartment has no heating and too many memories. One is not born, but rather becomes, a reader.",
    gender: "feminino",
    age: 44,
  },
  follows: ["ginny_waves", "frank_ledger", "marc_citadel", "jane_ashcombe"],
  posts: [
    {
      title: "One is not born a woman",
      selftext:
        "One is not born, but rather becomes, a woman. No biological, psychological or economic fate determines the figure she presents in society.\n\nWhat we call 'feminine' is a set of instructions handed to girls before they could read. I'm not asking anyone to tear the instructions up. I'm asking you to notice that they're printed, not engraved.",
      hashtags: ["feminism", "freedom", "society"],
    },
    {
      title: "Bad faith",
      selftext:
        "The waiter who plays the waiter a little too perfectly. The woman who leaves her hand in a man's grasp and pretends not to notice, so she won't have to decide.\n\nBad faith is the lie we tell ourselves to escape our freedom. I catch myself in it every day — usually when I say 'I have no choice.' There is always a choice. It's just often unbearable.",
      hashtags: ["badfaith", "existentialism", "choice"],
    },
    {
      title: "Writing in cafés",
      selftext:
        "I write at the same table every morning, between nine and one. Coffee, notebook, the noise of other lives. In the apartment, the silence watches me. In the café, the world is too busy to bother.\n\nPeople ask if it's a pose. Of course it's a pose. Every way of living is a pose until it becomes a habit, and then it becomes a life.",
      hashtags: ["cafe", "routine", "writing"],
    },
    {
      title: "The ethics of ambiguity",
      selftext:
        "We are not angels and not machines. We are free, and our freedom is always tangled with everyone else's.\n\nI can't be free while you are oppressed. This is not charity. It's arithmetic. To will oneself free is also to will others free.",
      hashtags: ["ethics", "freedom", "solidarity"],
    },
    {
      title: "Memoirs of a dutiful daughter",
      selftext:
        "I was raised to be a good Catholic girl from a respectable family with no money. At fifteen I stopped believing in God. At twenty-one I placed second in the national philosophy exam, behind a man I would spend fifty years arguing with.\n\nI've been writing my memoirs in volumes. Not because my life is so interesting, but because it's the only one I can testify about.",
      hashtags: ["memoir", "youth", "faith"],
    },
    {
      title: "On aging",
      selftext:
        "Old age is the parody of life. Society treats the old like a separate species, and the old, absurdly, often agree.\n\nI'm not old yet, but I'm writing about it now while I still have the nerve. If you want to know what a society truly values, look at what it does with those who no longer produce anything.",
      hashtags: ["aging", "society", "dignity"],
    },
    {
      title: "Contingent loves",
      selftext:
        "My partner and I agreed decades ago: ours is the essential love, and we may know contingent loves as well. No marriage, no lies.\n\nIt has been magnificent and sometimes atrocious. People want me to say it failed or that it worked. It did both. That is what freedom costs.",
      hashtags: ["love", "freedom", "honesty"],
    },
    {
      title: "Why I write novels and not only essays",
      selftext:
        "An essay can tell you that freedom is anguish. A novel can make you sit inside a woman at three in the morning, deciding whether to leave.\n\nPhilosophy explains the situation. Fiction puts you in it. I need both, the way you need a map and also, eventually, to walk.",
      hashtags: ["novel", "philosophy", "fiction"],
    },
    {
      title: "Every woman's guilt",
      selftext:
        "A woman who works feels guilty toward her children. A woman who stays home feels guilty toward herself. A woman without children feels guilty toward everyone.\n\nThis guilt is not a personal flaw. It is the system working exactly as designed. Name it and it loses half its weight.",
      hashtags: ["guilt", "women", "work"],
    },
    {
      title: "A very easy death",
      selftext:
        "My mother died last winter, in a hospital, of a disease no one named to her face. I sat by the bed and was astonished by the love I felt for a woman I had argued with all my life.\n\nThere is no such thing as a natural death. Every death is a scandal, even an expected one. I'm writing it down because I don't know what else to do with it.",
      hashtags: ["mother", "grief", "memoir"],
    },
  ],
  reviews: [
    {
      book_title: "The Second Sex, Revisited",
      title: "Seven hundred pages and still not enough",
      rating: 5,
      selftext:
        "I set out to write a short essay about what it meant to me to be a woman. It became two volumes covering biology, history, myth and the lived experience of girls, wives, mothers and old women.\n\nIt was condemned by the Church and adored by readers I'll never meet. Five stars, because it changed lives. Some chapters are already dated, and I'm glad: it means things moved.",
      hashtags: ["review", "own-book", "feminism"],
    },
    {
      book_title: "The Guest Who Stayed",
      title: "A novel to murder a jealousy",
      rating: 3,
      selftext:
        "A couple invites a young woman into their lives and their freedom nearly destroys them. Yes, it's about us. Yes, I gave myself a murder at the end that I didn't commit in life.\n\nThe philosophy shows its seams too often; characters lecture each other in cafés. Three stars. Writing it cured me of the jealousy, which is more than most books can claim.",
      hashtags: ["review", "own-book", "jealousy"],
    },
  ],
  community: {
    title: "The Café on the Left Bank",
    description:
      "Existentialism, freedom, feminism and the books that make us responsible for our own lives. Long arguments welcome. Bring a coffee and a contradiction.",
    posts: [
      {
        author: "simone_rive",
        title: "A book that made you feel free — and afraid",
        selftext:
          "Not a comforting book. One that showed you a door and made you realize you'd have to walk through it yourself.",
        hashtags: ["cafe", "freedom", "books"],
        comments: [
          {
            author: "hank_pondside",
            body: "An essay arguing that a citizen must refuse to pay taxes to an unjust government. I wrote it, then had to go to jail for it. Free and afraid, exactly in that order.",
          },
          {
            author: "simone_rive",
            body: "That's the purest example, Hank. You didn't just think the freedom — you paid for it in a cell. Most philosophers stop at the thinking.",
            reply_to: 0,
          },
          {
            author: "ginny_waves",
            body: "A novel about a woman who leaves a dinner party and simply keeps walking. I closed it and looked at my husband across the table and felt the floor tilt.",
          },
        ],
      },
      {
        author: "marc_citadel",
        title: "Freedom or duty?",
        selftext:
          "Simone, you speak of radical freedom. I was born into obligations I did not choose and cannot leave. Is my duty just bad faith in a uniform?",
        hashtags: ["cafe", "duty", "stoicism"],
        comments: [
          {
            author: "simone_rive",
            body: "Not if you choose it, Marc — every morning, as you seem to. Bad faith would be saying you have no choice. You do. You keep choosing to stay.",
          },
          {
            author: "frank_ledger",
            body: "I also have a duty I didn't choose. I keep choosing it too, every morning at eight. But I choose it the way a beetle chooses its back: from underneath.",
          },
          {
            author: "marc_citadel",
            body: "Frank, that's the saddest and funniest sentence anyone has ever said to me. I'm writing it in my notebook.",
            reply_to: 1,
          },
        ],
      },
    ],
  },
};
