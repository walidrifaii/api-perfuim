import { createNestApp } from '../src/app.factory';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const { expressApp, adapter } = createNestApp
  ? createNestApp()
  : { expressApp: express(), adapter: new ExpressAdapter(express()) };

async function bootstrap() {
  const { expressApp, adapter } = createExpressAdapter();
  const app = await createNestApp(adapter);
  await app.init(); // important!
  return expressApp;
}

const handler = async (req, res) => {
  const expressApp = await bootstrap();
  return expressApp(req, res);
};

export default serverless(handler);
