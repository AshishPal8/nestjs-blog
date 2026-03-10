import { Args, Query, Resolver } from "@nestjs/graphql";
import { TagsService } from "./tags.service";
import { TagOutput } from "./dto/tag.output";
import { SearchTagsInput } from "./dto/tag.input";

@Resolver(() => TagOutput)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [TagOutput], { name: "searchTags" })
  async searchTags(
    @Args("input") input: SearchTagsInput,
  ): Promise<TagOutput[]> {
    return this.tagsService.search(input.search);
  }
}
