"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = void 0;
const uuid_1 = require("uuid");
const correlationMiddleware = (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || (0, uuid_1.v4)();
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    req.correlationId = correlationId;
    next();
};
exports.correlationMiddleware = correlationMiddleware;
