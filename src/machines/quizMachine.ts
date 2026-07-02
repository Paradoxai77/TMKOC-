import { createMachine, assign } from "xstate";
import { QuizQuestion } from "@/data/questionsData";

export interface QuizContext {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  lives: number;
  totalTime: number; // in seconds
  timeLeft: number;  // in milliseconds (high-precision)
  selectedOptionId: string | null;
  textAnswer: string | null;
  sequenceAnswer: string[] | null;
  usedPowerups: {
    garba5050: boolean;
    askBhide: boolean;
    abdulPoll: boolean;
    sundarScheme: boolean;
  };
  audiencePoll: Record<string, number> | null;
  isSundarActive: boolean;
  activeHintsCount: number;
  revivedCount: number;
  wittyFeedbackText: string;
  isCorrect: boolean;
}

export type QuizEvent =
  | { type: "START_QUIZ"; questions: QuizQuestion[] }
  | { type: "TICK"; ms: number }
  | { type: "SUBMIT_MCQ"; optionId: string; elapsedMs: number }
  | { type: "SUBMIT_TEXT"; text: string; elapsedMs: number }
  | { type: "SUBMIT_SEQUENCE"; sequence: string[]; elapsedMs: number }
  | { type: "SUBMIT_BOOLEAN"; value: boolean; elapsedMs: number }
  | { type: "USE_GARBA_5050" }
  | { type: "USE_ASK_BHIDE" }
  | { type: "USE_ABDUL_POLL" }
  | { type: "USE_SUNDAR_SCHEME" }
  | { type: "USE_HINT" }
  | { type: "REVIVE" }
  | { type: "NEXT" }
  | { type: "RESET" }
  | { type: "TIMEOUT" };

// Scoring Formulas
export function getDifficultyMultiplier(difficulty: "easy" | "medium" | "hard"): number {
  switch (difficulty) {
    case "easy": return 1.0;
    case "medium": return 1.5;
    case "hard": return 2.2;
  }
}

export function calculateSpeedBonus(remainingMs: number, totalMs: number): number {
  return Math.max(0, Math.floor((remainingMs / totalMs) * 100));
}

export function calculateStreakMultiplier(streak: number): number {
  return Math.min(3.5, 1.0 + Math.floor(streak / 3) * 0.5);
}

export function generateAudiencePoll(
  correctOptionId: string,
  options: string[],
  difficulty: "easy" | "medium" | "hard"
): Record<string, number> {
  const distribution: Record<string, number> = {};
  let remainingPercentage = 100;

  const baseCorrectWeights = {
    easy: { min: 70, max: 85 },
    medium: { min: 50, max: 68 },
    hard: { min: 32, max: 48 }
  };
  
  const targetCorrect = baseCorrectWeights[difficulty];
  const correctPercentage = Math.floor(Math.random() * (targetCorrect.max - targetCorrect.min + 1)) + targetCorrect.min;
  
  distribution[correctOptionId] = correctPercentage;
  remainingPercentage -= correctPercentage;

  const incorrectOptions = options.filter(id => id !== correctOptionId);
  incorrectOptions.forEach((id, index) => {
    if (index === incorrectOptions.length - 1) {
      distribution[id] = remainingPercentage;
    } else {
      const share = Math.floor(Math.random() * (remainingPercentage - (incorrectOptions.length - index)));
      distribution[id] = Math.max(1, share);
      remainingPercentage -= distribution[id];
    }
  });

  return distribution;
}

const initialContext: QuizContext = {
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  lives: 3,
  totalTime: 15,
  timeLeft: 15000,
  selectedOptionId: null,
  textAnswer: null,
  sequenceAnswer: null,
  usedPowerups: {
    garba5050: false,
    askBhide: false,
    abdulPoll: false,
    sundarScheme: false,
  },
  audiencePoll: null,
  isSundarActive: false,
  activeHintsCount: 0,
  revivedCount: 0,
  wittyFeedbackText: "",
  isCorrect: false,
};

export const quizMachine = createMachine({
  id: "quiz",
  initial: "idle",
  context: initialContext,
  types: {} as {
    context: QuizContext;
    events: QuizEvent;
  },
  states: {
    idle: {
      on: {
        START_QUIZ: {
          target: "loading",
          actions: assign(({ event }) => ({
            ...initialContext,
            questions: event.questions,
            currentIndex: 0,
            lives: 3,
            score: 0,
            streak: 0,
          }))
        }
      }
    },
    loading: {
      after: {
        1200: "questionActive" // Simulate loading assets
      },
      exit: assign(({ context }) => {
        const currentQ = context.questions[context.currentIndex];
        const totalSec = currentQ.difficulty_tier === "easy" ? 20 : currentQ.difficulty_tier === "medium" ? 15 : 10;
        return {
          totalTime: totalSec,
          timeLeft: totalSec * 1000,
          selectedOptionId: null,
          textAnswer: null,
          sequenceAnswer: null,
          audiencePoll: null,
          isSundarActive: false,
          activeHintsCount: 0,
          wittyFeedbackText: "",
          isCorrect: false,
        };
      })
    },
    questionActive: {
      on: {
        TICK: {
          actions: assign(({ context, event }) => {
            const nextTime = Math.max(0, context.timeLeft - event.ms);
            return { timeLeft: nextTime };
          }),
          target: "evaluating",
          guard: ({ context }) => context.timeLeft <= 0
        },
        TIMEOUT: {
          target: "evaluating",
          actions: assign(({ context }) => ({
            timeLeft: 0,
            isCorrect: false,
            wittyFeedbackText: context.questions[context.currentIndex]?.witty_one_liners.incorrect || "Babuchak! Time's up!"
          }))
        },
        SUBMIT_MCQ: {
          target: "evaluating",
          actions: assign(({ context, event }) => {
            const currentQ = context.questions[context.currentIndex];
            const isCorrect = currentQ && currentQ.q_type === "mcq" && event.optionId === currentQ.correct_option_id;
            const feedback = currentQ
              ? (isCorrect ? currentQ.witty_one_liners.correct : currentQ.witty_one_liners.incorrect)
              : "";
            return {
              selectedOptionId: event.optionId,
              isCorrect,
              wittyFeedbackText: feedback,
            };
          })
        },
        SUBMIT_BOOLEAN: {
          target: "evaluating",
          actions: assign(({ context, event }) => {
            const currentQ = context.questions[context.currentIndex];
            const isCorrect = currentQ && currentQ.q_type === "boolean" && event.value === currentQ.correct_answer;
            const feedback = currentQ
              ? (isCorrect ? currentQ.witty_one_liners.correct : currentQ.witty_one_liners.incorrect)
              : "";
            return {
              isCorrect,
              wittyFeedbackText: feedback,
            };
          })
        },
        SUBMIT_TEXT: {
          target: "evaluating",
          actions: assign(({ context, event }) => {
            const currentQ = context.questions[context.currentIndex];
            let isCorrect = false;
            if (currentQ && currentQ.q_type === "text_input") {
              const cleaned = event.text.trim().toLowerCase();
              isCorrect = currentQ.accepted_answers.some(ans => ans.toLowerCase() === cleaned);
            }
            const feedback = currentQ
              ? (isCorrect ? currentQ.witty_one_liners.correct : currentQ.witty_one_liners.incorrect)
              : "";
            return {
              textAnswer: event.text,
              isCorrect,
              wittyFeedbackText: feedback,
            };
          })
        },
        SUBMIT_SEQUENCE: {
          target: "evaluating",
          actions: assign(({ context, event }) => {
            const currentQ = context.questions[context.currentIndex];
            let isCorrect = false;
            if (currentQ && currentQ.q_type === "sequence") {
              const correctOrder = [...currentQ.sequence_items]
                .sort((a, b) => a.rank_order - b.rank_order)
                .map(item => item.text);
              
              isCorrect = event.sequence.length === correctOrder.length && 
                event.sequence.every((val, idx) => val === correctOrder[idx]);
            }
            const feedback = currentQ
              ? (isCorrect ? currentQ.witty_one_liners.correct : currentQ.witty_one_liners.incorrect)
              : "";
            return {
              sequenceAnswer: event.sequence,
              isCorrect,
              wittyFeedbackText: feedback,
            };
          })
        },
        USE_GARBA_5050: {
          actions: assign(({ context }) => ({
            usedPowerups: { ...context.usedPowerups, garba5050: true }
          })),
          guard: ({ context }) => {
            const q = context.questions[context.currentIndex];
            return !context.usedPowerups.garba5050 && q?.q_type === "mcq";
          }
        },
        USE_ASK_BHIDE: {
          target: "evaluating",
          actions: assign(({ context }) => {
            const currentQ = context.questions[context.currentIndex];
            return {
              isCorrect: true,
              wittyFeedbackText: "Sakharam Tip! Bhide skipped this for you: " + (currentQ?.witty_one_liners.correct || ""),
              usedPowerups: { ...context.usedPowerups, askBhide: true }
            };
          }),
          guard: ({ context }) => !context.usedPowerups.askBhide
        },
        USE_ABDUL_POLL: {
          actions: assign(({ context }) => {
            const q = context.questions[context.currentIndex];
            if (q && q.q_type === "mcq") {
              const poll = generateAudiencePoll(
                q.correct_option_id,
                q.options.map(o => o.id),
                q.difficulty_tier
              );
              return {
                audiencePoll: poll,
                usedPowerups: { ...context.usedPowerups, abdulPoll: true }
              };
            }
            return {};
          }),
          guard: ({ context }) => {
            const q = context.questions[context.currentIndex];
            return !context.usedPowerups.abdulPoll && q?.q_type === "mcq";
          }
        },
        USE_SUNDAR_SCHEME: {
          actions: assign(({ context }) => ({
            isSundarActive: true,
            usedPowerups: { ...context.usedPowerups, sundarScheme: true }
          })),
          guard: ({ context }) => !context.usedPowerups.sundarScheme
        },
        USE_HINT: {
          actions: assign(({ context }) => {
            const q = context.questions[context.currentIndex];
            let cost = 0;
            if (q && q.q_type === "text_input" && q.hints && q.hints[context.activeHintsCount]) {
              cost = q.hints[context.activeHintsCount].cost_penalty_xp;
            }
            return {
              activeHintsCount: context.activeHintsCount + 1,
              // Deduct score or handle as XP penalty elsewhere
              score: Math.max(0, context.score - cost)
            };
          }),
          guard: ({ context }) => {
            const q = context.questions[context.currentIndex];
            return q?.q_type === "text_input" && !!q.hints && context.activeHintsCount < q.hints.length;
          }
        }
      }
    },
    evaluating: {
      always: [
        {
          target: "correctFeedback",
          guard: ({ context }) => context.isCorrect
        },
        {
          target: "incorrectFeedback"
        }
      ]
    },
    correctFeedback: {
      entry: assign(({ context }) => {
        const q = context.questions[context.currentIndex];
        if (!q) return {};
        
        // S_base = 100
        const S_base = 100;
        const M_diff = getDifficultyMultiplier(q.difficulty_tier);
        const B_speed = calculateSpeedBonus(context.timeLeft, context.totalTime * 1000);
        const M_streak = calculateStreakMultiplier(context.streak);
        
        // Formula: S_final = floor( (S_base * M_diff) + (B_speed * M_streak) )
        let points = Math.floor((S_base * M_diff) + (B_speed * M_streak));
        
        // Sundar Double or Nothing Scheme
        if (context.isSundarActive) {
          points *= 2;
        }

        // Penalty for Bhide ask skip (preserves 50% of the speed bonus and base)
        if (context.usedPowerups.askBhide && !context.usedPowerups.garba5050 && context.selectedOptionId === null) {
          // It was skipped by Bhide, give 50% score
          points = Math.floor(points * 0.5);
        }

        return {
          score: context.score + points,
          streak: context.streak + 1,
        };
      }),
      on: {
        NEXT: [
          {
            target: "victory",
            guard: ({ context }) => context.currentIndex + 1 >= context.questions.length
          },
          {
            target: "loading",
            actions: assign(({ context }) => ({
              currentIndex: context.currentIndex + 1
            }))
          }
        ]
      }
    },
    incorrectFeedback: {
      entry: assign(({ context }) => {
        // Lose life. Sundar Scheme loses 2 lives, normally 1.
        const livesLost = context.isSundarActive ? 2 : 1;
        const remainingLives = Math.max(0, context.lives - livesLost);
        return {
          lives: remainingLives,
          streak: 0, // Reset running correct answer streak
        };
      }),
      on: {
        NEXT: [
          {
            target: "gameOver",
            guard: ({ context }) => context.lives <= 0
          },
          {
            target: "victory",
            guard: ({ context }) => context.currentIndex + 1 >= context.questions.length
          },
          {
            target: "loading",
            actions: assign(({ context }) => ({
              currentIndex: context.currentIndex + 1
            }))
          }
        ]
      }
    },
    gameOver: {
      on: {
        REVIVE: {
          target: "questionActive",
          actions: assign(({ context }) => ({
            lives: 1,
            revivedCount: context.revivedCount + 1,
            timeLeft: context.totalTime * 1000 // reset timer for another chance
          })),
          guard: ({ context }) => context.revivedCount === 0 // only allow once
        },
        RESET: {
          target: "idle"
        }
      }
    },
    victory: {
      on: {
        RESET: {
          target: "idle"
        }
      }
    }
  }
});
