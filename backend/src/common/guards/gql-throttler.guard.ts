import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  // Logic to extract req/res from GQL
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    // Defensive check: handle both GQL and REST fallbacks
    const req = ctx?.req || context.switchToHttp().getRequest();
    const res = ctx?.res || context.switchToHttp().getResponse();

    return { req, res };
  }

  // FIX: This MUST be async to match the base class signature
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Standard Express IP location
    const ip =
      req?.ip ||
      req?.headers?.["x-forwarded-for"] ||
      req?.connection?.remoteAddress;

    // If IP is still missing (which happens in some Server Component calls),
    // return a fallback string so it doesn't crash on 'undefined'
    return ip || "127.0.0.1";
  }
}
