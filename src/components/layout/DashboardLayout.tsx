import type { PropsWithChildren } from 'react';

export function DashboardLayout({ children }: PropsWithChildren) {
  return <div className="app-shell">{children}</div>;
}
