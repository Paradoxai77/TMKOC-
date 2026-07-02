"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaHome,
  FaList,
  FaUser,
  FaTrophy,
  FaVolumeUp,
  FaVolumeMute,
  FaBolt,
  FaCoins,
  FaChevronRight,
  FaAward
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, streak, isMuted, loadUser, toggleMute, activeTheme } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (mounted) {
      audioPipeline.setMute(isMuted);
    }
  }, [isMuted, mounted]);

  // Handle clicking sounds
  const handleNavClick = () => {
    audioPipeline.play("TICK_TOCK");
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-g-bg text-g-maroon">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-g-teal border-t-transparent"></div>
          <p className="font-display text-2xl font-bold animate-pulse">Duniya Hila Denge... Loading Gokuldham...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Home", href: "/", icon: FaHome },
    { name: "Categories", href: "/categories", icon: FaList },
    { name: "Leaderboard", href: "/leaderboard", icon: FaTrophy },
    { name: "My Profile", href: "/profile", icon: FaUser },
  ];

  // Theme-specific styles
  let themeBg = "bg-g-bg";
  let themeBorder = "border-g-maroon";
  let bannerText = "";

  if (activeTheme === "monsoon") {
    themeBg = "bg-sky-50";
    themeBorder = "border-sky-800";
    bannerText = "🌧️ Gokuldham Society Monsoon Makeover Active! Raincoats and hot tea ready at Abdul's Soda shop!";
  } else if (activeTheme === "diwali") {
    themeBg = "bg-orange-50";
    themeBorder = "border-orange-800";
    bannerText = "🪔 Gokuldham Diwali Celebration Active! Lights, sweets, and quiz firecrackers!";
  } else if (activeTheme === "diet") {
    themeBg = "bg-green-50";
    themeBorder = "border-green-800";
    bannerText = "🥒 Karela Juice Special: Anjali Bhabhi's diet chart active! Avoid wrong answers or get diet snacks!";
  }

  return (
    <div className={`min-h-screen flex flex-col ${themeBg} transition-colors duration-500`}>
      {/* Theme Banner */}
      {bannerText && (
        <div className="bg-g-mustard text-g-maroon font-bold py-2 px-4 text-center text-xs md:text-sm border-b-2 border-g-maroon animate-pulse z-30">
          {bannerText}
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 bg-g-card border-b-4 border-g-maroon z-20 px-4 py-3 flex items-center justify-between retro-shadow-sm">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2" onClick={handleNavClick}>
            <div className="bg-g-mustard border-2 border-g-maroon p-1 rounded-lg shadow-sm">
              <span className="font-display font-extrabold text-xl md:text-2xl text-g-maroon leading-none">GK</span>
            </div>
            <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-g-maroon hidden md:block">
              Gokuldham <span className="text-g-terracotta">Quiz</span>
            </h1>
          </Link>
        </div>

        {/* Stats and Controls */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {profile && (
            <>
              {/* Level Badge */}
              <div className="flex items-center bg-g-bg border-2 border-g-maroon px-2 py-1 rounded-md text-xs font-bold retro-shadow-sm">
                <FaAward className="text-g-mustard mr-1 text-sm md:text-base" />
                <span className="hidden sm:inline">LVL</span> {profile.current_level}
              </div>

              {/* Coins Tracker */}
              <div className="flex items-center bg-yellow-100 border-2 border-g-maroon px-2 py-1 rounded-md text-xs font-bold retro-shadow-sm">
                <FaCoins className="text-g-mustard mr-1 text-sm md:text-base animate-bounce" />
                <span>{profile.coins}</span>
              </div>

              {/* Streak Tracker */}
              {streak && (
                <div className="flex items-center bg-orange-100 border-2 border-g-maroon px-2 py-1 rounded-md text-xs font-bold retro-shadow-sm">
                  <FaBolt className="text-orange-500 mr-1 text-sm md:text-base animate-pulse" />
                  <span>{streak.current_streak}D</span>
                </div>
              )}
            </>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleMute();
              audioPipeline.play("TICK_TOCK");
            }}
            className="p-2 border-2 border-g-maroon bg-g-bg hover:bg-g-mustard rounded-md transition-colors retro-shadow-sm text-g-maroon"
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <FaVolumeMute className="text-sm md:text-base" /> : <FaVolumeUp className="text-sm md:text-base" />}
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 border-r-4 border-g-maroon bg-g-card hidden md:flex flex-col justify-between py-6 px-4 z-10">
          <div className="space-y-4">
            <div className="px-3 mb-4">
              {profile ? (
                <div className="bg-g-bg border-2 border-g-maroon p-3 rounded-lg retro-shadow-sm">
                  <p className="text-xs text-g-maroon/60 font-bold uppercase tracking-wider">Gokuldham Member</p>
                  <p className="font-display text-lg font-extrabold text-g-maroon truncate">@{profile.username}</p>
                  <div className="w-full bg-g-card border border-g-maroon rounded-full h-2.5 mt-2 overflow-hidden">
                    <div
                      className="bg-g-teal h-full transition-all duration-300"
                      style={{ width: `${(profile.current_xp % (profile.current_level * 200)) / (profile.current_level * 2)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-right mt-1 text-g-maroon/70 font-semibold">
                    {profile.current_xp % (profile.current_level * 200)} / {profile.current_level * 200} XP
                  </p>
                </div>
              ) : (
                <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
              )}
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleNavClick}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                      isActive
                        ? "bg-g-teal text-white border-g-maroon shadow-[4px_4px_0px_0px_#4A1F1F]"
                        : "bg-g-bg text-g-maroon border-transparent hover:border-g-maroon hover:shadow-[4px_4px_0px_0px_#4A1F1F]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="text-lg" />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <FaChevronRight className="text-xs" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-3 text-center border-t-2 border-g-maroon/20 pt-4">
            <p className="text-[10px] font-bold text-g-maroon/60 uppercase">Society Notice</p>
            <p className="text-xs italic text-g-maroon/80 font-medium mt-1">
              \"Maintenance bill is due on time!\" - Bhide
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-6xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-g-card border-t-4 border-g-maroon flex md:hidden items-center justify-around py-3 px-2 z-20 retro-shadow-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-lg border-2 transition-all ${
                isActive
                  ? "bg-g-teal text-white border-g-maroon retro-shadow-sm"
                  : "text-g-maroon border-transparent"
              }`}
            >
              <item.icon className="text-lg" />
              <span className="text-[10px] font-extrabold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
