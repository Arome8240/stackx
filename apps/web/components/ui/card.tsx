import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 text-card-foreground ${className}`}>
      {children}
    </div>
  );
}
