import { Injectable } from "@nestjs/common";
import { db } from "@database/db";
import { quizzes } from "@database/schema/quizzes.schema";
import { quizQuestions } from "@database/schema/quiz-questions.schema";
import { quizAttempts } from "@database/schema/quiz-attempts.schema";
import { quizAttemptSessions } from "@database/schema/quiz-attempt-sessions.schema";
import { uploads } from "@database/schema/uploads.schema";
import { categories } from "@database/schema/categories.schema";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { SlugUtil } from "@common/utils/slug.util";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@common/responses/custom-response";
import {
  CreateQuizDto,
  createQuizSchema,
  UpdateQuizDto,
  updateQuizSchema,
  QuizQuestionDto,
  quizQuestionSchema,
  SubmitQuizAttemptDto,
  submitQuizAttemptSchema,
} from "./dto/quiz.input";
import { PaginationDto, paginationSchema } from "@common/dto/pagination.input";
import { ActivityService } from "@modules/activity/activity.service";
import { ACTIVITY_POINTS } from "@modules/activity/points.config";

const TIME_GRACE_SECONDS = 5;

@Injectable()
export class QuizzesService {
  constructor(private readonly activityService: ActivityService) {}

  // ── Admin authoring ─────────────────────────────────────

  async createQuiz(input: CreateQuizDto, createdById: number) {
    const validated = createQuizSchema.parse(input);

    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, validated.categoryId),
          eq(categories.isDeleted, false),
        ),
      )
      .limit(1);

    if (!category) throw new BadRequestError("Invalid category");

    const slug = SlugUtil.generate(validated.title);

    const [existing] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.slug, slug))
      .limit(1);

    if (existing) {
      throw new ConflictError(`A quiz with a similar title already exists`);
    }

    const [quiz] = await db
      .insert(quizzes)
      .values({
        title: validated.title,
        slug,
        description: validated.description,
        categoryId: validated.categoryId,
        imageId: validated.imageId,
        sourceText: validated.sourceText,
        pointsReward: validated.pointsReward,
        timeLimitSeconds: validated.timeLimitSeconds,
        createdById,
      })
      .returning();

    return this.toQuizOutput(quiz);
  }

  async updateQuiz(id: number, input: UpdateQuizDto) {
    const validated = updateQuizSchema.parse(input);
    const quiz = await this.findQuizOrThrow(id);

    const [updated] = await db
      .update(quizzes)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(quizzes.id, quiz.id))
      .returning();

    return this.toQuizOutput(updated);
  }

  async deleteQuiz(id: number) {
    await this.findQuizOrThrow(id);

    await db
      .update(quizzes)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(quizzes.id, id));

    return true;
  }

  async publishQuiz(id: number) {
    const quiz = await this.findQuizOrThrow(id);

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, id));

    if (questions.length === 0) {
      throw new BadRequestError(
        "Add at least one question before publishing",
      );
    }

    for (const q of questions) {
      if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
        throw new BadRequestError(
          `Question "${q.question}" has an invalid correct answer index`,
        );
      }
    }

    const [updated] = await db
      .update(quizzes)
      .set({ status: "published", updatedAt: new Date() })
      .where(eq(quizzes.id, id))
      .returning();

    return this.toQuizOutput(updated);
  }

  async addQuestion(quizId: number, input: QuizQuestionDto) {
    await this.findQuizOrThrow(quizId);
    const validated = quizQuestionSchema.parse(input);

    if (validated.correctOptionIndex >= validated.options.length) {
      throw new BadRequestError("correctOptionIndex is out of bounds");
    }

    const [{ value: existingCount }] = await db
      .select({ value: count() })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    const [question] = await db
      .insert(quizQuestions)
      .values({
        quizId,
        question: validated.question,
        options: validated.options,
        correctOptionIndex: validated.correctOptionIndex,
        explanation: validated.explanation,
        orderIndex: existingCount,
      })
      .returning();

    return question;
  }

  async updateQuestion(questionId: number, input: Partial<QuizQuestionDto>) {
    const [existing] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId))
      .limit(1);

    if (!existing) throw new NotFoundError("Question not found");

    const merged = {
      question: input.question ?? existing.question,
      options: input.options ?? existing.options,
      correctOptionIndex:
        input.correctOptionIndex ?? existing.correctOptionIndex,
      explanation: input.explanation ?? existing.explanation ?? undefined,
    };

    if (merged.correctOptionIndex >= merged.options.length) {
      throw new BadRequestError("correctOptionIndex is out of bounds");
    }

    const [updated] = await db
      .update(quizQuestions)
      .set(merged)
      .where(eq(quizQuestions.id, questionId))
      .returning();

    return updated;
  }

  async deleteQuestion(questionId: number) {
    const [existing] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId))
      .limit(1);

    if (!existing) throw new NotFoundError("Question not found");

    await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));

    return true;
  }

  async getAdminQuizzes(pagination: PaginationDto) {
    const validated = paginationSchema.parse(pagination);
    const { page, limit } = validated;
    const offset = (page - 1) * limit;

    const whereClause = eq(quizzes.isDeleted, false);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(quizzes)
      .where(whereClause);

    const quizList = await db
      .select()
      .from(quizzes)
      .where(whereClause)
      .orderBy(desc(quizzes.createdAt))
      .limit(limit)
      .offset(offset);

    const data = await Promise.all(quizList.map((q) => this.toQuizOutput(q)));
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getAdminQuizDetail(id: number) {
    const quiz = await this.findQuizOrThrow(id);

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, id))
      .orderBy(quizQuestions.orderIndex);

    return {
      quiz: await this.toQuizOutput(quiz),
      questions,
    };
  }

  // ── Public ───────────────────────────────────────────────

  async getQuizzesByCategory(categorySlug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (!category) return [];

    const quizList = await db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.categoryId, category.id),
          eq(quizzes.status, "published"),
          eq(quizzes.isActive, true),
          eq(quizzes.isDeleted, false),
        ),
      )
      .orderBy(desc(quizzes.createdAt));

    return Promise.all(quizList.map((q) => this.toQuizOutput(q)));
  }

  async getAllPublished() {
    const quizList = await db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.status, "published"),
          eq(quizzes.isActive, true),
          eq(quizzes.isDeleted, false),
        ),
      )
      .orderBy(desc(quizzes.createdAt));

    return Promise.all(quizList.map((q) => this.toQuizOutput(q)));
  }

  async getQuizForPlay(slug: string, userId?: number) {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.slug, slug),
          eq(quizzes.status, "published"),
          eq(quizzes.isActive, true),
          eq(quizzes.isDeleted, false),
        ),
      )
      .limit(1);

    if (!quiz) throw new NotFoundError("Quiz not found");

    const questions = await db
      .select({
        id: quizQuestions.id,
        question: quizQuestions.question,
        options: quizQuestions.options,
        orderIndex: quizQuestions.orderIndex,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quiz.id))
      .orderBy(quizQuestions.orderIndex);

    const alreadyCompleted = userId
      ? await this.hasCompletedQuiz(quiz.id, userId)
      : false;

    return {
      quiz: await this.toQuizOutput(quiz),
      questions,
      alreadyCompleted,
    };
  }

  private async hasCompletedQuiz(quizId: number, userId: number) {
    const [existing] = await db
      .select({ id: quizAttempts.id })
      .from(quizAttempts)
      .where(
        and(eq(quizAttempts.quizId, quizId), eq(quizAttempts.userId, userId)),
      )
      .limit(1);

    return !!existing;
  }

  async startAttempt(quizId: number, userId: number) {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.id, quizId),
          eq(quizzes.status, "published"),
          eq(quizzes.isActive, true),
          eq(quizzes.isDeleted, false),
        ),
      )
      .limit(1);

    if (!quiz) throw new NotFoundError("Quiz not found");

    if (await this.hasCompletedQuiz(quizId, userId)) {
      throw new ForbiddenError("You've already completed this quiz");
    }

    const startedAt = new Date();
    const expiresAt = quiz.timeLimitSeconds
      ? new Date(startedAt.getTime() + quiz.timeLimitSeconds * 1000)
      : null;

    const [session] = await db
      .insert(quizAttemptSessions)
      .values({ quizId, userId, startedAt, expiresAt })
      .returning();

    return {
      sessionId: session.id,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt ?? undefined,
    };
  }

  async submitAttempt(input: SubmitQuizAttemptDto, userId: number) {
    const validated = submitQuizAttemptSchema.parse(input);

    const [session] = await db
      .select()
      .from(quizAttemptSessions)
      .where(eq(quizAttemptSessions.id, validated.sessionId))
      .limit(1);

    if (!session) throw new NotFoundError("Quiz session not found");
    if (session.userId !== userId)
      throw new ForbiddenError("Not your quiz session");
    if (session.consumedAt)
      throw new BadRequestError("This quiz attempt was already submitted");

    const quiz = await this.findQuizOrThrow(session.quizId);

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quiz.id));

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const now = new Date();
    const timeTakenSeconds = Math.round(
      (now.getTime() - session.startedAt.getTime()) / 1000,
    );
    const timedOut = Boolean(
      session.expiresAt &&
        now.getTime() > session.expiresAt.getTime() + TIME_GRACE_SECONDS * 1000,
    );

    const results = validated.answers.map((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        throw new BadRequestError(
          `Question ${answer.questionId} does not belong to this quiz`,
        );
      }

      const correct = answer.selectedIndex === question.correctOptionIndex;

      return {
        questionId: question.id,
        selectedIndex: answer.selectedIndex,
        correctOptionIndex: question.correctOptionIndex,
        correct,
        explanation: question.explanation ?? undefined,
      };
    });

    const score = results.filter((r) => r.correct).length;

    await db
      .update(quizAttemptSessions)
      .set({ consumedAt: now })
      .where(eq(quizAttemptSessions.id, session.id));

    const alreadyCompleted = await this.activityService.hasRecordedActivity(
      userId,
      "quiz_completed",
      { refType: "quiz", refId: quiz.id },
    );

    let pointsEarned = 0;
    if (!alreadyCompleted) {
      pointsEarned = quiz.pointsReward || ACTIVITY_POINTS["quiz_completed"];
      await this.activityService.recordActivity(
        userId,
        "quiz_completed",
        pointsEarned,
        { refType: "quiz", refId: quiz.id },
      );
    }

    await db.insert(quizAttempts).values({
      quizId: quiz.id,
      userId,
      score,
      totalQuestions: questions.length,
      answers: results.map((r) => ({
        questionId: r.questionId,
        selectedIndex: r.selectedIndex,
        correct: r.correct,
      })),
      pointsEarned,
      startedAt: session.startedAt,
      timeTakenSeconds,
      timedOut,
    });

    return {
      score,
      totalQuestions: questions.length,
      pointsEarned,
      firstCompletion: !alreadyCompleted,
      timedOut,
      answers: results,
    };
  }

  // ── Helpers ──────────────────────────────────────────────

  private async findQuizOrThrow(id: number) {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), eq(quizzes.isDeleted, false)))
      .limit(1);

    if (!quiz) throw new NotFoundError("Quiz not found");
    return quiz;
  }

  private async toQuizOutput(quiz: typeof quizzes.$inferSelect) {
    let imageUrl: string | undefined;

    if (quiz.imageId) {
      const [image] = await db
        .select({ url: uploads.url })
        .from(uploads)
        .where(eq(uploads.id, quiz.imageId))
        .limit(1);
      imageUrl = image?.url;
    }

    const [{ value: questionCount }] = await db
      .select({ value: count() })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quiz.id));

    return {
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description ?? undefined,
      categoryId: quiz.categoryId,
      imageId: quiz.imageId ?? undefined,
      imageUrl,
      sourceText: quiz.sourceText ?? undefined,
      status: quiz.status,
      isActive: quiz.isActive,
      pointsReward: quiz.pointsReward,
      timeLimitSeconds: quiz.timeLimitSeconds ?? undefined,
      questionCount,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }
}
