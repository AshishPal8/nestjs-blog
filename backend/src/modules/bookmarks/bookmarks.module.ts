import { Module } from "@nestjs/common";
import { BookmarksResolver } from "./bookmarks.resolver";
import { BookmarksService } from "./bookmarks.service";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [PostsModule],
  providers: [BookmarksResolver, BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
