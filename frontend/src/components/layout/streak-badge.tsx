"use client";

import { useQuery } from "@apollo/client/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { GET_MY_STATS } from "@/src/graphql/queries/activity";
import { useAuthStore } from "@/src/store/auth-store";
import { FlameIcon, CoinIcon } from "@/src/assets";

interface MyStatsData {
  myStats: {
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
}

const StreakBadge = () => {
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data } = useQuery<MyStatsData>(GET_MY_STATS, {
    skip: !mounted || !user,
  });

  if (!mounted || !user || !data?.myStats) return null;

  const { currentStreak, totalPoints } = data.myStats;

  return (
    <div
      className="flex items-center gap-3 rounded-full border px-3 py-1.5 text-sm"
      title={`${currentStreak}-day streak · ${totalPoints} points`}
    >
      <span className="flex items-center gap-1">
        <Image src={FlameIcon} alt="Streak" width={16} height={16} />
        <span className="font-semibold">{currentStreak}</span>
      </span>
      <span className="flex items-center gap-1">
        <Image src={CoinIcon} alt="Points" width={16} height={16} />
        <span className="font-semibold">{totalPoints}</span>
      </span>
    </div>
  );
};

export default StreakBadge;
