import { db } from "@database/db";
import { comments } from "@database/schema/comment.schema";
import { users } from "@database/schema/user.schema";
import { Injectable } from "@nestjs/common";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import {
  CreateCommentInput,
  createCommentSchema,
  DeleteCommentInput,
  UpdateCommentInput,
  updateCommentSchema,
} from "./dto/comment.input";
import { posts } from "@database/schema/posts.schema";
import {
  ForbiddenError,
  NotFoundError,
} from "@common/responses/custom-response";

@Injectable()
export class CommentsService {
  private async getCommentWithAuthor(commentId: number) {
    const [result] = await db
      .select({
        id: comments.id,
        content: comments.content,
        postId: comments.postId,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(and(eq(comments.id, commentId), eq(comments.isDeleted, false)))
      .limit(1);

    return result ?? null;
  }

  async findByPost(postId: number, page = 1, limit = 1) {
    const offset = (page - 1) * limit;

    const topLevel = await db
      .select({
        id: comments.id,
        content: comments.content,
        postId: comments.postId,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(
        and(
          eq(comments.postId, postId),
          eq(comments.isDeleted, false),
          isNull(comments.parentId), // top level only
        ),
      )
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const withReplies = await Promise.all(
      topLevel.map(async (comment) => {
        const replies = await db
          .select({
            id: comments.id,
            content: comments.content,
            postId: comments.postId,
            parentId: comments.parentId,
            createdAt: comments.createdAt,
            updatedAt: comments.updatedAt,
            author: {
              id: users.id,
              name: users.name,
              email: users.email,
              avatar: users.avatar,
            },
          })
          .from(comments)
          .leftJoin(users, eq(comments.authorId, users.id))
          .where(
            and(
              eq(comments.parentId, comment.id),
              eq(comments.isDeleted, false),
            ),
          )
          .orderBy(desc(comments.createdAt));

        return { ...comment, replies };
      }),
    );

    const [{ value: total }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(comments)
      .where(
        and(
          eq(comments.postId, postId),
          eq(comments.isDeleted, false),
          isNull(comments.parentId),
        ),
      );

    return {
      data: withReplies,
      total: Number(total),
      hasMore: offset + limit < Number(total),
    };
  }

  async create(input: CreateCommentInput, authorId: number) {
    const validated = createCommentSchema.parse(input);

    const [comment] = await db
      .insert(comments)
      .values({
        content: validated.content,
        postId: validated.postId,
        authorId,
        parentId: validated.parentId,
      })
      .returning();

    await db
      .update(posts)
      .set({ commentsCount: sql`COALESCE(${posts.commentsCount}, 0) + 1` })
      .where(eq(posts.id, validated.postId));

    return this.getCommentWithAuthor(comment.id);
  }

  async update(input: UpdateCommentInput, userId: number) {
    const validated = updateCommentSchema.parse({ content: input.content });

    const [existing] = await db
      .select()
      .from(comments)
      .where(and(eq(comments.id, input.id), eq(comments.isDeleted, false)))
      .limit(1);

    if (!existing) throw new NotFoundError("Comment not found");
    if (existing.authorId !== userId)
      throw new ForbiddenError("Not your comment");

    await db
      .update(comments)
      .set({ content: validated.content, updatedAt: new Date() })
      .where(eq(comments.id, input.id));

    return this.getCommentWithAuthor(input.id);
  }

  async delete(input: DeleteCommentInput, userId: number) {
    const [existing] = await db
      .select()
      .from(comments)
      .where(and(eq(comments.id, input.id), eq(comments.isDeleted, false)))
      .limit(1);

    if (!existing) throw new NotFoundError("Comment not found");
    if (existing.authorId !== userId)
      throw new ForbiddenError("Not your comment");

    await db
      .update(comments)
      .set({ isDeleted: true })
      .where(eq(comments.id, input.id));

    await db
      .update(posts)
      .set({
        commentsCount: sql`GREATEST(COALESCE(${posts.commentsCount}, 0) - 1, 0)`,
      })
      .where(eq(posts.id, existing.postId));

    return { success: true, postId: existing.postId };
  }
}
