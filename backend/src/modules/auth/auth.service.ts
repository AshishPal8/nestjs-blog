import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq, or } from "drizzle-orm";
import { db } from "src/database/db";
import { users } from "src/database/schema/user.schema";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateOAuthUser(profile: any) {
    const { provider, googleId, facebookId, email, name, avatar } = profile;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(
        or(
          googleId ? eq(users.googleId, googleId) : undefined,
          facebookId ? eq(users.googleId, googleId) : undefined,
          eq(users.email, email),
        ),
      )
      .limit(1);

    if (existingUser) {
      const updates: any = {};

      if (provider === "google" && !existingUser.googleId) {
        updates.googleId = googleId;
      }
      if (provider === "facebook" && !existingUser.facebookId) {
        updates.facebookId = facebookId;
      }
      if (Object.keys(updates).length > 0) {
        await db
          .update(users)
          .set(updates)
          .where(eq(users.id, existingUser.id));
      }

      return existingUser;
    }

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        avatar,
        googleId,
        facebookId,
      })
      .returning();

    return newUser;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
