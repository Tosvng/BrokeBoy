import { useState, useEffect } from "react";
import type { Goal } from "../types";
import { fetchGoals, saveGoal, deleteGoal, markGoalCompleted, updateGoal } from "../api/goals";

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchGoals(userId);
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addTarget = async (name: string, targetAmount: number, targetDate?: string, monthly?: number) => {
    if (!userId) return;
    const newGoal = await saveGoal(userId, targetAmount, name, targetDate, monthly);
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const removeGoal = async (id: string) => {
    await deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const completeGoal = async (id: string) => {
    await markGoalCompleted(id);
    const completedAt = new Date().toISOString();
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completedAt } : g));
  };

  const updateTarget = async (id: string, updates: { name?: string; targetAmount?: number; targetDate?: string | null; monthlyContribution?: number | null }) => {
    await updateGoal(id, updates);
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const next: Goal = { ...g };
      if (updates.name !== undefined) next.name = updates.name;
      if (updates.targetAmount !== undefined) next.targetAmount = updates.targetAmount;
      if ("targetDate" in updates) next.targetDate = updates.targetDate ?? undefined;
      if ("monthlyContribution" in updates) next.monthlyContribution = updates.monthlyContribution ?? undefined;
      return next;
    }));
  };

  return { goals, loading, addTarget, removeGoal, completeGoal, updateTarget, loadGoals };
}
