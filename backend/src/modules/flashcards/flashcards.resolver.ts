import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { FlashcardsService } from "./flashcards.service";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { GqlOptionalAuthGuard } from "@modules/auth/guards/gql-optional-auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorator";
import { PaginationInput } from "@common/dto/pagination.input";
import {
  CreateFlashcardDeckInput,
  UpdateFlashcardDeckInput,
  FlashcardCardInput,
  SubmitFlashcardAttemptInput,
} from "./dto/flashcard.input";
import {
  FlashcardDeckOutput,
  PaginatedFlashcardDecksOutput,
  FlashcardDeckDetailOutput,
  FlashcardCardOutput,
  FlashcardAttemptResultOutput,
} from "./dto/flashcard.output";

@Resolver()
export class FlashcardsResolver {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  // ── Admin ────────────────────────────────────────────────

  @Mutation(() => FlashcardDeckOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async createFlashcardDeck(
    @Args("input") input: CreateFlashcardDeckInput,
    @Context() context: any,
  ) {
    return this.flashcardsService.createDeck(input, context.req.user.id);
  }

  @Mutation(() => FlashcardDeckOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async updateFlashcardDeck(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateFlashcardDeckInput,
  ) {
    return this.flashcardsService.updateDeck(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteFlashcardDeck(@Args("id", { type: () => Int }) id: number) {
    return this.flashcardsService.deleteDeck(id);
  }

  @Mutation(() => FlashcardDeckOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async publishFlashcardDeck(@Args("id", { type: () => Int }) id: number) {
    return this.flashcardsService.publishDeck(id);
  }

  @Mutation(() => FlashcardCardOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async addFlashcardCard(
    @Args("deckId", { type: () => Int }) deckId: number,
    @Args("input") input: FlashcardCardInput,
  ) {
    return this.flashcardsService.addCard(deckId, input);
  }

  @Mutation(() => FlashcardCardOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async updateFlashcardCard(
    @Args("cardId", { type: () => Int }) cardId: number,
    @Args("input") input: FlashcardCardInput,
  ) {
    return this.flashcardsService.updateCard(cardId, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteFlashcardCard(
    @Args("cardId", { type: () => Int }) cardId: number,
  ) {
    return this.flashcardsService.deleteCard(cardId);
  }

  @Query(() => PaginatedFlashcardDecksOutput, { name: "adminFlashcardDecks" })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async adminFlashcardDecks(
    @Args("pagination", { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
  ) {
    return this.flashcardsService.getAdminDecks(
      pagination || { page: 1, limit: 20 },
    );
  }

  @Query(() => FlashcardDeckDetailOutput, { name: "adminFlashcardDeckDetail" })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async adminFlashcardDeckDetail(@Args("id", { type: () => Int }) id: number) {
    return this.flashcardsService.getAdminDeckDetail(id);
  }

  // ── Public ───────────────────────────────────────────────

  @Query(() => [FlashcardDeckOutput], { name: "flashcardDecks" })
  async flashcardDecks() {
    return this.flashcardsService.getAllPublished();
  }

  @Query(() => [FlashcardDeckOutput], { name: "flashcardDecksByCategory" })
  async flashcardDecksByCategory(
    @Args("categorySlug", { type: () => String }) categorySlug: string,
  ) {
    return this.flashcardsService.getDecksByCategory(categorySlug);
  }

  @Query(() => FlashcardDeckDetailOutput, { name: "flashcardDeck" })
  @UseGuards(GqlOptionalAuthGuard)
  async flashcardDeck(
    @Args("slug", { type: () => String }) slug: string,
    @Context() context: any,
  ) {
    return this.flashcardsService.getDeckForPlay(slug, context.req.user?.id);
  }

  @Mutation(() => FlashcardAttemptResultOutput)
  @UseGuards(GqlAuthGuard)
  async submitFlashcardAttempt(
    @Args("input") input: SubmitFlashcardAttemptInput,
    @Context() context: any,
  ) {
    return this.flashcardsService.submitAttempt(input, context.req.user.id);
  }
}
