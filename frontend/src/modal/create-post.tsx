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
import { useMutation } from "@apollo/client/react";
import { handleGraphqlError } from "../lib/errors/handleGraphqlErrors";
import { CREATE_POST } from "../graphql/mutations/posts";
import { toast } from "sonner";
import CreatePostForm from "../components/editor/create-post-form";

const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    metaDescription: "",
    categoryIds: [],
    images: [],
    tags: [],
  });

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      toast.success("Post created successfully!");
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      handleGraphqlError(error);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      metaDescription: "",
      categoryIds: [],
      images: [],
      tags: [],
    });
  };

  const Content = (
    <div onSubmit={() => {}} className="p-6 space-y-6">
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
      <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
        <Icons.plus />
        Create
      </Button>

      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl">
            {Content}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="rounded-none">{Content}</DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CreatePostModal;
