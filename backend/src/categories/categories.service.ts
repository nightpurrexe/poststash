import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { categoriesTable } from "../db/schema.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";

@Injectable()
export class CategoriesService {
  constructor(@InjectDrizzle() private db: NodePgDatabase) {}

  findAll() {
    return this.db.select().from(categoriesTable);
  }

  async create(payload: CreateCategoryDto) {
    return await this.db
      .insert(categoriesTable)
      .values({
        name: payload.name,
      })
      .returning();
  }
}
