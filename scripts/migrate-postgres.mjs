import {readFileSync} from 'node:fs';
import {openPostgres} from '../server/postgres.js';
const db=openPostgres(process.env.DATABASE_URL_UNPOOLED||process.env.DATABASE_URL);
try{
 await db.transaction(async tx=>{
  await tx.query("SELECT pg_advisory_xact_lock(7341019)");
  await tx.query('CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY,applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)');
  if(!await tx.one('SELECT version FROM schema_migrations WHERE version=1')){
   await tx.query(readFileSync(new URL('../server/migrations/001-postgres.sql',import.meta.url),'utf8'));
   await tx.query('INSERT INTO schema_migrations(version) VALUES(1)');
  }
 });
 console.log('PostgreSQL schema is up to date.');
}finally{await db.close();}
