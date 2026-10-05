import {spawnSync} from 'node:child_process';
if(!process.env.DATABASE_URL)throw new Error('Load the isolated test branch environment first.');
const result=spawnSync(process.execPath,['--test','tests/hosted.test.js'],{
 stdio:'inherit',env:{...process.env,TEST_DATABASE_URL:process.env.DATABASE_URL}
});
process.exit(result.status??1);
