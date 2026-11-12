import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto.js';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/')
  findAll() {
    return this.postsService.findAll();
  }

  @Patch(':id/category')
  updatePostCategory(@Param('id') id: string, @Body() payload: UpdatePostCategoryDto) {
    return this.postsService.updatePostCategory(id, payload)
  }

  @Post('/')
  create(@Body() payload: CreatePostDto) {
    return this.postsService.create(payload)
  }
}
