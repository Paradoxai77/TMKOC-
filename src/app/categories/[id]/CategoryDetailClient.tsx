"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES_META } from "@/data/questionsData";
import { useUserStore } from "@/store/userStore";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaHeart,
  FaClock,
  FaPlay,
  FaTimesCircle
} from "react-icons/fa";

export default function CategoryDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { profile } = useUserStore();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const category = CATEGORIES_META.find((cat) => cat.id === id);
  const currentLevel = profile?.current_level || 1;
  const isLocked = category ? currentLevel < category.unlockedAtLevel : true;

  if (!mounted) return null;

  if (!category) {
    return (
      <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-8 text-center retro-shadow">
        <FaTimesCircle className="text-g-terracotta text-5xl mx-auto mb-4 animate-bounce" />
        <h3 className="font-display text-2xl font-bold">Category Not Found!</h3>
        <Link href="/categories" className="inline-block mt-4">
          <button className="retro-btn bg-g-mustard text-g-maroon font-bold py-2 px-4 rounded-xl flex items-center space-x-2">
            <FaArrowLeft /> <span>Back to Categories</span>
          </button>
        </Link>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-8 text-center retro-shadow">
        <FaChalkboardTeacher className="text-g-terracotta text-5xl mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold">Classroom Locked!</h3>
        <p className="text-xs text-g-maroon/70 mt-2 font-semibold">
          Aatmaram Bhide has locked this tuition room. You must reach Level {category.unlockedAtLevel} to enter.
        </p>
        <Link href="/categories" className="inline-block mt-6">
          <button className="retro-btn bg-g-mustard text-g-maroon font-bold py-2 px-4 rounded-xl flex items-center space-x-2">
            <FaArrowLeft /> <span>Back to Categories</span>
          </button>
        </Link>
      </div>
    );
  }

  const startQuiz = () => {
    audioPipeline.play("BALLE_BALLE");
    router.push(`/play?category=${id}&difficulty=${difficulty}`);
  };

  const getDifficultyDetails = () => {
    switch (difficulty) {
      case "easy":
        return { time: "20s", mult: "1.0x", points: "100pts base", desc: "For casual society members. Good to warm up!" };
      case "medium":
        return { time: "15s", mult: "1.5x", points: "150pts base", desc: "For regular repeat-telecast viewers. Medium challenges!" };
      case "hard":
        return { time: "10s", mult: "2.2x", points: "220pts base", desc: "For Gokuldham legends only. Lightning speed required!" };
    }
  };

  const info = getDifficultyDetails();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/categories" onClick={() => audioPipeline.play("TICK_TOCK")}>
        <button className="flex items-center space-x-2 text-xs md:text-sm font-bold text-g-teal hover:text-g-terracotta transition-colors">
          <FaArrowLeft /> <span>Back to Catalog</span>
        </button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Blackboard Panel */}
        <div className="lg:col-span-2 bg-[#1b3d2b] border-8 border-[#5c3e21] rounded-2xl p-6 md:p-8 text-yellow-100 retro-shadow relative overflow-hidden chalk-font min-h-[350px] flex flex-col justify-between shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>

          <div>
            <div className="flex items-center space-x-2 border-b border-white/20 pb-3 mb-6">
              <FaChalkboardTeacher className="text-2xl text-yellow-300" />
              <h3 className="font-display text-xl font-bold tracking-wider text-yellow-300">
                BHIDE'S TUITION BLACKBOARD
              </h3>
            </div>

            {/* Instruction Sheets */}
            <div className="space-y-4 text-xs md:text-sm leading-relaxed font-bold">
              <p className="text-yellow-300 uppercase tracking-widest text-sm">
                Subject: {category.name}
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-4 my-4">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-yellow-300" />
                  <span>Time Limit: <strong className="text-white">{info.time} / question</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaHeart className="text-rose-400 animate-pulse" />
                  <span>Lives Allowed: <strong className="text-white">3 ❤️</strong></span>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-yellow-100/90 font-medium font-sans">
                <li>Score calculations follow deterministic speed decays.</li>
                <li>Streak multiplier scales linearly capping at 3.5x maximum.</li>
                <li>Tab blurs or loss of window focus triggers the <strong>\"Secretary's Penalty\"</strong> (lockout).</li>
                <li>Daya's Garba (50/50) and Abdul's Soda (Poll) power-ups allowed!</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 text-center text-[10px] text-yellow-300/70 font-semibold italic">
            \"Writing thoughts daily builds clean character!\" — Aatmaram Ramchandra Bhide
          </div>
        </div>

        {/* Right Selection & Play Panel */}
        <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-g-maroon border-b-2 border-g-maroon/10 pb-2 mb-4">
              Quiz Setup
            </h3>

            {/* Difficulty Pills */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-g-maroon/60 uppercase tracking-wider block">
                Choose Difficulty
              </label>
              
              {(["easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    audioPipeline.play("TICK_TOCK");
                    setDifficulty(diff);
                  }}
                  className={`w-full text-left p-3 border-2 rounded-xl font-bold transition-all relative ${
                    difficulty === diff
                      ? "bg-g-mustard text-g-maroon border-g-maroon retro-shadow-sm scale-[1.02]"
                      : "bg-g-bg text-g-maroon/70 border-transparent hover:border-g-maroon"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{diff}</span>
                    <span className="text-[10px] bg-g-card border border-g-maroon/20 px-2 py-0.5 rounded-full">
                      {diff === "easy" ? "1.0x" : diff === "medium" ? "1.5x" : "2.2x"} Multiplier
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selection stats */}
            <div className="mt-6 bg-g-bg border-2 border-g-maroon p-4 rounded-xl space-y-2 text-xs font-bold text-g-maroon/80">
              <p>🎯 Base Score: <span className="text-g-terracotta">{info.points}</span></p>
              <p>⏱️ Speed decay: <span className="text-g-teal">Linear based on ticks</span></p>
              <p className="text-[10px] text-g-maroon/60 font-medium italic mt-2">
                {info.desc}
              </p>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="retro-btn w-full mt-8 bg-g-terracotta text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 text-base md:text-lg hover:bg-g-mustard hover:text-g-maroon transition-all"
          >
            <FaPlay className="text-sm" />
            <span>Enter Quiz Arena</span>
          </button>
        </div>
      </div>
    </div>
  );
}
