import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { LikesService } from "./likes.service";
import { LikeOutput } from "./dto/like.output";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { ToggleLikeInput } from "./dto/like.input";

@Resolver()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => LikeOutput, { name: "toggleLike" })
  @UseGuards(GqlAuthGuard)
  async toggleLike(
    @Args("input") input: ToggleLikeInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.likesService.toggle(input.postId, userId);
  }
}
