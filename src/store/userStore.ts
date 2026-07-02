import { create } from "zustand";
import { Profile, Streak, supabaseMock } from "@/lib/supabaseMock";

interface UserState {
  profile: Profile | null;
  streak: Streak | null;
  isMuted: boolean;
  volume: number;
  activeTheme: "regular" | "monsoon" | "diwali" | "diet";
  loading: boolean;
  
  // Actions
  loadUser: () => Promise<void>;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  updateUsername: (name: string) => Promise<void>;
  gainXP: (xp: number, coins?: number) => Promise<void>;
  completeDailyTask: (task: keyof Streak["daily_tasks"]) => Promise<void>;
  visitSodaShop: () => Promise<void>;
  resetDailies: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  changeTheme: (theme: UserState["activeTheme"]) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  streak: null,
  isMuted: false,
  volume: 0.6,
  activeTheme: "regular",
  loading: false,

  loadUser: async () => {
    set({ loading: true });
    try {
      const activeId = typeof window !== "undefined" ? localStorage.getItem("gokuldham_current_user_id") : null;
      if (!activeId) {
        set({ profile: null, streak: null, loading: false });
        return;
      }
      const profile = await supabaseMock.getProfile(activeId);
      const streak = await supabaseMock.getStreak(activeId);
      
      // Check if it's a new day and reset daily tasks if last played date is not today
      const today = new Date().toISOString().split('T')[0];
      if (streak.last_played_date && streak.last_played_date !== today) {
        const resetStreak = await supabaseMock.resetDailyTasks(activeId);
        set({ profile, streak: resetStreak, loading: false });
      } else {
        set({ profile, streak, loading: false });
      }
    } catch (e) {
      console.error("Failed to load user progress:", e);
      set({ profile: null, streak: null, loading: false });
    }
  },

  login: async (userId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gokuldham_current_user_id", userId);
    }
    await get().loadUser();
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gokuldham_current_user_id");
    }
    set({ profile: null, streak: null });
  },

  updateUsername: async (name: string) => {
    const profile = get().profile;
    if (!profile) return;
    try {
      const updated = await supabaseMock.updateProfile(profile.id, { username: name });
      set({ profile: updated });
    } catch (e) {
      console.error(e);
    }
  },

  gainXP: async (xp: number, coins = 0) => {
    const profile = get().profile;
    if (!profile) return;
    try {
      const updated = await supabaseMock.addXP(profile.id, xp, coins);
      set({ profile: updated });
    } catch (e) {
      console.error(e);
    }
  },

  completeDailyTask: async (task: keyof Streak["daily_tasks"]) => {
    const profile = get().profile;
    if (!profile) return;
    try {
      const updated = await supabaseMock.updateDailyTask(profile.id, task, true);
      set({ streak: updated });
      
      // Reload profile in case a level-up/coin-gain happened during sheet completion
      const updatedProfile = await supabaseMock.getProfile(profile.id);
      set({ profile: updatedProfile });
    } catch (e) {
      console.error(e);
    }
  },

  visitSodaShop: async () => {
    // Abdul check-in task
    await get().completeDailyTask("sodaShopVisit");
  },

  resetDailies: async () => {
    const profile = get().profile;
    if (!profile) return;
    try {
      const updated = await supabaseMock.resetDailyTasks(profile.id);
      set({ streak: updated });
    } catch (e) {
      console.error(e);
    }
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  setVolume: (vol: number) => {
    set({ volume: vol });
  },

  changeTheme: (theme: UserState["activeTheme"]) => {
    set({ activeTheme: theme });
    if (typeof document !== "undefined") {
      // Remove any existing theme class
      document.body.classList.remove("theme-monsoon", "theme-diwali", "theme-diet");
      if (theme !== "regular") {
        document.body.classList.add(`theme-${theme}`);
      }
    }
  }
}));
