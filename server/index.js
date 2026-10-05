import { createApp } from './app.js';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const {app,db}=createApp();
if(process.argv.includes('--dev')) {
  const {createServer}=await import('vite');
  const vite=await createServer({root,server:{middlewareMode:true},appType:'spa'});
  app.use(vite.middlewares);
} else {
  app.use(express.static(resolve(root,'dist')));
  app.get('/{*path}',(_req,res)=>res.sendFile(resolve(root,'dist/index.html')));
}
app.use((error,_req,res,_next)=> {
  console.error('Request failed:',error.message);
  res.status(error.type==='entity.too.large'?413:500).json({error:error.type==='entity.too.large'?'Your answer is too large.':'The server could not complete this request. Your typed answer is still on screen; please try again.'});
});
const host=process.env.HOST || '127.0.0.1'; const port=Number(process.env.PORT || 3000);
const server=app.listen(port,host,()=>console.log(`Part C textbook running at http://${host}:${port}`));
function close(){server.close(()=>{db.close();process.exit(0);});}
process.on('SIGINT',close);process.on('SIGTERM',close);
