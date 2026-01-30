import { Field, InputType } from "@nestjs/graphql";
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be valid URL").optional(),
  metaDescription: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed")
    .optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  metaDescription: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
