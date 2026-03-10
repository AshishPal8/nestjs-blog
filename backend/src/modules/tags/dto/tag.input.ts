import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SearchTagsInput {
  @Field()
  search: string;
}
