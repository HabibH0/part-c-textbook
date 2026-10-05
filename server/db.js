import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openDatabase(path) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;`);
  const version = db.prepare('PRAGMA user_version').get().user_version;
  if (version === 0) {
    db.exec(`BEGIN;
      CREATE TABLE users(id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, display_name TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE sessions(token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, csrf TEXT NOT NULL, expires_at INTEGER NOT NULL);
      CREATE INDEX session_user ON sessions(user_id);
      CREATE TABLE lesson_progress(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0, last_tab TEXT NOT NULL DEFAULT 'learn', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(user_id, lesson_id));
      CREATE TABLE exercise_progress(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, exercise_id TEXT NOT NULL, answer TEXT NOT NULL DEFAULT '', attempts INTEGER NOT NULL DEFAULT 0, correct INTEGER NOT NULL DEFAULT 0, independent INTEGER NOT NULL DEFAULT 0, hints_used INTEGER NOT NULL DEFAULT 0, solution_seen INTEGER NOT NULL DEFAULT 0, self_reviewed INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(user_id, exercise_id));
      CREATE TABLE attempts(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, exercise_id TEXT NOT NULL, answer TEXT NOT NULL, correct INTEGER NOT NULL, assisted INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE INDEX attempt_user ON attempts(user_id, exercise_id);
      PRAGMA user_version=1;
      COMMIT;`);
  }
  return db;
}
