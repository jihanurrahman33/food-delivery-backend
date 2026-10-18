"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../core/utils/logger");
const bundled_seeds_1 = require("./bundled-seeds");
/**
 * Robust JSON File Store with In-Memory Write-Queue & Atomic File Replacement
 *
 * Guarantees:
 * 1. Safe concurrent operations (serialized write queue per file)
 * 2. Atomic writes (write to .tmp then rename)
 * 3. Graceful handling of missing/corrupt files
 * 4. Easy swap for SQL/NoSQL databases via repository interfaces
 */
class JsonFileStore {
    fileName;
    filePath;
    tmpFilePath;
    cache = null;
    writeQueue = Promise.resolve();
    constructor(fileName, baseDir) {
        this.fileName = fileName.replace('.json', '');
        try {
            if (!fs_1.default.existsSync(baseDir)) {
                fs_1.default.mkdirSync(baseDir, { recursive: true });
            }
        }
        catch (err) {
            logger_1.logger.warn(`Could not ensure base directory ${baseDir}:`, err);
        }
        this.filePath = path_1.default.join(baseDir, `${this.fileName}.json`);
        this.tmpFilePath = `${this.filePath}.tmp`;
        this.ensureFileExists();
    }
    ensureFileExists() {
        if (!fs_1.default.existsSync(this.filePath)) {
            try {
                // 1. Try memory-bundled seeds first (zero filesystem dependency)
                const bundled = (0, bundled_seeds_1.getBundledSeedData)(this.fileName);
                if (bundled && bundled.length > 0) {
                    fs_1.default.writeFileSync(this.filePath, JSON.stringify(bundled, null, 2), 'utf-8');
                    logger_1.logger.info(`Auto-seeded ${this.filePath} from bundled memory`);
                    return;
                }
                // 2. Try repository data directory
                const seedPath = path_1.default.resolve(process.cwd(), 'data', `${this.fileName}.json`);
                if (fs_1.default.existsSync(seedPath) && seedPath !== this.filePath) {
                    fs_1.default.copyFileSync(seedPath, this.filePath);
                    logger_1.logger.info(`Auto-seeded ${this.filePath} from ${seedPath}`);
                    return;
                }
                // 3. Fallback to empty array
                fs_1.default.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
            }
            catch (err) {
                logger_1.logger.error(`Failed to initialize file ${this.filePath}:`, err);
            }
        }
    }
    async readAll() {
        if (this.cache !== null) {
            return [...this.cache];
        }
        try {
            if (!fs_1.default.existsSync(this.filePath)) {
                this.cache = [];
                return [];
            }
            const raw = await fs_1.default.promises.readFile(this.filePath, 'utf-8');
            if (!raw || raw.trim().length === 0) {
                this.cache = [];
                return [];
            }
            this.cache = JSON.parse(raw);
            return [...this.cache];
        }
        catch (err) {
            logger_1.logger.error(`Failed to read/parse ${this.filePath}, returning empty array:`, err);
            this.cache = [];
            return [];
        }
    }
    async writeAll(items) {
        this.cache = [...items];
        // Enqueue write to guarantee serialized atomic filesystem writes
        this.writeQueue = this.writeQueue.then(async () => {
            try {
                const payload = JSON.stringify(items, null, 2);
                // Write to temporary file first
                await fs_1.default.promises.writeFile(this.tmpFilePath, payload, 'utf-8');
                // Atomically replace target file
                await fs_1.default.promises.rename(this.tmpFilePath, this.filePath);
            }
            catch (err) {
                logger_1.logger.error(`Atomic write failure for ${this.filePath}:`, err);
                throw err;
            }
        });
        return this.writeQueue;
    }
    async findById(id) {
        const all = await this.readAll();
        const item = all.find((x) => x.id === id);
        return item ? { ...item } : null;
    }
    async findOne(predicate) {
        const all = await this.readAll();
        const item = all.find(predicate);
        return item ? { ...item } : null;
    }
    async filter(predicate) {
        const all = await this.readAll();
        return all.filter(predicate).map((item) => ({ ...item }));
    }
    async insert(item) {
        const all = await this.readAll();
        all.push(item);
        await this.writeAll(all);
        return { ...item };
    }
    async update(id, partial) {
        const all = await this.readAll();
        const index = all.findIndex((x) => x.id === id);
        if (index === -1)
            return null;
        all[index] = { ...all[index], ...partial };
        await this.writeAll(all);
        return { ...all[index] };
    }
    async delete(id) {
        const all = await this.readAll();
        const index = all.findIndex((x) => x.id === id);
        if (index === -1)
            return false;
        all.splice(index, 1);
        await this.writeAll(all);
        return true;
    }
    clearCache() {
        this.cache = null;
    }
}
exports.JsonFileStore = JsonFileStore;
