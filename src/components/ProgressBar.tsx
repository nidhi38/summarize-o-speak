
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
  label
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const gradientClass = gradient ? getGradientColor(percentage) : '';
  
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">{label}</span>
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              gradient ? `bg-gradient-to-r ${gradientClass}` : ""
            )}
            style={!gradient ? { backgroundColor: color } : {}}
          />
        ) : (
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              gradient ? `bg-gradient-to-r ${gradientClass}` : ""
            )}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: gradient ? undefined : color
            }}
          />
        )}
      </div>
      {showPercentage && !label && (
        <p className={cn(
          "text-xs text-right mt-1",
          percentage === 100 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}>
          {percentage.toFixed(0)}% completed
        </p>
      )}
    </div>
  );
}
