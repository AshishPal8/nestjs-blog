import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name cannot exceed 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Category description cannot exceed 1000 characters")
    .optional(),
  isActive: z.boolean().default(true).optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
