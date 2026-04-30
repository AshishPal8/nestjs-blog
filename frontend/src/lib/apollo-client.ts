import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useAuthStore } from "../store/auth-store";
import { useLoginModal } from "../store/useLoginModal";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const isUnauthorized =
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message === "Unauthorized" ||
        (err.extensions?.originalError as any)?.statusCode === 401;

      if (isUnauthorized) {
        useAuthStore.getState().logout();
        useLoginModal.getState().onOpen();
      }
    }
  }
  if (networkError && (networkError as any).statusCode === 401) {
    useAuthStore.getState().logout();
    useLoginModal.getState().onOpen();
  }
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
