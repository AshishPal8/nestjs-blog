import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface JWTPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
