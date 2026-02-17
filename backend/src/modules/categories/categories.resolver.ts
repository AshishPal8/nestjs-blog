import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CategoriesService } from "./categories.service";
import {
  CategoryOutput,
  PaginatedCategoryResponse,
} from "./dto/category.output";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@modules/auth/guards/gql-auth.guard";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { PaginationInput } from "@common/dto/pagination.input";

@Resolver()
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => [CategoryOutput], { name: "categories" })
  async getCategories() {
    return this.categoriesService.findAll();
  }

  @Query(() => [CategoryOutput], { name: "activeCategories" })
  async getActiveCategories() {
    return this.categoriesService.findActive();
  }

  @Query(() => PaginatedCategoryResponse, { name: "categories" })
  async getCategoriesWithPagination(
    @Args("paginationInput") paginationInput: PaginationInput,
  ) {
    return this.categoriesService.findAllWithPagination(paginationInput);
  }

  @Query(() => CategoryOutput, { name: "category" })
  async getCategory(@Args("id", { type: () => Int }) id: number) {
    return this.categoriesService.findById(id);
  }

  @Query(() => CategoryOutput, { name: "categoryBySlug" })
  async getCategoryBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Mutation(() => CategoryOutput, { name: "createCategory" })
  @UseGuards(GqlAuthGuard)
  async createCategory(@Args("input") input: CreateCategoryInput) {
    return this.categoriesService.create(input);
  }

  @Mutation(() => CategoryOutput, { name: "updateCategory" })
  @UseGuards(GqlAuthGuard)
  async updateCategory(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(id, input);
  }

  @Mutation(() => Boolean, { name: "deleteCategory" })
  @UseGuards(GqlAuthGuard)
  async deleteCategory(@Args("id", { type: () => Int }) id: number) {
    return this.categoriesService.delete(id);
  }
}
