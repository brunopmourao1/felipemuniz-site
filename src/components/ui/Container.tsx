import type { ReactNode } from 'react';

export function Container({
  children,
  larga = false,
  className = '',
}: {
  children: ReactNode;
  larga?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 ${className}`}
      style={{ maxWidth: larga ? 'var(--largura-larga)' : 'var(--largura-site)' }}
    >
      {children}
    </div>
  );
}
