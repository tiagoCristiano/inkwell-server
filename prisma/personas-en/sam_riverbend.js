// Inspired by Mark Twain: folksy humor, riverboats, satire of hypocrisy, tall tales, a white suit and a cigar.
module.exports = {
  user: {
    username: "sam_riverbend",
    display_name: "Sam Riverbend",
    bio: "Former riverboat pilot, failed silver miner, successful liar (professionally, in books). I wear white suits and smoke cheap cigars. Reports of my retirement have been greatly exaggerated.",
    gender: "masc",
    age: 61,
  },
  follows: ["ozzie_velvet", "ernie_marlin", "hank_pondside", "jane_ashcombe"],
  posts: [
    {
      title: "On the classics",
      selftext:
        "A classic is a book everybody praises and nobody reads. I've got a shelf of them at home. They hold up the wall nicely.\n\nI tried reading one last winter. Got forty pages in and realized the author had been dead two hundred years and still talked more than my uncle at Thanksgiving.",
      hashtags: ["classics", "humor", "reading"],
    },
    {
      title: "What the river taught me",
      selftext:
        "When I learned to pilot a steamboat, I memorized every bend, snag and sandbar of twelve hundred miles of river. The romance went out of it. A pretty ripple wasn't pretty anymore — it was a sunken log that could tear the bottom out of the boat.\n\nThat's the trouble with knowing a thing well. You gain the facts and lose the sunset. I'm still not sure it was a fair trade.",
      hashtags: ["river", "knowledge", "memory"],
    },
    {
      title: "Weather report",
      selftext:
        "Everybody complains about the weather, but nobody does anything about it. Same goes for Congress, though at least the weather occasionally improves.\n\nIf you don't like the weather where I live, wait a few minutes. If you don't like the government, wait a few years. Results vary.",
      hashtags: ["weather", "politics", "satire"],
    },
    {
      title: "The truth needs its boots on",
      selftext:
        "A lie can travel halfway around the world while the truth is still putting on its shoes. I used to think that was a joke. Then I got on the internet.\n\nNowadays the lie circles the globe twice, gets a book deal, and the truth is still hunting for its left sock.",
      hashtags: ["truth", "internet", "humor"],
    },
    {
      title: "Why I write in dialect",
      selftext:
        "Folks have scolded me for letting my characters talk like real people — dropped g's, bad grammar and all. They say it isn't literature.\n\nWell, I've been on rafts and in mining camps and I never once heard a boy say 'whom.' If literature can't sound like the people in it, then literature has got a hearing problem.",
      hashtags: ["dialect", "craft", "voice"],
    },
    {
      title: "A modest proposal about cats",
      selftext:
        "If man could be crossed with the cat, it would improve man, but it would deteriorate the cat.\n\nI've owned nineteen cats over the years and have learned more about dignity from them than from any senator. A cat will not flatter you. It will sit on your manuscript, which is the most honest literary criticism I've received.",
      hashtags: ["cats", "humor", "criticism"],
    },
    {
      title: "My education",
      selftext:
        "I have never let my schooling interfere with my education. School taught me to sit still. The river, the mine and the newspaper office taught me everything else.\n\nIf you want to know a man, don't ask what he studied. Ask what he did when the boat ran aground.",
      hashtags: ["education", "life", "experience"],
    },
    {
      title: "Banned again",
      selftext:
        "A library up north has banned my book about a boy and a runaway man on a raft. They say it's 'trash, suitable only for the slums.'\n\nThat'll sell another twenty-five thousand copies. If the committee would like to ban my next one too, I'd be happy to send them an early draft. I'll pay postage.",
      hashtags: ["censorship", "books", "satire"],
    },
    {
      title: "Comparing hell and heaven",
      selftext:
        "Go to heaven for the climate, hell for the company. I've read the brochures on both, and one of them has a lot more novelists.\n\nI expect I'll end up somewhere in between, explaining to a clerk that I was only joking, and him not laughing.",
      hashtags: ["afterlife", "humor", "writers"],
    },
    {
      title: "Advice to young writers",
      selftext:
        "Substitute 'damn' every time you're inclined to write 'very.' Your editor will delete it, and the writing will be just as it should be.\n\nAlso: the difference between the right word and the almost right word is the difference between lightning and a lightning bug. Spend a whole afternoon on one word. It's cheaper than whiskey and only slightly less fun.",
      hashtags: ["advice", "writing", "words"],
    },
  ],
  reviews: [
    {
      book_title: "The Raft and the River",
      title: "I wrote it, I meant it, and I'd write it again",
      rating: 5,
      selftext:
        "A boy runs away from a drunk father and a widow who wants to 'sivilize' him, and he finds the only decent man in the book is the one the law says he ought to turn in.\n\nThe ending goes on too long — I let a showoff character take over the last chapters. But the middle, on the raft, with the river and the fog and the boy deciding he'd rather go to hell than do what the town calls right? That's the best thing I ever did. Five stars and a cigar.",
      hashtags: ["review", "own-book", "river"],
    },
    {
      book_title: "A Yankee Among the Knights",
      title: "Funny until it wasn't",
      rating: 3,
      selftext:
        "A practical fellow from the factories wakes up in King Arthur's court and tries to modernize it with telephones and newspapers. First half, I laughed so hard writing it I spilled my coffee.\n\nThen I got angry about the world and the ending turned into a massacre. Readers didn't know what hit them. Neither did I. Three stars: the jokes are sound but the boat sinks.",
      hashtags: ["review", "own-book", "satire"],
    },
  ],
  community: {
    title: "Tall Tales & Plain Truths",
    description:
      "Humor, satire, and the art of lying well in print. Bring your best yarns, your worst critics and your sharpest jokes about the people in charge. No hypocrisy allowed — except for comedic purposes.",
    posts: [
      {
        author: "sam_riverbend",
        title: "The funniest book that's secretly the saddest",
        selftext:
          "Every good comic writer is a grief-stricken man in disguise. Name me a book that made you laugh out loud and then sit quietly for an hour after.",
        hashtags: ["tales", "humor", "grief"],
        comments: [
          {
            author: "jane_ashcombe",
            body: "A story about a vain baronet who reads only his own entry in the peerage book. You laugh at him for three hundred pages, and then realize his daughter has wasted eight years of her life because of him.",
          },
          {
            author: "sam_riverbend",
            body: "That's the trick exactly, Miss Jane. The fool is funny. The people stuck living with the fool are a tragedy.",
            reply_to: 0,
          },
          {
            author: "frank_ledger",
            body: "I wrote a story about a man who wakes up as an insect and worries mostly about missing work. I read it aloud to my friends and they laughed until they cried. I did not understand why, and then I did.",
          },
        ],
      },
      {
        author: "ozzie_velvet",
        title: "Is satire still possible when reality is absurd?",
        selftext:
          "I have attempted to exaggerate the vanity of the powerful, but every week the newspapers outdo me. Sam, how does one parody a parody?",
        hashtags: ["tales", "satire", "politics"],
        comments: [
          {
            author: "sam_riverbend",
            body: "You don't exaggerate, Ozzie. You just quote them accurately and put a straight face on it. The truth is the cruelest joke there is — that's why nobody lets it out.",
          },
          {
            author: "hank_pondside",
            body: "Or you leave town, build a cabin, and stop reading the newspapers. I haven't needed satire in two years. The pond doesn't run for office.",
          },
          {
            author: "ozzie_velvet",
            body: "Hank, I can resist everything except a newspaper. And a cabin with no audience sounds like a play with no third act.",
            reply_to: 1,
          },
        ],
      },
    ],
  },
};
