import React, { useState } from "react";
import { useGoals } from "../hooks/useGoals";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export const CreateGoalForm = ({ userId, onCreated, onCancel }: { userId: string; onCreated: () => void; onCancel: () => void }) => {
  const { addTarget } = useGoals(userId);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"date" | "monthly">("date");
  const [targetDate, setTargetDate] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || parseFloat(amount) <= 0) return;
    setLoading(true);
    await addTarget(
      name,
      parseFloat(amount),
      mode === "date" && targetDate ? targetDate : undefined,
      mode === "monthly" && monthlyContribution ? parseFloat(monthlyContribution) : undefined
    );
    setLoading(false);
    onCreated();
  };

  return (
    <div className="flex flex-col min-h-full px-5 pt-6 pb-10">
      {/* Back button */}
      <button onClick={onCancel} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-8 self-start transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        <span className="font-semibold text-sm">Back</span>
      </button>

      <h2 className="headline-md text-on-surface mb-2">New Goal</h2>
      <p className="body-md text-on-surface-variant mb-8">Define what you're saving toward.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
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
        <div className="flex bg-surface-card p-1.5 rounded-2xl">
          {(["date", "monthly"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                mode === m
                  ? "bg-surface-card-high text-gold shadow-sm"
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

        <div className="mt-auto pt-8">
          <Button type="submit" variant="primary" isLoading={loading} className="w-full h-14 text-base font-bold">
            Establish Goal
          </Button>
        </div>
      </form>
    </div>
  );
};
