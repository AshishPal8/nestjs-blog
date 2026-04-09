import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { AppResolver } from "./app.resolver";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { envConfig } from "@config/env.config";
import { PostsModule } from "@modules/posts/posts.module";
import { AuthMiddleware } from "@common/middleware/auth.middleware";
import { CategoriesModule } from "@modules/categories/categories.module";
import { UploadModule } from "@modules/uploads/upload.module";
import { LikesModule } from "@modules/likes/likes.module";
import { CommentsModule } from "@modules/comments/comments.module";
import { TagsModule } from "@modules/tags/tags.module";
import { AppController } from "./app.controller";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { BookmarksModule } from "@modules/bookmarks/bookmarks.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { GqlThrottlerGuard } from "@common/guards/gql-throttler.guard";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    ConfigModule.forRoot<ApolloDriverConfig>({
      isGlobal: true,
    }),

    JwtModule.register({
      global: true,
      secret: envConfig.jwt.secret,
      signOptions: { expiresIn: "7d" },
    }),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    PostsModule,
    CategoriesModule,
    UploadModule,
    LikesModule,
    CommentsModule,
    TagsModule,
    BookmarksModule,
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("graphql");
  }
}
