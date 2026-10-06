import type { Operator, AuthAdapter, LoginCredentials } from './auth';

export const AUTH_STORAGE_KEY = 'untitled_modula_auth_session_v1';

/**
 * Development & Mock credentials for local sandbox testing.
 * S10 replaces this adapter with FirebaseAuthAdapter.
 */
export const DEV_DEFAULT_OPERATORS: (Operator & { passwordHash: string })[] = [
  {
    id: 'op-admin-01',
    email: 'admin@modula.dev',
    displayName: 'Workspace Admin',
    role: 'admin',
    passwordHash: 'modula2026',
  },
  {
    id: 'op-lead-02',
    email: 'operator@modula.dev',
    displayName: 'Assessment Lead',
    role: 'operator',
    passwordHash: 'operator2026',
  },
];

export class MockAuthAdapter implements AuthAdapter {
  private storageKey: string;

  constructor(storageKey = AUTH_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  async getCurrentUser(): Promise<Operator | null> {
    // Artificial slight tick to emulate microtask resolution without UI flicker
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Operator;
      if (parsed && parsed.id && parsed.email) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  async login(credentials: LoginCredentials): Promise<Operator> {
    const trimmedEmail = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Simulate async network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    // Check predefined dev operators
    const matched = DEV_DEFAULT_OPERATORS.find(
      (op) => op.email.toLowerCase() === trimmedEmail
    );

    if (matched) {
      if (matched.passwordHash !== password) {
        throw new Error('Invalid email or password. Please try again.');
      }
      const operator: Operator = {
        id: matched.id,
        email: matched.email,
        displayName: matched.displayName,
        role: matched.role,
      };
      this.persistSession(operator);
      return operator;
    }

    // Allow mock fallback login for development testing with any valid credentials
    const username = trimmedEmail.split('@')[0];
    const operator: Operator = {
      id: `op-${Date.now().toString(36)}`,
      email: trimmedEmail,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'operator',
    };
    this.persistSession(operator);
    return operator;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.warn('MockAuthAdapter: logout storage clearance failed', err);
    }
  }

  private persistSession(user: Operator): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } catch (err) {
      console.warn('MockAuthAdapter: session persist failed', err);
    }
  }
}

export const defaultAuthAdapter = new MockAuthAdapter();

