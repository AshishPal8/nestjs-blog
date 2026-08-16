export const ACTIVITY_TYPE = {
  DAILY_LOGIN: "daily_login",
  POST_CREATED: "post_created",
  COMMENT_CREATED: "comment_created",
  LIKE_GIVEN: "like_given",
  QUIZ_COMPLETED: "quiz_completed",
  FLASHCARD_DECK_COMPLETED: "flashcard_deck_completed",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE];

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  [ACTIVITY_TYPE.DAILY_LOGIN]: 5,
  [ACTIVITY_TYPE.POST_CREATED]: 20,
  [ACTIVITY_TYPE.COMMENT_CREATED]: 5,
  [ACTIVITY_TYPE.LIKE_GIVEN]: 2,
  [ACTIVITY_TYPE.QUIZ_COMPLETED]: 10,
  [ACTIVITY_TYPE.FLASHCARD_DECK_COMPLETED]: 10,
};
