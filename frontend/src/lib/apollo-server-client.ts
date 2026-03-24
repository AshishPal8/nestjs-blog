import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { headers } from "next/headers";
import { envConfig } from "../config/env.config";

export const { getClient, query } = registerApolloClient(async () => {
  const headerList = await headers();
  const cookie = headerList.get("cookie") ?? "";

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      credentials: "include",
      headers: {
        cookie: cookie,
      },
      fetchOptions: {
        next: { revalidate: 30 },
      },
    }),
  });
});

export const publicQuery = async <T>(
  options: any,
  authCookie?: string | null,
): Promise<{ data: T }> => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      credentials: "include",
      // only attach cookie header if user is logged in
      headers: authCookie
        ? { cookie: `${envConfig.authCookieName}=${authCookie}` }
        : {},
      fetchOptions: {
        next: { revalidate: 60 },
      },
    }),
  });

  const result = await client.query<T>(options);

  if (!result.data) {
    throw new Error("No data returned from query");
  }

  return { data: result.data };
};
