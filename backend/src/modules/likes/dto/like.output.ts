import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LikeOutput {
  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  likesCount: number;

  @Field()
  isLiked: boolean;
}
