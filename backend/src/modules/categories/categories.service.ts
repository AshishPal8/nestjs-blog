import { Injectable } from "@nestjs/common";
import {
  CreateCategoryDto,
  createCategorySchema,
} from "./dto/create-category.input";
import { SlugUtil } from "@common/utils/slug.util";
import { db } from "@database/db";
import { categories } from "@database/schema/categories.schema";
import { and, count, eq, ilike } from "drizzle-orm";
import {
  ConflictError,
  NotFoundError,
} from "@common/responses/custom-response";
import {
  UpdateCategoryDto,
  updateCategorySchema,
} from "./dto/update-category.input";
import {
  PaginationDto,
  PaginationInput,
  paginationSchema,
} from "@common/dto/pagination.input";

@Injectable()
export class CategoriesService {
  async create(input: CreateCategoryDto) {
    const validated = createCategorySchema.parse(input);

    const slug = SlugUtil.generate(validated.name);

    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existingCategory) {
      throw new ConflictError(`Category with name ${slug} already exists`);
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: validated.name,
        slug,
        description: validated.description,
        isActive: validated.isActive,
      })
      .returning();

    return category;
  }

  async findAll() {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isDeleted, false));
  }

  async findAllWithPagination(paginationInput: PaginationInput) {
    const validated = paginationSchema.parse(paginationInput);

    const { page, limit, search } = validated;

    const offset = (page - 1) * limit;

    const filters = [
      eq(categories.isActive, true),
      eq(categories.isDeleted, false),
    ];

    if (search) {
      filters.push(ilike(categories.name, `%${search}%`));
    }

    const whereClause = and(...filters);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(categories)
      .where(whereClause);

    const data = await db
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(categories.name)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findActive() {
    return await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.isDeleted, false), eq(categories.isActive, true)),
      );
  }

  async findById(id: number) {
    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.isDeleted, false),
          eq(categories.isActive, true),
        ),
      )
      .limit(1);

    if (!category) {
      throw new NotFoundError(`Category with id ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), eq(categories.isDeleted, false)))
      .limit(1);

    if (!category) {
      throw new NotFoundError(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async update(id: number, input: UpdateCategoryDto) {
    const validated = updateCategorySchema.parse(input);

    await this.findById(id);

    if (validated.name) {
      const slug = SlugUtil.generate(validated.name);
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(and(eq(categories.slug, slug), eq(categories.isDeleted, false)))
        .limit(1);

      if (existingCategory) {
        throw new ConflictError(`Category with name ${slug} already exists`);
      }
    }

    const updatedData: any = { ...validated };

    if (validated.name) {
      updatedData.slug = SlugUtil.generate(validated.name);
    }

    const [updatedCategory] = await db
      .update(categories)
      .set(updatedData)
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  async delete(id: number) {
    await this.findById(id);

    const [deletedCategory] = await db
      .update(categories)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    return true;
  }
}
