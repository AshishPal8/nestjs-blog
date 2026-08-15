import { Module } from "@nestjs/common";
import { LikesResolver } from "./likes.resolver";
import { LikesService } from "./likes.service";
import { ActivityModule } from "@modules/activity/activity.module";

@Module({
  imports: [ActivityModule],
  providers: [LikesResolver, LikesService],
  exports: [LikesService],
})
export class LikesModule {}
