import {
  pgEnum,
  pgTable,
  primaryKey,
  foreignKey,
  text,
  unique,
  index,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const authProvidersEnum = pgEnum("auth_providers_enum", [
  "GOOGLE",
  "GITHUB",
]);

export const userAuthProviders = pgTable(
  "user_auth_providers",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    provider: authProvidersEnum("provider").notNull(),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    primaryKey({ name: "user_auth_providers_pk_id", columns: [table.id] }),
    foreignKey({
      name: "user_auth_providers_fk_user",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("no action"),
    index("user_auth_providers_idx_fk_user").on(table.userId),
    unique("user_auth_providers_uq_user_provider").on(
      table.userId,
      table.provider,
    ),
  ],
);

export const userAuthProvidersRelations = relations(
  userAuthProviders,
  ({ one }) => ({
    principal: one(users, {
      fields: [userAuthProviders.userId],
      references: [users.id],
    }),
  }),
);