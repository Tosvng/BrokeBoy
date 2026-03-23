import { useState, useEffect } from "react";
import type { Contribution } from "../types";
import { fetchContributions, addContribution } from "../api/goals";

export function useContributions(goalId: string | undefined, userId: string | undefined) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContributions = async () => {
    if (!goalId || !userId) return;
    setLoading(true);
    try {
      const data = await fetchContributions(userId, goalId);
      setContributions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error("fetchContributions error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  const recordContribution = async (userId: string, amount: number) => {
    if (!goalId) return;
    const newContribution = await addContribution(userId, goalId, amount);
    setContributions(prev => [newContribution, ...prev]);
    return newContribution;
  };

  return { contributions, loading, recordContribution, loadContributions };
}
