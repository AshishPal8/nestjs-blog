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

import { CategoryColumn } from "./columns";
import { useState } from "react";
import AlertModal from "@/src/modal/alert-modal";
import { useMutation } from "@apollo/client/react";
import { DELETE_CATEGORY } from "@/src/graphql/mutations/categories";
import { handleError } from "@/src/lib/errors/handleError";

interface CellActionProps {
  data: CategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success("Category Id is copied to clipboard");
  };

  const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category deleted.");
      router.push(`/dashboard/categories`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        "Failed to delete the category. Please ensure all dependencies are removed.",
      );
      console.error("Delete error:", error);
    },
  });

  const onDelete = async () => {
    try {
      await deleteCategory({
        variables: {
          id: data.id,
        },
      });
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
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
            onClick={() => router.push(`/dashboard/categories/${data.id}`)}
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
