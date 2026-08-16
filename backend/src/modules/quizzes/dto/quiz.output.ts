import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PaginationMeta } from "@common/dto/pagination.output";

@ObjectType()
export class QuizOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Int, { nullable: true })
  imageId?: number;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  sourceText?: string;

  @Field(() => String)
  status: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Int)
  pointsReward: number;

  @Field(() => Int, { nullable: true })
  timeLimitSeconds?: number;

  @Field(() => Int)
  questionCount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class PaginatedQuizzesOutput {
  @Field(() => [QuizOutput])
  data: QuizOutput[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}

@ObjectType()
export class QuizQuestionAdminOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  question: string;

  @Field(() => [String])
  options: string[];

  @Field(() => Int)
  correctOptionIndex: number;

  @Field(() => String, { nullable: true })
  explanation?: string;

  @Field(() => Int)
  orderIndex: number;
}

@ObjectType()
export class QuizAdminDetailOutput {
  @Field(() => QuizOutput)
  quiz: QuizOutput;

  @Field(() => [QuizQuestionAdminOutput])
  questions: QuizQuestionAdminOutput[];
}

@ObjectType()
export class QuizQuestionPlayOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  question: string;

  @Field(() => [String])
  options: string[];

  @Field(() => Int)
  orderIndex: number;
}

@ObjectType()
export class QuizPlayOutput {
  @Field(() => QuizOutput)
  quiz: QuizOutput;

  @Field(() => [QuizQuestionPlayOutput])
  questions: QuizQuestionPlayOutput[];

  @Field(() => Boolean)
  alreadyCompleted: boolean;
}

@ObjectType()
export class QuizAnswerResultOutput {
  @Field(() => Int)
  questionId: number;

  @Field(() => Int)
  selectedIndex: number;

  @Field(() => Int)
  correctOptionIndex: number;

  @Field(() => Boolean)
  correct: boolean;

  @Field(() => String, { nullable: true })
  explanation?: string;
}

@ObjectType()
export class StartQuizAttemptOutput {
  @Field(() => Int)
  sessionId: number;

  @Field(() => Date)
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date;
}

@ObjectType()
export class QuizAttemptResultOutput {
  @Field(() => Int)
  score: number;

  @Field(() => Int)
  totalQuestions: number;

  @Field(() => Int)
  pointsEarned: number;

  @Field(() => Boolean)
  firstCompletion: boolean;

  @Field(() => Boolean)
  timedOut: boolean;

  @Field(() => [QuizAnswerResultOutput])
  answers: QuizAnswerResultOutput[];
}
