'use client';

import React, { createContext, useState } from 'react';
import { Loader } from '../components/ui-kit/loader';
import { useAuthHelpers } from '../hooks/use-auth-helpers';
import { useGetFetchUser } from '../hooks/use-get-fetch-user';
import { authService, getSession } from '../services/auth.service';
import { cookieService } from '../services/cookie.service';
import { AuthContextValue, AuthSession } from '../types/auth';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const storedUser = getSession();
    if (storedUser) {
      return {
        user: storedUser,
        status: 'authenticated',
        error: null,
      };
    }
    return {
      user: null,
      status: 'unauthenticated',
      error: null,
    };
  });

  const { refetch: refetchUser, isSuccess } = useGetFetchUser({
    userId: session?.user?.id as number,
    skip: session?.status !== 'authenticated',
    setSession: (newSession) => setSession(newSession),
  });

  const user = session?.user || null;
  const status = session?.status || 'unauthenticated';
  const isAuthenticated = status === 'authenticated' && !!user;
  const isLoading =
    status === 'loading' || (status === 'authenticated' && !isSuccess);

  const logout = () => {
    const accessToken = cookieService.getCookie('accessToken');
    authService.logout(accessToken);
    cookieService.removeCookie('accessToken');
    cookieService.removeCookie('refreshToken');
    setSession(null);
  };

  const authHelpers = useAuthHelpers(user);

  const value: AuthContextValue = {
    session,
    user,
    status,
    isAuthenticated,
    isLoading,
    setSession,
    updateSession: refetchUser,
    logout,
    ...authHelpers,
  };

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
