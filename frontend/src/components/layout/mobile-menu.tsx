"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Icons } from "../shared/icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useAuthStore } from "@/src/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceholderImg } from "@/src/assets";
import { useLoginModal } from "@/src/store/useLoginModal";

const MobileMenu = () => {
  const { user, logout } = useAuthStore();
  const loginModal = useLoginModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Icons.menu className="h-10 w-10" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[60%] p-0 flex flex-col border-none shadow-2xl"
      >
        <SheetHeader className="py-4 px-2 border-b flex flex-row justify-start items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={user?.avatar || PlaceholderImg.src}
              alt={user?.name || "Profile"}
            />
            <AvatarFallback className="text-xs">
              {user?.name?.[0]?.toUpperCase() || "B"}
            </AvatarFallback>
          </Avatar>
          <SheetTitle className="text-base capitalize font-extrabold text-primary">
            {user?.name || "Hello Guest!"}
          </SheetTitle>
          {!user && (
            <SheetClose asChild>
              <Button
                size={"sm"}
                variant="outline"
                className="bg-primary text-white font-semibold text-sm cursor-pointer hover:text-primary"
                onClick={() => {
                  loginModal.onOpen();
                }}
              >
                <Icons.login />
                Login
              </Button>
            </SheetClose>
          )}

          <VisuallyHidden.Root>Navigation Menu</VisuallyHidden.Root>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-4 text-lg py-6">
            <Icons.home className="size-5" /> Home
          </Button>
          <Button variant="ghost" className="justify-start gap-4 text-lg py-6">
            <Icons.search className="size-5" /> Explore
          </Button>

          {user && (
            <>
              <div className="h-px bg-gray-100 my-2" />
              <Button
                variant="ghost"
                className="justify-start gap-4 text-lg py-6"
              >
                <Icons.user className="size-5" /> Profile
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-4 text-lg py-6"
              >
                <Icons.settings className="size-5" /> Settings
              </Button>
            </>
          )}
        </div>

        <div className="p-4 border-t mt-auto">
          {!mounted ? (
            // Show placeholder during SSR
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
          ) : user ? (
            <Button
              variant="destructive"
              className="w-full justify-start gap-4"
              onClick={() => logout()}
            >
              <Icons.logout className="size-5" /> Logout
            </Button>
          ) : (
            <p className="text-center text-sm text-gray-400 font-medium">
              Join our community to start sharing.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
