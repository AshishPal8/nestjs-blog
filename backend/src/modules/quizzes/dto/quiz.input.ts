import { Field, InputType, Int } from "@nestjs/graphql";
import z from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int(),
  imageId: z.number().int().optional(),
  sourceText: z.string().max(20000).optional(),
  pointsReward: z.number().int().min(1).max(1000).default(10),
  timeLimitSeconds: z.number().int().min(10).max(3600).optional(),
});
export type CreateQuizDto = z.infer<typeof createQuizSchema>;

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Int, { nullable: true })
  imageId?: number;

  @Field(() => String, { nullable: true })
  sourceText?: string;

  @Field(() => Int, { defaultValue: 10 })
  pointsReward: number;

  @Field(() => Int, { nullable: true })
  timeLimitSeconds?: number;
}

export const updateQuizSchema = createQuizSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateQuizDto = z.infer<typeof updateQuizSchema>;

@InputType()
export class UpdateQuizInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  imageId?: number;

  @Field(() => String, { nullable: true })
  sourceText?: string;

  @Field(() => Int, { nullable: true })
  pointsReward?: number;

  @Field(() => Int, { nullable: true })
  timeLimitSeconds?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

export const quizQuestionSchema = z.object({
  question: z.string().min(1).max(1000),
  options: z.array(z.string().min(1).max(255)).min(2).max(8),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().max(1000).optional(),
});
export type QuizQuestionDto = z.infer<typeof quizQuestionSchema>;

@InputType()
export class QuizQuestionInput {
  @Field(() => String)
  question: string;

  @Field(() => [String])
  options: string[];

  @Field(() => Int)
  correctOptionIndex: number;

  @Field(() => String, { nullable: true })
  explanation?: string;
}

export const submitQuizAttemptSchema = z.object({
  sessionId: z.number().int(),
  answers: z.array(
    z.object({
      questionId: z.number().int(),
      selectedIndex: z.number().int().min(0),
    }),
  ),
});
export type SubmitQuizAttemptDto = z.infer<typeof submitQuizAttemptSchema>;

@InputType()
class QuizAnswerInput {
  @Field(() => Int)
  questionId: number;

  @Field(() => Int)
  selectedIndex: number;
}

@InputType()
export class SubmitQuizAttemptInput {
  @Field(() => Int)
  sessionId: number;

  @Field(() => [QuizAnswerInput])
  answers: QuizAnswerInput[];
}
