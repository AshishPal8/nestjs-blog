import { Injectable } from "@nestjs/common";
import { db } from "@database/db";
import { users } from "@database/schema/user.schema";
import { eq } from "drizzle-orm";
import { UpdateProfileDto } from "./dto/update-profile.input";
import { NotFoundError } from "@common/responses/custom-response";

@Injectable()
export class UsersService {
  async findOne(id: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
  async updateProfile(userId: number, input: UpdateProfileDto) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updateData: any = {};

    if (input.name) {
      updateData.name = input.name;
    }

    if (input.bio) {
      updateData.bio = input.bio;
    }

    if (input.location) {
      updateData.location = input.location;
    }

    if (input.website) {
      updateData.website = input.website;
    }

    if (input.avatar) {
      updateData.avatar = input.avatar;
    }

    updateData.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }
}
