import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { categoriesTable, ownersTable, postsTable } from '../db/schema.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { and, asc, count, eq, notExists, sql } from 'drizzle-orm';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto.js';
import { PostFiltersDto } from './dto/post-filter.dto.js';

@Injectable()
export class PostsService {
  constructor(@InjectDrizzle() private db: NodePgDatabase) { }

  async findAll(filters: PostFiltersDto) {
    const pageNumber = filters.page || 1
    const pageSize = 16;
    const offset = (pageNumber - 1) * pageSize;

    const conditions = [];

    if (filters.username) {
      conditions.push(eq(ownersTable.username, filters.username))
    }

    if (filters.category) {
      conditions.push(eq(categoriesTable.name, filters.category))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const baseSelect = {
      id: postsTable.id,
      type: postsTable.type,
      shortcode: postsTable.shortcode,
      url: postsTable.url,
      productType: postsTable.productType,
      caption: postsTable.caption,
      slideCount: postsTable.slideCount,
      ownerId: postsTable.ownerId,
      categoryId: postsTable.categoryId,
    };

    const [posts, totalPosts] = await Promise.all([
      this.db
        .select(baseSelect)
        .from(postsTable)
        .leftJoin(ownersTable, eq(postsTable.ownerId, ownersTable.id))
        .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
        .where(whereClause)
        .orderBy(asc(postsTable.type), asc(postsTable.id))
        .limit(pageSize)
        .offset(offset),

      this.db
        .select({ count: count() })
        .from(postsTable)
        .leftJoin(ownersTable, eq(postsTable.ownerId, ownersTable.id))
        .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
        .where(whereClause),
    ]);

    const total = totalPosts[0]?.count ?? 0;

    return {
      data: posts,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  async countAllUncategorizedPosts() {
    const [uncategorizedPosts] = await this.db
      .select({
        totalUncategorizedPosts: count()
      })
      .from(postsTable)
      .where(
        notExists(
          this.db
            .select({ id: sql`1` })
            .from(categoriesTable)
            .where(eq(categoriesTable.id, postsTable.categoryId))
        )
      )

    return uncategorizedPosts.totalUncategorizedPosts;
  }

  async updatePostCategory(postId: string, payload: UpdatePostCategoryDto) {
    const [category] = await this.db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, payload.categoryId))
      .limit(1);

    if (!category) {
      throw new Error("Could not found category with the given ID")
    }

    const [updatedPost] = await this.db
      .update(postsTable)
      .set({ categoryId: payload.categoryId })
      .where(eq(postsTable.id, postId))
      .returning();

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    return updatedPost;
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
