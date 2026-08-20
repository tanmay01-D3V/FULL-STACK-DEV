"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user?: {
    id?: string;
    _id?: string;
    username: string;
    email: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    const userData = data.user ?? {
      id: undefined,
      _id: undefined,
      username: "",
      email: "",
    };
    const userId = userData._id ?? userData.id ?? "";
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: userId,
        username: userData.username,
        email: userData.email,
      }),
    );
    setToken(data.token);
    setUser({
      _id: userId,
      username: userData.username,
      email: userData.email,
    });
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
      });
      const userData = data.user ?? {
        id: undefined,
        _id: undefined,
        username: "",
        email: "",
      };
      const userId = userData._id ?? userData.id ?? "";
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: userId,
          username: userData.username,
          email: userData.email,
        }),
      );
      setToken(data.token);
      setUser({
        _id: userId,
        username: userData.username,
        email: userData.email,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
