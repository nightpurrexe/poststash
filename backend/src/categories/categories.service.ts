import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { categoriesTable } from '../db/schema.js';

@Injectable()
export class CategoriesService {
  constructor(@InjectDrizzle() private db: NodePgDatabase) {}
  
  findAll() {
    return this.db.select().from(categoriesTable);
  }
}
