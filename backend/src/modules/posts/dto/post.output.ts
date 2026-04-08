import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CategoryOutput } from "@modules/categories/dto/category.output";
import { TagOutput } from "@modules/tags/dto/tag.output";

@ObjectType()
export class AuthorOutput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  email: string;
}

@ObjectType()
export class ImageOutput {
  @Field(() => Int)
  id: number;

  @Field()
  url: string;
}

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

  @Field(() => AuthorOutput, { nullable: true })
  author?: AuthorOutput;

  @Field(() => [CategoryOutput], { nullable: true })
  categories?: CategoryOutput[];

  @Field(() => [TagOutput], { nullable: true })
  tags?: TagOutput[];

  @Field(() => [ImageOutput], { nullable: true })
  images?: ImageOutput[];

  @Field(() => Int)
  likesCount: number;

  @Field(() => Int)
  readingTime: number;

  @Field(() => Int)
  commentsCount: number;

  @Field({ nullable: true })
  isLiked?: boolean;

  @Field({ nullable: true })
  isBookmarked?: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
