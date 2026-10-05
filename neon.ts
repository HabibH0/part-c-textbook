import {defineConfig} from '@neon/config/v1';
export default defineConfig({
 functions:{
  textbook:{
   name:'Part C textbook API',
   source:'server/neon.js',
   env:{FRONTEND_ORIGINS:process.env.FRONTEND_ORIGINS!}
  }
 }
});
