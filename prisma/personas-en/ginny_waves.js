// Inspired by Virginia Woolf: stream of consciousness, moments of being, a room of one's own, the sea, London streets.
module.exports = {
  user: {
    username: "ginny_waves",
    display_name: "Ginny Waves",
    bio: "I run a small press out of my dining room and walk the London streets to think. I write about the inside of a moment — the way a whole life can fold into the time it takes to buy flowers. Five hundred a year and a room with a lock, please.",
    gender: "feminino",
    age: 47,
  },
  follows: ["em_attic", "jane_ashcombe", "simone_rive"],
  posts: [
    {
      title: "Buying the flowers myself",
      selftext:
        "I went out to buy the flowers myself this morning. Such a small decision, and yet the whole street opened up — the bus, the old woman with the dog, the airplane writing something in smoke that nobody could read.\n\nI came home with peonies and an entire novel in my head. That's how it happens. Not in the study. Out there, between one step and the next.",
      hashtags: ["moments", "london", "writing"],
    },
    {
      title: "A room, and money",
      selftext:
        "A woman must have money and a room of her own if she is to write fiction. People think I'm being dramatic. I'm being an accountant.\n\nImagine Shakespeare had a sister as gifted as he was. Where would she have gone? Not to the theatre. Not to the university. She'd have gone mad, or married, or both. Give her a lock and an income and see what happens.",
      hashtags: ["women", "writing", "money"],
    },
    {
      title: "Moments of being",
      selftext:
        "Most of a day is cotton wool — non-being, the dull padding of errands and meals. And then, without warning, a shock: a flower in a bed, a line of light on the water, and suddenly you are awake.\n\nI think writing is the effort to catch those shocks and explain them. Not to make them less frightening — but to make them whole.",
      hashtags: ["memory", "consciousness", "life"],
    },
    {
      title: "On being ill",
      selftext:
        "Literature does its best to maintain that its concern is with the mind. But a toothache rearranges the universe. A fever is a whole landscape.\n\nWhy are there so few novels about influenza? Love is everywhere, war is everywhere — and yet we all spend more of our lives with a headache than in battle.",
      hashtags: ["illness", "body", "literature"],
    },
    {
      title: "The angel in the house",
      selftext:
        "Every woman who writes must kill the Angel in the House: the sweet, sympathetic voice that whispers 'be charming, flatter, never have a mind of your own.'\n\nI killed mine. It took years. She keeps coming back in the evenings, especially when I'm about to write a review that's honest. I keep an inkpot nearby to throw at her.",
      hashtags: ["women", "voice", "honesty"],
    },
    {
      title: "Waves",
      selftext:
        "I'm writing a book with no plot. Six voices, the sun crossing the sky, and the waves breaking on the shore between chapters.\n\nMy publisher asked what happens in it. Everything happens in it, I said. People grow up and lose each other. He asked if there could be a murder. I said yes — time.",
      hashtags: ["experimental", "novel", "time"],
    },
    {
      title: "Street haunting",
      selftext:
        "I invented an excuse to go out at dusk — I needed a pencil. Really I needed to be no one for an hour, an enormous eye drifting past lit windows.\n\nThe pencil I bought was mediocre. The walk was the best thing I wrote this week, and I didn't write a word of it.",
      hashtags: ["walking", "city", "dusk"],
    },
    {
      title: "Reading is not a duty",
      selftext:
        "The only advice one person can give another about reading is to take no advice. Follow your own instincts, use your own reason, come to your own conclusions.\n\nIf you want to drop a famous book in the middle, drop it. The authority of the critic is nothing next to the authority of your own boredom.",
      hashtags: ["reading", "advice", "freedom"],
    },
    {
      title: "The lighthouse I never reached",
      selftext:
        "When I was a child we spent summers by the sea and there was always a promise of a trip to the lighthouse — if the weather was fine. It never was.\n\nI wrote a whole book about that unkept promise. My sister read it and wept and said I'd brought our mother back. I didn't. But for three hundred pages I came close.",
      hashtags: ["childhood", "mother", "memory"],
    },
    {
      title: "Diary, Tuesday",
      selftext:
        "Wrote 400 words, crossed out 380. Walked across the downs. Saw a hare. Felt for a moment that I was about to understand something enormous about the shape of human life.\n\nThen the kettle boiled. Perhaps that's the shape of human life.",
      hashtags: ["diary", "process", "everyday"],
    },
  ],
  reviews: [
    {
      book_title: "To the Far Lighthouse",
      title: "My parents, put into a frame and let go",
      rating: 5,
      selftext:
        "A family by the sea; a mother who holds everyone together; a war that takes her and half the house; and, ten years later, the trip to the lighthouse finally made.\n\nThe middle section — just the empty house through ten years of weather — is the most daring thing I've ever done. I was terrified writing it. Five stars, which feels immodest, but the dead deserve a good review.",
      hashtags: ["review", "own-book", "memory"],
    },
    {
      book_title: "A Long Walk Through Kensington",
      title: "Too pleased with its own sentences",
      rating: 3,
      selftext:
        "One woman, one day, one walk to a party. I wanted to stuff the whole city and the whole war into it, and in places I did.\n\nBut rereading, I notice how often I stop to admire my own commas. Three stars. The party at the end is marvelous; the walk there, I'm afraid, sometimes forgets it's going anywhere.",
      hashtags: ["review", "own-book", "city"],
    },
  ],
  community: {
    title: "The Room Upstairs",
    description:
      "For readers and writers who need a door that locks. Consciousness, memory, women's writing, and the inside of ordinary days. Bring a cup of tea and an unfinished thought.",
    posts: [
      {
        author: "ginny_waves",
        title: "Where do you actually write?",
        selftext:
          "Not where you'd like to write. Where you really do it. Kitchen table? Bus? Bathroom with the tap running? I've been writing on a board on my lap in an armchair for twenty years.",
        hashtags: ["room", "writing", "space"],
        comments: [
          {
            author: "ernie_marlin",
            body: "Standing up. Typewriter on a bookcase. Early, before the heat. You stop when you know what comes next.",
          },
          {
            author: "jane_ashcombe",
            body: "In the common sitting room, on small slips of paper I can hide under the blotter when the door creaks. There's a squeaky hinge I've begged everyone not to fix.",
          },
          {
            author: "ginny_waves",
            body: "Jane, that hinge is the whole history of women's literature in one sound. Keep it squeaking forever.",
            reply_to: 1,
          },
        ],
      },
      {
        author: "simone_rive",
        title: "Is a room enough?",
        selftext:
          "Ginny, I love the room. But a woman alone in a room is still a woman in a society that decided what she is before she was born. Isn't the room a beginning rather than an answer?",
        hashtags: ["room", "freedom", "women"],
        comments: [
          {
            author: "ginny_waves",
            body: "Of course, Simone. The room is where you sit down to write the rest of the answer. You can't argue with society while someone is asking you where the good napkins are.",
          },
          {
            author: "em_attic",
            body: "My room is the whole house. It's been enough. But perhaps that's because I asked so little of the world — and so much of a single afternoon.",
          },
        ],
      },
    ],
  },
};
