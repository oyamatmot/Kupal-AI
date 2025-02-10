import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata")
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  role: true,
  metadata: true
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ChatMessage = {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  metadata?: Record<string, any>;
};
