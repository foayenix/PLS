import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
export const learningRecords = sqliteTable('learning_records', {
  userId: text('user_id').notNull(), key: text('record_key').notNull(),
  value: text('value').notNull(), updatedAt: text('updated_at').notNull(),
}, t => [primaryKey({ columns: [t.userId, t.key] })]);
