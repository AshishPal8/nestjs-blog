import { UseGuards } from "@nestjs/common";
import { Context, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "./guards/gql-auth.guard";

@Resolver()
export class AuthResolver {
  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context: any): Promise<string> {
    const user = context.req.user;
    return `Hello ${user.email}! Your ID is ${user.id}`;
  }
}
