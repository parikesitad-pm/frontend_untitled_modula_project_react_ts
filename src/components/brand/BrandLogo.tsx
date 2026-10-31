import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  linkTo?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  size = 'md',
  iconOnly = false,
  linkTo = '/',
}) => {
  const iconSizes = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-11 w-auto',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 select-none group', className)}>
      <img
        src="/brand/modula-owl-128.webp"
        alt="MODULA Owl Crest"
        className={cn(
          iconSizes[size],
          'object-contain transition-transform group-hover:scale-105 duration-200'
        )}
        loading="eager"
      />
      {!iconOnly && (
        <div className="flex flex-col text-left leading-tight">
          <span className={cn('font-bold tracking-tight text-ink flex items-center gap-1.5', titleSizes[size])}>
            QUEICE
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
          </span>
          <span className={cn('font-mono uppercase tracking-widest text-muted group-hover:text-ink-soft transition-colors', subSizes[size])}>
            a MODULA Project
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded">
        {content}
      </Link>
    );
  }

  return content;
};
