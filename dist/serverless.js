"use strict";
const app_1 = require("./app");
const container_1 = require("./container");
let appInstance = null;
function getApp() {
    if (!appInstance) {
        const container = container_1.DependencyContainer.getInstance();
        appInstance = (0, app_1.createApp)(container);
    }
    return appInstance;
}
const handler = (req, res) => {
    try {
        const app = getApp();
        return app(req, res);
    }
    catch (err) {
        console.error('SERVERLESS RUNTIME ERROR:', err);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: err?.message || String(err),
                    stack: err?.stack,
                },
            }));
        }
    }
};
module.exports = handler;
