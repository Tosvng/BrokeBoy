import React, { useState } from "react";
import { type Goal } from "../types";
import { useContributions } from "../hooks/useContributions";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { motion } from "motion/react";

export const ContributeModal = ({ goal, userId, onClose }: { goal: Goal; userId: string; onClose: () => void }) => {
  const { recordContribution } = useContributions(goal.id, userId);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    setLoading(true);
    await recordContribution(userId, num);
    setLoading(false);
    onClose();
  };

  return (
    <div className="mb-16 fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="relative z-10 w-full max-w-md bg-surface-card rounded-3xl p-8 shadow-ambient"
      >
        <div className="mb-6">
          <h2 className="headline-md text-on-surface">Add Contribution</h2>
          <p className="body-md text-on-surface-variant mt-1">Logging funds towards <span className="text-gold font-semibold">{goal.name}</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            placeholder="100.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            required
          />
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" isLoading={loading} className="flex-1">Confirm</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
