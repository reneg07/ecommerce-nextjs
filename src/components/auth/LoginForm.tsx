'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import type { AuthActionState } from '@/types/auth';

const initialState: AuthActionState = {
  success: false,
  message: '',
};

export function LoginForm({ redirectTarget }: { redirectTarget?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Redirección oculta para Open Redirect protegido */}
      <input type="hidden" name="redirect" value={redirectTarget || '/'} />

      {/* Alerta general de error */}
      {!state.success && state.message && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 font-medium">{state.message}</div>
        </div>
      )}

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@correo.com"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            state.errors?.email
              ? 'border-rose-300 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
          }`}
        />
        {state.errors?.email && (
          <p className="mt-1 text-xs text-rose-600 font-medium">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Contraseña
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            state.errors?.password
              ? 'border-rose-300 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
          }`}
        />
        {state.errors?.password && (
          <p className="mt-1 text-xs text-rose-600 font-medium">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Botón de Envío con Estado de Carga */}
      <Button type="submit" variant="primary" isLoading={isPending} className="w-full py-2.5 mt-2">
        {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Enlace a Registro */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        ¿Aún no tienes cuenta?{' '}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          Crear cuenta corporativa
        </Link>
      </div>
    </form>
  );
}
