const serverless = require('serverless-http');
const express = require('express');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { createNestApp } = require('../dist/src/app.factory');

let cachedExpressApp;

async function bootstrap() {
  if (!cachedExpressApp) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await createNestApp(adapter);
    await app.init(); // important
    cachedExpressApp = expressApp;
  }
  return cachedExpressApp;
}

const handler = serverless(async (req, res) => {
  const app = await bootstrap();
  return app(req, res);
});

module.exports = handler; // ✅ export handler for Vercel
