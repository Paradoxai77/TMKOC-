"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { audioPipeline } from "@/lib/audioPipeline";
import { motion } from "framer-motion";
import { FaUserPlus, FaUsers, FaArrowRight, FaKey, FaDoorOpen } from "react-icons/fa";

interface ResidentCard {
  id: string;
  name: string;
  username: string;
  avatar: string;
  imageSrc?: string;
  level: number;
  xp: number;
  coins: number;
  quote: string;
  bgClass: string;
}

const RESIDENTS: ResidentCard[] = [
  {
    id: "jethalal",
    name: "Jethalal Gada",
    username: "Jetha_Gada_100",
    avatar: "🧔🏽",
    imageSrc: "/TMKOC-/images/jethalal.png",
    level: 32,
    xp: 12850,
    coins: 2500,
    quote: '"Nonsense! Bagha, prepare the points voucher!"',
    bgClass: "from-amber-100 to-amber-200 border-amber-400 text-amber-950",
  },
  {
    id: "bhide",
    name: "Aatmaram Bhide",
    username: "Bhide_Ek_Mev_Secretary",
    avatar: "👨🏽‍🏫",
    imageSrc: "/TMKOC-/images/bhide.png",
    level: 28,
    xp: 11400,
    coins: 1500,
    quote: '"Discipline is the foundation of Gokuldham!"',
    bgClass: "from-teal-100 to-teal-200 border-teal-400 text-teal-950",
  },
  {
    id: "daya",
    name: "Daya Gada",
    username: "Daya_Ben_Garba",
    avatar: "💃🏽",
    imageSrc: "/TMKOC-/images/daya.png",
    level: 15,
    xp: 3000,
    coins: 800,
    quote: '"Hey Maa, Mataji! Do some garba!"',
    bgClass: "from-rose-100 to-rose-200 border-rose-400 text-rose-950",
  },
  {
    id: "taarak",
    name: "Taarak Mehta",
    username: "Taarak_Mehta_Author",
    avatar: "👓",
    level: 24,
    xp: 9800,
    coins: 1200,
    quote: '"A cup of soda after a long quiz cures all stress."',
    bgClass: "from-blue-100 to-blue-200 border-blue-400 text-blue-950",
  },
  {
    id: "popatlal",
    name: "Popatlal",
    username: "Popatlal_Journalist",
    avatar: "☂️",
    level: 5,
    xp: 900,
    coins: 200,
    quote: '"Cancel! I will shake the whole world!"',
    bgClass: "from-purple-100 to-purple-200 border-purple-400 text-purple-950",
  },
];

const BUDDY_AVATARS = [
  { emoji: "🦁", label: "Sodhi" },
  { emoji: "🔬", label: "Iyer" },
  { emoji: "🐘", label: "Dr. Hathi" },
  { emoji: "🥤", label: "Abdul" },
  { emoji: "🎒", label: "Tapu Sena" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, profile, loading } = useUserStore();
  const [usernameInput, setUsernameInput] = useState("");
  const [selectedBuddy, setSelectedBuddy] = useState("🦁");
  const [errorMsg, setErrorMsg] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to home if already logged in
  useEffect(() => {
    if (isClient && profile && !loading) {
      router.push("/");
    }
  }, [profile, loading, isClient, router]);

  if (!isClient) return null;

  const handleResidentClick = async (resident: ResidentCard) => {
    audioPipeline.play("BALLE_BALLE");
    await login(resident.id);
    router.push("/");
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim();

    if (!cleanUsername) {
      audioPipeline.play("WRONG_TRING");
      setErrorMsg("Bhide says: A custom member must have a name!");
      return;
    }

    if (cleanUsername.length < 3) {
      audioPipeline.play("WRONG_TRING");
      setErrorMsg("Bhide says: Name must be at least 3 characters!");
      return;
    }

    // Register a new custom member in local storage profiles
    const customUserId = `custom-${Date.now()}`;
    const newProfile = {
      id: customUserId,
      username: `${cleanUsername}_${selectedBuddy}`,
      current_xp: 0,
      current_level: 1,
      unlocked_floor: 0,
      avatar_frame_url: null,
      coins: 50,
      created_at: new Date().toISOString(),
    };

    const newStreak = {
      user_id: customUserId,
      current_streak: 1,
      longest_streak: 1,
      last_played_date: new Date().toISOString().split("T")[0],
      maintenance_sheet_completed: false,
      daily_tasks: {
        collectBhideChecks: false,
        fixSodhiJeep: false,
        sodaShopVisit: false,
      },
    };

    // Save mock user in local storage
    if (typeof window !== "undefined") {
      const storedProfiles = JSON.parse(localStorage.getItem("gokuldham_profile") || "{}");
      storedProfiles[customUserId] = newProfile;
      localStorage.setItem("gokuldham_profile", JSON.stringify(storedProfiles));

      const storedStreaks = JSON.parse(localStorage.getItem("gokuldham_streak") || "{}");
      storedStreaks[customUserId] = newStreak;
      localStorage.setItem("gokuldham_streak", JSON.stringify(storedStreaks));
    }

    audioPipeline.play("CORRECT_GARBA");
    await login(customUserId);
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 text-g-maroon">
      {/* Welcome Registry Gate Blackboard */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1b3d2b] border-8 border-[#5c3e21] rounded-3xl p-6 md:p-8 text-yellow-100 retro-shadow relative overflow-hidden chalk-font shadow-inner"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex-1 space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="bg-g-mustard border-4 border-g-maroon p-3 rounded-full text-g-maroon text-2xl md:text-3xl shadow-sm rotate-[-3deg] w-fit">
              <FaDoorOpen />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-wider text-yellow-300">
              GOKULDHAM GATE
            </h2>
            <p className="text-sm md:text-base text-yellow-100/90 font-medium max-w-xl font-sans leading-relaxed">
              Aatmaram Ramchandra Bhide (Secretary) is verifying all entrants. To enter the ultimate TMKOC quiz platform, select a resident pass or register a new member!
            </p>
          </div>

          <div className="w-full md:w-52 h-32 border-4 border-g-mustard bg-white rounded-xl overflow-hidden shadow-md flex-shrink-0 rotate-[1deg] hover:scale-105 transition-transform duration-300">
            <img src="/TMKOC-/images/gokuldham_society.png" alt="Gokuldham Society" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Resident Quick Login Passes */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center space-x-2 border-b-2 border-g-maroon/20 pb-2">
            <FaUsers className="text-g-teal text-xl" />
            <h3 className="font-display text-2xl font-bold text-g-maroon">
              Resident Quick Passes
            </h3>
          </div>
          <p className="text-xs text-g-maroon/70 font-semibold">
            Log in as one of the legendary members of Gokuldham to inherit their current game progress and ranking:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESIDENTS.map((res, index) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleResidentClick(res)}
                className={`bg-gradient-to-br ${res.bgClass} border-4 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.03] hover:shadow-retro flex flex-col justify-between min-h-[160px] retro-shadow-sm`}
                onMouseEnter={() => audioPipeline.play("TICK_TOCK")}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display text-lg font-extrabold leading-tight">
                        {res.name}
                      </h4>
                      <p className="text-[10px] font-mono opacity-80 mt-0.5">
                        @{res.username}
                      </p>
                    </div>
                    {res.imageSrc ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-g-maroon/20 bg-white flex-shrink-0 shadow-inner">
                        <img src={res.imageSrc} alt={res.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <span className="text-3xl filter drop-shadow-sm">{res.avatar}</span>
                    )}
                  </div>
                  <p className="text-[11px] italic font-semibold font-sans mt-3 line-clamp-2">
                    {res.quote}
                  </p>
                </div>

                <div className="border-t border-black/10 pt-2.5 mt-3 flex justify-between items-center text-[10px] font-bold">
                  <span className="bg-black/5 px-2 py-0.5 rounded border border-black/10">
                    LVL {res.level}
                  </span>
                  <span>💰 {res.coins} | {res.xp} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Member Registry */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center space-x-2 border-b-2 border-g-maroon/20 pb-2">
            <FaUserPlus className="text-g-teal text-xl" />
            <h3 className="font-display text-2xl font-bold text-g-maroon">
              Register New Member
            </h3>
          </div>
          <p className="text-xs text-g-maroon/70 font-semibold">
            First time in the society compound? Write your name on Bhide's register to start your personal quiz journey at Level 1:
          </p>

          <motion.form
            onSubmit={handleCustomSubmit}
            className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {errorMsg && (
              <div className="bg-rose-50 border-2 border-g-terracotta text-g-terracotta text-xs font-bold p-3 rounded-lg animate-pulse">
                {errorMsg}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-g-maroon/70 uppercase tracking-wider block">
                Your Member Name
              </label>
              <input
                type="text"
                maxLength={15}
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="e.g. Champaklal"
                className="w-full px-4 py-3 border-2 border-g-maroon rounded-xl bg-g-bg font-semibold text-sm outline-none focus:border-g-teal focus:ring-1 focus:ring-g-teal text-g-maroon"
              />
            </div>

            {/* Buddy Avatar Picker */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-g-maroon/70 uppercase tracking-wider block">
                Choose Society Buddy
              </label>
              <div className="flex justify-between gap-1">
                {BUDDY_AVATARS.map((avatar) => (
                  <button
                    key={avatar.emoji}
                    type="button"
                    onClick={() => {
                      audioPipeline.play("TICK_TOCK");
                      setSelectedBuddy(avatar.emoji);
                    }}
                    className={`h-11 w-11 flex items-center justify-center rounded-xl border-2 text-2xl transition-all ${
                      selectedBuddy === avatar.emoji
                        ? "bg-g-mustard border-g-maroon scale-110 shadow-sm"
                        : "bg-g-bg border-transparent hover:border-g-maroon/50"
                    }`}
                    title={avatar.label}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Register Action Button */}
            <button
              type="submit"
              className="retro-btn w-full bg-g-teal text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 text-base md:text-lg hover:bg-g-mustard hover:text-g-maroon transition-all"
            >
              <FaKey className="text-sm" />
              <span>Enter Gokuldham Gate</span>
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
