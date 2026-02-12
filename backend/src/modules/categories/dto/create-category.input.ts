import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name cannot exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Category description cannot exceed 1000 characters")
    .optional(),
  isActive: z.boolean().default(true),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
