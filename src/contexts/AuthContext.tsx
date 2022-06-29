import Router from "next/router";
import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../services/api";

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext({} as AuthContextData);

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn: AuthContextData["signIn"] = useCallback(async credentials => {
    try {
      const response = await api.post("/sessions", credentials);
      const { permissions, roles } = response.data;

      setUser({
        email: credentials.email,
        permissions,
        roles,
      });

      Router.push("/dashboard");
    } catch (error) {
      console.log({ error });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated: !!user, user }}>
      {children}
    </AuthContext.Provider>
  );
};
