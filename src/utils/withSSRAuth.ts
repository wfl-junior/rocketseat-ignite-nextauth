import jwtDecode from "jwt-decode";
import { GetServerSideProps, PreviewData } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";
import { Permission, Role, User } from "../@types/api";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { validateUserPermissionsAndRoles } from "./validateUserPermissionsAndRoles";

interface WithSSRAuthOptions {
  permissions?: Permission[];
  roles?: Role[];
}

export function withSSRAuth<
  TProps extends Record<string, any> = Record<string, any>,
  TQuery extends ParsedUrlQuery = ParsedUrlQuery,
  TData extends PreviewData = PreviewData,
>(
  handler?: GetServerSideProps<TProps, TQuery, TData>,
  options?: WithSSRAuthOptions,
): GetServerSideProps<TProps, TQuery, TData> {
  return async context => {
    const cookies = parseCookies(context);

    const { "nextauth.token": token } = cookies;

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (options) {
      const user: User = jwtDecode(token);
      const userHasValidPermissionsAndRoles = validateUserPermissionsAndRoles({
        user,
        ...options,
      });

      if (!userHasValidPermissionsAndRoles) {
        return {
          redirect: {
            destination: "/dashboard",
            permanent: false,
          },
        };
      }
    }

    if (!handler) {
      return {
        props: {} as TProps,
      };
    }

    try {
      const result = await handler(context);
      return result;
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(context, "nextauth.token");
        destroyCookie(context, "nextauth.refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      throw error;
    }
  };
}
