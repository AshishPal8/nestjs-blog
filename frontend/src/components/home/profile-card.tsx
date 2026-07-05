"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAuthStore } from "@/src/store/auth-store";
import Link from "next/link";

const ProfileCard = () => {
  const { user } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="sticky top-[150px] w-[300px] h-fit space-y-4 bg-card p-2 rounded-md">
      <CardHeader className="flex flex-col items-center gap-2 pb-2">
        <div className="relative p-1 rounded-full bg-linear-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-md">
          <Avatar className="w-24 h-24 border-4 border-card">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback className="text-xl font-bold bg-muted">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {user.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="text-center px-6">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
          {user.bio || "No bio yet. Tell the world who you are!"}
        </p>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          asChild
          variant={"ghost"}
          className="w-full h-11 text-primary font-bold text-lg active:scale-[0.98]"
        >
          <Link href="/profile">Update Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProfileSkeleton = () => (
  <div className="sticky top-[150px] w-[300px] h-fit space-y-4 bg-card p-2 rounded-md">
    <CardHeader className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
        <div className="h-3 w-20 bg-muted animate-pulse rounded-md" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md mx-auto" />
      </div>
    </CardContent>
    <CardFooter>
      <div className="h-11 w-full bg-muted animate-pulse rounded-xl" />
    </CardFooter>
  </div>
);

export default ProfileCard;
