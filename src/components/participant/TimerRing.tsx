import React from 'react';
import { cn } from '@/lib/utils';

interface TimerRingProps {
  secondsLeft: number;
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  isPlayful?: boolean;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  secondsLeft,
  totalSeconds,
  size = 72,
  strokeWidth = 5,
  className,
  isPlayful = false,
}) => {
  const safeSecondsLeft = Math.max(0, secondsLeft);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, safeSecondsLeft / totalSeconds)) : 1;
  const strokeDashoffset = circumference - progress * circumference;

  const isUrgent = safeSecondsLeft <= 10 && safeSecondsLeft > 0;
  const isExpired = safeSecondsLeft <= 0;

  let strokeColor = isPlayful ? '#5AA9FF' : 'var(--color-burgundy-bright)';
  if (isUrgent) strokeColor = '#F0646A';
  if (isExpired) strokeColor = '#7A1025';

  const timeDisplay = totalSeconds > 60
    ? `${Math.floor(safeSecondsLeft / 60)}:${(safeSecondsLeft % 60).toString().padStart(2, '0')}`
    : safeSecondsLeft.toString();

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center font-mono select-none',
        isUrgent && 'animate-pulse',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-border-subtle)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-300 ease-linear"
        />
      </svg>
      {/* Time Display Number */}
      <span
        className={cn(
          'absolute font-bold tabular-nums text-[var(--color-soft-white)]',
          totalSeconds > 60 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base',
          isUrgent && 'text-[#F0646A]'
        )}
      >
        {timeDisplay}
      </span>
    </div>
  );
};

