
import { cn, getGradientColor } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  height?: number;
  showPercentage?: boolean;
  animate?: boolean;
  gradient?: boolean;
  label?: string;
  showGlow?: boolean;
}

export function ProgressBar({ 
  value,
  max = 100,
  color = "#8B5CF6",
  className,
  height = 4,
  showPercentage = false,
  animate = true,
  gradient = false,
  label,
  showGlow = false
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const gradientClass = gradient ? getGradientColor(percentage) : '';
  
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {showPercentage && (
            <span className="text-xs font-medium">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner"
        style={{ height: `${height}px` }}
      >
        {animate ? (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: percentage > 50 ? 1.2 : 0.8, 
              ease: "easeOut",
              delay: 0.1
            }}
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              gradient ? `bg-gradient-to-r ${gradientClass}` : "",
              showGlow && percentage > 60 ? "shadow-[0_0_8px_rgba(139,92,246,0.6)]" : ""
            )}
            style={!gradient ? { backgroundColor: color } : {}}
          />
        ) : (
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              gradient ? `bg-gradient-to-r ${gradientClass}` : "",
              showGlow && percentage > 60 ? "shadow-[0_0_8px_rgba(139,92,246,0.6)]" : ""
            )}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: gradient ? undefined : color
            }}
          />
        )}
      </div>
      {showPercentage && !label && (
        <div className="flex justify-end mt-1.5">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "text-xs",
              percentage === 100 ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"
            )}
          >
            {percentage.toFixed(0)}% completed
            {percentage === 100 && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block ml-1"
              >
                ✓
              </motion.span>
            )}
          </motion.p>
        </div>
      )}
    </div>
  );
}
