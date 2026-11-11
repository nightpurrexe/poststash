import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { postsTable } from '../db/schema.js';

@Injectable()
export class PostsService {
  constructor(@InjectDrizzle() private db: NodePgDatabase) {}
  
  findAll() {
    return this.db.select().from(postsTable);
  }

  updatePostCategory(id: string, payload: any) {
    return `Update posts category with ${payload} where post ID: ${id}`
  }

  create(payload: any) {
    return `Create new post with payload: ${payload}`
  }
}
