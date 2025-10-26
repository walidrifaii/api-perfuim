// Plain JS so Vercel doesn't try to parse TS
const serverless = require('serverless-http');

// Import the compiled factory (built by `npm run build`)
const { createExpressAdapter, createNestApp } = require('../dist/app.factory');

let cachedHandler;

module.exports = async (req, res) => {
  try {
    if (!cachedHandler) {
      const { expressApp, adapter } = createExpressAdapter();
      const app = await createNestApp(adapter);
      await app.init(); // IMPORTANT: don't call app.listen() in serverless
      cachedHandler = serverless(expressApp);
    }
    return cachedHandler(req, res);
  } catch (err) {
    console.error('Serverless handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
