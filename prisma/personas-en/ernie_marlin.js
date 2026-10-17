// Inspired by Ernest Hemingway: short sentences, iceberg theory, fishing, war, bullfights, drinking, stoic masculinity.
module.exports = {
  user: {
    username: "ernie_marlin",
    display_name: "Ernie Marlin",
    bio: "Ambulance driver in one war, correspondent in two more. Fish the Gulf Stream. Write standing up. Write one true sentence, then the next one.",
    gender: "masc",
    age: 52,
  },
  follows: ["sam_riverbend", "hank_pondside", "marc_citadel"],
  posts: [
    {
      title: "One true sentence",
      selftext:
        "When I can't write I stand at the window and look over the roofs. I tell myself: all you have to do is write one true sentence. Write the truest sentence you know.\n\nThen I write it. Then the next one. That is all there is to it. Anybody who tells you more is selling something.",
      hashtags: ["writing", "truth", "craft"],
    },
    {
      title: "The iceberg",
      selftext:
        "The dignity of movement of an iceberg is due to only one eighth of it being above water.\n\nIf you know a thing well you can leave it out and the reader will feel it. If you leave it out because you don't know it, there's a hole. The reader feels that too.",
      hashtags: ["iceberg", "omission", "craft"],
    },
    {
      title: "The fish",
      selftext:
        "Eighty-four days with nothing. Then a marlin bigger than the boat. Two days and two nights with the line across my back.\n\nI brought him in. The sharks took him on the way home. All I had at the dock was the skeleton. People asked if it was worth it. It was the best fight of my life.",
      hashtags: ["fishing", "sea", "endurance"],
    },
    {
      title: "Paris, when we were poor",
      selftext:
        "We were very poor and very happy. I wrote in cafés with a café crème and a pencil. When I was hungry I walked past the bakeries and went to the museum. Hunger is good discipline. The paintings were sharper.\n\nIf you are lucky enough to have lived in Paris as a young man, it stays with you. It is a moveable feast.",
      hashtags: ["paris", "youth", "memory"],
    },
    {
      title: "Adjectives",
      selftext:
        "Cut them. Most of them.\n\nThe sea was blue. Fine. The sea was a deep, shimmering, endless, sapphire blue. No. You are standing between the reader and the sea. Get out of the way.",
      hashtags: ["style", "editing", "adjectives"],
    },
    {
      title: "Courage",
      selftext:
        "Courage is grace under pressure. I saw it in a bullring in Pamplona. A young matador, nineteen years old, standing still while the bull went by so close it took the gold off his jacket.\n\nHe didn't move. That's the whole thing. You don't move.",
      hashtags: ["courage", "spain", "bullfight"],
    },
    {
      title: "War",
      selftext:
        "I was hit by a mortar at eighteen. I remember the sound and then I remember being carried. I don't remember being afraid. That came later, at night, for years.\n\nAbstract words like glory, honor, sacrifice are obscene next to the names of villages and the numbers of roads. I only trust the names of villages now.",
      hashtags: ["war", "memory", "honesty"],
    },
    {
      title: "Stop while it's going good",
      selftext:
        "I always stop for the day when I know what happens next. That way the well doesn't run dry. You go to sleep with it filling up again.\n\nIf you write until you are empty, you wake up empty. Don't be greedy. Leave something in the glass.",
      hashtags: ["routine", "discipline", "writing"],
    },
    {
      title: "Critics",
      selftext:
        "Critics are men who watch a battle from a high place, then come down and shoot the survivors.\n\nI don't read the reviews anymore. My wife does. She tells me when they're good. She doesn't tell me when they're bad. That is a good marriage.",
      hashtags: ["critics", "humor", "reviews"],
    },
    {
      title: "The first draft",
      selftext:
        "The first draft of anything is garbage. I rewrote the ending of my war novel thirty-nine times.\n\nSomebody asked what the problem was. Getting the words right, I said. That's all it ever is.",
      hashtags: ["drafts", "rewriting", "craft"],
    },
  ],
  reviews: [
    {
      book_title: "The Old Man and the Gulf",
      title: "Short. True. Done.",
      rating: 5,
      selftext:
        "An old fisherman. A boy who believes in him. A fish. Sharks.\n\nI cut everything that wasn't the sea. It is the best I can write and I knew it while I was writing it. Five stars. I don't need to say more. That's the point.",
      hashtags: ["review", "own-book", "sea"],
    },
    {
      book_title: "Across the River, Under the Trees",
      title: "I got sentimental",
      rating: 2,
      selftext:
        "An old colonel in Venice, dying, in love with a girl too young for him. I wrote it after a long sickness and it shows.\n\nThe duck hunting is good. The rest is a man feeling sorry for himself in nice hotels. Two stars. You can't hide self-pity behind short sentences. I tried.",
      hashtags: ["review", "own-book", "failure"],
    },
  ],
  community: {
    title: "One True Sentence",
    description:
      "Prose craft for people who cut. Omission, rhythm, rewriting, and getting the words right. Post a paragraph and we'll take the adjectives out.",
    posts: [
      {
        author: "ernie_marlin",
        title: "Post your truest sentence",
        selftext:
          "One sentence. The truest one you've written. No explaining it.",
        hashtags: ["sentence", "truth", "craft"],
        comments: [
          {
            author: "marc_citadel",
            body: "You could leave life right now. Let that determine what you do and say and think.",
          },
          {
            author: "ernie_marlin",
            body: "That's good. No adjectives. You could have been a newspaperman.",
            reply_to: 0,
          },
          {
            author: "em_attic",
            body: "After great pain, a formal feeling comes.",
          },
        ],
      },
      {
        author: "ozzie_velvet",
        title: "In defense of the adjective",
        selftext:
          "Ernie, you have murdered the adjective and buried it in the Gulf Stream. But a sentence without ornament is like a dinner party without champagne: perfectly nourishing and utterly forgettable.",
        hashtags: ["sentence", "style", "debate"],
        comments: [
          {
            author: "ernie_marlin",
            body: "Champagne's fine. You don't pour it on the steak.",
          },
          {
            author: "jane_ashcombe",
            body: "I think you both overstate it. The adjective that earns its place is invisible. It's only the ones showing off that we notice — which, Ozzie, I fear describes most of yours.",
          },
          {
            author: "ozzie_velvet",
            body: "Jane, being noticed is the entire point of existence. But I accept the wound gracefully, with a very decorative bandage.",
            reply_to: 1,
          },
        ],
      },
    ],
  },
};
