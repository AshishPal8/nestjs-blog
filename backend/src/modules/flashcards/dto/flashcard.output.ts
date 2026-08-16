import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PaginationMeta } from "@common/dto/pagination.output";

@ObjectType()
export class FlashcardDeckOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Int, { nullable: true })
  imageId?: number;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  sourceText?: string;

  @Field(() => String)
  status: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Int)
  pointsReward: number;

  @Field(() => Int)
  cardCount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class PaginatedFlashcardDecksOutput {
  @Field(() => [FlashcardDeckOutput])
  data: FlashcardDeckOutput[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}

@ObjectType()
export class FlashcardCardOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  front: string;

  @Field(() => String)
  back: string;

  @Field(() => Int)
  orderIndex: number;
}

@ObjectType()
export class FlashcardDeckDetailOutput {
  @Field(() => FlashcardDeckOutput)
  deck: FlashcardDeckOutput;

  @Field(() => [FlashcardCardOutput])
  cards: FlashcardCardOutput[];

  @Field(() => Boolean, { nullable: true })
  alreadyCompleted?: boolean;
}

@ObjectType()
export class FlashcardAttemptResultOutput {
  @Field(() => Int)
  knownCount: number;

  @Field(() => Int)
  totalCards: number;

  @Field(() => Int)
  pointsEarned: number;

  @Field(() => Boolean)
  firstCompletion: boolean;
}
