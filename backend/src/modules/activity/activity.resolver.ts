import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { UserStatsOutput } from "./dto/activity.output";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { UserStats } from "@database/schema/user-stats.schema";

@Resolver()
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Query(() => UserStatsOutput, { name: "myStats" })
  @UseGuards(GqlAuthGuard)
  async myStats(@Context() context: any): Promise<UserStatsOutput> {
    const userId = context.req.user.id;
    return this.toOutput(await this.activityService.getStats(userId));
  }

  @Query(() => UserStatsOutput, { name: "userStats", nullable: true })
  async userStats(
    @Args("userId", { type: () => Int }) userId: number,
  ): Promise<UserStatsOutput | null> {
    const stats = await this.activityService.getPublicStats(userId);
    return stats ? this.toOutput(stats) : null;
  }

  @Mutation(() => UserStatsOutput)
  @UseGuards(GqlAuthGuard)
  async recordDailyLogin(@Context() context: any): Promise<UserStatsOutput> {
    const userId = context.req.user.id;
    await this.activityService.touchDailyLogin(userId);
    return this.toOutput(await this.activityService.getStats(userId));
  }

  private toOutput(stats: UserStats): UserStatsOutput {
    return {
      totalPoints: stats.totalPoints,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      lastActiveDate: stats.lastActiveDate,
    };
  }
}
