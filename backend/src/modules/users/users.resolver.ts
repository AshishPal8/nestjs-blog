import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { UsersService } from "./users.service";
import { UserOutput } from "./dto/user.output";
import { UpdateProfileInput } from "./dto/update-profile.input";

@Resolver(() => UserOutput)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserOutput, { name: "me" })
  @UseGuards(GqlAuthGuard)
  async me(@Context() context: any) {
    return this.usersService.findOne(context.req.user.id);
  }

  @Mutation(() => UserOutput)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args("input") input: UpdateProfileInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.usersService.updateProfile(userId, input);
  }
}
