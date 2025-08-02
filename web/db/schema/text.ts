import { foreignKey, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { clips } from "./clip";

export const texts = pgTable(
  "texts",
  {
    id: text("id")
      .notNull()
      .references(() => clips.id),
    content: text("content").notNull(),
  },
  (table) => [
    primaryKey({ name: "texts_pk_id", columns: [table.id] }),
    
    foreignKey({
      name: "texts_fk_clip",
      columns: [table.id],
      foreignColumns: [clips.id],
    })
      .onDelete("cascade")
      .onUpdate("no action"),
  ],
);