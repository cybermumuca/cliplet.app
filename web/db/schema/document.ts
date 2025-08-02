import { foreignKey, integer, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { clips } from "./clip";

export const documents = pgTable(
  "documents",
  {
    id: text("id")
      .notNull()
      .references(() => clips.id),
    fileName: varchar("file_name").notNull(),
    fileKey: varchar("file_key").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type").notNull(),
    originalName: varchar("original_name").notNull(),
    url: text("url").notNull(),
  },
  (table) => [
    primaryKey({ name: "documents_pk_id", columns: [table.id] }),

    foreignKey({
      name: "documents_fk_clip",
      columns: [table.id],
      foreignColumns: [clips.id],
    })
      .onDelete("cascade")
      .onUpdate("no action")
  ]
);