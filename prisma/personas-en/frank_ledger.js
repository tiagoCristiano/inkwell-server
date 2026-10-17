// Inspired by Franz Kafka: insurance clerk, absurd bureaucracy, guilt, the father, metamorphosis, unfinished novels, dark humor.
module.exports = {
  user: {
    username: "frank_ledger",
    display_name: "Frank Ledger",
    bio: "Claims officer at a workers' accident insurance institute. I write at night, which my father considers a hobby and my employer considers fatigue. Most of my books are unfinished. I'm not sure this bio is finished either.",
    gender: "masc",
    age: 40,
  },
  follows: ["em_attic", "simone_rive", "marc_citadel"],
  posts: [
    {
      title: "One morning",
      selftext:
        "As I awoke one morning from uneasy dreams, I found myself unable to remember my login.\n\nI lay there for some time contemplating the ceiling. My first thought was not for my own condition but that I would be late for the office. The second was that the IT department would surely need a form. The third was that the form would need a login.",
      hashtags: ["morning", "bureaucracy", "absurd"],
    },
    {
      title: "Before the law",
      selftext:
        "A man waits his whole life at a door. The doorkeeper says he cannot enter yet. Years pass. As he dies, he asks why no one else ever came. The doorkeeper says: this door was made only for you, and now I'm going to close it.\n\nI tell this story at parties. No one invites me to parties anymore.",
      hashtags: ["law", "parable", "waiting"],
    },
    {
      title: "A book must be an axe",
      selftext:
        "I think we ought to read only books that bite and sting us. If the book we are reading doesn't shake us awake like a blow on the skull, why bother reading it?\n\nA book must be the axe for the frozen sea within us. I have read three books like that. I am still trying to write one.",
      hashtags: ["reading", "axe", "literature"],
    },
    {
      title: "Letter to my father",
      selftext:
        "I wrote my father a hundred pages explaining why I am afraid of him. I gave them to my mother to deliver. She gave them back.\n\nSo the letter exists only for me, and for you now. My father has still not read it. This, I think, is the most realistic thing I've ever written.",
      hashtags: ["father", "fear", "family"],
    },
    {
      title: "The office",
      selftext:
        "My job is to determine whether a worker's lost finger was the fault of the machine or the man. I am very good at it. I hate how good I am at it.\n\nEvery evening I go home and write about men trapped in systems they cannot understand. My colleagues read them and say, 'how imaginative.' They are not imaginative. They are the minutes of the meeting.",
      hashtags: ["work", "insurance", "systems"],
    },
    {
      title: "On being accused",
      selftext:
        "Someone must have slandered me, because one morning, without having done anything wrong, I received an email titled 'Quick question.'\n\nThere is no quick question. There never has been. I have now been answering it for three weeks.",
      hashtags: ["anxiety", "email", "guilt"],
    },
    {
      title: "Engagements",
      selftext:
        "I have been engaged three times, twice to the same woman. Each time I wrote her hundreds of letters explaining why I would make a terrible husband.\n\nShe agreed with the letters, eventually. I was relieved. I was devastated. I wrote another letter about it.",
      hashtags: ["love", "letters", "indecision"],
    },
    {
      title: "Hope",
      selftext:
        "My friend asked if there is hope. I said: plenty of hope, an infinite amount of hope — just not for us.\n\nHe laughed. I laughed too. It's important to remember this is funny. When I read my stories aloud I can barely get through them for laughing. People think I'm joking about the laughing.",
      hashtags: ["hope", "humor", "despair"],
    },
    {
      title: "The burrow",
      selftext:
        "I am writing a story narrated by a creature who has built a perfect underground burrow and spends all its time worrying that someone will break in.\n\nIt hears a faint whistling. It cannot locate it. It digs new tunnels. It cannot finish the story, and neither can I. That's how you know it's autobiographical.",
      hashtags: ["anxiety", "unfinished", "story"],
    },
    {
      title: "Instructions to my executor",
      selftext:
        "Everything I leave behind — diaries, manuscripts, letters — is to be burned unread. I've told my best friend this many times.\n\nHe always nods and says nothing. I chose him for this task very carefully. I hope he is as unreliable as I think.",
      hashtags: ["legacy", "friendship", "fire"],
    },
  ],
  reviews: [
    {
      book_title: "The Trial of Josef B.",
      title: "Arrested, never charged, never finished",
      rating: 2,
      selftext:
        "A bank clerk is arrested on his thirtieth birthday for a crime nobody will name. He spends a year in attics full of court offices, hunting for an explanation.\n\nI never finished the middle chapters and I don't know in what order they go. The ending, at least, I wrote first, which tells you something about me. Two stars. It is not a book; it is a symptom with a plot.",
      hashtags: ["review", "own-book", "law"],
    },
    {
      book_title: "The Transformation",
      title: "The only one I didn't abandon",
      rating: 4,
      selftext:
        "A traveling salesman wakes up as an enormous insect, and the family's main concern is the rent.\n\nI wrote it in three weeks and finished it, which never happens. The ending is weak — I was interrupted by a business trip. Four stars. Please don't put an insect on the cover. Anything but the insect.",
      hashtags: ["review", "own-book", "family"],
    },
  ],
  community: {
    title: "Department of Unfinished Things",
    description:
      "For writers with drawers full of half-books and readers who love fragments. Bureaucracy, anxiety, absurd humor, and stories that stop exactly where they should — or slightly before. Please file your post in triplicate.",
    posts: [
      {
        author: "frank_ledger",
        title: "Show us your unfinished manuscript",
        selftext:
          "Title, how far you got, and why you stopped. No judgement. Well — some judgement, but only self-directed.",
        hashtags: ["unfinished", "drafts", "confession"],
        comments: [
          {
            author: "ginny_waves",
            body: "A novel about a woman who lives for three hundred years and changes sex halfway through. I finished it — but I keep feeling it hasn't finished me. Does that count?",
          },
          {
            author: "frank_ledger",
            body: "It counts double, Ginny. A book that isn't done with you is the only kind worth leaving open.",
            reply_to: 0,
          },
          {
            author: "sam_riverbend",
            body: "A sequel about a boy who goes west and fights Indians. Got to chapter nine and realized I was just repeating my old jokes louder. Put it in a trunk. The trunk is the best editor I ever had.",
          },
        ],
      },
      {
        author: "em_attic",
        title: "Fragments are not failures",
        selftext:
          "Frank, you call yours unfinished. I call mine small. Perhaps a fragment is a whole thing that refused to lie about being bigger.",
        hashtags: ["unfinished", "fragments", "poetry"],
        comments: [
          {
            author: "frank_ledger",
            body: "Em, I wish I believed that. My fragments are like rooms in a house with no front door. Yours are like rooms with no walls — the sky comes straight in.",
          },
          {
            author: "marc_citadel",
            body: "My whole notebook is fragments. Nobody's life is finished either, until it is, and then nobody asks if it was well structured. Only whether it was well lived.",
          },
        ],
      },
    ],
  },
};
