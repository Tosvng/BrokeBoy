import { useAllContributions } from "../hooks/useAllContributions";
import { formatCurrency } from "../../../lib/utils";
import { motion } from "motion/react";

export const ActivityList = ({ userId }: { userId: string }) => {
  const { contributions, loading } = useAllContributions(userId);

  if (loading) {
     return <div className="px-5 pt-10 text-on-surface-variant animate-pulse label-sm tracking-widest text-center mt-10">Loading activity...</div>;
  }

  return (
    <div className="px-5 pt-10 pb-20 flex flex-col gap-6">
      <h2 className="headline-md text-on-surface">Activity</h2>
      {contributions.length === 0 ? (
        <div className="card-surface p-8 text-center mt-4">
          <p className="body-md text-on-surface-variant">No recent transactions.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-2">
          {contributions.map((c, index) => (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-surface p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-success/15 flex items-center justify-center border border-success/20">
                  <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                   <p className="body-md font-semibold text-on-surface">Contribution</p>
                   <p className="label-sm text-on-surface-variant mt-0.5">
                     {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                   </p>
                </div>
              </div>
              <p className="font-sans text-lg font-bold text-success tracking-tight">+{formatCurrency(c.amount)}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
