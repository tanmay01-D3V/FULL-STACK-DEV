import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { login as loginApi, signup as signupApi } from "../api/authApi";
import { storage } from "../api/client";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());

  const login = useCallback(async ({ email, password }) => {
    const { data } = await loginApi({ email, password });
    storage.setSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const { data } = await signupApi({ name, email, password });
    return data;
  }, []);

  const logout = useCallback(() => {
    storage.clearSession();
    setUser(null);
    toast("You have been logged out", { icon: "👋" });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && storage.getToken()),
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
