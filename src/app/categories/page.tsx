"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { CATEGORIES_META } from "@/data/questionsData";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaBuilding,
  FaUsers,
  FaCommentDots,
  FaImage,
  FaSmile,
  FaSortAmountDown,
  FaRunning,
  FaLock,
  FaArrowRight
} from "react-icons/fa";

// Map strings to React Icons
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  FaBuilding: FaBuilding,
  FaUsers: FaUsers,
  FaCommentDots: FaCommentDots,
  FaImage: FaImage,
  FaSmile: FaSmile,
  FaSortAmountDown: FaSortAmountDown,
  FaRunning: FaRunning,
};

export default function CategoriesPage() {
  const { profile } = useUserStore();
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const currentLevel = profile?.current_level || 1;

  const filteredCategories = CATEGORIES_META.filter((cat) => {
    if (filterDifficulty === "all") return true;
    return cat.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "hard":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleCategoryClick = (isLocked: boolean) => {
    if (isLocked) {
      audioPipeline.play("WRONG_TRING");
      alert("🔒 This category is locked! Keep leveling up to unlock it.");
    } else {
      audioPipeline.play("TICK_TOCK");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="text-center md:text-left space-y-2">
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-g-maroon">
          Quiz Categories
        </h2>
        <p className="text-sm md:text-base text-g-maroon/70 font-semibold">
          Select a topic to test your knowledge. Harder categories award larger speed bonuses and multipliers!
        </p>
      </section>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {["all", "easy", "medium", "hard"].map((diff) => (
          <button
            key={diff}
            onClick={() => {
              audioPipeline.play("TICK_TOCK");
              setFilterDifficulty(diff);
            }}
            className={`px-4 py-2 border-2 border-g-maroon rounded-full font-bold text-xs md:text-sm transition-all retro-shadow-sm ${
              filterDifficulty === diff
                ? "bg-g-mustard text-g-maroon"
                : "bg-g-card text-g-maroon/80 hover:bg-g-bg"
            }`}
          >
            {diff.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || FaBuilding;
          const isLocked = currentLevel < cat.unlockedAtLevel;

          return (
            <div
              key={cat.id}
              className={`bg-g-card border-4 border-g-maroon rounded-2xl p-6 retro-shadow flex flex-col justify-between relative transition-all duration-150 ${
                isLocked ? "opacity-75" : "hover:translate-y-[-4px]"
              }`}
            >
              {/* Lock Overlay Badge */}
              {isLocked && (
                <div className="absolute top-4 right-4 bg-g-maroon text-white p-2 rounded-full border-2 border-white flex items-center justify-center retro-shadow-sm">
                  <FaLock className="text-xs" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-g-bg border-2 border-g-maroon p-3 rounded-xl text-g-teal text-xl md:text-2xl shadow-sm">
                    <IconComponent />
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-g-maroon leading-tight">
                      {cat.name}
                    </h3>
                    <div className="flex space-x-2 mt-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 ${getDifficultyColor(cat.difficulty)}`}>
                        {cat.difficulty}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-g-maroon/20 bg-g-bg text-g-maroon/60">
                        {cat.questionsCount} Questions
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-g-maroon/80 leading-relaxed font-semibold">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-g-maroon/10 flex items-center justify-between">
                {isLocked ? (
                  <span className="text-[10px] font-bold text-g-terracotta bg-red-50 border-2 border-red-200 px-2.5 py-1 rounded-md">
                    🔒 Locks until Level {cat.unlockedAtLevel}
                  </span>
                ) : (
                  <Link
                    href={`/categories/${cat.id}`}
                    onClick={() => handleCategoryClick(false)}
                    className="w-full"
                  >
                    <button className="retro-btn w-full bg-g-teal text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs md:text-sm hover:bg-g-mustard hover:text-g-maroon transition-colors duration-150">
                      <span>Enter Room</span>
                      <FaArrowRight />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
