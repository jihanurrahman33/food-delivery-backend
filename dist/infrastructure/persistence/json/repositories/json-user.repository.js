"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonUserRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonUserRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('users', dataDir);
    }
    async findById(id) {
        return this.store.findById(id);
    }
    async findByEmail(email) {
        const normalized = email.trim().toLowerCase();
        return this.store.findOne((u) => u.email.trim().toLowerCase() === normalized);
    }
    async create(user) {
        return this.store.insert(user);
    }
    async update(id, partial) {
        return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
    }
    async delete(id) {
        return this.store.delete(id);
    }
    async findAll() {
        return this.store.readAll();
    }
}
exports.JsonUserRepository = JsonUserRepository;
