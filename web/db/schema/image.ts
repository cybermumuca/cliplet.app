import { foreignKey, integer, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { clips } from "./clip";

export const images = pgTable(
  "images",
  {
    id: text("id")
      .notNull()
      .references(() => clips.id),
    fileKey: varchar("file_key").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type").notNull(),
    originalName: varchar("original_name").notNull(),
    width: integer("width"),
    height: integer("height"),
  },
  (table) => [
    primaryKey({ name: "images_pk_id", columns: [table.id] }),
    
    foreignKey({
      name: "images_fk_clip",
      columns: [table.id],
      foreignColumns: [clips.id],
    })
      .onDelete("cascade")
      .onUpdate("no action"),
  ],
);