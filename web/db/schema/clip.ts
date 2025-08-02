import { createId } from "@paralleldrive/cuid2";
import { foreignKey, pgEnum, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const clipTypesEnum = pgEnum("clip_types_enum", [
  "text",
  "image",
  "video",
  "audio",
  "document",
  "file"
]);

export const clips = pgTable(
  "clips",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .notNull(),
    type: clipTypesEnum("type").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    primaryKey({ name: "clips_pk_id", columns: [table.id] }),
    foreignKey({
      name: "clips_fk_user",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("no action"),
  ],
);

export const clipsRelations = relations(clips, ({ one }) => ({
  user: one(users, {
    fields: [clips.userId],
    references: [users.id],
  }),
}));