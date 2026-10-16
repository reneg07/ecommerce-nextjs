'use client';

import React, { useTransition } from 'react';
import { logoutAction } from '@/actions/auth.actions';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer disabled:opacity-50"
      title="Cerrar sesión e invalidar token JWT"
    >
      {isPending ? 'Saliendo...' : 'Cerrar Sesión'}
    </button>
  );
}
