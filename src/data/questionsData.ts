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
  },
  // 21. MCQ - Picture Quiz
  {
    id: "q_pic_2",
    category: "picture_quiz",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "Who are the two legendary actors seen in this picture celebrating a TMKOC milestone?",
    media_asset: {
      type: "image",
      url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Dilip_and_Disha_in_Success_bash_for_completion_of_1000_episodes_of_TMKOC.jpg"
    },
    options: [
      { id: "opt_p2_1", text: "Taarak Mehta and Anjali Mehta" },
      { id: "opt_p2_2", text: "Jethalal Gada and Daya Gada" },
      { id: "opt_p2_3", text: "Aatmaram Bhide and Madhavi Bhide" },
      { id: "opt_p2_4", text: "Popatlal Pandey and Rita Reporter" }
    ],
    correct_option_id: "opt_p2_2",
    witty_one_liners: {
      correct: "Balle Balle! The real Jetha and Daya! Tapu Ke Papa and Tapu Ki Mummy.",
      incorrect: "Ae babuchak! Look closely, it is Jetha and Daya!"
    }
  },
  // 22. MCQ - Picture Quiz
  {
    id: "q_pic_3",
    category: "picture_quiz",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "Identify this gorgeous actress who plays the role of Babita Krishnan Iyer in the show:",
    media_asset: {
      type: "image",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Munmun_Dutta.jpg"
    },
    options: [
      { id: "opt_p3_1", text: "Munmun Dutta" },
      { id: "opt_p3_2", text: "Sunayana Fozdar" },
      { id: "opt_p3_3", text: "Jennifer Mistry Bansiwal" },
      { id: "opt_p3_4", text: "Ambika Ranjankar" }
    ],
    correct_option_id: "opt_p3_1",
    witty_one_liners: {
      correct: "Jethalal is dancing in joy! Correct! It is Munmun Dutta (Babita Ji).",
      incorrect: "Wrong! Iyer is typing a complaint to Bhide about your bad memory."
    }
  },
  // 23. MCQ - Picture Quiz
  {
    id: "q_pic_4",
    category: "picture_quiz",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "Which actor, playing the iconic lead role of Jethalal Champaklal Gada, is pictured here at an award show?",
    media_asset: {
      type: "image",
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Dilip_Joshi_at_Nickelodeon_Kids_Choice_Awards_2019.jpg"
    },
    options: [
      { id: "opt_p4_1", text: "Dilip Joshi" },
      { id: "opt_p4_2", text: "Amit Bhatt" },
      { id: "opt_p4_3", text: "Shailesh Lodha" },
      { id: "opt_p4_4", text: "Mandar Chandwadkar" }
    ],
    correct_option_id: "opt_p4_1",
    witty_one_liners: {
      correct: "Kya baat hai! Dilip Joshi, the acting powerhouse of TMKOC!",
      incorrect: "Nonsense! That is Dilip Joshi. Go watch Gada Electronics ads!"
    }
  },
  // 24. MCQ - Picture Quiz
  {
    id: "q_pic_5",
    category: "picture_quiz",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "Identify this actress who portrayed Daya Gada (famous for her Garba dances and 'Hey Maa, Mataji!'):",
    media_asset: {
      type: "image",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Disha_Vakani.jpg"
    },
    options: [
      { id: "opt_p5_1", text: "Disha Vakani" },
      { id: "opt_p5_2", text: "Madhavi Bhide" },
      { id: "opt_p5_3", text: "Komal Hathi" },
      { id: "opt_p5_4", text: "Rita Reporter" }
    ],
    correct_option_id: "opt_p5_1",
    witty_one_liners: {
      correct: "Hey Maa, Mataji! Sahi jawab! Disha Vakani, the queen of Garba!",
      incorrect: "Incorrect! Daya Gada is doing an angry garba now."
    }
  },
  // 25. MCQ - Famous Personalities (Behind the scenes)
  {
    id: "q_shyam_pathak_ca",
    category: "famous_personalities",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "What is the real-life profession of Shyam Pathak, the actor who plays Patrakar Popatlal?",
    options: [
      { id: "prof_1", text: "Journalist" },
      { id: "prof_2", text: "Chartered Accountant (CA)" },
      { id: "prof_3", text: "Software Engineer" },
      { id: "prof_4", text: "Lawyer" }
    ],
    correct_option_id: "prof_2",
    witty_one_liners: {
      correct: "Tax calculations or news reporting, Popatlal is a master of both!",
      incorrect: "Duniya hila dunga! Popatlal is actually a qualified Chartered Accountant!"
    }
  },
  // 26. Boolean - Character Quiz
  {
    id: "q_roshan_names",
    category: "character_quiz",
    q_type: "boolean",
    difficulty_tier: "easy",
    prompt_text: "In Taarak Mehta Ka Ooltah Chashmah, the character Roshan Singh Sodhi and his wife share the same first name 'Roshan'.",
    correct_answer: true,
    witty_one_liners: {
      correct: "O Papa Ji! Both are indeed named Roshan. Double the energy!",
      incorrect: "Arey yaar! Roshan and Roshan, they are the most energetic couple!"
    }
  },
  // 27. TextInput - Society Trivia
  {
    id: "q_jeevdaya_mother",
    category: "society_trivia",
    q_type: "text_input",
    difficulty_tier: "medium",
    prompt_text: "What is the name of Daya Gada's mother who lives in Ahmedabad and is a constant off-screen presence on the phone?",
    accepted_answers: [
      "jeevdaya",
      "jeevdayaben",
      "jeevdaya ben"
    ],
    hints: [
      { cost_penalty_xp: 15, text: "Her name starts with 'Jeev' (meaning life/soul)." }
    ],
    witty_one_liners: {
      correct: "Hey Maa, Mataji! You know Jeevdayaben's wisdom!",
      incorrect: "Incorrect. Daya's mother is Jeevdayaben, who has never shown her face!"
    }
  },
  // 28. MCQ - Character Quiz
  {
    id: "q_bagha_fullname",
    category: "character_quiz",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "What is the full character name of Bagha, Jethalal's loyal employee at Gada Electronics?",
    options: [
      { id: "bag_1", text: "Bhagwan Das Gada" },
      { id: "bag_2", text: "Bagheshwar Daddu Undhaiwala" },
      { id: "bag_3", text: "Bagha Sengupta" },
      { id: "bag_4", text: "Bagheshwar Nattu Undhaiwala" }
    ],
    correct_option_id: "bag_2",
    witty_one_liners: {
      correct: "Bawri ji is blushing! Yes, it's Bagheshwar Daddu Undhaiwala.",
      incorrect: "Galti se mistake ho gaya! His full name is Bagheshwar Daddu Undhaiwala."
    }
  },
  // 29. MCQ - Society Trivia
  {
    id: "q_dt_construction",
    category: "society_trivia",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "What is the name of Sundar's construction company that renovated the Gokuldham society?",
    options: [
      { id: "const_1", text: "Sundar Renovations" },
      { id: "const_2", text: "Ahmedabad Builders" },
      { id: "const_3", text: "D&T Construction Company" },
      { id: "const_4", text: "Gada & Brother-in-Law Corp" }
    ],
    correct_option_id: "const_3",
    witty_one_liners: {
      correct: "Jethalal's wallet is crying! D&T (Daya & Tapu) Construction did it!",
      incorrect: "Wrong! Sundar named it D&T Construction (Daya & Tapu) to escape bills!"
    }
  },
  // 30. MCQ - Famous Personalities (Behind the scenes)
  {
    id: "q_jethalal_offered",
    category: "famous_personalities",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "Which of these actors were reportedly offered the role of Jethalal Gada before Dilip Joshi?",
    options: [
      { id: "off_1", text: "Ali Asgar" },
      { id: "off_2", text: "Rajpal Yadav" },
      { id: "off_3", text: "Both Ali Asgar and Rajpal Yadav" },
      { id: "off_4", text: "Kapil Sharma" }
    ],
    correct_option_id: "off_3",
    witty_one_liners: {
      correct: "Wow, you know your TMKOC history! Both were offered the role before Dilip Joshi made it legendary.",
      incorrect: "Nope, both Ali Asgar and Rajpal Yadav were approached before Dilip Joshi accepted."
    }
  },
  // 31. Boolean - Famous Personalities (Behind the scenes)
  {
    id: "q_amit_bhatt_audition",
    category: "famous_personalities",
    q_type: "boolean",
    difficulty_tier: "medium",
    prompt_text: "In real life, actor Amit Bhatt did not have to audition for the role of Champaklal Gada (Bapuji).",
    correct_answer: true,
    witty_one_liners: {
      correct: "Sahi pakde! Producer Asit Modi cast him in just 5 minutes without an audition on Dilip Joshi's recommendation.",
      incorrect: "Wrong guess! He was selected without an audition within 5 minutes of meeting the producer."
    }
  },
  // 32. MCQ - Character Quiz
  {
    id: "q_jayantilal_gada",
    category: "character_quiz",
    q_type: "mcq",
    difficulty_tier: "hard",
    prompt_text: "What is the name of Jethalal's grandfather (Champaklal's father) whose photo hangs in the Gada household?",
    options: [
      { id: "gf_1", text: "Girdharlal Gada" },
      { id: "gf_2", text: "Jayantilal Girdharlal Gada" },
      { id: "gf_3", text: "Champaklal Jayantilal Gada" },
      { id: "gf_4", text: "Mohanlal Gada" }
    ],
    correct_option_id: "gf_2",
    witty_one_liners: {
      correct: "Correct! Jayantilal Girdharlal Gada. Bhide is impressed by your history knowledge!",
      incorrect: "No! Bapuji is checking his stick. The correct name is Jayantilal Girdharlal Gada."
    }
  },
  // 33. MCQ - Guess Dialogue
  {
    id: "q_bawri_catchphrase",
    category: "guess_dialogue",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "Complete Bawri's famous catchphrase when she makes a mistake: 'Galti se...'",
    options: [
      { id: "baw_1", text: "Galti ho gayi" },
      { id: "baw_2", text: "Mistake ho gaya" },
      { id: "baw_3", text: "Gadbad ho gayi" },
      { id: "baw_4", text: "Tension ho gaya" }
    ],
    correct_option_id: "baw_2",
    witty_one_liners: {
      correct: "Hahaha! 'Galti se mistake ho gaya!' Bawri ji would love this.",
      incorrect: "Hey bhagwan! Have you ever seen Bawri and Bagha together?"
    }
  },
  // 34. MCQ - Guess Dialogue
  {
    id: "q_chalu_pandey_catchphrase",
    category: "guess_dialogue",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "What is Inspector Chalu Pandey's signature catchphrase when introducing himself?",
    options: [
      { id: "cp_1", text: "Hum hain Inspector Chalu Pandey!" },
      { id: "cp_2", text: "Pehle Pandey, Phir Chalu!" },
      { id: "cp_3", text: "Chalu Pandey, kaam chalu!" },
      { id: "cp_4", text: "Pandey ji ka swagat karo!" }
    ],
    correct_option_id: "cp_2",
    witty_one_liners: {
      correct: "Humara naam hai Inspector Chalu Pandey, Pehle Pandey, Phir Chalu!",
      incorrect: "Wrong! Keep guessing or he will lock you up in the lockup!"
    }
  },
  // 35. MCQ - Character Quiz
  {
    id: "q_toofaan_express",
    category: "character_quiz",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "What is the name of the newspaper company where Patrakar Popatlal works?",
    options: [
      { id: "news_1", text: "Mumbai Samachar" },
      { id: "news_2", text: "Kal Tak News" },
      { id: "news_3", text: "Toofaan Express" },
      { id: "news_4", text: "Gokuldham Times" }
    ],
    correct_option_id: "news_3",
    witty_one_liners: {
      correct: "Toofaan Express is printing a front-page story on your genius!",
      incorrect: "Wrong! Popatlal's umbrella is shaking in anger. It's Toofaan Express!"
    }
  },
  // 36. MCQ - Character Quiz
  {
    id: "q_achar_papad",
    category: "character_quiz",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "What homemade items does Madhavi Bhide sell as part of her home business?",
    options: [
      { id: "biz_1", text: "Sweets and Chocolates" },
      { id: "biz_2", text: "Pickles and Papad (Achar and Papad)" },
      { id: "biz_3", text: "Sarees and Dress materials" },
      { id: "biz_4", text: "Spices and Masalas" }
    ],
    correct_option_id: "biz_2",
    witty_one_liners: {
      correct: "Bilkul sahi! Madhavi's Achar and Papad are Gokuldham's favorites.",
      incorrect: "Incorrect. Madhavi makes delicious home-made pickles and papads!"
    }
  },
  // 37. MCQ - Society Trivia
  {
    id: "q_rita_reporter_channel",
    category: "society_trivia",
    q_type: "mcq",
    difficulty_tier: "medium",
    prompt_text: "Which news channel does Gokuldham's resident Rita Reporter work for?",
    options: [
      { id: "chan_1", text: "Toofaan Express" },
      { id: "chan_2", text: "Kal Tak" },
      { id: "chan_3", text: "Sab TV News" },
      { id: "chan_4", text: "Bharat Samachar" }
    ],
    correct_option_id: "chan_2",
    witty_one_liners: {
      correct: "Correct! Rita Reporter reports live for Kal Tak!",
      incorrect: "Wrong channel! Popatlal works for Toofaan Express, but Rita works for Kal Tak!"
    }
  },
  // 38. Boolean - Character Quiz
  {
    id: "q_gogi_parentage",
    category: "character_quiz",
    q_type: "boolean",
    difficulty_tier: "easy",
    prompt_text: "Tapu Sena's Gogi (Gurucharan Singh Sodhi) is the son of Roshan Singh Sodhi and Roshan Kaur Sodhi.",
    correct_answer: true,
    witty_one_liners: {
      correct: "Sodhi family is proud! Gogi is indeed their only son.",
      incorrect: "O Papa Ji! You missed Gogi's parentage?"
    }
  },
  // 39. MCQ - Mythology Corner
  {
    id: "q_dahi_handi_tapu",
    category: "mythology_corner",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "In the grand Gokuldham Janmashtami celebration, who traditionally breaks the Dahi Handi first?",
    options: [
      { id: "handi_1", text: "Jethalal Gada" },
      { id: "handi_2", text: "Tapu (Tipendra Gada)" },
      { id: "handi_3", text: "Bagha" },
      { id: "handi_4", text: "Sodhi" }
    ],
    correct_option_id: "handi_2",
    witty_one_liners: {
      correct: "Tapu Sena leads the way! Tapu breaks the handi.",
      incorrect: "Wrong! Tapu is Gokuldham's ultimate Dahi Handi champion."
    }
  },
  // 40. TextInput - Emoji Decode
  {
    id: "q_jalebi_fafda_emoji",
    category: "emoji_decode",
    q_type: "text_input",
    difficulty_tier: "easy",
    prompt_text: "Decode this emoji string to find Jethalal's ultimate Sunday breakfast food: 😋🥨🍩",
    accepted_answers: [
      "jalebi fafda",
      "jalebi phafda",
      "fafda jalebi",
      "phafda jalebi"
    ],
    hints: [
      { cost_penalty_xp: 10, text: "It's a sweet and salty combination popular in Gujarat. Jethalal can't live without it." }
    ],
    witty_one_liners: {
      correct: "Bapuji approved! Jalebi Fafda party is on!",
      incorrect: "Nonsense! Daya has to make Jalebi Fafda for you to learn this."
    }
  },
  // 41. MCQ - Speed Round
  {
    id: "q_abdul_shop_name",
    category: "speed_round",
    q_type: "mcq",
    difficulty_tier: "easy",
    prompt_text: "What is the official name of Abdul's soda/general store shop located just outside Gokuldham Society?",
    options: [
      { id: "abd_1", text: "Abdul Soda Shop" },
      { id: "abd_2", text: "Gokuldham General Store" },
      { id: "abd_3", text: "All In One General Store" },
      { id: "abd_4", text: "Apna Bazaar" }
    ],
    correct_option_id: "abd_3",
    witty_one_liners: {
      correct: "Sahi pakde! It is the All In One General Store.",
      incorrect: "Incorrect! Soda is just one of many things Abdul sells at the All In One General Store."
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
    questionsCount: 6,
    unlockedAtLevel: 1,
  },
  {
    id: "character_quiz",
    name: "Character Files",
    description: "How well do you know Jethalal, Sodhi, Iyer, and Nattu Kaka?",
    icon: "FaUsers",
    difficulty: "Easy",
    questionsCount: 8,
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
    questionsCount: 5,
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
    questionsCount: 3,
    unlockedAtLevel: 2,
  },
  {
    id: "famous_personalities",
    name: "Behind the Scenes",
    description: "Learn about the production history, real actors, and original column details.",
    icon: "FaUsers",
    difficulty: "Medium",
    questionsCount: 7,
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
