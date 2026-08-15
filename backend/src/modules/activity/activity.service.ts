import { Injectable, Logger } from "@nestjs/common";
import { db } from "@database/db";
import { userActivities } from "@database/schema/activity.schema";
import { userStats, UserStats } from "@database/schema/user-stats.schema";
import { users } from "@database/schema/user.schema";
import { and, eq } from "drizzle-orm";
import { ACTIVITY_POINTS, ActivityType } from "./points.config";

interface ActivityRef {
  refType?: string;
  refId?: number;
}

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  async recordActivity(
    userId: number,
    type: ActivityType,
    points: number = ACTIVITY_POINTS[type],
    ref?: ActivityRef,
  ): Promise<void> {
    try {
      await db.insert(userActivities).values({
        userId,
        type,
        points,
        refType: ref?.refType,
        refId: ref?.refId,
      });

      await this.applyToStats(userId, points);
    } catch (error) {
      this.logger.error(
        `Failed to record activity "${type}" for user ${userId}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async hasRecordedActivity(
    userId: number,
    type: ActivityType,
    ref: Required<ActivityRef>,
  ): Promise<boolean> {
    const [existing] = await db
      .select({ id: userActivities.id })
      .from(userActivities)
      .where(
        and(
          eq(userActivities.userId, userId),
          eq(userActivities.type, type),
          eq(userActivities.refType, ref.refType),
          eq(userActivities.refId, ref.refId),
        ),
      )
      .limit(1);

    return !!existing;
  }

  async touchDailyLogin(userId: number): Promise<void> {
    const stats = await this.getOrCreateStats(userId);

    if (stats.lastActiveDate === this.todayUtc()) {
      return;
    }

    await this.recordActivity(
      userId,
      "daily_login",
      ACTIVITY_POINTS["daily_login"],
    );
  }

  async getStats(userId: number): Promise<UserStats> {
    return this.getOrCreateStats(userId);
  }

  async getPublicStats(userId: number): Promise<UserStats | null> {
    const [existing] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (existing) return existing;

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    return {
      userId,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      updatedAt: new Date(),
    };
  }

  private async getOrCreateStats(userId: number): Promise<UserStats> {
    const [existing] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (existing) return existing;

    const [created] = await db
      .insert(userStats)
      .values({ userId })
      .onConflictDoNothing()
      .returning();

    if (created) return created;

    const [afterRace] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    return afterRace;
  }

  private async applyToStats(userId: number, points: number): Promise<void> {
    const stats = await this.getOrCreateStats(userId);
    const today = this.todayUtc();
    const yesterday = this.yesterdayUtc();

    let currentStreak = stats.currentStreak;

    if (stats.lastActiveDate === today) {
      // already active today, streak unchanged
    } else if (stats.lastActiveDate === yesterday) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    const longestStreak = Math.max(stats.longestStreak, currentStreak);

    await db
      .update(userStats)
      .set({
        totalPoints: stats.totalPoints + points,
        currentStreak,
        longestStreak,
        lastActiveDate: today,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId));
  }

  private todayUtc(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private yesterdayUtc(): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }
}
