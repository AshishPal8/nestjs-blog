import { Module } from "@nestjs/common";
import { PostsResolver } from "./posts.resolver";
import { PostsService } from "./posts.service";
import { LikesModule } from "@modules/likes/likes.module";

@Module({
  imports: [LikesModule],
  providers: [PostsResolver, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
