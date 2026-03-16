"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../shared/icons";
import { useLoginModal } from "@/src/store/useLoginModal";
import { useAuthStore } from "@/src/store/auth-store";
import UserDropdown from "./user-dropdown";
import { useEffect, useState } from "react";
import MobileMenu from "./mobile-menu";
import CreatePostModal from "@/src/modal/create-post";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?searchterm=${encodeURIComponent(search.trim())}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(e as any);
  };

  return (
    <div className="w-full px-0 sm:px-5 md:px-10 lg:px-16 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center justify-between gap-4 sm:gap-8">
        <MobileMenu />
        <Link href="/">
          <h1 className="text-2xl font-bold hidden sm:block">Blogapp</h1>
          <h1 className="text-2xl font-bold sm:hidden">B</h1>
        </Link>
        <div className="relative">
          <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search .."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-96 rounded-full text-lg py-2 px-4 border focus-visible:ring-0 focus-visible:border-primary pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 font-bold cursor-pointer"
            >
              <Icons.x size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="items-center gap-2 hidden sm:flex">
        <CreatePostModal />
        {!mounted ? (
          <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
        ) : user ? (
          <UserDropdown isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        ) : (
          <Button
            variant="outline"
            className="border border-primary text-primary font-semibold text-sm cursor-pointer hover:text-primary"
            onClick={() => loginModal.onOpen()}
          >
            <Icons.login />
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
