"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { supabaseMock, GameLog } from "@/lib/supabaseMock";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaUserAlt,
  FaCalendarCheck,
  FaAward,
  FaBuilding,
  FaPaintBrush,
  FaCoins,
  FaBolt,
  FaGamepad,
  FaLock
} from "react-icons/fa";

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, streak, activeTheme, changeTheme, logout } = useUserStore();
  const [history, setHistory] = useState<GameLog[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!profile) return;
    const fetchHistory = async () => {
      const logs = await supabaseMock.getGameHistory(profile.id);
      setHistory(logs);
    };
    fetchHistory();
  }, [profile]);

  if (!mounted) return null;

  const currentLevel = profile?.current_level || 1;
  const unlockedFloor = profile?.unlocked_floor || 0;
  const currentStreak = streak?.current_streak || 0;

  // Badge list logic
  const badges: Badge[] = [
    {
      id: "b1",
      name: "Chai-Biscuit Fan",
      desc: "Used Bapuji's lecture to revive once.",
      icon: "☕",
      unlocked: typeof window !== "undefined" && profile ? !!localStorage.getItem(`gokuldham_revive_used_${profile.id}`) : false,
    },
    {
      id: "b2",
      name: "Late for Gada Electronics",
      desc: "Triggered Jethalal's easter egg alarm.",
      icon: "🚨",
      unlocked: typeof window !== "undefined" && !!localStorage.getItem("gokuldham_alarm_easter_egg"),
    },
    {
      id: "b3",
      name: "Disciplined Member",
      desc: "Achieve a running streak of 3+ days.",
      icon: "✍🏽",
      unlocked: currentStreak >= 3,
    },
    {
      id: "b4",
      name: "Garba Champion",
      desc: "Used Daya's 50-50 power-up 3+ times.",
      icon: "💃🏽",
      unlocked: typeof window !== "undefined" && profile ? parseInt(localStorage.getItem(`gokuldham_garba_powerups_used_${profile.id}`) || "0") >= 3 : false,
    }
  ];

  // Simulated streak dates (7 days)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();
  
  const handleThemeChange = (themeName: "regular" | "monsoon" | "diwali" | "diet") => {
    audioPipeline.play("BALLE_BALLE");
    changeTheme(themeName);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <section className="bg-g-card border-4 border-g-maroon rounded-3xl p-6 retro-shadow relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="bg-g-mustard border-4 border-g-maroon p-6 rounded-full retro-shadow-sm text-g-maroon text-4xl">
          <FaUserAlt />
        </div>
        <div className="space-y-2 flex-1">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-g-maroon leading-tight">
            @{profile?.username || "Gokuldham Member"}
          </h2>
          <p className="text-xs font-bold text-g-maroon/70">
            Current Floor Unlock: <span className="text-g-teal">{unlockedFloor === 0 ? "Ground Floor (Soda Shop)" : `Floor ${unlockedFloor}`}</span>
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
            <div className="flex items-center space-x-1 text-xs font-bold">
              <FaCoins className="text-g-mustard" />
              <span>{profile?.coins} Coins</span>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold">
              <FaBolt className="text-orange-500 animate-pulse" />
              <span>{streak?.current_streak}D Daily Streak</span>
            </div>
          </div>
        </div>
        
        {/* Logout Action */}
        <div className="flex-shrink-0">
          <button
            onClick={() => {
              audioPipeline.play("WRONG_TRING");
              logout();
              router.push("/login");
            }}
            className="retro-btn bg-g-terracotta text-white font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-g-mustard hover:text-g-maroon transition-all"
          >
            🚪 Log Out of Gate
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Stats and Streak Calendar */}
        <div className="space-y-8">
          {/* General Stats */}
          <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow">
            <h3 className="font-display text-xl font-bold text-g-maroon border-b-2 border-g-maroon/10 pb-2 mb-4 flex items-center">
              <FaGamepad className="mr-2 text-g-teal" /> Game Progress
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-g-maroon">
              <div className="bg-g-bg border border-g-maroon/10 p-3 rounded-xl">
                <p className="text-g-maroon/60 text-[10px] uppercase">Total XP</p>
                <p className="text-lg font-extrabold">{profile?.current_xp} XP</p>
              </div>
              <div className="bg-g-bg border border-g-maroon/10 p-3 rounded-xl">
                <p className="text-g-maroon/60 text-[10px] uppercase">Current Level</p>
                <p className="text-lg font-extrabold">LVL {profile?.current_level}</p>
              </div>
              <div className="bg-g-bg border border-g-maroon/10 p-3 rounded-xl">
                <p className="text-g-maroon/60 text-[10px] uppercase">Quizzes Played</p>
                <p className="text-lg font-extrabold">{history.length} Games</p>
              </div>
              <div className="bg-g-bg border border-g-maroon/10 p-3 rounded-xl">
                <p className="text-g-maroon/60 text-[10px] uppercase">Max Streak</p>
                <p className="text-lg font-extrabold">{streak?.longest_streak} Days</p>
              </div>
            </div>
          </div>

          {/* 7-Day Streak Calendar */}
          <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow">
            <h3 className="font-display text-xl font-bold text-g-maroon border-b-2 border-g-maroon/10 pb-2 mb-4 flex items-center">
              <FaCalendarCheck className="mr-2 text-g-teal" /> Streak Calendar
            </h3>
            <p className="text-xs text-g-maroon/60 font-semibold mb-4">
              Complete quizzes daily to maintain your fire streak.
            </p>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold">
              {weekdays.map((day, idx) => {
                const isToday = idx === todayIndex;
                const isPlayed = idx <= todayIndex && streak?.current_streak && streak.current_streak > 0;
                
                return (
                  <div key={day} className="space-y-2">
                    <div className="text-[10px] opacity-75">{day}</div>
                    <div
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg border-2 ${
                        isPlayed
                          ? "bg-orange-100 border-orange-500 text-orange-600 font-extrabold scale-105"
                          : isToday
                          ? "bg-g-bg border-g-mustard text-g-maroon animate-pulse"
                          : "bg-g-bg border-g-maroon/10 text-g-maroon/30"
                      }`}
                    >
                      {isPlayed ? "🔥" : idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Floor Blueprint Diagram Map */}
        <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-g-maroon border-b-2 border-g-maroon/10 pb-2 mb-4 flex items-center">
              <FaBuilding className="mr-2 text-g-teal" /> Floor Blueprint
            </h3>
            <p className="text-xs text-g-maroon/60 font-semibold mb-6">
              Level up to unlock higher building areas and premium items.
            </p>

            {/* Visual Floor lock layers */}
            <div className="space-y-4 max-w-sm mx-auto">
              {[3, 2, 1, 0].map((floor) => {
                const isUnlocked = unlockedFloor >= floor;
                let floorName = "";
                let residents = "";
                
                if (floor === 3) { floorName = "The Terrace"; residents = "Water Tank & Festive decorations"; }
                if (floor === 2) { floorName = "2nd Floor Flats"; residents = "Iyer, Dr. Hathi & Sodhi flats"; }
                if (floor === 1) { floorName = "1st Floor Flats"; residents = "Jethalal, Bhide & Taarak flats"; }
                if (floor === 0) { floorName = "Ground Floor"; residents = "Abdul's Soda Shop & Compound"; }

                return (
                  <div
                    key={floor}
                    className={`border-2 rounded-xl p-4 flex justify-between items-center transition-all ${
                      isUnlocked
                        ? "bg-g-bg border-g-maroon hover:shadow-retro-hover"
                        : "bg-gray-100 border-gray-300 opacity-60 text-gray-500"
                    }`}
                  >
                    <div>
                      <h4 className="font-display text-sm font-extrabold text-g-maroon capitalize">{floorName}</h4>
                      <p className="text-[10px] text-g-maroon/70 font-semibold mt-0.5">{residents}</p>
                    </div>
                    <div>
                      {isUnlocked ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-200 text-gray-700 border border-gray-400 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                          <FaLock className="text-[8px]" />
                          <span>Lvl {floor === 3 ? 26 : floor === 2 ? 16 : 6}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Badges and Cosmetic Themes */}
        <div className="space-y-8">
          {/* Themes Panel */}
          <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow">
            <h3 className="font-display text-xl font-bold text-g-maroon border-b-2 border-g-maroon/10 pb-2 mb-4 flex items-center">
              <FaPaintBrush className="mr-2 text-g-teal" /> Cosmetic Themes
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "regular", name: "Regular Theme", color: "bg-[#FBF2DC] border-[#4A1F1F]" },
                { id: "monsoon", name: "Monsoon Special", color: "bg-[#E0F2FE] border-[#0369A1]" },
                { id: "diwali", name: "Diwali Lights", color: "bg-[#FFEDD5] border-[#C2410C]" },
                { id: "diet", name: "Diet Green", color: "bg-[#DCFCE7] border-[#15803D]" },
              ].map((t) => {
                const isActive = activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id as any)}
                    className={`p-3 border-2 rounded-xl text-[10px] font-bold text-left transition-all ${t.color} ${
                      isActive ? "ring-4 ring-g-mustard scale-105" : "hover:scale-[1.02]"
                    }`}
                  >
                    <div className="h-4 w-full rounded-md bg-white border border-black/10 mb-2"></div>
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badges showcase */}
          <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow">
            <h3 className="font-display text-xl font-bold text-g-maroon border-b-2 border-g-maroon/10 pb-2 mb-4 flex items-center">
              <FaAward className="mr-2 text-g-teal" /> Badge Showcase
            </h3>

            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center space-x-3 p-3 border-2 rounded-xl ${
                    badge.unlocked
                      ? "bg-g-bg border-g-maroon"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-2xl">{badge.unlocked ? badge.icon : "🔒"}</div>
                  <div>
                    <h4 className="font-bold text-xs">{badge.name}</h4>
                    <p className="text-[9px] text-g-maroon/70 font-semibold">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
