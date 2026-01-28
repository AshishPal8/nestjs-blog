import { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = "auth_token";

export const getCookieOptions = (isProduction: boolean): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});
