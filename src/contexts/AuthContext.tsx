import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";

interface CommonData {
  permissions: string[];
  roles: string[];
}

interface User extends CommonData {
  email: string;
}

interface SignInResponse extends CommonData {
  token: string;
  refreshToken: string;
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

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get<User>("/me")
        .then(response => setUser(response.data))
        .catch(error => console.log({ error }));
    }
  }, []);

  const signIn: AuthContextData["signIn"] = useCallback(async credentials => {
    try {
      const response = await api.post<SignInResponse>("/sessions", credentials);
      const { token, refreshToken, permissions, roles } = response.data;

      const cookieOptions = {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      };

      setCookie(undefined, "nextauth.token", token, cookieOptions);
      setCookie(
        undefined,
        "nextauth.refreshToken",
        refreshToken,
        cookieOptions,
      );

      setUser({
        email: credentials.email,
        permissions,
        roles,
      });

      (api.defaults.headers as any)["Authorization"] = `Bearer ${token}`;
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
