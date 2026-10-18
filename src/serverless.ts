import { createApp } from './app';
import { DependencyContainer } from './container';

let appInstance: any = null;

function getApp() {
  if (!appInstance) {
    const container = DependencyContainer.getInstance();
    appInstance = createApp(container);
  }
  return appInstance;
}

const handler = (req: any, res: any) => {
  try {
    const app = getApp();
    return app(req, res);
  } catch (err: any) {
    console.error('SERVERLESS RUNTIME ERROR:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: {
            message: err?.message || String(err),
            stack: err?.stack,
          },
        })
      );
    }
  }
};

export = handler;

