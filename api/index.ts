import { createApp } from '../src/app';
import { DependencyContainer } from '../src/container';

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
    console.error('Serverless invocation error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err?.message || 'Serverless invocation failure',
      });
    }
  }
};

export default handler;
// @ts-ignore
module.exports = handler;
// @ts-ignore
module.exports.default = handler;
