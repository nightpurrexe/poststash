import { integer, pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

export const ownersTable = pgTable("owners", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  username: varchar({ length: 256 }).notNull().unique(),
  fullname: varchar({ length: 512 }),
});

export const categoriesTable = pgTable("categories", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 100 }).notNull().unique(),
});

export const postsTable = pgTable("posts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  type: varchar({ length: 30 }).notNull(),
  shortcode: varchar({ length: 25 }).notNull(),
  url: varchar({ length: 55 }).notNull().unique(),
  productType: varchar("product_type", { length: 30 }).notNull(),
  caption: text(),
  slideCount: integer("slide_count"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => ownersTable.id),
  categoryId: uuid("category_id").references(() => categoriesTable.id),
});
