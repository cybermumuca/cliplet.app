import { foreignKey, varchar, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { clips } from "./clip";

export const files = pgTable(
  "files",
  {
    id: text("id")
      .notNull()
      .references(() => clips.id),
    fileKey: varchar("file_key").notNull(),
    fileSize: integer("file_size").notNull(),
    originalName: varchar("original_name").notNull(),
  },
  (table) => [
    primaryKey({ name: "files_pk_id", columns: [table.id] }),
    
    foreignKey({
      name: "files_fk_clip",
      columns: [table.id],
      foreignColumns: [clips.id],
    })
      .onDelete("cascade")
      .onUpdate("no action"),
  ],
);