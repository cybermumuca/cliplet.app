import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { userAuthProviders } from "./user-auth-provider";

export const users = pgTable(
  "users",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique("users_uq_email"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [primaryKey({ name: "users_pk_id", columns: [table.id] })]
);

export const usersRelations = relations(users, ({ many }) => ({
  authProviders: many(userAuthProviders),
}));