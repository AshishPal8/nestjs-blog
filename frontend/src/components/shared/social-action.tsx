"use client";
import { Icons } from "./icons";
import { useState } from "react";
import ShareModal from "@/src/modal/share-modal";
import { Post } from "@/src/types/post.types";
import { useAuthStore } from "@/src/store/auth-store";
import { useLoginModal } from "@/src/store/useLoginModal";
import { useMutation } from "@apollo/client/react";
import { TOGGLE_LIKE } from "@/src/graphql/mutations/likes";
import { useRouter } from "next/navigation";
import { TOGGLE_BOOKMARK } from "@/src/graphql/mutations/bookmarks";

const SocialAction = ({ post }: { post: Post }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [likeState, setLikeState] = useState<{
    isLiked: boolean;
    likesCount: number;
  } | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    post?.isBookmarked ?? false,
  );

  const user = useAuthStore((state) => state.user);
  const loginModal = useLoginModal();

  const isLiked = likeState?.isLiked ?? post?.isLiked ?? false;
  const likesCount = likeState?.likesCount ?? post?.likesCount ?? 0;

  const [toggleLike, { loading }] = useMutation(TOGGLE_LIKE, {
    onCompleted: (data) => {
      setLikeState({
        isLiked: data.toggleLike.isLiked,
        likesCount: data.toggleLike.likesCount,
      });
    },
    onError: () => {
      setLikeState(null);
    },
  });

  const [toggleBookmark, { loading: bookmarkLoading }] = useMutation(
    TOGGLE_BOOKMARK,
    {
      onCompleted: (data) => {
        setIsBookmarked(data.toggleBookmark.isBookmarked);
      },
      onError: () => {
        setIsBookmarked(post?.isBookmarked ?? false);
      },
    },
  );

  const handleLike = () => {
    if (!user) {
      loginModal.onOpen();
      return;
    }
    if (loading) return;

    setLikeState({
      isLiked: !isLiked,
      likesCount: isLiked ? likesCount - 1 : likesCount + 1,
    });

    toggleLike({ variables: { input: { postId: post.id } } });
  };

  const handleBookmark = () => {
    if (!user) return loginModal.onOpen();
    if (bookmarkLoading) return;

    setIsBookmarked(!isBookmarked);
    toggleBookmark({ variables: { postId: post.id } });
  };

  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-4">
        <div
          onClick={handleLike}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Icons.like
            size={24}
            className={`transition-all duration-200 transform active:scale-125 ${
              isLiked
                ? "text-blue-500 fill-blue-500"
                : "text-gray-500 group-hover:text-blue-500"
            }`}
          />
          <span
            className={`text-sm ${isLiked ? "text-blue-500" : "text-gray-400"}`}
          >
            {likesCount}
          </span>
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => router.push(`/p/${post.slug}`)}
        >
          <Icons.comment
            size={24}
            className="text-gray-500 hover:text-gray-600 cursor-pointer"
          />
          <span className="text-gray-400">{post?.commentsCount || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.share
            size={24}
            onClick={() => setOpen(true)}
            className="text-green-500 hover:text-green-600 cursor-pointer"
          />
        </div>
      </div>
      <div onClick={handleBookmark} className="cursor-pointer group">
        <Icons.bookmark
          size={24}
          className={`transition-all duration-200 transform active:scale-125 ${
            isBookmarked
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-500 group-hover:text-yellow-500"
          }`}
        />
      </div>
      <ShareModal open={open} onClose={() => setOpen(false)} slug={post.slug} />
    </div>
  );
};

export default SocialAction;
