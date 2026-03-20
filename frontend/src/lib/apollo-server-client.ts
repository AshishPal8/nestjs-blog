import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { headers } from "next/headers";

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
