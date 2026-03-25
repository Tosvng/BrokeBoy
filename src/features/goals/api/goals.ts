import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../models/firebase";
import type { Goal, Contribution } from "../types";

export const saveGoal = async (userId: string, targetAmount: number, name: string, targetDate?: string, monthlyContribution?: number) => {
  const newGoalRef = doc(collection(db, "goals"));
  const goal: Partial<Goal> = {
    id: newGoalRef.id,
    userId,
    name,
    targetAmount,
    createdAt: new Date().toISOString()
  };
  
  if (targetDate) goal.targetDate = targetDate;
  if (monthlyContribution !== undefined) goal.monthlyContribution = monthlyContribution;

  await setDoc(newGoalRef, goal);
  return goal as Goal;
};

export const fetchGoals = async (userId: string): Promise<Goal[]> => {
  const q = query(collection(db, "goals"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Goal);
};

export const deleteGoal = async (goalId: string) => {
  await deleteDoc(doc(db, "goals", goalId));
};

export const markGoalCompleted = async (goalId: string) => {
  await updateDoc(doc(db, "goals", goalId), { completedAt: new Date().toISOString() });
};

export const updateGoal = async (goalId: string, updates: { name?: string; targetAmount?: number; targetDate?: string | null; monthlyContribution?: number | null }) => {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.targetAmount !== undefined) payload.targetAmount = updates.targetAmount;
  if ("targetDate" in updates) payload.targetDate = updates.targetDate ?? null;
  if ("monthlyContribution" in updates) payload.monthlyContribution = updates.monthlyContribution ?? null;
  await updateDoc(doc(db, "goals", goalId), payload);
};

export const addContribution = async (userId: string, goalId: string, amount: number) => {
  const newRef = doc(collection(db, "contributions"));
  const contribution: Contribution = {
    id: newRef.id,
    userId,
    goalId,
    amount,
    date: new Date().toISOString()
  };
  await setDoc(newRef, contribution);
  return contribution;
};

export const fetchContributions = async (userId: string, goalId: string): Promise<Contribution[]> => {
  const q = query(
    collection(db, "contributions"), 
    where("userId", "==", userId),
    where("goalId", "==", goalId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Contribution);
};

export const fetchAllContributions = async (userId: string): Promise<Contribution[]> => {
  const q = query(
    collection(db, "contributions"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Contribution);
};
