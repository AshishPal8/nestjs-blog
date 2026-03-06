import { AuthorOutput } from "@modules/posts/dto/post.output";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CommentOutput {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field(() => Int)
  postId: number;

  @Field(() => AuthorOutput, { nullable: true })
  author?: AuthorOutput;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => [CommentOutput], { nullable: true })
  replies?: CommentOutput[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PaginatedCommentsOutput {
  @Field(() => [CommentOutput])
  data: CommentOutput[];

  @Field(() => Int)
  total: number;

  @Field()
  hasMore: boolean;
}

@ObjectType()
export class DeleteCommentOutput {
  @Field()
  success: boolean;

  @Field(() => Int)
  postId: number;
}
