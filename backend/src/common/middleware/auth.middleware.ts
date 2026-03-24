import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "@config/cookie.config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let token: string | null = null;

    if (req.cookies?.[AUTH_COOKIE_NAME]) {
      token = req.cookies[AUTH_COOKIE_NAME];
    }

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer")) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        req["user"] = decoded;
      } catch (error) {
        req["user"] = null;
      }
    }

    next();
  }
}
