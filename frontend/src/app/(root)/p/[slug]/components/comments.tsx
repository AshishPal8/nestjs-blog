"use client";

import { Icons } from "@/src/components/shared/icons";
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
} from "@/src/graphql/mutations/comments";
import { GET_COMMENTS } from "@/src/graphql/queries/comments";
import { timeAgo } from "@/src/lib";
import { useAuthStore } from "@/src/store/auth-store";
import { useLoginModal } from "@/src/store/useLoginModal";
import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Author {
  id: number;
  name: string;
  avatar?: string;
}

interface Comment {
  id: number;
  content: string;
  postId: number;
  parentId?: number;
  createdAt: string;
  author?: Author;
  replies?: Comment[];
}

interface CommentsProps {
  postId: number;
}

// ── Comment Item ───────────────────────────────────────────────────────────
const CommentItem = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
}: {
  comment: Comment;
  onReply: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  currentUserId?: number;
}) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-3">
      <div className="shrink-0">
        {comment.author?.avatar ? (
          <Image
            src={comment.author.avatar}
            alt={comment.author.name ?? ""}
            width={32}
            height={32}
            className="rounded-full object-cover w-8 h-8"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold">
            {comment.author?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-accent/40 rounded-2xl px-3 py-2 inline-block max-w-full">
          <p className="text-xs font-semibold">{comment.author?.name}</p>
          <p className="text-sm wrap-break-word">{comment.content}</p>
        </div>

        <div className="flex items-center gap-3 mt-1 px-1">
          <span className="text-xs text-muted-foreground">
            {timeAgo(comment.createdAt)}
          </span>
          <button
            onClick={() => onReply(comment.id, comment.author?.name ?? "")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reply
          </button>
          {currentUserId === comment.author?.id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-red-400 hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="text-xs text-primary mb-2"
            >
              {showReplies
                ? "Hide replies"
                : `View ${comment.replies.length} repl${comment.replies.length > 1 ? "ies" : "y"}`}
            </button>
            {showReplies && (
              <div className="flex flex-col gap-3 pl-3 border-l-2 border-accent mt-2">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    onDelete={onDelete}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Comments = ({ postId }: CommentsProps) => {
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(
    null,
  );

  const user = useAuthStore((state) => state.user);
  const loginModal = useLoginModal();

  const { data, loading, fetchMore, refetch } = useQuery(GET_COMMENTS, {
    variables: { postId, pagination: { page: 1, limit: 10 } },
    fetchPolicy: "cache-and-network",
    skip: !postId,
  });

  const comments: Comment[] = data?.comments?.data ?? [];
  const hasMore: boolean = data?.comments?.hasMore ?? false;
  const total: number = data?.comments?.total ?? 0;

  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setContent("");
      setReplyTo(null);
      refetch();
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => refetch(),
    onError: () => toast.error("Failed to delete comment"),
  });

  const handleSubmit = () => {
    if (!user) {
      loginModal.onOpen();
      return;
    }
    if (!content.trim()) return;
    createComment({
      variables: {
        input: {
          content: content.trim(),
          postId,
          ...(replyTo && { parentId: replyTo.id }),
        },
      },
    });
  };

  const handleReply = (id: number, name: string) => {
    if (!user) {
      loginModal.onOpen();
      return;
    }
    setReplyTo({ id, name });
  };

  const handleDelete = (id: number) => {
    deleteComment({ variables: { input: { id } } });
  };

  const loadMore = () => {
    fetchMore({
      variables: {
        postId,
        pagination: { page: Math.ceil(comments.length / 10) + 1, limit: 10 },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          comments: {
            ...fetchMoreResult.comments,
            data: [...prev.comments.data, ...fetchMoreResult.comments.data],
          },
        };
      },
    });
  };

  return (
    <div className="px-4 pb-10 mt-2">
      {/* header */}
      <h2 className="font-semibold text-sm mb-4">
        Comments{" "}
        {total > 0 && <span className="text-muted-foreground">({total})</span>}
      </h2>

      {/* input */}
      <div className="flex gap-3 mb-6">
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name ?? ""}
            width={32}
            height={32}
            className="rounded-full object-cover shrink-0 w-8 h-8"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}

        <div className="flex-1">
          {replyTo && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary">
                Replying to @{replyTo.name}
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 bg-accent/40 rounded-full px-4 py-2">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={user ? "Write a comment..." : "Login to comment"}
              className="flex-1 bg-transparent text-sm outline-none"
              onClick={() => {
                if (!user) loginModal.onOpen();
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={creating || !content.trim()}
              className="text-primary disabled:opacity-40 transition-opacity"
            >
              <Icons.send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      {loading && comments.length === 0 ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-accent shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-accent rounded w-24" />
                <div className="h-3 bg-accent rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              currentUserId={user?.id}
            />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              className="text-sm text-primary text-center py-2 hover:underline"
            >
              Load more comments
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
