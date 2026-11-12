import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ownersTable, postsTable } from '../db/schema.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(@InjectDrizzle() private db: NodePgDatabase) {}
  
  findAll() {
    return this.db.select().from(postsTable);
  }

  updatePostCategory(id: string, payload: any) {
    return `Update posts category with ${payload} where post ID: ${id}`
  }

  async create(payload: CreatePostDto) {
    return await this.db.transaction(async (tx) => {
      const [insertedOwner] = await tx
        .insert(ownersTable)
        .values({
          username: payload.owner.username,
          fullname: payload.owner.fullName,
        })
        .onConflictDoNothing()
        .returning({ id: ownersTable.id });

      let ownerId = insertedOwner?.id;

      if (!ownerId) {
        const [existingOwner] = await tx
          .select({ id: ownersTable.id })
          .from(ownersTable)
          .where(eq(ownersTable.username, payload.owner.username))
          .limit(1);

        if (!existingOwner) {
          throw new Error("Could not found or create owner");
        }

        ownerId = existingOwner.id;
      }

      const [post] = await tx
        .insert(postsTable)
        .values({
          type: payload.type,
          shortcode: payload.shortcode,
          url: payload.url,
          productType: payload.productType,
          caption: payload.caption,
          slideCount: payload.slideCount,
          ownerId,
        })
        .returning();

      return post;
    });
  }
}
