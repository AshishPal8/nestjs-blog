import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class UserStatsOutput {
  @Field(() => Int)
  totalPoints: number;

  @Field(() => Int)
  currentStreak: number;

  @Field(() => Int)
  longestStreak: number;

  @Field(() => String, { nullable: true })
  lastActiveDate: string | null;
}
