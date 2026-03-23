import { useState, useEffect } from "react";
import type { Goal } from "../types";
import { fetchGoals, saveGoal, deleteGoal } from "../api/goals";

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

  return { goals, loading, addTarget, removeGoal, loadGoals };
}
