"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "@/src/graphql/queries/user";
import { useAuthStore } from "@/src/store/auth-store";
import { useLoginModal } from "@/src/store/useLoginModal";

export const SessionSync = () => {
  const { user, logout } = useAuthStore();
  const { onOpen } = useLoginModal();

  const { data, error, loading } = useQuery(GET_ME, {
    skip: !user,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!loading && user) {
      if (error || (data && !data.me)) {
        logout();
        onOpen();
      }
    }
  }, [data, error, loading, user, logout, onOpen]);

  return null;
};
