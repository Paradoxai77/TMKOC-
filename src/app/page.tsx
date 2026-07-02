"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaCheckCircle,
  FaRegCircle,
  FaArrowRight,
  FaCoffee,
  FaInfoCircle,
  FaBuilding,
  FaBolt,
  FaMapMarkerAlt
} from "react-icons/fa";
import { motion } from "framer-motion";

const DAILY_SUVICHARS = [
  "\"Discipline is the foundation of Gokuldham Society!\" — A.R. Bhide (Secretary)",
  "\"Hey Maa, Mataji! Play the quiz and do some garba!\" — Daya Gada",
  "\"Babuchak! Don't look up answers on another tab, Bhide is watching!\" — Jethalal",
  "\"A cup of soda after a long quiz cures all stress.\" — Taarak Mehta",
  "\"Balle Balle! Today we play with full speed and full power!\" — Sodhi",
  "\"Nonsense! Bagha, prepare the points voucher!\" — Jethalal"
];

export default function HomePage() {
  const { profile, streak, completeDailyTask, visitSodaShop } = useUserStore();
  const [suvichar, setSuvichar] = useState(DAILY_SUVICHARS[0]);
  const [activeBuildingInfo, setActiveBuildingInfo] = useState<string | null>(null);

  useEffect(() => {
    // Pick a random suvichar
    const idx = Math.floor(Math.random() * DAILY_SUVICHARS.length);
    setSuvichar(DAILY_SUVICHARS[idx]);
  }, []);

  const handleTaskClick = (taskName: "collectBhideChecks" | "fixSodhiJeep" | "sodaShopVisit") => {
    audioPipeline.play("CORRECT_GARBA");
    if (taskName === "sodaShopVisit") {
      visitSodaShop();
    } else {
      completeDailyTask(taskName);
    }
  };

  const getFloorCharacterInfo = (floor: number) => {
    switch (floor) {
      case 0:
        return "Ground Floor: Abdul's Soda Shop. Open for daily check-ins!";
      case 1:
        return "1st Floor: Jethalal, Bhide & Taarak's flats. Unlock by reaching Level 6!";
      case 2:
        return "2nd Floor: Iyer, Dr. Hathi & Sodhi's flats. Unlock by reaching Level 16!";
      case 3:
        return "Terrace & Water Tank: The elite battleground. Unlock by reaching Level 26!";
      default:
        return "Gokuldham Society Blocks";
    }
  };

  const triggerEasterEggClock = () => {
    audioPipeline.play("ALARM_JETHER");
    if (typeof window !== "undefined") {
      localStorage.setItem("gokuldham_alarm_easter_egg", "true");
    }
    alert("🚨 ALARM TRIGGERED! Jethalal is late for Gada Electronics! You unlocked a secret!");
  };

  const currentLevel = profile?.current_level || 1;
  const unlockedFloor = profile?.unlocked_floor || 0;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <section className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 md:p-8 retro-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-g-mustard opacity-20 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="bg-g-terracotta text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Welcome to Powder Galli
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-g-maroon">
              Kem Cho, {profile?.username || "Gokuldham Member"}?
            </h2>
            <p className="text-sm md:text-base text-g-maroon/80 font-medium max-w-lg">
              Test your knowledge of India's favorite comedy show. Climb floors, use legendary power-ups, and avoid the Secretary's penalty!
            </p>
          </div>

          <Link href="/categories" onClick={() => audioPipeline.play("BALLE_BALLE")}>
            <button className="retro-btn bg-g-mustard text-g-maroon font-bold py-3 px-6 rounded-xl flex items-center space-x-2 text-base md:text-lg group hover:bg-g-terracotta hover:text-white transition-colors duration-150">
              <span>Start Play</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* Daily Blackboard Notice Ticker */}
      <div className="bg-g-teal border-4 border-g-maroon rounded-xl p-3 retro-shadow-sm flex items-center space-x-3 text-white overflow-hidden">
        <span className="bg-g-terracotta border-2 border-g-maroon font-display px-3 py-1 rounded-md text-xs font-extrabold shadow-sm flex-shrink-0 animate-pulse">
          NOTICE BOARD
        </span>
        <div className="w-full relative whitespace-nowrap overflow-hidden text-xs md:text-sm font-bold">
          <span className="inline-block pl-[100%] animate-[marquee_20s_linear_infinite] hover:pause">
            {suvichar}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Maintenance Tasks (Quests) */}
        <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-g-maroon/20 pb-3 mb-4">
              <h3 className="font-display text-2xl font-bold text-g-maroon">Maintenance Sheet</h3>
              <span className="text-xs font-bold text-g-maroon/60 uppercase">Daily Tasks</span>
            </div>

            <p className="text-xs text-g-maroon/70 mb-4 font-semibold">
              Complete your daily society chores to keep Bhide happy and earn bonus Coins & XP.
            </p>

            <div className="space-y-3">
              {/* Task 1 */}
              <div
                className={`flex items-start p-3 rounded-xl border-2 transition-all ${
                  streak?.daily_tasks.collectBhideChecks
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : "bg-g-bg border-g-maroon/20 opacity-75"
                }`}
              >
                <div className="mr-3 mt-1 text-lg">
                  {streak?.daily_tasks.collectBhideChecks ? (
                    <FaCheckCircle className="text-emerald-600" />
                  ) : (
                    <FaRegCircle />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">Collect Maintenance Checks</h4>
                  <p className="text-[10px] opacity-80 mt-0.5">Complete any 2 Trivia / Category Quizzes.</p>
                </div>
              </div>

              {/* Task 2 */}
              <div
                className={`flex items-start p-3 rounded-xl border-2 transition-all ${
                  streak?.daily_tasks.fixSodhiJeep
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : "bg-g-bg border-g-maroon/20 opacity-75"
                }`}
              >
                <div className="mr-3 mt-1 text-lg">
                  {streak?.daily_tasks.fixSodhiJeep ? (
                    <FaCheckCircle className="text-emerald-600" />
                  ) : (
                    <FaRegCircle />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">Fix Sodhi's Jeep</h4>
                  <p className="text-[10px] opacity-80 mt-0.5">Complete any Speed Round or Hard Quiz.</p>
                </div>
              </div>

              {/* Task 3 */}
              <div
                onClick={() => !streak?.daily_tasks.sodaShopVisit && handleTaskClick("sodaShopVisit")}
                className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  streak?.daily_tasks.sodaShopVisit
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : "bg-g-bg border-g-maroon/20 hover:border-g-maroon"
                }`}
              >
                <div className="mr-3 mt-1 text-lg">
                  {streak?.daily_tasks.sodaShopVisit ? (
                    <FaCheckCircle className="text-emerald-600" />
                  ) : (
                    <FaRegCircle />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">Visit Abdul's Soda Shop</h4>
                  <p className="text-[10px] opacity-80 mt-0.5">Tap to check-in for evening soda gathering.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t-2 border-g-maroon/20 pt-4 flex items-center justify-between text-xs font-bold text-g-maroon/70">
            <span>Progress: {Object.values(streak?.daily_tasks || {}).filter(Boolean).length}/3</span>
            {streak?.maintenance_sheet_completed && (
              <span className="text-emerald-600 flex items-center">
                Sheet Completed! +100XP 🏆
              </span>
            )}
          </div>
        </div>

        {/* Interactive Gokuldham Building Facade Map */}
        <div className="lg:col-span-2 bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-g-maroon/20 pb-3 mb-4">
              <h3 className="font-display text-2xl font-bold text-g-maroon flex items-center">
                <FaBuilding className="mr-2 text-g-teal" /> Gokuldham Facade Progress
              </h3>
              <button 
                onClick={triggerEasterEggClock}
                className="text-xs bg-g-bg border-2 border-g-maroon font-bold py-1 px-2 rounded-md hover:bg-g-mustard transition-colors retro-shadow-sm"
              >
                ⏰ Easter Egg
              </button>
            </div>

            <p className="text-xs text-g-maroon/70 mb-6 font-semibold">
              Your level unlocks different blocks of Gokuldham. Click on the floors below to inspect residents!
            </p>

            {/* Building Layout Container */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              {/* Building Grid */}
              <div className="space-y-4 max-w-md w-full">
                {/* Terrace (Lvl 26+) */}
                <div
                  onClick={() => setActiveBuildingInfo(getFloorCharacterInfo(3))}
                  className={`border-4 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    unlockedFloor >= 3
                      ? "bg-blue-100 border-blue-500 hover:bg-blue-200"
                      : "bg-gray-100 border-gray-400 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="font-display text-lg font-bold">The Terrace / Water Tank</div>
                  <div className="text-[10px] font-bold text-g-maroon/60 mt-0.5">
                    {unlockedFloor >= 3 ? "🔓 UNLOCKED (Level 26+)" : "🔒 Unlocks at Level 26"}
                  </div>
                </div>

                {/* 2nd Floor (Lvl 16+) */}
                <div
                  onClick={() => setActiveBuildingInfo(getFloorCharacterInfo(2))}
                  className={`border-4 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    unlockedFloor >= 2
                      ? "bg-amber-100 border-amber-500 hover:bg-amber-200"
                      : "bg-gray-100 border-gray-400 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="font-display text-lg font-bold">2nd Floor (Sodhi, Iyer, Dr. Hathi)</div>
                  <div className="text-[10px] font-bold text-g-maroon/60 mt-0.5">
                    {unlockedFloor >= 2 ? "🔓 UNLOCKED (Level 16+)" : "🔒 Unlocks at Level 16"}
                  </div>
                </div>

                {/* 1st Floor (Lvl 6+) */}
                <div
                  onClick={() => setActiveBuildingInfo(getFloorCharacterInfo(1))}
                  className={`border-4 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    unlockedFloor >= 1
                      ? "bg-teal-100 border-teal-500 hover:bg-teal-200"
                      : "bg-gray-100 border-gray-400 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="font-display text-lg font-bold">1st Floor (Jethalal, Bhide, Taarak)</div>
                  <div className="text-[10px] font-bold text-g-maroon/60 mt-0.5">
                    {unlockedFloor >= 1 ? "🔓 UNLOCKED (Level 6+)" : "🔒 Unlocks at Level 6"}
                  </div>
                </div>

                {/* Ground Floor (Lvl 1+) */}
                <div
                  onClick={() => setActiveBuildingInfo(getFloorCharacterInfo(0))}
                  className="border-4 border-g-teal rounded-xl p-4 text-center cursor-pointer bg-emerald-100 hover:bg-emerald-200 transition-all"
                >
                  <div className="font-display text-lg font-bold text-g-maroon">Ground Floor (Abdul's Soda Shop)</div>
                  <div className="text-[10px] font-bold text-emerald-800 mt-0.5">🔓 ALWAYS UNLOCKED (Level 1+)</div>
                </div>
              </div>

              {/* Building Illustration */}
              <div className="w-full max-w-[280px] border-4 border-g-maroon rounded-2xl overflow-hidden retro-shadow flex-shrink-0 bg-white rotate-[1.5deg] hover:scale-105 transition-transform duration-300">
                <img src="/images/gokuldham_society.png" alt="Gokuldham Society" className="w-full h-auto object-cover aspect-[4/3]" />
                <div className="bg-g-maroon text-yellow-100 text-center font-display py-1.5 font-bold text-xs uppercase tracking-wider">
                  Clubhouse Compound View
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Info Board */}
          <div className="mt-6 bg-g-bg border-2 border-g-maroon p-3 rounded-xl flex items-start space-x-2 text-xs font-bold">
            <FaInfoCircle className="text-g-teal mt-0.5 text-base flex-shrink-0" />
            <span>
              {activeBuildingInfo || "Click a floor to see which Gokuldham characters reside there!"}
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
