import { Database } from 'bun:sqlite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { seedDatabase } from './seed';

export const db = new Database('emod.sqlite', { create: true });

export function initializeDatabase() {
  db.exec('PRAGMA foreign_keys = ON;');

  const schemaPath = join(import.meta.dir, 'schema.sql');
  const schemaSql = readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);

  const countRow = db.query('SELECT COUNT(*) as total FROM users').get() as { total: number };
  if (countRow.total === 0) {
    seedDatabase(db);
  }
}
