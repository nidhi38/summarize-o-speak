
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
  pulseEffect?: boolean;
  rounded?: "sm" | "md" | "lg" | "full";
  showBubble?: boolean;
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
  showGlow = false,
  pulseEffect = false,
  rounded = "full",
  showBubble = false
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const gradientClass = gradient ? getGradientColor(percentage) : '';
  
  const roundedClass = {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  }[rounded];

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
        className={cn(
          "bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner",
          roundedClass
        )}
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
              "h-full transition-all duration-500 ease-out",
              roundedClass,
              gradient ? `bg-gradient-to-r ${gradientClass}` : "",
              showGlow && percentage > 60 ? "shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "",
              pulseEffect && percentage > 75 ? "animate-pulse-soft" : ""
            )}
            style={!gradient ? { backgroundColor: color } : {}}
          />
        ) : (
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              roundedClass,
              gradient ? `bg-gradient-to-r ${gradientClass}` : "",
              showGlow && percentage > 60 ? "shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "",
              pulseEffect && percentage > 75 ? "animate-pulse-soft" : ""
            )}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: gradient ? undefined : color
            }}
          />
        )}
        
        {showBubble && percentage > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="relative"
          >
            <div 
              className="absolute top-0 -right-3 -translate-y-full mb-1 bg-primary text-primary-foreground text-xs rounded-md px-1.5 py-0.5 shadow-sm"
              style={{ transform: `translateX(-${100 - percentage}%)` }}
            >
              {percentage.toFixed(0)}%
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" style={{ width: 0, height: 0 }} />
            </div>
          </motion.div>
        )}
      </div>
      {showPercentage && !label && !showBubble && (
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
