import { Field, InputType, Int } from "@nestjs/graphql";
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000),
  postId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000),
});

export const deleteCommentSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

@InputType()
export class CreateCommentInput {
  @Field()
  content: string;

  @Field(() => Int)
  postId: number;

  @Field(() => Int, { nullable: true })
  parentId?: number;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;
}

@InputType()
export class DeleteCommentInput {
  @Field(() => Int)
  id: number;
}

@InputType()
export class CommentPaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;
}
