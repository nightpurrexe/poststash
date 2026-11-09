import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/')
  findAll() {
    return this.postsService.findAll();
  }

  @Patch(':id/category')
  updatePostCategory(@Param('id') id: string, @Body() payload: any) {
    return this.postsService.updatePostCategory(id, payload)
  }

  @Post('/')
  create(@Body() payload: any) {
    return this.postsService.create(payload)
  }
}
