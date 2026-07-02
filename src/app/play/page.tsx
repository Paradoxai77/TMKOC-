"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMachine } from "@xstate/react";
import { quizMachine } from "@/machines/quizMachine";
import { QUESTIONS_DATA } from "@/data/questionsData";
import { useUserStore } from "@/store/userStore";
import { supabaseMock } from "@/lib/supabaseMock";
import { audioPipeline } from "@/lib/audioPipeline";
import {
  FaHeart,
  FaClock,
  FaBolt,
  FaTrophy,
  FaCoins,
  FaVolumeUp,
  FaChevronRight,
  FaRedo,
  FaTimes,
  FaQuestionCircle,
  FaLightbulb,
  FaSortUp,
  FaSortDown,
  FaSmileWink
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayArenaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, gainXP, loadUser } = useUserStore();
  
  const categoryId = searchParams.get("category") || "society_trivia";
  const difficulty = searchParams.get("difficulty") || "easy";

  // Filter questions for the session
  const sessionQuestions = QUESTIONS_DATA.filter(
    (q) => q.category === categoryId
  );

  // Fallback to all questions if none match
  const activeQuestions = sessionQuestions.length > 0 ? sessionQuestions : QUESTIONS_DATA.slice(0, 3);

  // Initialize XState Machine
  const [state, send] = useMachine(quizMachine);
  const context = state.context;
  const currentQuestion = context.questions[context.currentIndex];

  const [cheatSuspended, setCheatSuspended] = useState(false);
  const [textVal, setTextVal] = useState("");
  const [sequenceItems, setSequenceItems] = useState<string[]>([]);
  const hasLoggedResult = useRef(false);

  // Start the quiz
  useEffect(() => {
    send({ type: "START_QUIZ", questions: activeQuestions });
    hasLoggedResult.current = false;
  }, [send, activeQuestions]);

  // High precision timer tick in active question state
  useEffect(() => {
    if (state.matches("questionActive")) {
      const timer = setInterval(() => {
        send({ type: "TICK", ms: 100 });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [state.value, send]);

  // Play alarm sound if timer is running low (< 3 seconds)
  useEffect(() => {
    if (state.matches("questionActive") && context.timeLeft > 0 && context.timeLeft <= 3000) {
      audioPipeline.play("TICK_TOCK");
    }
  }, [context.timeLeft, state.value]);

  // Tab blur interceptor - Secretary's Penalty
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.matches("questionActive")) {
        audioPipeline.play("ALARM_JETHER");
        send({ type: "TIMEOUT" });
        setCheatSuspended(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.value, send]);

  // Sync results when game ends
  useEffect(() => {
    if ((state.matches("victory") || state.matches("gameOver")) && !hasLoggedResult.current) {
      hasLoggedResult.current = true;
      const syncData = async () => {
        try {
          const finalScore = context.score;
          // Calculate correct answers count
          const correctCount = state.matches("victory")
            ? context.questions.length - context.revivedCount
            : Math.max(0, context.currentIndex - (context.lives === 0 ? 1 : 0));
          
          // Log game session
          await supabaseMock.logGameSession(
            categoryId,
            difficulty,
            finalScore,
            correctCount,
            context.questions.length,
            profile?.id
          );

          // Award coins and XP
          const earnedXP = finalScore;
          const earnedCoins = Math.floor(finalScore / 10);
          await gainXP(earnedXP, earnedCoins);
          await loadUser(); // refresh global state
        } catch (e) {
          console.error("Failed to sync quiz results:", e);
        }
      };
      syncData();
    }
  }, [state.value, context.score, gainXP, loadUser, categoryId, difficulty, context.questions.length, context.currentIndex, context.lives, context.revivedCount]);

  // Trigger feedback sounds
  useEffect(() => {
    if (state.matches("correctFeedback")) {
      audioPipeline.play("CORRECT_GARBA");
    }
    if (state.matches("incorrectFeedback")) {
      audioPipeline.play("WRONG_TRING");
    }
    if (state.matches("victory")) {
      audioPipeline.play("BALLE_BALLE");
    }
    if (state.matches("gameOver")) {
      audioPipeline.play("WRONG_TRING");
    }
  }, [state.value]);

  // Populate sorting sequence items when current question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.q_type === "sequence") {
      // Shuffle sequence items initially
      const shuffled = [...currentQuestion.sequence_items]
        .sort(() => Math.random() - 0.5)
        .map(i => i.text);
      setSequenceItems(shuffled);
    }
    setTextVal("");
  }, [context.currentIndex, currentQuestion]);

  if (cheatSuspended) {
    return (
      <div className="max-w-2xl mx-auto bg-g-card border-8 border-g-terracotta rounded-2xl p-8 text-center retro-shadow text-g-maroon space-y-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-g-terracotta">
          SECRETARY'S PENALTY!
        </h2>
        <div className="bg-red-100 border-4 border-g-terracotta rounded-xl p-4 font-mono text-sm leading-relaxed text-red-900 font-bold">
          "Aatmaram Ramchandra Bhide caught you minimizing the page or switching tabs to search Google! Gokuldham Notice Board explicitly forbids un-disciplined behavior."
        </div>
        <p className="text-xs md:text-sm font-semibold">
          Your current question timer was forced to expire. Lives may have been consumed!
        </p>
        <button
          onClick={() => {
            audioPipeline.play("TICK_TOCK");
            setCheatSuspended(false);
          }}
          className="retro-btn bg-g-teal text-white font-bold py-3 px-6 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-colors"
        >
          I Promise Discipline, Resume Play
        </button>
      </div>
    );
  }

  // Loading, victory, and gameOver states layout
  if (state.matches("idle") || state.matches("loading")) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 animate-bounce mx-auto text-g-mustard text-6xl">☂️</div>
          <p className="font-display text-2xl font-bold animate-pulse text-g-maroon">
            \"Duniya hila denge...\" preloading Bhide's blackboard...
          </p>
        </div>
      </div>
    );
  }

  if (state.matches("victory")) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-g-card border-4 border-g-maroon rounded-3xl p-8 text-center retro-shadow space-y-6"
      >
        <div className="text-6xl">🏆</div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-g-teal">
          Gokuldham Mahotsav!
        </h2>
        <p className="text-sm md:text-base font-bold text-g-maroon/80">
          Perfect! You completed all questions in the room. Jethalal is celebrating with special Jalebi-Fafda!
        </p>

        <div className="bg-g-bg border-2 border-g-maroon rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs font-bold text-g-maroon">
          <div>
            <p className="text-g-maroon/60 text-[10px] uppercase">Earned Score</p>
            <p className="text-2xl font-extrabold text-g-terracotta">{context.score} pts</p>
          </div>
          <div>
            <p className="text-g-maroon/60 text-[10px] uppercase">Reward Coins</p>
            <p className="text-2xl font-extrabold text-g-mustard flex items-center justify-center">
              <FaCoins className="mr-1" /> +{Math.floor(context.score / 10)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => router.push("/categories")}
            className="retro-btn bg-g-teal text-white font-bold py-3 px-6 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-all"
          >
            Choose Another Category
          </button>
          <button
            onClick={() => send({ type: "START_QUIZ", questions: activeQuestions })}
            className="retro-btn bg-g-bg text-g-maroon border-2 border-g-maroon font-bold py-3 px-6 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-all flex items-center justify-center space-x-2"
          >
            <FaRedo /> <span>Play Again</span>
          </button>
        </div>
      </motion.div>
    );
  }

  if (state.matches("gameOver")) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-g-card border-4 border-g-maroon rounded-3xl p-8 text-center retro-shadow space-y-6"
      >
        <div className="text-6xl animate-bounce">👴🏽</div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-g-terracotta">
          HEI MAA, MATAJI!
        </h2>
        <p className="text-sm md:text-base font-semibold text-g-maroon/80">
          You consumed all lives. Bapuji (Champaklal) is walking over to give you a long moral lecture on studying show history properly!
        </p>

        {/* Bapuji Revive Lecture system */}
        {context.revivedCount === 0 ? (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 space-y-3">
            <p className="text-xs text-orange-900 font-bold italic leading-relaxed">
              \"Arey Babuchak! What is this nonsense? Gada Electronics needs focus. Listen to my lecture for 10 seconds, get tea from Abdul, and revive!\"
            </p>
            <button
              onClick={() => {
                audioPipeline.play("ALARM_JETHER");
                send({ type: "REVIVE" });
              }}
              className="retro-btn w-full bg-g-mustard text-g-maroon font-extrabold py-3 px-4 rounded-xl text-xs md:text-sm hover:bg-g-teal hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              <span>Accept Bapuji's Lecture & Revive (1 ❤️)</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-g-maroon/60 font-bold uppercase tracking-wider">
            (No remaining Bapuji Revives available for this session)
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => router.push("/categories")}
            className="retro-btn bg-g-teal text-white font-bold py-3 px-6 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-all"
          >
            Return to Classroom
          </button>
          <button
            onClick={() => send({ type: "START_QUIZ", questions: activeQuestions })}
            className="retro-btn bg-g-bg text-g-maroon border-2 border-g-maroon font-bold py-3 px-6 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-all flex items-center justify-center space-x-2"
          >
            <FaRedo /> <span>Restart Quiz</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Active playing view
  const percentLeft = (context.timeLeft / (context.totalTime * 1000)) * 100;
  const isMcq = currentQuestion?.q_type === "mcq";
  const isBoolean = currentQuestion?.q_type === "boolean";
  const isTextInput = currentQuestion?.q_type === "text_input";
  const isSequence = currentQuestion?.q_type === "sequence";

  const handleMcqSelect = (optId: string) => {
    send({ type: "SUBMIT_MCQ", optionId: optId, elapsedMs: context.totalTime * 1000 - context.timeLeft });
  };

  const handleBooleanSelect = (val: boolean) => {
    send({ type: "SUBMIT_BOOLEAN", value: val, elapsedMs: context.totalTime * 1000 - context.timeLeft });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textVal.trim()) return;
    send({ type: "SUBMIT_TEXT", text: textVal.trim(), elapsedMs: context.totalTime * 1000 - context.timeLeft });
  };

  const moveSequenceItem = (index: number, direction: "up" | "down") => {
    audioPipeline.play("TICK_TOCK");
    const items = [...sequenceItems];
    if (direction === "up" && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === "down" && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }
    setSequenceItems(items);
  };

  const handleSequenceSubmit = () => {
    send({ type: "SUBMIT_SEQUENCE", sequence: sequenceItems, elapsedMs: context.totalTime * 1000 - context.timeLeft });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quiz Top Status Bar */}
      <div className="flex items-center justify-between bg-g-card border-4 border-g-maroon rounded-2xl p-4 retro-shadow-sm font-bold text-xs md:text-sm text-g-maroon">
        <div className="flex items-center space-x-2">
          <span>Question:</span>
          <span className="bg-g-bg border-2 border-g-maroon px-2 py-0.5 rounded-md font-mono">
            {context.currentIndex + 1} / {context.questions.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>Score:</span>
          <span className="bg-g-bg border-2 border-g-maroon px-2 py-0.5 rounded-md font-mono text-g-terracotta">
            {context.score} pts
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <FaHeart
              key={i}
              className={`text-lg md:text-xl transition-all duration-300 ${
                i < context.lives ? "text-rose-500 scale-100 animate-pulse" : "text-gray-300 scale-90"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Question Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Core Question & Input Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-g-card border-4 border-g-maroon rounded-3xl p-6 md:p-8 retro-shadow relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            {/* Header Timer Bar */}
            <div className="w-full bg-g-bg border-2 border-g-maroon h-4 rounded-full overflow-hidden mb-6">
              <div
                className={`h-full transition-all duration-100 ${
                  percentLeft > 50
                    ? "bg-g-teal"
                    : percentLeft > 20
                    ? "bg-g-mustard"
                    : "bg-g-terracotta animate-pulse"
                }`}
                style={{ width: `${percentLeft}%` }}
              ></div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-g-bg border border-g-maroon/20 px-2 py-0.5 rounded-full capitalize font-bold">
                  {currentQuestion?.category.replace("_", " ")}
                </span>
                <span className="text-[10px] bg-g-bg border border-g-maroon/20 px-2 py-0.5 rounded-full capitalize font-bold text-g-terracotta">
                  {currentQuestion?.difficulty_tier}
                </span>
              </div>

              {/* Prompt Text */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-g-maroon leading-snug">
                {currentQuestion?.prompt_text}
              </h3>

              {/* Media Asset if exists */}
              {currentQuestion && 'media_asset' in currentQuestion && (currentQuestion as any).media_asset && (currentQuestion as any).media_asset.type === "image" && (
                <div className="border-4 border-g-maroon rounded-2xl overflow-hidden max-h-48 max-w-sm mx-auto shadow-sm">
                  <img
                    src={(currentQuestion as any).media_asset.url}
                    alt="Quiz illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Dynamic Inputs Based on Type */}
              {state.matches("questionActive") && (
                <div className="pt-4">
                  {/* MCQ Inputs */}
                  {isMcq && currentQuestion && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {((currentQuestion as any).options || []).map((opt: any) => {
                        // Support Daya's 50-50 Powerup
                        const isBlurred =
                          context.usedPowerups.garba5050 &&
                          context.audiencePoll === null && // only trigger if not poll
                          opt.id !== (currentQuestion as any).correct_option_id &&
                          // Hide two incorrect options
                          (opt.id === ((currentQuestion as any).options || []).filter((o: any) => o.id !== (currentQuestion as any).correct_option_id)[0]?.id ||
                            opt.id === ((currentQuestion as any).options || []).filter((o: any) => o.id !== (currentQuestion as any).correct_option_id)[1]?.id);

                        if (isBlurred) return null;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleMcqSelect(opt.id)}
                            className="text-left p-4 bg-g-bg border-2 border-g-maroon rounded-xl font-semibold text-xs md:text-sm hover:bg-g-teal hover:text-white transition-all retro-shadow-sm active:translate-y-[2px]"
                          >
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Boolean Inputs */}
                  {isBoolean && (
                    <div className="flex gap-4 max-w-sm mx-auto justify-center">
                      <button
                        onClick={() => handleBooleanSelect(true)}
                        className="retro-btn bg-g-teal text-white font-bold py-3 px-6 rounded-xl w-32 hover:bg-g-mustard hover:text-g-maroon transition-all"
                      >
                        Sahi (True)
                      </button>
                      <button
                        onClick={() => handleBooleanSelect(false)}
                        className="retro-btn bg-g-terracotta text-white font-bold py-3 px-6 rounded-xl w-32 hover:bg-g-mustard hover:text-g-maroon transition-all"
                      >
                        Galat (False)
                      </button>
                    </div>
                  )}

                  {/* Text Phrase Input */}
                  {isTextInput && (
                    <form onSubmit={handleTextSubmit} className="space-y-4">
                      {(currentQuestion as any).emoji_string && (
                        <div className="text-4xl text-center tracking-widest my-2 select-none animate-pulse">
                          {(currentQuestion as any).emoji_string}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={textVal}
                          onChange={(e) => setTextVal(e.target.value)}
                          placeholder="Type your answer here..."
                          className="flex-1 px-4 py-3 border-2 border-g-maroon rounded-xl bg-g-bg font-semibold text-sm outline-none focus:border-g-teal focus:ring-1 focus:ring-g-teal text-g-maroon"
                        />
                        <button
                          type="submit"
                          className="retro-btn bg-g-teal text-white font-bold py-3 px-6 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-all text-sm"
                        >
                          Submit Answer
                        </button>
                      </div>

                      {/* Hint dock */}
                      {(currentQuestion as any).hints && ((currentQuestion as any).hints).length > 0 && (
                        <div className="flex items-center justify-between border-t border-g-maroon/10 pt-3">
                          <button
                            type="button"
                            onClick={() => send({ type: "USE_HINT" })}
                            disabled={context.activeHintsCount >= ((currentQuestion as any).hints).length}
                            className="text-xs text-g-teal hover:text-g-terracotta font-extrabold flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaLightbulb /> <span>Reveal Hint ({((currentQuestion as any).hints)[context.activeHintsCount]?.cost_penalty_xp || 0} XP Penalty)</span>
                          </button>
                          
                          {context.activeHintsCount > 0 && (
                            <p className="text-xs italic bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-md text-amber-800 font-semibold max-w-xs">
                              💡 Hint: {((currentQuestion as any).hints)[context.activeHintsCount - 1]?.text}
                            </p>
                          )}
                        </div>
                      )}
                    </form>
                  )}

                  {/* Chronological Sequence Sorting */}
                  {isSequence && (
                    <div className="space-y-4">
                      <p className="text-[10px] text-g-maroon/60 font-bold uppercase tracking-wider">
                        Use buttons to move items up/down to sort from oldest (first) to newest (last):
                      </p>
                      
                      <div className="space-y-2">
                        {sequenceItems.map((item, index) => (
                          <div
                            key={index}
                            className="bg-g-bg border-2 border-g-maroon rounded-xl p-3 flex justify-between items-center text-xs md:text-sm font-semibold"
                          >
                            <span className="flex items-center space-x-2">
                              <span className="bg-g-mustard border border-g-maroon px-2 py-0.5 rounded-md font-mono font-bold text-xs">
                                {index + 1}
                              </span>
                              <span>{item}</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => moveSequenceItem(index, "up")}
                                disabled={index === 0}
                                className="p-1.5 border border-g-maroon bg-g-card hover:bg-g-mustard rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Move Up"
                              >
                                <FaSortUp className="text-xs translate-y-[2px]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSequenceItem(index, "down")}
                                disabled={index === sequenceItems.length - 1}
                                className="p-1.5 border border-g-maroon bg-g-card hover:bg-g-mustard rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Move Down"
                              >
                                <FaSortDown className="text-xs translate-y-[-2px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleSequenceSubmit}
                        className="retro-btn w-full bg-g-teal text-white font-bold py-3 rounded-xl hover:bg-g-mustard hover:text-g-maroon transition-all text-sm mt-4"
                      >
                        Submit Sorted Sequence
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Evaluating correctness feedback screen overlay */}
              {(state.matches("correctFeedback") || state.matches("incorrectFeedback")) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 border-4 rounded-2xl p-5 ${
                    state.matches("correctFeedback")
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                      : "bg-rose-50 border-g-terracotta text-g-terracotta"
                  } font-bold text-xs md:text-sm space-y-3 retro-shadow-sm animate-shake`}
                >
                  <p className="text-lg md:text-xl font-display flex items-center space-x-1">
                    <span>
                      {state.matches("correctFeedback") ? "✅ Sahi Jawab! (Correct!)" : "❌ Galat Jawab! (Incorrect!)"}
                    </span>
                  </p>
                  
                  <p className="italic font-sans text-g-maroon/90 font-medium">
                    {context.wittyFeedbackText}
                  </p>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => send({ type: "NEXT" })}
                      className={`retro-btn font-extrabold py-2 px-6 rounded-xl flex items-center space-x-2 text-xs md:text-sm hover:scale-105 transition-all text-white ${
                        state.matches("correctFeedback") ? "bg-emerald-600 hover:bg-emerald-700" : "bg-g-terracotta hover:bg-g-mustard hover:text-g-maroon"
                      }`}
                    >
                      <span>{context.currentIndex + 1 >= context.questions.length ? "View Final Summary" : "Next Question"}</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Masala Powerups Dock */}
        <div className="bg-g-card border-4 border-g-maroon rounded-2xl p-4 retro-shadow space-y-4">
          <div className="border-b-2 border-g-maroon/10 pb-2">
            <h4 className="font-display text-lg font-bold text-g-maroon">Power-Ups</h4>
            <p className="text-[10px] text-g-maroon/60 font-bold uppercase tracking-wider">
              TMKOC Character Special
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            {/* Daya's Garba (50-50) */}
            <button
              onClick={() => {
                audioPipeline.play("BALLE_BALLE");
                send({ type: "USE_GARBA_5050" });
              }}
              disabled={context.usedPowerups.garba5050 || !isMcq || !state.matches("questionActive")}
              className={`w-full text-left p-3 border-2 rounded-xl text-xs font-bold transition-all ${
                context.usedPowerups.garba5050
                  ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-g-bg border-g-maroon hover:bg-g-mustard hover:shadow-retro-hover active:translate-y-[2px]"
              }`}
            >
              <div className="flex items-center space-x-1">
                <span>💃🏽</span>
                <span className="truncate">Daya's Garba (50/50)</span>
              </div>
            </button>

            {/* Ask Bhide Skip */}
            <button
              onClick={() => {
                audioPipeline.play("BALLE_BALLE");
                send({ type: "USE_ASK_BHIDE" });
              }}
              disabled={context.usedPowerups.askBhide || !state.matches("questionActive")}
              className={`w-full text-left p-3 border-2 rounded-xl text-xs font-bold transition-all ${
                context.usedPowerups.askBhide
                  ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-g-bg border-g-maroon hover:bg-g-mustard hover:shadow-retro-hover active:translate-y-[2px]"
              }`}
            >
              <div className="flex items-center space-x-1">
                <span>✍🏽</span>
                <span className="truncate">Bhide Decree (Skip)</span>
              </div>
            </button>

            {/* Abdul Soda Poll */}
            <button
              onClick={() => {
                audioPipeline.play("BALLE_BALLE");
                send({ type: "USE_ABDUL_POLL" });
              }}
              disabled={context.usedPowerups.abdulPoll || !isMcq || !state.matches("questionActive")}
              className={`w-full text-left p-3 border-2 rounded-xl text-xs font-bold transition-all ${
                context.usedPowerups.abdulPoll
                  ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-g-bg border-g-maroon hover:bg-g-mustard hover:shadow-retro-hover active:translate-y-[2px]"
              }`}
            >
              <div className="flex items-center space-x-1">
                <span>🥤</span>
                <span className="truncate">Abdul Soda (Poll)</span>
              </div>
            </button>

            {/* Sundar Scheme Double/Nothing */}
            <button
              onClick={() => {
                audioPipeline.play("ALARM_JETHER");
                send({ type: "USE_SUNDAR_SCHEME" });
              }}
              disabled={context.usedPowerups.sundarScheme || !state.matches("questionActive")}
              className={`w-full text-left p-3 border-2 rounded-xl text-xs font-bold transition-all ${
                context.usedPowerups.sundarScheme
                  ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                  : context.isSundarActive
                  ? "bg-g-terracotta text-white border-g-maroon"
                  : "bg-g-bg border-g-maroon hover:bg-g-mustard hover:shadow-retro-hover active:translate-y-[2px]"
              }`}
            >
              <div className="flex items-center space-x-1">
                <span>💸</span>
                <span className="truncate">Sundar (Double/Nothing)</span>
              </div>
            </button>
          </div>

          {/* Render Abdul's Audience Poll Result Graphic */}
          {context.audiencePoll && isMcq && currentQuestion && (
            <div className="bg-g-bg border-2 border-g-maroon rounded-xl p-3 space-y-2 text-[10px] font-bold text-g-maroon">
              <p className="border-b border-g-maroon/10 pb-1 text-center font-display text-xs">
                📊 ABDUL'S SODA GATHERING POLL
              </p>
              <div className="space-y-1.5">
                {((currentQuestion as any).options || []).map((opt: any) => {
                  const share = context.audiencePoll?.[opt.id] || 0;
                  return (
                    <div key={opt.id} className="space-y-0.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="truncate max-w-[120px]">{opt.text}</span>
                        <span>{share}%</span>
                      </div>
                      <div className="w-full bg-g-card border border-g-maroon rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-g-teal h-full transition-all duration-300"
                          style={{ width: `${share}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sundar active warning banner */}
          {context.isSundarActive && (
            <div className="bg-orange-50 border-2 border-g-terracotta rounded-xl p-2 text-[9px] font-bold text-g-terracotta leading-relaxed animate-pulse">
              ⚠️ SUNDAR'S SCHEME IS ACTIVE! Double XP on correctness, but losing will cost 2 lives! Arey Jeeja Ji!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
