import { Injectable } from "@nestjs/common";
import { GqlAuthGuard } from "./gql-auth.guard";

@Injectable()
export class GqlOptionalAuthGuard extends GqlAuthGuard {
  handleRequest(err: any, user: any) {
    return user ?? null;
  }
}
