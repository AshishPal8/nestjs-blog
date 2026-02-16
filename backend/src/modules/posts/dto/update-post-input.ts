import { Field, InputType } from "@nestjs/graphql";
import { z } from "zod";

export const updatePostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageIds: z.array(z.number()).optional(),
  metaDescription: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed")
    .optional(),
  categoryIds: z.array(z.number()).min(1, "At least one category is required"),
  isActive: z.boolean().optional(),
});

export type UpdatePostDto = z.infer<typeof updatePostSchema>;

@InputType()
export class UpdatePostInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  imageIds?: number[];

  @Field()
  metaDescription: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => [Number])
  categoryIds: number[];
}
