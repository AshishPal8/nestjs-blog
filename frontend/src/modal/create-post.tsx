"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useMediaQuery } from "../hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../components/ui/drawer";
import { Icons } from "../components/shared/icons";
import CreatePostForm from "../components/editor/create-post-form";
import { useAuthStore } from "../store/auth-store";
import { useLoginModal } from "../store/useLoginModal";
import { toast } from "sonner";

const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const user = useAuthStore((state) => state.user);
  const loginModal = useLoginModal();

  const handleCreatePost = () => {
    if (!user) {
      toast.error("Please login to create a post");
      loginModal.onOpen();
      return;
    }
    setIsOpen(true);
  };

  const Content = (
    <div className="p-6 space-y-6">
      {isDesktop ? (
        <>
          <DialogTitle className="text-primary font-bold text-2xl mb-0">
            Create New Post
          </DialogTitle>
          <DialogDescription>Add your blog content here.</DialogDescription>
        </>
      ) : (
        <>
          <DrawerTitle className="text-primary font-bold text-2xl mb-0">
            Create New Post
          </DrawerTitle>
          <DrawerDescription>Add your blog content here.</DrawerDescription>
        </>
      )}
      <div className="">
        <CreatePostForm onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );

  return (
    <>
      {user?.role === "admin" && (
        <Button onClick={handleCreatePost} className="cursor-pointer">
          <Icons.plus />
          <span className="hidden sm:block">Create</span>
        </Button>
      )}

      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl max-h-[95vh] flex flex-col"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="overflow-y-auto flex-1">{Content}</div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="rounded-none flex flex-col h-screen">
            <div className="overflow-y-auto flex-1">{Content}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CreatePostModal;
