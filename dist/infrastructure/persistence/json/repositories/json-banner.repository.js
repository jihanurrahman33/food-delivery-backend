"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonBannerRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonBannerRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('banners', dataDir);
    }
    async findAll() {
        return this.store.readAll();
    }
}
exports.JsonBannerRepository = JsonBannerRepository;
