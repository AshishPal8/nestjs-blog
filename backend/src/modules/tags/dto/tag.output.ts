import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TagOutput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;
}
