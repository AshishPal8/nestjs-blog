import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { PostOutput } from "./dto/post.output";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { CreatePostInput } from "./dto/create-post.input";

@Resolver(() => PostOutput)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation(() => PostOutput)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args("input") input: CreatePostInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.postsService.create(input, userId);
  }
}
