import React from "react";
import type { HTMLMotionProps } from "motion/react";
import { motion } from "motion/react";

interface CardProps extends HTMLMotionProps<"div"> {
  elevation?: "low" | "medium" | "high" | "lowest";
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, elevation = "medium", glass = false, className = "", ...props }, ref) => {
    // Tonal layering elevations
    const elevations = {
      lowest: "bg-surface-container-lowest",
      low: "bg-surface-container-low",
      medium: "bg-surface-container",
      high: "bg-surface-container-high shadow-ambient",
    };

    const glassClass = glass ? "glass-panel" : "";
    const baseClass = "rounded-3xl overflow-hidden";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${baseClass} ${elevations[elevation]} ${glassClass} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
