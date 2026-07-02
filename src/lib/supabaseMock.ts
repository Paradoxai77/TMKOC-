// Mock Supabase Client using localStorage to store data locally
export interface Profile {
  id: string;
  username: string;
  current_xp: number;
  current_level: number;
  unlocked_floor: number;
  avatar_frame_url: string | null;
  coins: number;
  created_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_played_date: string | null;
  maintenance_sheet_completed: boolean;
  daily_tasks: {
    collectBhideChecks: boolean; // Complete 2 Society Trivia quizzes
    fixSodhiJeep: boolean;        // Play 1 Speed Round mini-game
    sodaShopVisit: boolean;       // Visited Abdul's Soda shop (check-in)
  };
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  level: number;
  unlocked_floor: number;
  updated_at: string;
}

export interface GameLog {
  id: string;
  user_id: string;
  category: string;
  difficulty: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  played_at: string;
}

// Initial Mock Seed Data
const DEFAULT_USER_ID = "gokuldham-guest-uuid";
const MOCK_PROFILES: Record<string, Profile> = {
  [DEFAULT_USER_ID]: {
    id: DEFAULT_USER_ID,
    username: "TapuKePapa",
    current_xp: 450,
    current_level: 2,
    unlocked_floor: 1, // Floor 1
    avatar_frame_url: "/frames/soda_glass.png",
    coins: 120,
    created_at: new Date().toISOString(),
  },
  "jethalal": {
    id: "jethalal",
    username: "Jetha_Gada_100",
    current_xp: 12850,
    current_level: 32,
    unlocked_floor: 3,
    avatar_frame_url: null,
    coins: 2500,
    created_at: new Date().toISOString(),
  },
  "bhide": {
    id: "bhide",
    username: "Bhide_Ek_Mev_Secretary",
    current_xp: 11400,
    current_level: 28,
    unlocked_floor: 3,
    avatar_frame_url: null,
    coins: 1500,
    created_at: new Date().toISOString(),
  },
  "taarak": {
    id: "taarak",
    username: "Taarak_Mehta_Author",
    current_xp: 9800,
    current_level: 24,
    unlocked_floor: 2,
    avatar_frame_url: null,
    coins: 1200,
    created_at: new Date().toISOString(),
  },
  "daya": {
    id: "daya",
    username: "Daya_Ben_Garba",
    current_xp: 3000,
    current_level: 15,
    unlocked_floor: 1,
    avatar_frame_url: null,
    coins: 800,
    created_at: new Date().toISOString(),
  },
  "popatlal": {
    id: "popatlal",
    username: "Popatlal_Journalist",
    current_xp: 900,
    current_level: 5,
    unlocked_floor: 0,
    avatar_frame_url: null,
    coins: 200,
    created_at: new Date().toISOString(),
  }
};

const MOCK_STREAKS: Record<string, Streak> = {
  [DEFAULT_USER_ID]: {
    user_id: DEFAULT_USER_ID,
    current_streak: 2,
    longest_streak: 5,
    last_played_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    maintenance_sheet_completed: false,
    daily_tasks: {
      collectBhideChecks: false,
      fixSodhiJeep: false,
      sodaShopVisit: false,
    }
  },
  "jethalal": {
    user_id: "jethalal",
    current_streak: 8,
    longest_streak: 15,
    last_played_date: new Date().toISOString().split('T')[0],
    maintenance_sheet_completed: false,
    daily_tasks: { collectBhideChecks: false, fixSodhiJeep: false, sodaShopVisit: false }
  },
  "bhide": {
    user_id: "bhide",
    current_streak: 12,
    longest_streak: 20,
    last_played_date: new Date().toISOString().split('T')[0],
    maintenance_sheet_completed: false,
    daily_tasks: { collectBhideChecks: false, fixSodhiJeep: false, sodaShopVisit: false }
  },
  "taarak": {
    user_id: "taarak",
    current_streak: 5,
    longest_streak: 10,
    last_played_date: new Date().toISOString().split('T')[0],
    maintenance_sheet_completed: false,
    daily_tasks: { collectBhideChecks: false, fixSodhiJeep: false, sodaShopVisit: false }
  },
  "daya": {
    user_id: "daya",
    current_streak: 3,
    longest_streak: 6,
    last_played_date: new Date().toISOString().split('T')[0],
    maintenance_sheet_completed: false,
    daily_tasks: { collectBhideChecks: false, fixSodhiJeep: false, sodaShopVisit: false }
  },
  "popatlal": {
    user_id: "popatlal",
    current_streak: 1,
    longest_streak: 3,
    last_played_date: new Date().toISOString().split('T')[0],
    maintenance_sheet_completed: false,
    daily_tasks: { collectBhideChecks: false, fixSodhiJeep: false, sodaShopVisit: false }
  }
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { user_id: "jethalal", username: "Jetha_Gada_100", score: 12850, level: 32, unlocked_floor: 3, updated_at: new Date().toISOString() },
  { user_id: "bhide", username: "Bhide_Ek_Mev_Secretary", score: 11400, level: 28, unlocked_floor: 3, updated_at: new Date().toISOString() },
  { user_id: "taarak", username: "Taarak_Mehta_Author", score: 9800, level: 24, unlocked_floor: 2, updated_at: new Date().toISOString() },
  { user_id: "sodhi", username: "Sodhi_Balle_Balle", score: 8550, level: 20, unlocked_floor: 2, updated_at: new Date().toISOString() },
  { user_id: "iyer", username: "Iyer_Scientist", score: 7900, level: 18, unlocked_floor: 2, updated_at: new Date().toISOString() },
  { user_id: "daya", username: "Daya_Ben_Garba", score: 3000, level: 15, unlocked_floor: 1, updated_at: new Date().toISOString() },
  { user_id: "popatlal", username: "Popatlal_Journalist", score: 900, level: 5, unlocked_floor: 0, updated_at: new Date().toISOString() },
];

const LOCAL_STORAGE_KEYS = {
  PROFILE: "gokuldham_profile",
  STREAK: "gokuldham_streak",
  LEADERBOARD: "gokuldham_leaderboard",
  LOGS: "gokuldham_game_logs",
};

// Local storage init helper
function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Database Actions
export const supabaseMock = {
  // Profiles
  async getProfile(userId = DEFAULT_USER_ID): Promise<Profile> {
    const profiles = getStoredData<Record<string, Profile>>(LOCAL_STORAGE_KEYS.PROFILE, MOCK_PROFILES);
    if (!profiles[userId]) {
      // Create user if not existing
      profiles[userId] = {
        id: userId,
        username: "GuestGokuldham",
        current_xp: 0,
        current_level: 1,
        unlocked_floor: 0,
        avatar_frame_url: null,
        coins: 0,
        created_at: new Date().toISOString(),
      };
      setStoredData(LOCAL_STORAGE_KEYS.PROFILE, profiles);
    }
    return profiles[userId];
  },

  async updateProfile(userId = DEFAULT_USER_ID, updates: Partial<Profile>): Promise<Profile> {
    const profiles = getStoredData<Record<string, Profile>>(LOCAL_STORAGE_KEYS.PROFILE, MOCK_PROFILES);
    const current = await this.getProfile(userId);
    const updated = { ...current, ...updates };
    profiles[userId] = updated;
    setStoredData(LOCAL_STORAGE_KEYS.PROFILE, profiles);
    
    // Sync to leaderboard if score or user details changed
    await this.syncToLeaderboard(userId, updated);
    
    return updated;
  },

  async addXP(userId = DEFAULT_USER_ID, xpToAdd: number, coinsToAdd = 0): Promise<Profile> {
    const current = await this.getProfile(userId);
    const totalXP = current.current_xp + xpToAdd;
    
    // Level scaling: Each level requires level * 200 XP
    let level = current.current_level;
    let requiredXP = level * 200;
    while (totalXP >= requiredXP) {
      level += 1;
      requiredXP = level * 200;
    }

    // Floor locks map:
    // Level 1-5: 0 (Ground floor)
    // Level 6-15: 1 (1st floor)
    // Level 16-25: 2 (2nd floor)
    // Level 26+: 3 (Terrace / Water Tank)
    let unlockedFloor = 0;
    if (level >= 26) unlockedFloor = 3;
    else if (level >= 16) unlockedFloor = 2;
    else if (level >= 6) unlockedFloor = 1;

    return this.updateProfile(userId, {
      current_xp: totalXP,
      current_level: level,
      unlocked_floor: Math.max(current.unlocked_floor, unlockedFloor),
      coins: current.coins + coinsToAdd,
    });
  },

  // Streaks
  async getStreak(userId = DEFAULT_USER_ID): Promise<Streak> {
    const streaks = getStoredData<Record<string, Streak>>(LOCAL_STORAGE_KEYS.STREAK, MOCK_STREAKS);
    if (!streaks[userId]) {
      streaks[userId] = {
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        last_played_date: null,
        maintenance_sheet_completed: false,
        daily_tasks: {
          collectBhideChecks: false,
          fixSodhiJeep: false,
          sodaShopVisit: false,
        }
      };
      setStoredData(LOCAL_STORAGE_KEYS.STREAK, streaks);
    }
    return streaks[userId];
  },

  async updateStreak(userId = DEFAULT_USER_ID, answeredCorrectly: boolean): Promise<Streak> {
    const streaks = getStoredData<Record<string, Streak>>(LOCAL_STORAGE_KEYS.STREAK, MOCK_STREAKS);
    const streak = await this.getStreak(userId);
    const today = new Date().toISOString().split('T')[0];
    
    let current = streak.current_streak;
    let longest = streak.longest_streak;

    if (answeredCorrectly) {
      if (streak.last_played_date === today) {
        // Already played today, don't increment daily streak again
      } else {
        // Increment streak
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (streak.last_played_date === yesterday || streak.last_played_date === null) {
          current += 1;
        } else {
          current = 1; // Broke streak, reset to 1
        }
        if (current > longest) longest = current;
      }
    } else {
      // Failed a quiz entirely (lives run out)? That's up to design.
      // Usually daily streaks only break if you miss a whole calendar day.
    }

    const updated: Streak = {
      ...streak,
      current_streak: current,
      longest_streak: longest,
      last_played_date: today,
    };
    streaks[userId] = updated;
    setStoredData(LOCAL_STORAGE_KEYS.STREAK, streaks);
    return updated;
  },

  async updateDailyTask(userId = DEFAULT_USER_ID, task: keyof Streak['daily_tasks'], completed = true): Promise<Streak> {
    const streaks = getStoredData<Record<string, Streak>>(LOCAL_STORAGE_KEYS.STREAK, MOCK_STREAKS);
    const streak = await this.getStreak(userId);
    
    const updatedTasks = {
      ...streak.daily_tasks,
      [task]: completed,
    };

    // If all tasks are completed, mark maintenance sheet completed
    const isCompleted = Object.values(updatedTasks).every(val => val === true);

    const updated: Streak = {
      ...streak,
      daily_tasks: updatedTasks,
      maintenance_sheet_completed: isCompleted,
    };

    // Award bonus if completed
    if (isCompleted && !streak.maintenance_sheet_completed) {
      await this.addXP(userId, 100, 50); // 100 XP, 50 coins bonus
    }

    streaks[userId] = updated;
    setStoredData(LOCAL_STORAGE_KEYS.STREAK, streaks);
    return updated;
  },

  async resetDailyTasks(userId = DEFAULT_USER_ID): Promise<Streak> {
    const streaks = getStoredData<Record<string, Streak>>(LOCAL_STORAGE_KEYS.STREAK, MOCK_STREAKS);
    const streak = await this.getStreak(userId);
    
    const updated: Streak = {
      ...streak,
      maintenance_sheet_completed: false,
      daily_tasks: {
        collectBhideChecks: false,
        fixSodhiJeep: false,
        sodaShopVisit: false,
      }
    };
    streaks[userId] = updated;
    setStoredData(LOCAL_STORAGE_KEYS.STREAK, streaks);
    return updated;
  },

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const list = getStoredData<LeaderboardEntry[]>(LOCAL_STORAGE_KEYS.LEADERBOARD, MOCK_LEADERBOARD);
    return list.sort((a, b) => b.score - a.score);
  },

  async syncToLeaderboard(userId = DEFAULT_USER_ID, profile: Profile): Promise<void> {
    const list = getStoredData<LeaderboardEntry[]>(LOCAL_STORAGE_KEYS.LEADERBOARD, MOCK_LEADERBOARD);
    const index = list.findIndex(item => item.user_id === userId);
    
    const entry: LeaderboardEntry = {
      user_id: userId,
      username: profile.username,
      score: profile.current_xp, // XP acts as the global score ranking
      level: profile.current_level,
      unlocked_floor: profile.unlocked_floor,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = entry;
    } else {
      list.push(entry);
    }
    setStoredData(LOCAL_STORAGE_KEYS.LEADERBOARD, list);
  },

  // Game Logs
  async getGameHistory(userId = DEFAULT_USER_ID): Promise<GameLog[]> {
    const logs = getStoredData<GameLog[]>(LOCAL_STORAGE_KEYS.LOGS, []);
    return logs.filter(log => log.user_id === userId).sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime());
  },

  async logGameSession(
    category: string,
    difficulty: string,
    score: number,
    correctAnswers: number,
    totalQuestions: number,
    userId = DEFAULT_USER_ID
  ): Promise<GameLog> {
    const logs = getStoredData<GameLog[]>(LOCAL_STORAGE_KEYS.LOGS, []);
    
    const newLog: GameLog = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      category,
      difficulty,
      score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      played_at: new Date().toISOString(),
    };

    logs.push(newLog);
    setStoredData(LOCAL_STORAGE_KEYS.LOGS, logs);

    // Update streak calendar
    await this.updateStreak(userId, correctAnswers > 0);

    // Update daily tasks triggers
    if (category === "society_trivia") {
      // Completed a society trivia. Bhide checks collected increments or toggles.
      await this.updateDailyTask(userId, "collectBhideChecks", true);
    }
    if (difficulty === "hard" || category === "speed_round") {
      // Completed speed round / hard quiz. Sodhi jeep fixed.
      await this.updateDailyTask(userId, "fixSodhiJeep", true);
    }

    return newLog;
  }
};
