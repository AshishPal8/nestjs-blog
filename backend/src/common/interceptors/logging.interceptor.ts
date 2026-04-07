import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("GQL");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    if (context.getType<string>() !== "graphql") {
      return next.handle();
    }
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();

    if (!info) {
      return next.handle();
    }

    const req = gqlCtx.getContext().req;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    const ua = req.headers["user-agent"] || "unknown";
    const device = this.parseDevice(ua);
    const os = this.parseOS(ua);
    const browser = this.parseBrowser(ua);

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(
          `[${info.parentType.name}] ${info.fieldName} | ${ms}ms | IP: ${ip} | ${device} • ${os} • ${browser}`,
        );
      }),
    );
  }

  private parseDevice(ua: string): string {
    if (/mobile/i.test(ua)) return "Mobile";
    if (/tablet|ipad/i.test(ua)) return "Tablet";
    return "Desktop";
  }

  private parseOS(ua: string): string {
    if (/windows/i.test(ua)) return "Windows";
    if (/android/i.test(ua)) return "Android";
    if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
    if (/mac os/i.test(ua)) return "macOS";
    if (/linux/i.test(ua)) return "Linux";
    return "Unknown OS";
  }

  private parseBrowser(ua: string): string {
    if (/edg\//i.test(ua)) return "Edge";
    if (/opr\//i.test(ua)) return "Opera";
    if (/chrome/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    return "Unknown Browser";
  }
}
