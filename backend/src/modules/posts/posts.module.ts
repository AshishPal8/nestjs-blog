import { Module } from "@nestjs/common";
import { PostsResolver } from "./posts.resolver";
import { PostsService } from "./posts.service";
import { LikesModule } from "@modules/likes/likes.module";
import { ActivityModule } from "@modules/activity/activity.module";

@Module({
  imports: [LikesModule, ActivityModule],
  providers: [PostsResolver, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
