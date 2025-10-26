const serverless = require('serverless-http');

// Import compiled factory built by `npm run build` (dist/app.factory.js)
const { createExpressAdapter, createNestApp } = require('../dist/app.factory');

let cachedHandler;

module.exports = async (req, res) => {
  try {
    if (!cachedHandler) {
      const { expressApp, adapter } = createExpressAdapter();
      const app = await createNestApp(adapter);
      await app.init(); // don't call listen()
      cachedHandler = serverless(expressApp);
    }
    return cachedHandler(req, res);
  } catch (err) {
    console.error('Serverless handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
