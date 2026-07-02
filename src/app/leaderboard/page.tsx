"use client";

import React, { useEffect, useState } from "react";
import { supabaseMock, LeaderboardEntry } from "@/lib/supabaseMock";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaTrophy,
  FaAward,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaUserAlt
} from "react-icons/fa";

export default function LeaderboardPage() {
  const [list, setList] = useState<LeaderboardEntry[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchLeaderboard = async () => {
      const data = await supabaseMock.getLeaderboard();
      setList(data);
    };
    fetchLeaderboard();
  }, []);

  if (!mounted) return null;

  // Filter lists based on search
  const filteredList = list.filter((user) =>
    user.username.toLowerCase().includes(searchVal.toLowerCase())
  );

  // Extract Top 3 podium users (safely check length)
  const first = list[0] || null;
  const second = list[1] || null;
  const third = list[2] || null;
  const remaining = filteredList.slice(3);

  const handleUserSearch = (val: string) => {
    setSearchVal(val);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="text-center md:text-left space-y-2">
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-g-maroon">
          Society Leaderboard
        </h2>
        <p className="text-sm md:text-base text-g-maroon/70 font-semibold">
          Check who holds the crown of Gokuldham's smartest member. Keep playing to climb the ranks!
        </p>
      </section>

      {/* Top 3 Podium Displays */}
      {list.length >= 3 && (
        <div className="grid grid-cols-3 items-end gap-2 md:gap-6 max-w-2xl mx-auto pt-6 text-center text-g-maroon font-bold text-xs md:text-sm">
          {/* 2nd Place */}
          {second && (
            <div className="space-y-3">
              <div className="text-2xl md:text-3xl">🥈</div>
              <div className="bg-g-card border-4 border-g-maroon rounded-t-2xl p-3 md:p-5 retro-shadow-sm h-32 md:h-40 flex flex-col justify-between">
                <div>
                  <p className="font-display text-xs md:text-base truncate">@{second.username}</p>
                  <p className="text-[9px] opacity-75 font-semibold">LVL {second.level}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-g-teal">2nd Place</p>
                  <p className="text-sm md:text-lg font-extrabold">{second.score} XP</p>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {first && (
            <div className="space-y-3 z-10 scale-[1.05]">
              <div className="text-3xl md:text-5xl animate-bounce">👑 🥇</div>
              <div className="bg-g-mustard border-4 border-g-maroon rounded-t-3xl p-3 md:p-5 retro-shadow h-40 md:h-48 flex flex-col justify-between">
                <div>
                  <p className="font-display text-xs md:text-lg truncate font-extrabold">@{first.username}</p>
                  <p className="text-[9px] text-g-maroon/80 font-bold">LVL {first.level}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold tracking-wider text-g-terracotta">Gokuldham King</p>
                  <p className="text-base md:text-xl font-extrabold">{first.score} XP</p>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="space-y-3">
              <div className="text-2xl md:text-3xl">🥉</div>
              <div className="bg-g-card border-4 border-g-maroon rounded-t-2xl p-3 md:p-5 retro-shadow-sm h-28 md:h-36 flex flex-col justify-between">
                <div>
                  <p className="font-display text-xs md:text-base truncate">@{third.username}</p>
                  <p className="text-[9px] opacity-75 font-semibold">LVL {third.level}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-g-teal">3rd Place</p>
                  <p className="text-sm md:text-lg font-extrabold">{third.score} XP</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-4 retro-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-g-maroon/50" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => handleUserSearch(e.target.value)}
            placeholder="Search Gokuldham member..."
            className="w-full pl-10 pr-4 py-2 border-2 border-g-maroon rounded-xl bg-g-bg font-semibold text-xs md:text-sm outline-none focus:border-g-teal focus:ring-1 focus:ring-g-teal text-g-maroon"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-g-maroon/70">
          <FaFilter />
          <span>Ranking: XP based</span>
        </div>
      </div>

      {/* Remaining Leaderboard Table */}
      <div className="bg-g-card border-4 border-g-maroon rounded-2xl overflow-hidden retro-shadow">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs md:text-sm font-bold text-g-maroon">
            <thead>
              <tr className="bg-g-teal border-b-4 border-g-maroon text-white font-display text-sm">
                <th className="p-4 w-16">Rank</th>
                <th className="p-4">Member Name</th>
                <th className="p-4 w-24">Level</th>
                <th className="p-4 w-32 text-right">XP Points</th>
              </tr>
            </thead>
            <tbody>
              {/* Top 3 row duplicates for reference in searchable filter */}
              {filteredList.slice(0, 3).map((user, idx) => (
                <tr
                  key={user.user_id}
                  className={`border-b-2 border-g-maroon/10 ${
                    user.user_id === "gokuldham-guest-uuid" ? "bg-amber-50" : "bg-white hover:bg-g-bg/30"
                  }`}
                >
                  <td className="p-4">
                    <span className="bg-g-mustard border border-g-maroon px-2 py-0.5 rounded font-mono text-[10px]">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <FaUserAlt className="text-g-maroon/40 text-xs" />
                    <span className={user.user_id === "gokuldham-guest-uuid" ? "font-extrabold text-g-terracotta" : ""}>
                      @{user.username} {user.user_id === "gokuldham-guest-uuid" && "(Aap)"}
                    </span>
                  </td>
                  <td className="p-4">LVL {user.level}</td>
                  <td className="p-4 text-right text-g-terracotta font-mono font-extrabold">
                    {user.score} XP
                  </td>
                </tr>
              ))}

              {/* Ranks 4+ */}
              {remaining.map((user, index) => {
                const rank = index + 4;
                return (
                  <tr
                    key={user.user_id}
                    className={`border-b-2 border-g-maroon/10 ${
                      user.user_id === "gokuldham-guest-uuid" ? "bg-amber-50" : "bg-white hover:bg-g-bg/30"
                    }`}
                  >
                    <td className="p-4 font-mono text-[11px] opacity-75">#{rank}</td>
                    <td className="p-4 flex items-center space-x-2">
                      <FaUserAlt className="text-g-maroon/40 text-xs" />
                      <span className={user.user_id === "gokuldham-guest-uuid" ? "font-extrabold text-g-terracotta" : ""}>
                        @{user.username} {user.user_id === "gokuldham-guest-uuid" && "(Aap)"}
                      </span>
                    </td>
                    <td className="p-4">LVL {user.level}</td>
                    <td className="p-4 text-right text-g-terracotta font-mono font-extrabold">
                      {user.score} XP
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-g-maroon/60 italic font-semibold">
                    No Gokuldham member found with that name!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
