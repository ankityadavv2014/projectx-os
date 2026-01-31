// ProjectX OS - Role Switcher (Dev Only)
'use client';

import { useAuth } from '@/lib/auth';
import type { UserRole } from '@/lib/domain/types';

const ROLES: { value: UserRole; label: string; emoji: string }[] = [
  { value: 'student', label: 'Student', emoji: '🎓' },
  { value: 'teacher', label: 'Teacher', emoji: '👨‍🏫' },
  { value: 'parent', label: 'Parent', emoji: '👨‍👩‍👧' },
  { value: 'admin', label: 'Admin', emoji: '⚙️' },
  { value: 'facilitator', label: 'Facilitator', emoji: '🔧' },
];

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-lg">
      <div className="text-xs text-gray-400 mb-2 font-mono">DEV: Switch Role</div>
      <div className="flex gap-1">
        {ROLES.map(role => (
          <button
            key={role.value}
            onClick={() => switchRole(role.value)}
            className={`
              px-2 py-1 text-xs rounded transition-all
              ${user?.role === role.value 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
            `}
            title={role.label}
          >
            {role.emoji}
          </button>
        ))}
      </div>
      {user && (
        <div className="text-xs text-gray-500 mt-2 font-mono">
          {user.displayName} ({user.role})
        </div>
      )}
    </div>
  );
}
