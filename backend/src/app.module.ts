import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { PostsModule } from './posts/posts.module.js';

@Module({
  imports: [CategoriesModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
