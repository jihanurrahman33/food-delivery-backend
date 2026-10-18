"use strict";
const app_1 = require("./app");
const container_1 = require("./container");
const container = container_1.DependencyContainer.getInstance();
const app = (0, app_1.createApp)(container);
module.exports = app;
