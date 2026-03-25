import React, { useState } from "react";
import { type Goal } from "../types";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { motion } from "motion/react";

export const EditGoalModal = ({
  goal,
  onSave,
  onClose,
}: {
  goal: Goal;
  onSave: (updates: { name: string; targetAmount: number; targetDate?: string | null; monthlyContribution?: number | null }) => Promise<void>;
  onClose: () => void;
}) => {
  const [name, setName] = useState(goal.name);
  const [amount, setAmount] = useState(String(goal.targetAmount));
  const [mode, setMode] = useState<"date" | "monthly">(goal.monthlyContribution != null ? "monthly" : "date");
  const [targetDate, setTargetDate] = useState(goal.targetDate ?? "");
  const [monthlyContribution, setMonthlyContribution] = useState(
    goal.monthlyContribution != null ? String(goal.monthlyContribution) : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    setLoading(true);
    await onSave({
      name: name.trim(),
      targetAmount: parsedAmount,
      targetDate: mode === "date" && targetDate ? targetDate : null,
      monthlyContribution: mode === "monthly" && monthlyContribution ? parseFloat(monthlyContribution) : null,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 mb-16 sm:mb-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="relative z-10 w-full max-w-md bg-surface-card rounded-3xl p-8 shadow-ambient"
      >
        <div className="mb-6">
          <h2 className="headline-md text-on-surface">Edit Goal</h2>
          <p className="body-md text-on-surface-variant mt-1">Update the details for this goal.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Goal Name"
            placeholder="e.g. Emergency Fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Target Amount ($)"
            type="number"
            step="0.01"
            placeholder="10,000.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          {/* Mode toggle */}
          <div className="flex bg-surface-card-high p-1.5 rounded-2xl">
            {(["date", "monthly"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-surface-card text-gold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {m === "date" ? "By Deadline" : "By Monthly"}
              </button>
            ))}
          </div>

          {mode === "date" ? (
            <Input
              label="Target Date (Optional)"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          ) : (
            <Input
              label="Monthly Contribution ($)"
              type="number"
              step="0.01"
              placeholder="500.00"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          )}

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading} className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
