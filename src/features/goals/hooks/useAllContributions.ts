import { useState, useEffect } from "react";
import type { Contribution } from "../types";
import { fetchAllContributions } from "../api/goals";

export function useAllContributions(userId: string | undefined) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContributions = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchAllContributions(userId);
      setContributions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error("fetchAllContributions error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { contributions, loading, loadContributions };
}
