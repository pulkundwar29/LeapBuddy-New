import {integer, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const chatGroups = pgTable('chat_groups', {
  id: serial('id').primaryKey(), // Unique identifier for each chat group
  userId: varchar('user_id', { length: 256 }).notNull(), // User who owns the chat group
  name: text('name').notNull().default('Untitled Group'), // Name of the chat group
  createdAt: timestamp('created_at').notNull().defaultNow(), // Timestamp
});

export type DrizzleChatGroup = typeof chatGroups.$inferSelect;

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  fileKey: text('file_key').notNull(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  chatGroupId: integer('chat_group_id') // Foreign key for grouping chats
      .references(() => chatGroups.id, {onDelete: 'cascade'})// add cascade delete
      .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_group_id')
      .references(() => chatGroups.id, { onDelete: 'cascade' }) // Add cascade delete here
      .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
  });

// drizzle-orm

// drizzle-kit