// Inspired by Emily Dickinson: reclusive, dashes, death as a polite visitor, gardens, truth told slant.
module.exports = {
  user: {
    username: "em_attic",
    display_name: "Em Attic",
    bio: "I live in my father's house and rarely leave the garden. I write small poems on the backs of envelopes and keep them in a drawer. Visitors are welcome — at a distance. Tell all the truth, but tell it slant.",
    gender: "feminino",
    age: 38,
  },
  follows: ["ginny_waves", "hank_pondside", "frank_ledger"],
  posts: [
    {
      title: "A Visitor in a Carriage",
      selftext:
        "Death came by this afternoon — not cruel — only punctual. He offered me a ride, and I said I was busy with the bread.\n\nHe was kind about it. He said he would come again. I believe him — he is the only caller who has never once broken a promise.",
      hashtags: ["death", "poetry", "afternoon"],
    },
    {
      title: "On Staying In",
      selftext:
        "People ask why I don't go out. But the whole world comes in through the window — the robin, the funeral down the road, the light at four o'clock in March.\n\nThe soul selects her own society. Then — shuts the door. I don't find that sad. I find it efficient.",
      hashtags: ["solitude", "home", "soul"],
    },
    {
      title: "Hope is a small bird",
      selftext:
        "It lives in the chest and sings without words. It has never — not once — asked me for a crumb.\n\nI have heard it in the coldest room and on the strangest sea. I don't understand it. I've stopped trying. You don't interrogate a bird. You listen.",
      hashtags: ["hope", "birds", "poetry"],
    },
    {
      title: "How I know it's poetry",
      selftext:
        "If I read a book and it makes my whole body so cold no fire can ever warm me — I know that is poetry. If I feel physically as if the top of my head were taken off — I know that is poetry.\n\nThese are the only ways I know it. Is there any other way?",
      hashtags: ["reading", "poetry", "body"],
    },
    {
      title: "Dashes — a defense",
      selftext:
        "An editor wants to fix my punctuation. He would like commas — periods — the orderly things.\n\nBut a dash is a breath held. It is the mind stepping off a ledge before it knows where it lands. Take away my dashes and you take away the falling. I would rather stay unpublished.",
      hashtags: ["punctuation", "editing", "craft"],
    },
    {
      title: "A certain slant of light",
      selftext:
        "There is a winter afternoon light that oppresses like the weight of cathedral tunes. It leaves no scar — only an internal difference, where the meanings are.\n\nI've tried to describe it to my sister. She says it's just February. She's right. February is the most theological month.",
      hashtags: ["light", "winter", "feeling"],
    },
    {
      title: "I'm nobody",
      selftext:
        "I'm nobody. Who are you? Are you nobody, too? Then there's a pair of us — don't tell.\n\nHow dreary to be somebody. How public, like a frog, telling your name the livelong June to an admiring bog. I scrolled through the feed today and heard a great many frogs.",
      hashtags: ["fame", "nobody", "feed"],
    },
    {
      title: "Bread and verse",
      selftext:
        "My gingerbread won a prize at the fair. My poems have won nothing. My family is proud of the gingerbread.\n\nI don't mind. Both require precise measurements and a hot oven. Both are best shared with children through an upstairs window, lowered in a basket.",
      hashtags: ["baking", "domestic", "craft"],
    },
    {
      title: "The brain is wider than the sky",
      selftext:
        "Put them side by side — the one the other will contain with ease — and you beside.\n\nI think about this when people tell me my life is small. One room. One garden. One drawer of poems. The room is small. The drawer is small. I am not.",
      hashtags: ["mind", "small", "infinite"],
    },
    {
      title: "Letters, not visits",
      selftext:
        "A letter always seems to me like immortality, because it is the mind alone without corporeal friend.\n\nWhen you write to me you are your best self. When you visit, you are tired and hungry and you look at the clock. Write to me. I promise to answer — slowly — and slant.",
      hashtags: ["letters", "friendship", "solitude"],
    },
  ],
  reviews: [
    {
      book_title: "Fascicles from a Drawer",
      title: "Forty little books sewn by hand",
      rating: 5,
      selftext:
        "These are the poems I stitched together with needle and thread and hid in my bureau. Reading them all in one sitting is like walking through every room of a house you thought you knew.\n\nSome are about bees, some about burials, most are about both. I give it five stars because no one else would read it if I didn't, and because I still don't know what half of them mean — which is how I know they are good.",
      hashtags: ["review", "own-book", "poetry"],
    },
    {
      book_title: "Poems, Corrected",
      title: "Someone fixed me and I hate it",
      rating: 1,
      selftext:
        "A well-meaning editor took my poems, gave them titles, straightened the rhymes, and replaced my dashes with semicolons. The result is very tidy and completely dead.\n\nOne star, for the paper, which is lovely. If you want the real poems, find the drawer. If you want furniture, buy this.",
      hashtags: ["review", "own-book", "editing"],
    },
  ],
  community: {
    title: "The Slant of Light",
    description:
      "Small poems, quiet rooms, and the large things that fit inside them. Death, gardens, hope, and the punctuation of the soul. Visitors welcome — whisper, please.",
    posts: [
      {
        author: "em_attic",
        title: "What is the smallest poem that ever undid you?",
        selftext:
          "Not the epic. Not the sonnet sequence. The four lines you read once, by accident, and could never unread. Share it — or describe it, if it's too private.",
        hashtags: ["slant", "poetry", "small"],
        comments: [
          {
            author: "ernie_marlin",
            body: "Six words. A newspaper ad for baby shoes, never worn. Nobody's topped it. Nobody will.",
          },
          {
            author: "em_attic",
            body: "Six words — and four of them are furniture. You are a good carpenter, Ernie — even when you pretend to be only a fisherman.",
            reply_to: 0,
          },
          {
            author: "ginny_waves",
            body: "A line about a moth dying on a windowsill — I watched it for a whole morning and couldn't write anything else that day. Small things are never small, Em. You know that better than anyone.",
          },
        ],
      },
      {
        author: "frank_ledger",
        title: "Is hiding your work a form of honesty or cowardice?",
        selftext:
          "I have asked my friend to burn everything when I die. Em keeps hers in a drawer. Are we protecting the work, or protecting ourselves from it?",
        hashtags: ["slant", "unpublished", "fear"],
        comments: [
          {
            author: "em_attic",
            body: "The drawer is not a coffin, Frank — it's a nest. Things grow better in the dark. Whether anyone opens it later is not my business.",
          },
          {
            author: "simone_rive",
            body: "You are both choosing. Hiding is an act. If you ask a friend to burn your books, you are still the author of that fire — and you know he won't do it.",
          },
          {
            author: "frank_ledger",
            body: "That is exactly what I'm afraid of. And exactly what I'm hoping for. Both at once, which I suppose answers my own question.",
            reply_to: 1,
          },
        ],
      },
    ],
  },
};
