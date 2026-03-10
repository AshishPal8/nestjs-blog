import { Injectable } from "@nestjs/common";
import { db } from "@database/db";
import { tags } from "@database/schema/tags.schema";
import { and, eq, ilike } from "drizzle-orm";

@Injectable()
export class TagsService {
  async search(search: string) {
    const results = await db
      .select({ id: tags.id, name: tags.name, slug: tags.slug })
      .from(tags)
      .where(
        and(
          eq(tags.isDeleted, false),
          eq(tags.isActive, true),
          ilike(tags.name, `%${search}%`),
        ),
      )
      .limit(5);

    return results;
  }
}
