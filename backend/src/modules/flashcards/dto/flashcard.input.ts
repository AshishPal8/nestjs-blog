import { Field, InputType, Int } from "@nestjs/graphql";
import z from "zod";

export const createFlashcardDeckSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int(),
  imageId: z.number().int().optional(),
  sourceText: z.string().max(20000).optional(),
  pointsReward: z.number().int().min(1).max(1000).default(10),
});
export type CreateFlashcardDeckDto = z.infer<typeof createFlashcardDeckSchema>;

@InputType()
export class CreateFlashcardDeckInput {
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
}

export const updateFlashcardDeckSchema = createFlashcardDeckSchema
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });
export type UpdateFlashcardDeckDto = z.infer<typeof updateFlashcardDeckSchema>;

@InputType()
export class UpdateFlashcardDeckInput {
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

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

export const flashcardCardSchema = z.object({
  front: z.string().min(1).max(500),
  back: z.string().min(1).max(1000),
});
export type FlashcardCardDto = z.infer<typeof flashcardCardSchema>;

@InputType()
export class FlashcardCardInput {
  @Field(() => String)
  front: string;

  @Field(() => String)
  back: string;
}

export const submitFlashcardAttemptSchema = z.object({
  deckId: z.number().int(),
  knownCount: z.number().int().min(0),
  totalCards: z.number().int().min(1),
});
export type SubmitFlashcardAttemptDto = z.infer<
  typeof submitFlashcardAttemptSchema
>;

@InputType()
export class SubmitFlashcardAttemptInput {
  @Field(() => Int)
  deckId: number;

  @Field(() => Int)
  knownCount: number;

  @Field(() => Int)
  totalCards: number;
}
