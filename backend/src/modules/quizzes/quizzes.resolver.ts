import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { GqlOptionalAuthGuard } from "@modules/auth/guards/gql-optional-auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorator";
import { PaginationInput } from "@common/dto/pagination.input";
import {
  CreateQuizInput,
  UpdateQuizInput,
  QuizQuestionInput,
  SubmitQuizAttemptInput,
} from "./dto/quiz.input";
import {
  QuizOutput,
  PaginatedQuizzesOutput,
  QuizAdminDetailOutput,
  QuizQuestionAdminOutput,
  QuizPlayOutput,
  StartQuizAttemptOutput,
  QuizAttemptResultOutput,
} from "./dto/quiz.output";

@Resolver()
export class QuizzesResolver {
  constructor(private readonly quizzesService: QuizzesService) {}

  // ── Admin ────────────────────────────────────────────────

  @Mutation(() => QuizOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async createQuiz(
    @Args("input") input: CreateQuizInput,
    @Context() context: any,
  ) {
    return this.quizzesService.createQuiz(input, context.req.user.id);
  }

  @Mutation(() => QuizOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async updateQuiz(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateQuizInput,
  ) {
    return this.quizzesService.updateQuiz(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteQuiz(@Args("id", { type: () => Int }) id: number) {
    return this.quizzesService.deleteQuiz(id);
  }

  @Mutation(() => QuizOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async publishQuiz(@Args("id", { type: () => Int }) id: number) {
    return this.quizzesService.publishQuiz(id);
  }

  @Mutation(() => QuizQuestionAdminOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async addQuizQuestion(
    @Args("quizId", { type: () => Int }) quizId: number,
    @Args("input") input: QuizQuestionInput,
  ) {
    return this.quizzesService.addQuestion(quizId, input);
  }

  @Mutation(() => QuizQuestionAdminOutput)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async updateQuizQuestion(
    @Args("questionId", { type: () => Int }) questionId: number,
    @Args("input") input: QuizQuestionInput,
  ) {
    return this.quizzesService.updateQuestion(questionId, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteQuizQuestion(
    @Args("questionId", { type: () => Int }) questionId: number,
  ) {
    return this.quizzesService.deleteQuestion(questionId);
  }

  @Query(() => PaginatedQuizzesOutput, { name: "adminQuizzes" })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async adminQuizzes(
    @Args("pagination", { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
  ) {
    return this.quizzesService.getAdminQuizzes(
      pagination || { page: 1, limit: 20 },
    );
  }

  @Query(() => QuizAdminDetailOutput, { name: "adminQuizDetail" })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("admin")
  async adminQuizDetail(@Args("id", { type: () => Int }) id: number) {
    return this.quizzesService.getAdminQuizDetail(id);
  }

  // ── Public ───────────────────────────────────────────────

  @Query(() => [QuizOutput], { name: "quizzes" })
  async quizzes() {
    return this.quizzesService.getAllPublished();
  }

  @Query(() => [QuizOutput], { name: "quizzesByCategory" })
  async quizzesByCategory(
    @Args("categorySlug", { type: () => String }) categorySlug: string,
  ) {
    return this.quizzesService.getQuizzesByCategory(categorySlug);
  }

  @Query(() => QuizPlayOutput, { name: "quiz" })
  @UseGuards(GqlOptionalAuthGuard)
  async quiz(
    @Args("slug", { type: () => String }) slug: string,
    @Context() context: any,
  ) {
    return this.quizzesService.getQuizForPlay(slug, context.req.user?.id);
  }

  @Mutation(() => StartQuizAttemptOutput)
  @UseGuards(GqlAuthGuard)
  async startQuizAttempt(
    @Args("quizId", { type: () => Int }) quizId: number,
    @Context() context: any,
  ) {
    return this.quizzesService.startAttempt(quizId, context.req.user.id);
  }

  @Mutation(() => QuizAttemptResultOutput)
  @UseGuards(GqlAuthGuard)
  async submitQuizAttempt(
    @Args("input") input: SubmitQuizAttemptInput,
    @Context() context: any,
  ) {
    return this.quizzesService.submitAttempt(input, context.req.user.id);
  }
}
