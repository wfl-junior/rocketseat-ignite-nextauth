import { GetServerSideProps, PreviewData } from "next";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";

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

    return handler(context);
  };
}
