import { Module } from "@nestjs/common";
import { CommentsResolver } from "./comments.resolver";
import { CommentsService } from "./comments.service";
import { ActivityModule } from "@modules/activity/activity.module";

@Module({
  imports: [ActivityModule],
  providers: [CommentsResolver, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
