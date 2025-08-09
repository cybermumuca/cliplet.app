import { foreignKey, integer, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { clips } from "./clip";

export const audios = pgTable(
  "audios",
  {
    id: text("id")
      .notNull()
      .references(() => clips.id),
    fileKey: varchar("file_key").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type").notNull(),
    originalName: varchar("original_name").notNull(),
    duration: integer("duration").notNull(),
  },
  (table) => [
    primaryKey({ name: "audios_pk_id", columns: [table.id] }),
    foreignKey({
      name: "audios_fk_clip",
      columns: [table.id],
      foreignColumns: [clips.id],
    })
      .onDelete("cascade")
      .onUpdate("no action"),
  ],
);
