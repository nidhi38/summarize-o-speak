
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  height?: number;
  showPercentage?: boolean;
}

export function ProgressBar({ 
  value,
  max = 100,
  color = "#8B5CF6",
  className,
  height = 4,
  showPercentage = false
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner"
        style={{ height: `${height}px` }}
      >
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
      {showPercentage && (
        <p className={cn(
          "text-xs text-right mt-1",
          percentage === 100 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}>
          {percentage}% completed
        </p>
      )}
    </div>
  );
}
