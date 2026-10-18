"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthRouter = void 0;
const express_1 = require("express");
const createHealthRouter = (controller) => {
    const router = (0, express_1.Router)();
    router.get('/', controller.check);
    return router;
};
exports.createHealthRouter = createHealthRouter;
