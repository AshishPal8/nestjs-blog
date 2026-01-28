import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { AppResolver } from "./app.resolver";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { envConfig } from "@config/env.config";

@Module({
  imports: [
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
  ],
  providers: [AppResolver],
})
export class AppModule {}
