import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CategoryOutput } from "@modules/categories/dto/category.output";

@ObjectType()
export class TagOutput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;
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

  @Field(() => [CategoryOutput], { nullable: true })
  categories?: CategoryOutput[];

  @Field(() => [TagOutput], { nullable: true })
  tags?: TagOutput[];

  @Field(() => [ImageOutput], { nullable: true })
  images?: ImageOutput[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
