const { createApp } = require('../dist/app');
const { DependencyContainer } = require('../dist/container');

let appInstance = null;

function getApp() {
  if (!appInstance) {
    const container = DependencyContainer.getInstance();
    appInstance = createApp(container);
  }
  return appInstance;
}

const handler = (req, res) => {
  try {
    const app = getApp();
    return app(req, res);
  } catch (err) {
    console.error('CRITICAL SERVERLESS RUNTIME ERROR:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: {
            message: err && err.message ? err.message : String(err),
            stack: err && err.stack ? err.stack : undefined,
          },
        })
      );
    }
  }
};

module.exports = handler;
module.exports.default = handler;
