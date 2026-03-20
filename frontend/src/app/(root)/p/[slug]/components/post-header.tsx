"use client";
import { Icons } from "@/src/components/shared/icons";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const PostHeader = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icons.arrowLeft
          className="text-muted-foreground cursor-pointer"
          size={20}
          onClick={() => router.back()}
        />
        <span className="font-semibold">Post</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Icons.ellipsisVertical
            className="text-muted-foreground cursor-pointer"
            size={20}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostHeader;
