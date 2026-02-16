import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UploadOutput {
  @Field(() => Int)
  id: number;

  @Field()
  fileId: string;

  @Field()
  url: string;

  @Field()
  name: string;

  @Field()
  mimeType: string;

  @Field(() => Int)
  size: number;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
