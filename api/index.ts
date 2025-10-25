// api/index.ts
import serverless from 'serverless-http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createNestApp, createExpressAdapter } from '../src/app.factory';

let cached: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cached) {
    const { expressApp, adapter } = createExpressAdapter();
    const app = await createNestApp(adapter);
    await app.init(); // serverless: do NOT call app.listen
    cached = serverless(expressApp);
  }
  return cached(req, res);
}
