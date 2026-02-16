"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";

export const HandleAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam && typeof setAuth === "function") {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        setAuth(token, user);

        const redirect = localStorage.getItem("redirectAfterLogin");

        if (redirect) {
          localStorage.removeItem("redirectAfterLogin");
          router.push(redirect);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to parse user from OAuth redirect", error);
      }
    }
  }, [searchParams, setAuth, router, pathname]);

  return null;
};
