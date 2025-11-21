'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Користувач'}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {session.user.name || session.user.email}
          </span>
        </div>
        {session.user.image && (
          <div className="sm:hidden">
            <Image
              src={session.user.image}
              alt={session.user.name || 'Користувач'}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="hidden sm:inline">Вийти</span>
          <span className="sm:hidden">✕</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
    >
      <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="hidden sm:inline">Увійти через Google</span>
      <span className="sm:hidden">Увійти</span>
    </button>
  );
}

