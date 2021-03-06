import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SignInCredentials, SignInResponse, User } from "../@types/api";
import { api } from "../services/apiClient";

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext({} as AuthContextData);

export const useAuthContext = () => useContext(AuthContext);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  authChannel.postMessage("signOut");
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = message => {
      switch (message.data) {
        case "signOut": {
          Router.push("/");
          break;
        }
        // funciona, porém não atualiza dados nas outras abas
        // case "signIn": {
        //   Router.push("/dashboard");
        //   break;
        // }
      }
    };
  }, []);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get<User>("/me")
        .then(response => setUser(response.data))
        .catch();
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
      // authChannel.postMessage("signIn");
    } catch (error) {
      console.log({ error });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, isAuthenticated: !!user, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
