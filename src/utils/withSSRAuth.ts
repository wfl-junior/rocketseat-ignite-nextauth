import { GetServerSideProps, PreviewData } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function withSSRAuth<
  TProps extends Record<string, any> = Record<string, any>,
  TQuery extends ParsedUrlQuery = ParsedUrlQuery,
  TData extends PreviewData = PreviewData,
>(
  handler?: GetServerSideProps<TProps, TQuery, TData>,
): GetServerSideProps<TProps, TQuery, TData> {
  return async context => {
    const cookies = parseCookies(context);

    if (!("nextauth.token" in cookies)) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
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
