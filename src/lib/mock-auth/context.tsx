"use client";

import * as React from "react";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: "free" | "pro" | "studio";
}

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  upgradePlan: (plan: "free" | "pro" | "studio") => void;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
  upgradePlan: () => {},
});

const STORAGE_KEY = "webuild-mock-user";

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const signIn = React.useCallback((name: string, email: string) => {
    const newUser: MockUser = {
      id: `user_${Date.now().toString(36)}`,
      name,
      email,
      plan: "free",
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const signOut = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const upgradePlan = React.useCallback((plan: "free" | "pro" | "studio") => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, plan };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useMockAuth() {
  return React.useContext(AuthContext);
}
