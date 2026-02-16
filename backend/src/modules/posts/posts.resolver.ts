import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { PostOutput } from "./dto/post.output";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { PaginatedPostsOutput } from "./dto/paginated-posts.output";
import { PaginationInput } from "@common/dto/pagination.input";
import { UpdatePostInput } from "./dto/update-post-input";
import { CreatePostInput } from "./dto/create-post.input";

@Resolver(() => PostOutput)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query(() => PaginatedPostsOutput, { name: "posts" })
  async getPosts(
    @Args("pagination", { nullable: true })
    pagination: PaginationInput,
  ) {
    return this.postsService.findAll(
      pagination || { page: 1, limit: 10, search: "" },
    );
  }

  @Query(() => PostOutput, { name: "post" })
  async getPost(
    @Args("id", { type: () => Int })
    id: number,
  ) {
    return this.postsService.findById(id);
  }

  @Query(() => PostOutput, { name: "postBySlug" })
  async getPostBySlug(
    @Args("slug", { type: () => String })
    slug: string,
  ) {
    return this.postsService.findBySlug(slug);
  }

  @Query(() => PaginatedPostsOutput, { name: "myPosts" })
  @UseGuards(GqlAuthGuard)
  async getMyPosts(
    @Context() context: any,
    @Args("pagination", { nullable: true })
    pagination: PaginationInput,
  ) {
    const userId = context.req.user.id;
    return this.postsService.findByAuthor(
      userId,
      pagination || { page: 1, limit: 10, search: "" },
    );
  }

  @Mutation(() => PostOutput)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args("input") input: CreatePostInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.postsService.create(input, userId);
  }

  @Mutation(() => PostOutput)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args("id", { type: () => Int })
    id: number,
    @Args("input") input: UpdatePostInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.postsService.update(id, input, userId);
  }

  @Mutation(() => PostOutput)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args("id", { type: () => Int })
    id: number,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.postsService.delete(id, userId);
  }
}
