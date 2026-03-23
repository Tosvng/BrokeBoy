export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateMonthsBetween = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  return months <= 0 ? 1 : months;
};

export const calculateRequiredMonthly = (
  targetAmount: number,
  currentSaved: number,
  targetDate: string
) => {
  const remaining = targetAmount - currentSaved;
  if (remaining <= 0) return 0;
  
  const months = calculateMonthsBetween(new Date().toISOString(), targetDate);
  return remaining / months;
};

export const calculateTimeToReach = (
  targetAmount: number,
  currentSaved: number,
  monthlyContribution: number
) => {
  const remaining = targetAmount - currentSaved;
  if (remaining <= 0) return 0;
  if (monthlyContribution <= 0) return Infinity;
  
  return Math.ceil(remaining / monthlyContribution);
};
