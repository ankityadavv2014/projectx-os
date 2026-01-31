// ProjectX OS - Providers
'use client';

import { AuthProvider } from '@/lib/auth';
import { RoleSwitcher } from '@/components/dev/RoleSwitcher';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <RoleSwitcher />
    </AuthProvider>
  );
}
