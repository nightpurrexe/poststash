import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  findAll() {
    return 'All posts'
  }

  updatePostCategory(id: string, payload: any) {
    return `Update posts category with ${payload} where post ID: ${id}`
  }

  create(payload: any) {
    return `Create new post with payload: ${payload}`
  }
}
