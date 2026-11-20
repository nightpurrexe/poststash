import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { CategoriesModule } from "./categories/categories.module.js";
import { PostsModule } from "./posts/posts.module.js";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DrizzleModule } from "@nestjs/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        drizzle,
        connection: configService.getOrThrow<string>("DATABASE_URL"),
      }),
    }),
    CategoriesModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
