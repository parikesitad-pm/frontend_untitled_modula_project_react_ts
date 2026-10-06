import { createContext } from 'react';
import type { Operator, AuthStatus, LoginCredentials, AuthAdapter } from '@/domain/auth';

export interface AuthContextType {
  user: Operator | null;
  status: AuthStatus;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  authAdapter: AuthAdapter;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

