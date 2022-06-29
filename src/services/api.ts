import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

interface FailedRequest {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

api.interceptors.response.use(undefined, (error: AxiosError) => {
  // se for status 401 = Unauthenticated
  if (error.response?.status === 401) {
    // se for error de token expirado, fazer refresh de token
    if ((error.response.data as any).code === "token.expired") {
      cookies = parseCookies();
      const { "nextauth.refreshToken": refreshToken } = cookies;

      // config da request que vai ser repassada posteriormente para refazer este request
      const originalConfig = error.config;

      // somente fazer refresh de token se não tiver outra requisição fazendo refresh no momento
      if (!isRefreshing) {
        isRefreshing = true;

        api
          .post("/refresh", { refreshToken })
          .then(response => {
            const { token, refreshToken: newRefreshToken } = response.data;

            const cookieOptions = {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/",
            };

            setCookie(undefined, "nextauth.token", token, cookieOptions);
            setCookie(
              undefined,
              "nextauth.refreshToken",
              newRefreshToken,
              cookieOptions,
            );

            (api.defaults.headers as any)["Authorization"] = `Bearer ${token}`;

            // refaz as requisições na fila com novo token
            failedRequestsQueue.forEach(request => request.onSuccess(token));
          })
          .catch(error => {
            // trata erro das requisições na fila caso tenha dado erro no refresh de token
            failedRequestsQueue.forEach(request => request.onFailure(error));
          })
          .finally(() => {
            // reseta isRefreshing e fila de requests
            isRefreshing = false;
            failedRequestsQueue = [];
          });
      }

      // adiciona fila de requests para serem tratadas após terminar refresh
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: token => {
            (originalConfig.headers as any)[
              "Authorization"
            ] = `Bearer ${token}`;

            // refaz request on success
            resolve(api(originalConfig));
          },
          onFailure: error => {
            reject(error);
          },
        });
      });
    }

    // faz logout caso tenha dado erro que não seja token expirado
    signOut();
  }

  // retorna outros errors normalmente
  return Promise.reject(error);
});
