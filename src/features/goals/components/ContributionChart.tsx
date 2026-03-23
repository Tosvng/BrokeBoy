import { useMemo } from "react";
import { motion } from "motion/react";
import type { Contribution } from "../types";

export const ContributionChart = ({ contributions }: { contributions: Contribution[] }) => {
  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toLocaleString('en-US', { month: 'short' });
      data[monthKey] = 0;
    }
    
    contributions.forEach(c => {
      const d = new Date(c.date);
      // Only include if it's within the last 6 months approx
      const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
      if (monthDiff >= 0 && monthDiff <= 5) {
        const monthKey = d.toLocaleString('en-US', { month: 'short' });
        if (data[monthKey] !== undefined) {
          data[monthKey] += c.amount;
        }
      }
    });

    return Object.entries(data).map(([label, value]) => ({ label, value }));
  }, [contributions]);

  const maxValue = Math.max(...chartData.map(d => d.value), 100);

  return (
    <div className="card-surface p-6 mt-6 mb-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="title-md text-on-surface">Contribution Rate</h2>
          <p className="label-sm text-on-surface-variant mt-0.5">Last 6 months</p>
        </div>
      </div>

      <div className="flex items-end justify-between h-36 gap-3 relative z-10">
        {chartData.map((d, i) => {
          const heightPct = (d.value / Math.max(maxValue, 1)) * 100;
          return (
            <div key={d.label} className="flex flex-col items-center gap-3 flex-1 h-full select-none group/bar cursor-default">
              <div className="w-full bg-surface-card-high/50 rounded-md relative flex items-end h-full overflow-hidden transition-colors group-hover/bar:bg-surface-card-high">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 150, damping: 20 }}
                  className="w-full bg-gold/80 rounded-sm min-h-1 relative"
                >
                   {/* Gradient overlay for premium feel */}
                   <div className="absolute inset-0 bg-linear-to-t from-gold/40 to-transparent"></div>
                </motion.div>
                
                {/* Tooltip on hover */}
                {d.value > 0 && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-outline-variant text-on-surface text-[10px] py-1 px-2 rounded font-semibold pointer-events-none whitespace-nowrap">
                    ${d.value.toLocaleString()}
                  </div>
                )}
              </div>
              <span className="label-sm text-on-surface-variant text-[11px] font-medium tracking-wide uppercase">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
