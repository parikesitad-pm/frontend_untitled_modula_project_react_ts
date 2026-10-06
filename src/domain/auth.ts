export type OperatorRole = 'operator' | 'admin' | 'super_admin';

export interface Operator {
  id: string;
  email: string;
  displayName: string;
  role: OperatorRole;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthAdapter {
  getCurrentUser(): Promise<Operator | null>;
  login(credentials: LoginCredentials): Promise<Operator>;
  logout(): Promise<void>;
}

