import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostOutput {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field()
  metaDescription: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Int)
  authorId: number;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
