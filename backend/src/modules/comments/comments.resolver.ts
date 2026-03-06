import { Args, Query, Context, Int, Mutation, Resolver } from "@nestjs/graphql";
import { CommentsService } from "./comments.service";
import { UseGuards } from "@nestjs/common";
import {
  CommentOutput,
  DeleteCommentOutput,
  PaginatedCommentsOutput,
} from "./dto/comment.output";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import {
  CommentPaginationInput,
  CreateCommentInput,
  DeleteCommentInput,
  UpdateCommentInput,
} from "./dto/comment.input";

@Resolver(() => CommentOutput)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => PaginatedCommentsOutput, { name: "comments" })
  async getComments(
    @Args("postId", { type: () => Int }) postId: number,
    @Args("pagination", { type: () => CommentPaginationInput, nullable: true })
    pagination?: CommentPaginationInput,
  ) {
    const { page, limit } = pagination ?? { page: 1, limit: 10 };
    return this.commentsService.findByPost(postId, page, limit);
  }

  @Mutation(() => CommentOutput, { name: "createComment" })
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args("input") input: CreateCommentInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentsService.create(input, userId);
  }

  @Mutation(() => CommentOutput, { name: "updateComment" })
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args("input") input: UpdateCommentInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentsService.update(input, userId);
  }

  @Mutation(() => DeleteCommentOutput, { name: "deleteComment" })
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Args("input") input: DeleteCommentInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentsService.delete(input, userId);
  }
}
