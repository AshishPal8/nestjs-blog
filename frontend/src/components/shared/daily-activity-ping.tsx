"use client";

import { useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { RECORD_DAILY_LOGIN } from "@/src/graphql/mutations/activity";
import { useAuthStore } from "@/src/store/auth-store";

const PING_STORAGE_KEY = "daily-activity-ping-date";

const todayUtc = () => new Date().toISOString().slice(0, 10);

const DailyActivityPing = () => {
  const user = useAuthStore((state) => state.user);
  const [recordDailyLogin] = useMutation(RECORD_DAILY_LOGIN);

  useEffect(() => {
    if (!user) return;

    const today = todayUtc();
    const lastPing = localStorage.getItem(PING_STORAGE_KEY);

    if (lastPing === today) return;

    recordDailyLogin()
      .then(() => localStorage.setItem(PING_STORAGE_KEY, today))
      .catch(() => {
        // silently ignore - not critical to the user's session
      });
  }, [user, recordDailyLogin]);

  return null;
};

export default DailyActivityPing;
