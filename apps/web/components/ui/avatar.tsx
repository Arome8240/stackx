'use client';

import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  online?: boolean;
  verified?: boolean;
}

const sizeMap = {
  xs:  'w-6 h-6 text-xs',
  sm:  'w-8 h-8 text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-base',
  xl:  'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const indicatorMap = {
  xs:  'w-1.5 h-1.5 border',
  sm:  'w-2 h-2 border',
  md:  'w-2.5 h-2.5 border-2',
  lg:  'w-3 h-3 border-2',
  xl:  'w-3.5 h-3.5 border-2',
  '2xl': 'w-4 h-4 border-2',
};

export function Avatar({ src, alt = '', size = 'md', className, online, verified }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials(alt);

  return (
    <span className={cn('relative inline-flex shrink-0', sizeMap[size], className)}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full rounded-full object-cover ring-1 ring-border"
        />
      ) : (
        <span className={cn(
          'w-full h-full rounded-full flex items-center justify-center font-semibold',
          'bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white ring-1 ring-border',
        )}>
          {initials || '?'}
        </span>
      )}
      {online && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full bg-green-500 border-background',
          indicatorMap[size],
        )} />
      )}
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-primary-foreground fill-current" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </span>
      )}
    </span>
  );
}
