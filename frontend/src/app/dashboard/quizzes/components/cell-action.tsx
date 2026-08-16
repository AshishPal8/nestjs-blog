"use client";

import { useRouter } from "next/navigation";
import { Copy, Edit, EyeOff, Eye, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";

import { QuizColumn } from "./columns";
import { useState } from "react";
import AlertModal from "@/src/modal/alert-modal";
import { useMutation } from "@apollo/client/react";
import { DELETE_QUIZ, UPDATE_QUIZ } from "@/src/graphql/mutations/quizzes";
import { handleError } from "@/src/lib/errors/handleError";

interface CellActionProps {
  data: QuizColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success("Quiz Id copied to clipboard");
  };

  const [deleteQuiz, { loading }] = useMutation(DELETE_QUIZ, {
    onCompleted: () => {
      toast.success("Quiz deleted.");
      router.push(`/dashboard/quizzes`);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete the quiz.");
    },
  });

  const onDelete = async () => {
    try {
      await deleteQuiz({ variables: { id: data.id } });
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const [toggleActive] = useMutation(UPDATE_QUIZ, {
    onCompleted: (result) => {
      toast.success(
        result.updateQuiz.isActive ? "Quiz activated" : "Quiz deactivated",
      );
    },
    onError: () => toast.error("Failed to update quiz status"),
  });

  const onToggleActive = async () => {
    try {
      await toggleActive({
        variables: { id: data.id, input: { isActive: !data.isActive } },
      });
    } catch (error) {
      handleError(error);
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
            onClick={() => router.push(`/dashboard/quizzes/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleActive}>
            {data.isActive ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
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
