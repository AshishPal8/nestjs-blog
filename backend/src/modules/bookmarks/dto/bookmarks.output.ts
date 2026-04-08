import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class ToggleBookmarkOutput {
  @Field(() => Boolean)
  isBookmarked: boolean;

  @Field(() => String)
  message: string;
}
