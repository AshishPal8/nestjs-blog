import { z } from "zod";
import { Field, InputType } from "@nestjs/graphql";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.url().optional(),
  avatar: z.url().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  avatar?: string;
}
