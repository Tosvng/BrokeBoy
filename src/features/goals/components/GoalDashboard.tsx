import { useState } from "react";
import { type Goal } from "../types";
import { useGoals } from "../hooks/useGoals";
import { useContributions } from "../hooks/useContributions";
import { useAllContributions } from "../hooks/useAllContributions";
import { formatCurrency, calculateRequiredMonthly, calculateTimeToReach } from "../../../lib/utils";
import { Button } from "../../../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { ContributeModal } from "./ContributeModal";
import { ContributionChart } from "./ContributionChart";

export const GoalDashboard = ({ 
  userId, 
  onCreateGoal,
  variant = "dashboard" 
}: { 
  userId: string; 
  onCreateGoal: () => void;
  variant?: "dashboard" | "goals"
}) => {
  const { goals, loading, removeGoal, completeGoal } = useGoals(userId);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { contributions, loading: contributionsLoading } = useAllContributions(userId);

  // Only count contributions from active (non-completed) goals toward savings total
  const activeGoalIds = new Set(goals.filter(g => !g.completedAt).map(g => g.id));
  const activeContributions = contributions.filter(c => activeGoalIds.has(c.goalId));

  const totalNetWorth = activeContributions.reduce((sum, c) => sum + c.amount, 0);

  // Calculate momentum (this month vs last month) using active goals only
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthSaved = activeContributions
    .filter(c => { const d = new Date(c.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
    .reduce((sum, c) => sum + c.amount, 0);

  const lastMonthSaved = activeContributions
    .filter(c => { const d = new Date(c.date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
    .reduce((sum, c) => sum + c.amount, 0);
    
  let momentumPct = 0;
  if (lastMonthSaved > 0) {
    momentumPct = Math.round(((currentMonthSaved - lastMonthSaved) / lastMonthSaved) * 100);
  } else if (currentMonthSaved > 0) {
    momentumPct = 100;
  }

  if (loading || contributionsLoading) {
    return (
      <div className="px-5 pt-6 flex flex-col gap-6 animate-pulse">
        <div className="h-24 rounded-2xl bg-surface-card"></div>
        <div className="h-32 rounded-2xl bg-surface-card"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {variant === "dashboard" && (
        <>
          {/* Hero Balance */}
          <div className="px-5 pt-8 pb-6">
            <p className="label-sm text-on-surface-variant mb-2">Net Worth</p>
            <div className="flex items-end gap-1">
              <span className="font-sans text-4xl font-bold text-on-surface tracking-tight">
                ${Math.floor(totalNetWorth).toLocaleString()}
              </span>
              <span className="font-sans text-2xl font-bold text-gold mb-0.5">
                .{String(totalNetWorth.toFixed(2).split(".")[1])}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-success text-xs font-semibold bg-success/10 px-2 py-0.5 rounded-full">Active goals on track</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-5 flex gap-3 mb-8">
            {/* <Button variant="secondary" className="flex-1">Deposit</Button> */}
            <Button variant="primary" className="flex-1" onClick={onCreateGoal}>Create Goal</Button>
          </div>
        </>
      )}

      {/* Active Goals */}
      {(() => {
        const activeGoals = goals.filter(g => !g.completedAt);
        const completedGoals = goals.filter(g => !!g.completedAt);
        return (
          <>
            <div className="px-5 mb-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="title-lg text-on-surface">Active Goals</h2>
                <button className="label-sm text-gold">View All</button>
              </div>

              {activeGoals.length === 0 ? (
                <div className="card-surface p-8 text-center">
                  <p className="body-md text-on-surface-variant">No active goals.</p>
                  <p className="body-sm text-on-surface-variant mt-1">Tap + to create your first goal.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {activeGoals.map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 28 }}
                      >
                        <GoalCard
                          goal={goal}
                          onDelete={() => removeGoal(goal.id)}
                          onContribute={() => setSelectedGoal(goal)}
                          onComplete={() => completeGoal(goal.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {completedGoals.length > 0 && (
              <div className="px-5 mb-2 mt-4">
                <h2 className="title-lg text-on-surface mb-4">Completed Goals</h2>
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {completedGoals.map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 28 }}
                      >
                        <GoalCard
                          goal={goal}
                          onDelete={() => removeGoal(goal.id)}
                          onContribute={() => setSelectedGoal(goal)}
                          completed
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* Chart Section */}
      {variant === "dashboard" && (
        <div className="px-5">
          <ContributionChart contributions={activeContributions} />
        </div>
      )}

      {/* Insights */}
      {variant === "dashboard" && (
        <div className="px-5 mt-2 mb-4">
          <h2 className="title-lg text-on-surface mb-4">Insights</h2>
          <div className="card-surface p-5 flex flex-col gap-4">
            <div>
              <p className="label-sm text-on-surface-variant mb-1">Savings Momentum</p>
              <div className="flex items-center gap-3">
                <span className="font-sans text-2xl font-bold text-on-surface">{formatCurrency(currentMonthSaved)}</span>
                {momentumPct !== 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${momentumPct > 0 ? "text-success bg-success/10" : "text-error bg-error/10"}`}>
                    {momentumPct > 0 ? "▲" : "▼"} {Math.abs(momentumPct)}% vs last mo
                  </span>
                )}
              </div>
              <p className="body-sm text-on-surface-variant mt-2">You saved {formatCurrency(currentMonthSaved)} this month towards your goals.</p>
            </div>
          </div>
        </div>
      )}

      {/* Upsell banner */}
      {/* {variant === "dashboard" && (
        <div className="px-5 mb-4">
          <div className="rounded-2xl bg-primary-gradient p-5 flex flex-col gap-2">
            <p className="font-sans font-bold text-on-primary">Secure your future with BrokeBoy Pro</p>
            <p className="body-sm text-on-primary/80">Unlock advanced auto-save features and higher yield accounts.</p>
            <button className="mt-2 self-start bg-on-primary/15 backdrop-blur text-on-primary font-semibold text-sm px-4 py-2 rounded-full hover:bg-on-primary/25 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )} */}

      {selectedGoal && (
        <ContributeModal goal={selectedGoal} userId={userId} onClose={() => setSelectedGoal(null)} />
      )}
    </div>
  );
};

const GoalCard = ({
  goal,
  onDelete,
  onContribute,
  onComplete,
  completed = false,
}: {
  goal: Goal;
  onDelete: () => void;
  onContribute: () => void;
  onComplete?: () => void;
  completed?: boolean;
}) => {
  const { contributions } = useContributions(goal.id, goal.userId);

  const currentSaved = contributions.reduce((sum, c) => sum + c.amount, 0);
  const progressPercent = Math.min((currentSaved / goal.targetAmount) * 100, 100);

  const reqMonthly = goal.targetDate
    ? calculateRequiredMonthly(goal.targetAmount, currentSaved, goal.targetDate)
    : 0;
  const timeToReach = goal.monthlyContribution
    ? calculateTimeToReach(goal.targetAmount, currentSaved, goal.monthlyContribution)
    : null;

  return (
    <div className={`card-surface p-5 flex flex-col gap-4 ${completed ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="text-success text-sm" aria-label="Completed">✓</span>
            )}
            <h3 className={`title-md text-on-surface ${completed ? "line-through text-on-surface-variant" : ""}`}>
              {goal.name}
            </h3>
          </div>
          {goal.targetDate && !completed && (
            <p className="body-sm text-on-surface-variant mt-0.5">
              Target: {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          )}
          {completed && goal.completedAt && (
            <p className="body-sm text-success mt-0.5">
              Completed {new Date(goal.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className="font-sans font-bold text-on-surface">{formatCurrency(currentSaved)}</p>
            <p className="body-sm text-on-surface-variant">of {formatCurrency(goal.targetAmount)}</p>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 active:bg-error/20 transition-colors"
            aria-label="Remove goal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-full bg-surface-card-high rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${completed ? "bg-success" : "progress-gold"}`}
          />
        </div>
        <div className="flex justify-between">
          <span className="label-sm text-on-surface-variant">{progressPercent.toFixed(1)}% saved</span>
          {!completed && (
            <span className="label-sm text-gold">
              {goal.targetDate
                ? `${reqMonthly > 0 ? formatCurrency(reqMonthly) + "/mo" : "On track"}`
                : timeToReach
                ? `${timeToReach} months left`
                : "In progress"}
            </span>
          )}
        </div>
      </div>

      {!completed && (
        <div className="flex gap-2">
          <button
            onClick={onContribute}
            className="flex-1 py-2.5 rounded-xl bg-surface-card-high text-on-surface font-semibold text-sm hover:bg-outline-variant/30 transition-colors"
          >
            Log Contribution
          </button>
          {onComplete && (
            <button
              onClick={onComplete}
              className="py-2.5 px-4 rounded-xl bg-success/10 text-success font-semibold text-sm hover:bg-success/20 transition-colors"
              title="Mark as completed"
            >
              ✓ Done
            </button>
          )}
        </div>
      )}
    </div>
  );
};
