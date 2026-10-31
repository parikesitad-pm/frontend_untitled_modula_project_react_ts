import React from 'react';
import { cn } from '@/lib/utils';

interface AssessmentBannerProps {
  bannerUrl?: string | null;
  title?: string;
  className?: string;
  aspectRatio?: 'wide' | 'ultra-wide' | 'compact';
}

export const AssessmentBanner: React.FC<AssessmentBannerProps> = ({
  bannerUrl,
  title = 'Assessment banner',
  className,
  aspectRatio = 'wide',
}) => {
  if (!bannerUrl) return null;

  const aspectClass = {
    'compact': 'aspect-[4/1] max-h-36',
    'wide': 'aspect-[21/9] sm:aspect-[3/1] max-h-48 sm:max-h-56',
    'ultra-wide': 'aspect-[4/1] max-h-44 sm:max-h-52',
  }[aspectRatio];

  return (
    <div
      className={cn(
        'w-full relative overflow-hidden rounded-xl border border-line bg-raised group shadow-md',
        aspectClass,
        className
      )}
    >
      <img
        src={bannerUrl}
        alt={title}
        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        onError={(e) => {
          // If image fails to load, gracefully hide broken image
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
