import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { envConfig } from "src/config/env.config";
import { AUTH_COOKIE_NAME, getCookieOptions } from "@config/cookie.config";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  private setAuthCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions(isProd));
  }
  private clearAuthCookie(res: Response) {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie(AUTH_COOKIE_NAME, getCookieOptions(isProd));
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateOAuthUser(req.user);
    const { accessToken } = await this.authService.login(user);

    console.log("Access token: ", accessToken);

    //set cookie
    this.setAuthCookie(res, accessToken);

    const userEncoded = encodeURIComponent(JSON.stringify(user));

    const frontendUrl = envConfig.frontendUrl;
    res.redirect(`${frontendUrl}?token=${accessToken}&user=${userEncoded}`);
  }

  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookAuth() {
    // Initiates Facebook OAuth flow
  }

  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async facebookAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateOAuthUser(req.user);
    const { accessToken } = await this.authService.login(user);

    //set cookie
    this.setAuthCookie(res, accessToken);

    const userEncoded = encodeURIComponent(JSON.stringify(user));

    const frontendUrl = envConfig.frontendUrl;
    res.redirect(`${frontendUrl}?token=${accessToken}&user=${userEncoded}`);
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    this.clearAuthCookie(res);

    res.status(HttpStatus.OK).json({ message: "Logged out successfully" });
  }
}
