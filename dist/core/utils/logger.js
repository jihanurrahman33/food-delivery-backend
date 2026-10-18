"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    format(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaStr}`;
    }
    debug(message, meta) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.format(LogLevel.DEBUG, message, meta));
        }
    }
    info(message, meta) {
        console.info(this.format(LogLevel.INFO, message, meta));
    }
    warn(message, meta) {
        console.warn(this.format(LogLevel.WARN, message, meta));
    }
    error(message, meta) {
        console.error(this.format(LogLevel.ERROR, message, meta));
    }
}
exports.logger = new Logger();
