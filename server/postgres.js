import pg from 'pg';
export function openPostgres(connectionString) {
  if (!connectionString) throw new Error('DATABASE_URL is required.');
  const url=new URL(connectionString);
  if(url.hostname.endsWith('.neon.tech'))url.searchParams.set('sslmode','verify-full');
  connectionString=url.toString();
  const pool=new pg.Pool({connectionString,max:5,connectionTimeoutMillis:10000,idleTimeoutMillis:30000});
  const wrap=client=>({
    async query(sql,params=[]){return (await client.query(sql,params)).rows;},
    async one(sql,params=[]){return (await client.query(sql,params)).rows[0];}
  });
  return {
    ...wrap(pool),pool,
    async transaction(fn){
      const client=await pool.connect();
      try{await client.query('BEGIN');const result=await fn(wrap(client));await client.query('COMMIT');return result;}
      catch(error){await client.query('ROLLBACK');throw error;}
      finally{client.release();}
    },
    close:()=>pool.end()
  };
}
