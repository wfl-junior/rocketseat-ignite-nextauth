import { GetServerSideProps, PreviewData } from "next";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";

export function withSSRGuest<
  TProps extends Record<string, any> = Record<string, any>,
  TQuery extends ParsedUrlQuery = ParsedUrlQuery,
  TData extends PreviewData = PreviewData,
>(
  handler: GetServerSideProps<TProps>,
): GetServerSideProps<TProps, TQuery, TData> {
  return async context => {
    const cookies = parseCookies(context);

    if ("nextauth.token" in cookies) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return handler(context);
  };
}
