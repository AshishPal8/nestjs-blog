"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_POST_BY_ID, DELETE_POST } from "@/src/graphql/queries/posts";
import CreatePostForm from "@/src/components/editor/create-post-form";
import { Heading } from "@/src/components/ui/heading";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Trash } from "lucide-react";
import AlertModal from "@/src/modal/alert-modal";
import { toast } from "sonner";

interface PostData {
  post: {
    id: number;
    title: string;
    description: string;
    tags: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    images: { id: number; url: string }[];
  };
}

const PostPage = () => {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  const isNew = postId === "new";

  const [open, setOpen] = useState(false);

  const { data, loading, error } = useQuery<PostData>(GET_POST_BY_ID, {
    variables: { id: parseInt(postId) },
    skip: isNew,
  });

  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      toast.success("Post deleted.");
      router.push("/dashboard/blogs");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete the post.");
    },
  });

  const onDelete = async () => {
    await deletePost({ variables: { id: parseInt(postId) } });
    setOpen(false);
  };

  if (isNew) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title="Create Post" description="Add a new blog post" />
          <Separator />
          <CreatePostForm onClose={() => router.push("/dashboard/blogs")} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        </div>
      </div>
    );
  }

  const post = data.post;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={deleteLoading}
      />
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <Heading title="Edit Post" description="Update blog post details" />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <Separator />
          <CreatePostForm
            initialData={{
              id: post.id,
              title: post.title,
              description: post.description,
              tags: post.tags.map((t) => t.name),
              categoryIds: post.categories.map((c) => c.id),
              images: post.images,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PostPage;
