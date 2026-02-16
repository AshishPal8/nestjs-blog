import { ObjectType, Field } from "@nestjs/graphql";
import { PostOutput } from "./post.output";
import { PaginationMeta } from "@common/dto/pagination.output";

@ObjectType()
export class PaginatedPostsOutput {
  @Field(() => [PostOutput])
  data: PostOutput[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
