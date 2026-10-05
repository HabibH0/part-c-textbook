import {DatabaseSync} from 'node:sqlite';
import {resolve} from 'node:path';
import {openPostgres} from '../server/postgres.js';
const source=new DatabaseSync(resolve(process.argv[2]||'data/textbook.sqlite'),{readOnly:true});
const target=openPostgres(process.env.DATABASE_URL_UNPOOLED||process.env.DATABASE_URL);
try{
 source.exec('BEGIN'); // Read all tables from one consistent SQLite snapshot.
 const counts=await target.transaction(async tx=>{
  await tx.query('SELECT pg_advisory_xact_lock(7341020)');
  await tx.query('CREATE TABLE IF NOT EXISTS data_imports(name text PRIMARY KEY,imported_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)');
  if(await tx.one("SELECT name FROM data_imports WHERE name='initial-sqlite'"))throw new Error('The initial SQLite import has already completed; no rows were changed.');
  if(Number((await tx.one('SELECT count(*) AS n FROM users')).n)!==0)throw new Error('Target is not empty; refusing to overwrite existing accounts.');
  const counts={};
  for(const table of ['users','lesson_progress','exercise_progress','attempts']){
   const rows=source.prepare('SELECT * FROM '+table).all();counts[table]=rows.length;
   for(const row of rows){const keys=Object.keys(row);await tx.query('INSERT INTO '+table+'('+keys.join(',')+') VALUES('+keys.map((_,i)=>'$'+(i+1)).join(',')+')',keys.map(k=>row[k]));}
  }
  await tx.query("SELECT setval(pg_get_serial_sequence('attempts','id'),COALESCE((SELECT MAX(id) FROM attempts),1),EXISTS(SELECT 1 FROM attempts))");
  await tx.query("INSERT INTO data_imports(name) VALUES('initial-sqlite')");
  return counts;
 });
 console.log('Imported account data:',counts);
 source.exec('COMMIT');
 console.log('Local sessions are not copied. Sign in on the hosted site with the same username and password.');
}finally{source.close();await target.close();}
