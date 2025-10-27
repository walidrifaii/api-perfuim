// api/index.ts
import { createNestApp } from '../src/app.factory';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedExpressApp;

async function bootstrap() {
  if (!cachedExpressApp) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await createNestApp(adapter);
    await app.init();
    cachedExpressApp = expressApp;
  }
  return cachedExpressApp;
}

const handler = serverless(async (req, res) => {
  const expressApp = await bootstrap();
  return expressApp(req, res);
});

export default handler;
