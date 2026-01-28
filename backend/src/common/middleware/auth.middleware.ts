import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let token: string | null = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
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
