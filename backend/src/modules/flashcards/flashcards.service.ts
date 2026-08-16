import { Injectable } from "@nestjs/common";
import { db } from "@database/db";
import { flashcardDecks } from "@database/schema/flashcard-decks.schema";
import { flashcardCards } from "@database/schema/flashcard-cards.schema";
import { flashcardAttempts } from "@database/schema/flashcard-attempts.schema";
import { uploads } from "@database/schema/uploads.schema";
import { categories } from "@database/schema/categories.schema";
import { and, count, desc, eq } from "drizzle-orm";
import { SlugUtil } from "@common/utils/slug.util";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@common/responses/custom-response";
import {
  CreateFlashcardDeckDto,
  createFlashcardDeckSchema,
  UpdateFlashcardDeckDto,
  updateFlashcardDeckSchema,
  FlashcardCardDto,
  flashcardCardSchema,
  SubmitFlashcardAttemptDto,
  submitFlashcardAttemptSchema,
} from "./dto/flashcard.input";
import { PaginationDto, paginationSchema } from "@common/dto/pagination.input";
import { ActivityService } from "@modules/activity/activity.service";
import { ACTIVITY_POINTS } from "@modules/activity/points.config";

@Injectable()
export class FlashcardsService {
  constructor(private readonly activityService: ActivityService) {}

  // ── Admin authoring ─────────────────────────────────────

  async createDeck(input: CreateFlashcardDeckDto, createdById: number) {
    const validated = createFlashcardDeckSchema.parse(input);

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
      .from(flashcardDecks)
      .where(eq(flashcardDecks.slug, slug))
      .limit(1);

    if (existing) {
      throw new ConflictError(`A deck with a similar title already exists`);
    }

    const [deck] = await db
      .insert(flashcardDecks)
      .values({
        title: validated.title,
        slug,
        description: validated.description,
        categoryId: validated.categoryId,
        imageId: validated.imageId,
        sourceText: validated.sourceText,
        pointsReward: validated.pointsReward,
        createdById,
      })
      .returning();

    return this.toDeckOutput(deck);
  }

  async updateDeck(id: number, input: UpdateFlashcardDeckDto) {
    const validated = updateFlashcardDeckSchema.parse(input);
    const deck = await this.findDeckOrThrow(id);

    const [updated] = await db
      .update(flashcardDecks)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(flashcardDecks.id, deck.id))
      .returning();

    return this.toDeckOutput(updated);
  }

  async deleteDeck(id: number) {
    await this.findDeckOrThrow(id);

    await db
      .update(flashcardDecks)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(flashcardDecks.id, id));

    return true;
  }

  async publishDeck(id: number) {
    await this.findDeckOrThrow(id);

    const cards = await db
      .select()
      .from(flashcardCards)
      .where(eq(flashcardCards.deckId, id));

    if (cards.length === 0) {
      throw new BadRequestError("Add at least one card before publishing");
    }

    const [updated] = await db
      .update(flashcardDecks)
      .set({ status: "published", updatedAt: new Date() })
      .where(eq(flashcardDecks.id, id))
      .returning();

    return this.toDeckOutput(updated);
  }

  async addCard(deckId: number, input: FlashcardCardDto) {
    await this.findDeckOrThrow(deckId);
    const validated = flashcardCardSchema.parse(input);

    const [{ value: existingCount }] = await db
      .select({ value: count() })
      .from(flashcardCards)
      .where(eq(flashcardCards.deckId, deckId));

    const [card] = await db
      .insert(flashcardCards)
      .values({
        deckId,
        front: validated.front,
        back: validated.back,
        orderIndex: existingCount,
      })
      .returning();

    return card;
  }

  async updateCard(cardId: number, input: Partial<FlashcardCardDto>) {
    const [existing] = await db
      .select()
      .from(flashcardCards)
      .where(eq(flashcardCards.id, cardId))
      .limit(1);

    if (!existing) throw new NotFoundError("Card not found");

    const [updated] = await db
      .update(flashcardCards)
      .set({
        front: input.front ?? existing.front,
        back: input.back ?? existing.back,
      })
      .where(eq(flashcardCards.id, cardId))
      .returning();

    return updated;
  }

  async deleteCard(cardId: number) {
    const [existing] = await db
      .select()
      .from(flashcardCards)
      .where(eq(flashcardCards.id, cardId))
      .limit(1);

    if (!existing) throw new NotFoundError("Card not found");

    await db.delete(flashcardCards).where(eq(flashcardCards.id, cardId));

    return true;
  }

  async getAdminDecks(pagination: PaginationDto) {
    const validated = paginationSchema.parse(pagination);
    const { page, limit } = validated;
    const offset = (page - 1) * limit;

    const whereClause = eq(flashcardDecks.isDeleted, false);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(flashcardDecks)
      .where(whereClause);

    const deckList = await db
      .select()
      .from(flashcardDecks)
      .where(whereClause)
      .orderBy(desc(flashcardDecks.createdAt))
      .limit(limit)
      .offset(offset);

    const data = await Promise.all(deckList.map((d) => this.toDeckOutput(d)));
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

  async getAdminDeckDetail(id: number) {
    const deck = await this.findDeckOrThrow(id);

    const cards = await db
      .select()
      .from(flashcardCards)
      .where(eq(flashcardCards.deckId, id))
      .orderBy(flashcardCards.orderIndex);

    return {
      deck: await this.toDeckOutput(deck),
      cards,
    };
  }

  // ── Public ───────────────────────────────────────────────

  async getDecksByCategory(categorySlug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (!category) return [];

    const deckList = await db
      .select()
      .from(flashcardDecks)
      .where(
        and(
          eq(flashcardDecks.categoryId, category.id),
          eq(flashcardDecks.status, "published"),
          eq(flashcardDecks.isActive, true),
          eq(flashcardDecks.isDeleted, false),
        ),
      )
      .orderBy(desc(flashcardDecks.createdAt));

    return Promise.all(deckList.map((d) => this.toDeckOutput(d)));
  }

  async getAllPublished() {
    const deckList = await db
      .select()
      .from(flashcardDecks)
      .where(
        and(
          eq(flashcardDecks.status, "published"),
          eq(flashcardDecks.isActive, true),
          eq(flashcardDecks.isDeleted, false),
        ),
      )
      .orderBy(desc(flashcardDecks.createdAt));

    return Promise.all(deckList.map((d) => this.toDeckOutput(d)));
  }

  async getDeckForPlay(slug: string, userId?: number) {
    const [deck] = await db
      .select()
      .from(flashcardDecks)
      .where(
        and(
          eq(flashcardDecks.slug, slug),
          eq(flashcardDecks.status, "published"),
          eq(flashcardDecks.isActive, true),
          eq(flashcardDecks.isDeleted, false),
        ),
      )
      .limit(1);

    if (!deck) throw new NotFoundError("Deck not found");

    const cards = await db
      .select()
      .from(flashcardCards)
      .where(eq(flashcardCards.deckId, deck.id))
      .orderBy(flashcardCards.orderIndex);

    const alreadyCompleted = userId
      ? await this.hasCompletedDeck(deck.id, userId)
      : false;

    return {
      deck: await this.toDeckOutput(deck),
      cards,
      alreadyCompleted,
    };
  }

  private async hasCompletedDeck(deckId: number, userId: number) {
    const [existing] = await db
      .select({ id: flashcardAttempts.id })
      .from(flashcardAttempts)
      .where(
        and(
          eq(flashcardAttempts.deckId, deckId),
          eq(flashcardAttempts.userId, userId),
        ),
      )
      .limit(1);

    return !!existing;
  }

  async submitAttempt(input: SubmitFlashcardAttemptDto, userId: number) {
    const validated = submitFlashcardAttemptSchema.parse(input);
    const deck = await this.findDeckOrThrow(validated.deckId);

    if (await this.hasCompletedDeck(deck.id, userId)) {
      throw new ForbiddenError("You've already completed this deck");
    }

    const alreadyCompleted = await this.activityService.hasRecordedActivity(
      userId,
      "flashcard_deck_completed",
      { refType: "flashcard_deck", refId: deck.id },
    );

    let pointsEarned = 0;
    if (!alreadyCompleted) {
      pointsEarned =
        deck.pointsReward || ACTIVITY_POINTS["flashcard_deck_completed"];
      await this.activityService.recordActivity(
        userId,
        "flashcard_deck_completed",
        pointsEarned,
        { refType: "flashcard_deck", refId: deck.id },
      );
    }

    await db.insert(flashcardAttempts).values({
      deckId: deck.id,
      userId,
      knownCount: validated.knownCount,
      totalCards: validated.totalCards,
      pointsEarned,
    });

    return {
      knownCount: validated.knownCount,
      totalCards: validated.totalCards,
      pointsEarned,
      firstCompletion: !alreadyCompleted,
    };
  }

  // ── Helpers ──────────────────────────────────────────────

  private async findDeckOrThrow(id: number) {
    const [deck] = await db
      .select()
      .from(flashcardDecks)
      .where(
        and(eq(flashcardDecks.id, id), eq(flashcardDecks.isDeleted, false)),
      )
      .limit(1);

    if (!deck) throw new NotFoundError("Deck not found");
    return deck;
  }

  private async toDeckOutput(deck: typeof flashcardDecks.$inferSelect) {
    let imageUrl: string | undefined;

    if (deck.imageId) {
      const [image] = await db
        .select({ url: uploads.url })
        .from(uploads)
        .where(eq(uploads.id, deck.imageId))
        .limit(1);
      imageUrl = image?.url;
    }

    const [{ value: cardCount }] = await db
      .select({ value: count() })
      .from(flashcardCards)
      .where(eq(flashcardCards.deckId, deck.id));

    return {
      id: deck.id,
      title: deck.title,
      slug: deck.slug,
      description: deck.description ?? undefined,
      categoryId: deck.categoryId,
      imageId: deck.imageId ?? undefined,
      imageUrl,
      sourceText: deck.sourceText ?? undefined,
      status: deck.status,
      isActive: deck.isActive,
      pointsReward: deck.pointsReward,
      cardCount,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    };
  }
}
