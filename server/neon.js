import {attachDatabasePool} from '@neon/functions';
import {openPostgres} from './postgres.js';
import {createHostedApi} from './hosted-api.js';
const db=openPostgres(process.env.DATABASE_URL);
attachDatabasePool(db.pool);
export default createHostedApi({db,allowedOrigins:(process.env.FRONTEND_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean)});
