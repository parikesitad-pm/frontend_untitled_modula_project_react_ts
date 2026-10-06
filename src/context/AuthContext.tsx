import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Operator, AuthStatus, LoginCredentials, AuthAdapter } from '@/domain/auth';
import { defaultAuthAdapter } from '@/domain/auth-mock';
import { AuthContext, AuthContextType } from './AuthContextCore';

interface AuthProviderProps {
  children: React.ReactNode;
  adapter?: AuthAdapter;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  adapter = defaultAuthAdapter,
}) => {
  const [user, setUser] = useState<Operator | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Initialize session on app load
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const currentUser = await adapter.getCurrentUser();
        if (isMounted) {
          if (currentUser) {
            setUser(currentUser);
            setStatus('authenticated');
          } else {
            setUser(null);
            setStatus('unauthenticated');
          }
        }
      } catch (err) {
        console.warn('AuthProvider: initSession error', err);
        if (isMounted) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [adapter]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setStatus('loading');
      try {
        const authenticatedUser = await adapter.login(credentials);
        setUser(authenticatedUser);
        setStatus('authenticated');
      } catch (err) {
        setStatus('unauthenticated');
        throw err;
      }
    },
    [adapter]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await adapter.logout();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, [adapter]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      status,
      login,
      logout,
      authAdapter: adapter,
    }),
    [user, status, login, logout, adapter]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

