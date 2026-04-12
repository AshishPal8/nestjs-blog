import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BookmarksService } from "./bookmarks.service";
import { ToggleBookmarkOutput } from "./dto/bookmarks.output";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { PaginatedPostsOutput } from "@modules/posts/dto/paginated-posts.output";
import { PaginationInput } from "@common/dto/pagination.input";

@Resolver()
export class BookmarksResolver {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Mutation(() => ToggleBookmarkOutput)
  @UseGuards(GqlAuthGuard)
  async toggleBookmark(
    @Args("postId", { type: () => Int }) postId: number,
    @Context() context: any,
  ): Promise<ToggleBookmarkOutput> {
    const userId = context.req.user.id;
    const isBookmarked = await this.bookmarksService.toggleBookmark(
      userId,
      postId,
    );
    return {
      isBookmarked,
      message: isBookmarked
        ? "Post saved to bookmarks"
        : "Post removed from bookmarks",
    };
  }

  @Query(() => PaginatedPostsOutput, { name: "myBookmarks" })
  @UseGuards(GqlAuthGuard)
  async myBookmarks(
    @Args("pagination", { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
    @Context() context: any,
  ): Promise<PaginatedPostsOutput> {
    const userId = context.req.user.id;
    return this.bookmarksService.findMyBookmarks(
      pagination || { page: 1, limit: 20 },
      userId,
    );
  }
}
