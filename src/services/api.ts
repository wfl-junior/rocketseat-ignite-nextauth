import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();

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
        })
        .catch(error => console.log({ error }));
    } else {
      // deslogar o usuário
    }
  }
});
