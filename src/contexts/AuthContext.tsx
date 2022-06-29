import { createContext, useCallback, useContext } from "react";
import { api } from "../services/api";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext({} as AuthContextData);

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const isAuthenticated = false;

  const signIn: AuthContextData["signIn"] = useCallback(async credentials => {
    try {
      const response = await api.post("/sessions", credentials);
      console.log(response.data);
    } catch (error) {
      console.log({ error });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
