"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/src/store/auth-store";
import { Menu } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { api } from "@/src/lib/axios";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

function UserDropdown({ isMenuOpen, setIsMenuOpen }: UserDropdownProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayUser = mounted ? user : null;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      {displayUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user?.avatar || ""}
                  alt={user?.name || "Profile"}
                />
                <AvatarFallback className="text-xs">
                  {user?.name?.[0]?.toUpperCase() || "B"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <Link href={`/profile/${user?.name}`} className="cursor-pointer"> */}
            <DropdownMenuItem>{user?.name}</DropdownMenuItem>
            {/* </Link> */}
            {/* <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex items-center cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem> */}

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      )}

      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
}

export default UserDropdown;
