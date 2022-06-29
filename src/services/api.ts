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
  if (error.response?.status === 401) {
    if ((error.response.data as any).code === "token.expired") {
      cookies = parseCookies();
      const { "nextauth.refreshToken": refreshToken } = cookies;
      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        api
          .post("/refresh", {
            refreshToken,
          })
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

            failedRequestsQueue.forEach(request => request.onSuccess(token));
          })
          .catch(error => {
            failedRequestsQueue.forEach(request => request.onFailure(error));
          })
          .finally(() => {
            isRefreshing = false;
            failedRequestsQueue = [];
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: token => {
            (originalConfig.headers as any)[
              "Authorization"
            ] = `Bearer ${token}`;

            resolve(api(originalConfig));
          },
          onFailure: error => {
            reject(error);
          },
        });
      });
    }

    signOut();
  }

  return Promise.reject(error);
});
