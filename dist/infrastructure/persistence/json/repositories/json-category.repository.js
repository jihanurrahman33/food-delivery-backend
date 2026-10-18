"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCategoryRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonCategoryRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('categories', dataDir);
    }
    async findAll() {
        const list = await this.store.readAll();
        return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    async findById(id) {
        return this.store.findById(id);
    }
}
exports.JsonCategoryRepository = JsonCategoryRepository;
