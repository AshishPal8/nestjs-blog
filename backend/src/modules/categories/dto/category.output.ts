import { PaginationMeta } from "@common/dto/pagination.output";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CategoryOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class PaginatedCategoryResponse {
  @Field(() => [CategoryOutput])
  data: CategoryOutput[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
