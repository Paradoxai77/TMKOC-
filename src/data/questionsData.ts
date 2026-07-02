export type QuizCategory =
  | 'picture_quiz'
  | 'character_quiz'
  | 'society_trivia'
  | 'famous_personalities'
  | 'mythology_corner'
  | 'random_masala'
  | 'guess_dialogue'
  | 'guess_word'
  | 'riddles'
  | 'true_false'
  | 'speed_round'
  | 'sequence_it'
  | 'emoji_decode'
  | 'odd_one_out';

export type QuestionType = 'mcq' | 'boolean' | 'sequence' | 'text_input';

export interface QuestionBase {
  id: string;
  category: QuizCategory;
  q_type: QuestionType;
  difficulty_tier: 'easy' | 'medium' | 'hard';
  witty_one_liners: {
    correct: string;
    incorrect: string;
  };
}

export interface MCQQuestion extends QuestionBase {
  q_type: 'mcq';
  prompt_text: string;
  media_asset?: {
    type: 'image' | 'audio';
    url: string;
  };
  options: {
    id: string;
    text: string;
  }[];
  correct_option_id: string;
}

export interface BooleanQuestion extends QuestionBase {
  q_type: 'boolean';
  prompt_text: string;
  correct_answer: boolean;
}

export interface SequenceQuestion extends QuestionBase {
  q_type: 'sequence';
  prompt_text: string;
  sequence_items: {
    rank_order: number;
    text: string;
  }[];
}

export interface TextInputQuestion extends QuestionBase {
  q_type: 'text_input';
  prompt_text: string;
  emoji_string?: string;
  accepted_answers: string[];
  hints?: {
    cost_penalty_xp: number;
    text: string;
  }[];
}

export type QuizQuestion = MCQQuestion | BooleanQuestion | SequenceQuestion | TextInputQuestion;

export const QUESTIONS_DATA: QuizQuestion[] = [
  // 1. MCQ - Dialogue
  {
    id: "q_mcq_1",
    category: "guess_dialogue",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "Complete Jethalal's famous scolding: 'Ae babuchak, chai pi ke jaa, nahi to...'",
    options: [
      { id: "opt_01", text: "Tension aa jayega" },
      { id: "opt_02", text: "Gada Electronics band ho jayega" },
      { id: "opt_03", text: "Bapuji gussa karenge" },
      { id: "opt_04", text: "Bhide maintenance bill mang lega" }
    ],
    correct_option_id: "opt_01",
    witty_one_liners: {
      correct: "Tapu ke Papa proud ho gaye! Perfect answer.",
      incorrect: "Nonsense! Bagha can write better scripts than your guess."
    }
  },
  // 2. MCQ - Society Trivia
  {
    id: "q_mcq_2",
    category: "society_trivia",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "What is the exact name of the board that Bhide writes the daily thoughts on?",
    options: [
      { id: "opt_a", text: "Gokuldham Suvichar Board" },
      { id: "opt_b", text: "Gokuldham Society Notice Board" },
      { id: "opt_c", text: "Suvichar Aur Samachar Board" },
      { id: "opt_d", text: "Bhide Coaching Classes Board" }
    ],
    correct_option_id: "opt_b",
    witty_one_liners: {
      correct: "Bilkul sahi! Bhide would be proud of your discipline.",
      incorrect: "Aareaa! You clearly missed the society morning meeting!"
    }
  },
  // 3. MCQ - Picture Quiz
  {
    id: "q_pic_1",
    category: "picture_quiz",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "Identify this iconic character frame from the early episodes of TMKOC:",
    media_asset: {
      type: "image",
      url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop"
    },
    options: [
      { id: "opt_p1", text: "Reporter Popatlal with his black umbrella" },
      { id: "opt_p2", text: "Dr. Hansraj Hathi in his royal sofa" },
      { id: "opt_p3", text: "Sheru, the stray dog who guarded the society" },
      { id: "opt_p4", text: "Inspector Chalu Pandey (Pehle Pandey, Phir Chalu)" }
    ],
    correct_option_id: "opt_p4",
    witty_one_liners: {
      correct: "Chalu Pandey agrees: 'Humara naam hai Inspector Chalu Pandey!'" ,
      incorrect: "Wrong inspector! Chalu Pandey is coming to lock you up."
    }
  },
  // 4. Sequence - Sorting Events
  {
    id: "q_seq_1",
    category: "sequence_it",
    q_type: "sequence",
    difficulty_tier: "hard",
    prompt_text: "Arrange these iconic Gokuldham events in their correct historical broadcast order:",
    sequence_items: [
      { rank_order: 1, text: "Jethalal gets locked in the Pakistan border zone" },
      { rank_order: 2, text: "The entire society goes to London with Sundar" },
      { rank_order: 3, text: "Gada Electronics is temporarily rented out to a garment brand" },
      { rank_order: 4, text: "Popatlal transforms into an undercover agent to bust a water scam" }
    ],
    witty_one_liners: {
      correct: "Kya baat hai! You have the historical memory of Bhide's old diaries.",
      incorrect: "Garbad ho gayi! Go back and watch the repeat telecasts on TV."
    }
  },
  // 5. TextInput - Emoji Decode
  {
    id: "q_emoji_1",
    category: "emoji_decode",
    q_type: "text_input",
    difficulty_tier: "medium",
    prompt_text: "Decode this emoji string to find the correct TMKOC shop or asset:",
    emoji_string: "💸⚡🏢💼",
    accepted_answers: [
      "gada electronics",
      "gada electronic",
      "jethalal shop",
      "gada shop"
    ],
    hints: [
      { cost_penalty_xp: 15, text: "Located outside Gokuldham Society, managed directly by Nattu Kaka." }
    ],
    witty_one_liners: {
      correct: "Superb decoding! Magan is preparing your royal chair.",
      incorrect: "Wrong shop! Did you mistake this for Abdul's soda shop?"
    }
  },
  // 6. TextInput - Guess Word
  {
    id: "q_word_1",
    category: "guess_word",
    q_type: "text_input",
    difficulty_tier: "easy",
    prompt_text: "Guess the name of Jethalal's brother-in-law who constantly scams him for taxi fare:",
    accepted_answers: [
      "sundar",
      "sundarlal",
      "sunder",
      "sunderlal"
    ],
    hints: [
      { cost_penalty_xp: 10, text: "He lives in Ahmedabad and loves calling Jethalal 'Jeeja Ji'." }
    ],
    witty_one_liners: {
      correct: "Arey Sundar! 'Jeeja Ji, Ahmedabad se namaskar!'",
      incorrect: "Hey bhagwan! You don't know the Ahmedabad king of transport?"
    }
  },
  // 7. Boolean - True / False
  {
    id: "q_tf_1",
    category: "true_false",
    q_type: "boolean",
    difficulty_tier: "easy",
    prompt_text: "Taarak Mehta is allowed to eat fried food whenever he wants without Anjali noticing.",
    correct_answer: false,
    witty_one_liners: {
      correct: "Exactly! Diet food is Taarak's permanent punishment.",
      incorrect: "Karela juice alert! Anjali Bhabhi is watching you write this."
    }
  },
  // 8. MCQ - Character Quiz
  {
    id: "q_char_1",
    category: "character_quiz",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "Which of the following is Babita Ji's husband?",
    options: [
      { id: "opt_c1", text: "Jethalal Gada" },
      { id: "opt_c2", text: "Taarak Mehta" },
      { id: "opt_c3", text: "Aatmaram Bhide" },
      { id: "opt_c4", text: "Krishnan Subramaniam Iyer" }
    ],
    correct_option_id: "opt_c4",
    witty_one_liners: {
      correct: "Yes! Iyer Bhai, scientist at the space agency.",
      incorrect: "Jethalal wished! But no, it's Iyer."
    }
  },
  // 9. MCQ - Random Masala
  {
    id: "q_rand_1",
    category: "random_masala",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "What is the brand/model of Aatmaram Bhide's beloved scooter?",
    options: [
      { id: "s_1", text: "Cheetah" },
      { id: "s_2", text: "Sakharam" },
      { id: "s_3", text: "Dhanno" },
      { id: "s_4", text: "Sheru" }
    ],
    correct_option_id: "s_2",
    witty_one_liners: {
      correct: "Sakharam is shiny and proud! Sahi jawab.",
      incorrect: "Sakharam feels insulted! It's not a generic scooter, it's Sakharam."
    }
  },
  // 10. MCQ - Speed Round
  {
    id: "q_speed_1",
    category: "speed_round",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "Who is the son of Jethalal and Daya?",
    options: [
      { id: "son_1", text: "Gogi" },
      { id: "son_2", text: "Golu" },
      { id: "son_3", text: "Tapu" },
      { id: "son_4", text: "Pinku" }
    ],
    correct_option_id: "son_3",
    witty_one_liners: {
      correct: "Tapu Sena Leader! Sahi jawab.",
      incorrect: "Daya is crying! Tapu is her only son."
    }
  },
  // 11. MCQ - Famous Personalities (NEW search-informed data)
  {
    id: "q_mcq_3",
    category: "famous_personalities",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "On which weekly Gujarati column is the show Taarak Mehta Ka Ooltah Chashmah based?",
    options: [
      { id: "col_1", text: "Duniya Ne Undha Chashmah" },
      { id: "col_2", text: "Gokuldham Chitra Katha" },
      { id: "col_3", text: "Taarak Kahaniyan" },
      { id: "col_4", text: "Chitralekha Samachar" }
    ],
    correct_option_id: "col_1",
    witty_one_liners: {
      correct: "Correct! The column was written by writer Taarak Mehta himself.",
      incorrect: "Wrong column! Read the credits scroll in the television broadcasts."
    }
  },
  // 12. Boolean - Famous Personalities (NEW search-informed data)
  {
    id: "q_tf_2",
    category: "famous_personalities",
    q_type: "boolean",
    difficulty_tier: "hard",
    prompt_text: "In real life, actor Amit Bhatt (Bapuji) is actually older than Dilip Joshi (Jethalal).",
    correct_answer: false,
    witty_one_liners: {
      correct: "Sahi pakde! Amit Bhatt is younger than Dilip Joshi in real life.",
      incorrect: "Wrong guess! Dilip Joshi is actually older than the actor playing his father!"
    }
  },
  // 13. MCQ - Famous Personalities (NEW search-informed data)
  {
    id: "q_mcq_4",
    category: "famous_personalities",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "What is the real-life relationship between Disha Vakani (Daya) and Mayur Vakani (Sundar)?",
    options: [
      { id: "rel_1", text: "Real-life husband and wife" },
      { id: "rel_2", text: "Real-life brother and sister (siblings)" },
      { id: "rel_3", text: "Cousins" },
      { id: "rel_4", text: "No actual relationship" }
    ],
    correct_option_id: "rel_2",
    witty_one_liners: {
      correct: "Sahi jawab! They are real siblings, which explains their natural comedic chemistry.",
      incorrect: "Wrong relation! They are real-life brother and sister."
    }
  },
  // 14. TextInput - Society Trivia (NEW search-informed data)
  {
    id: "q_word_2",
    category: "society_trivia",
    q_type: "text_input",
    difficulty_tier: "medium",
    prompt_text: "What is the full name of the Gokuldham Secretary 'Bhide'?",
    accepted_answers: [
      "aatmaram tukaram bhide",
      "aatmaram bhide",
      "atmaram tukaram bhide",
      "atmaram bhide"
    ],
    hints: [
      { cost_penalty_xp: 15, text: "Middle name is Tukaram. He teaches tuition classes." }
    ],
    witty_one_liners: {
      correct: "Correct! 'Aatmaram Tukaram Bhide, Ek Mev Secretary!'",
      incorrect: "Arey! Sakharam is disappointed. It is Aatmaram Tukaram Bhide."
    }
  },
  // 15. MCQ - Character Quiz (NEW search-informed data)
  {
    id: "q_mcq_5",
    category: "character_quiz",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "What type of shop was Jethalal's shop, 'Gada Electronics,' originally planned to be?",
    options: [
      { id: "plan_1", text: "A grocery store (Gada Kirana)" },
      { id: "plan_2", text: "A cloth/garment shop (Gada Garments)" },
      { id: "plan_3", text: "A fast food joint" },
      { id: "plan_4", text: "A cycle garage" }
    ],
    correct_option_id: "plan_2",
    witty_one_liners: {
      correct: "Spot on! It was originally planned as Gada Garments before switching to electronics.",
      incorrect: "Arey Bagha! Tell them it was planned as a garment/cloth store."
    }
  },
  // 16. MCQ - Famous Personalities (NEW search-informed data)
  {
    id: "q_mcq_6",
    category: "famous_personalities",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "In what year and date did Taarak Mehta Ka Ooltah Chashmah premiere on SAB TV?",
    options: [
      { id: "date_1", text: "28 July 2008" },
      { id: "date_2", text: "15 August 2009" },
      { id: "date_3", text: "26 January 2007" },
      { id: "date_4", text: "2 October 2008" }
    ],
    correct_option_id: "date_1",
    witty_one_liners: {
      correct: "Historic! Yes, July 28, 2008 is when the magic started.",
      incorrect: "Check your diary! The show premiered on 28th July, 2008."
    }
  },
  // 17. MCQ - Mythology Corner
  {
    id: "q_myth_1",
    category: "mythology_corner",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "During the Gokuldham Ramlila play, which role was Jethalal forced to play?",
    options: [
      { id: "ram_1", text: "Lord Rama" },
      { id: "ram_2", text: "Lakshmana" },
      { id: "ram_3", text: "Ravana" },
      { id: "ram_4", text: "Hanuman" }
    ],
    correct_option_id: "ram_2",
    witty_one_liners: {
      correct: "Sahi jawab! Jethalal acted as Lakshmana while Bapuji played Rama.",
      incorrect: "Wrong actor! Jethalal wanted to be Rama but played Lakshmana."
    }
  },
  // 18. Boolean - Society Trivia
  {
    id: "q_tf_3",
    category: "society_trivia",
    q_type: "boolean",
    difficulty_tier: "easy",
    prompt_text: "Abdul's Soda Shop is located inside the main compound of Gokuldham Society.",
    correct_answer: false,
    witty_one_liners: {
      correct: "Correct! The shop is just outside the main gate, next to the entrance.",
      incorrect: "Incorrect! It's right outside the society main gate."
    }
  },
  // 19. TextInput - Riddles
  {
    id: "q_rid_1",
    category: "riddles",
    q_type: "text_input",
    difficulty_tier: "hard",
    prompt_text: "I call Daya 'Behn' (sister) but I constantly loot Jethalal of taxi cash. Who am I?",
    accepted_answers: [
      "sundar",
      "sundarlal",
      "sunder",
      "sunderlal"
    ],
    hints: [
      { cost_penalty_xp: 15, text: "He resides in Ahmedabad and travels to Mumbai frequently." }
    ],
    witty_one_liners: {
      correct: "Haha, Sundar Lal indeed! Master of taxi schemes.",
      incorrect: "Wrong guess! Jethalal is sobbing. It is Sundar Lal."
    }
  },
  // 20. MCQ - Speed Round
  {
    id: "q_speed_2",
    category: "speed_round",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "What is the name of Taarak Mehta's boss who constantly gives him piles of paperwork?",
    options: [
      { id: "boss_1", text: "Mr. Gada" },
      { id: "boss_2", text: "Mr. Bhide" },
      { id: "boss_3", text: "Mr. Boss / Boss" },
      { id: "boss_4", text: "Asit Modi" }
    ],
    correct_option_id: "boss_3",
    witty_one_liners: {
      correct: "Correct! Taarak refers to him simply as 'Boss' or 'Mr. Boss'.",
      incorrect: "Nope! It's Mr. Boss. The tyrant of files!"
    }
  }
];

export const CATEGORIES_META = [
  {
    id: "society_trivia",
    name: "Society Trivia",
    description: "Test your memory on the compound, the notices, and meetings.",
    icon: "FaBuilding",
    difficulty: "Medium",
    questionsCount: 4,
    unlockedAtLevel: 1,
  },
  {
    id: "character_quiz",
    name: "Character Files",
    description: "How well do you know Jethalal, Sodhi, Iyer, and Nattu Kaka?",
    icon: "FaUsers",
    difficulty: "Easy",
    questionsCount: 3,
    unlockedAtLevel: 1,
  },
  {
    id: "guess_dialogue",
    name: "Famous Dialogues",
    description: "Complete iconic character punchlines and dramatic roasts.",
    icon: "FaCommentDots",
    difficulty: "Easy",
    questionsCount: 3,
    unlockedAtLevel: 1,
  },
  {
    id: "picture_quiz",
    name: "Picture Gallery",
    description: "Identify rare objects, costumes, and background frames.",
    icon: "FaImage",
    difficulty: "Hard",
    questionsCount: 2,
    unlockedAtLevel: 1,
  },
  {
    id: "emoji_decode",
    name: "Emoji Decoder",
    description: "Decode text phrases and locations from a series of emojis.",
    icon: "FaSmile",
    difficulty: "Medium",
    questionsCount: 2,
    unlockedAtLevel: 1,
  },
  {
    id: "sequence_it",
    name: "Time Machine",
    description: "Sort historical broadcast story arcs in chronological order.",
    icon: "FaSortAmountDown",
    difficulty: "Hard",
    questionsCount: 1,
    unlockedAtLevel: 2,
  },
  {
    id: "speed_round",
    name: "Speed Soda Round",
    description: "Lightning-fast questions at Abdul's shop under high pressure.",
    icon: "FaRunning",
    difficulty: "Hard",
    questionsCount: 5,
    unlockedAtLevel: 2,
  },
  {
    id: "famous_personalities",
    name: "Behind the Scenes",
    description: "Learn about the production history, real actors, and original column details.",
    icon: "FaUsers",
    difficulty: "Medium",
    questionsCount: 4,
    unlockedAtLevel: 1,
  },
  {
    id: "mythology_corner",
    name: "Mythology Plays",
    description: "Questions based on the Ramlila, Krishna Janmashtami, and play acts inside the society.",
    icon: "FaBuilding",
    difficulty: "Medium",
    questionsCount: 2,
    unlockedAtLevel: 2,
  }
];
