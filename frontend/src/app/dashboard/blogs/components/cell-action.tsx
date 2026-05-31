"use client";

import { useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";

import { PostColumn } from "./columns";
import { useState } from "react";
import AlertModal from "@/src/modal/alert-modal";
import { useMutation } from "@apollo/client/react";
import { DELETE_POST } from "@/src/graphql/queries/posts";

interface CellActionProps {
  data: PostColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success("Post Id is copied to clipboard");
  };

  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      toast.success("Post deleted.");
      router.push(`/dashboard/blogs`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        "Failed to delete the post. Please ensure all dependencies are removed.",
      );
      console.error("Delete error:", error);
    },
  });

  const onDelete = async () => {
    await deletePost({ variables: { id: data.id } });
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/blogs/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
