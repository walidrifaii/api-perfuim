// api/index.js
const { createNestApp } = require('../dist/src/app.factory');
const serverless = require('serverless-http');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

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

module.exports = handler;
