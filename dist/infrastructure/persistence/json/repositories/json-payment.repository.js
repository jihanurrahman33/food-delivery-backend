"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPaymentRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonPaymentRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('payments', dataDir);
    }
    async create(transaction) {
        return this.store.insert(transaction);
    }
    async findById(id) {
        return this.store.findById(id);
    }
    async findByOrderId(orderId) {
        return this.store.filter((t) => t.orderId === orderId);
    }
    async findByReference(ref) {
        return this.store.findOne((t) => t.transactionReference === ref);
    }
    async update(id, partial) {
        return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
    }
}
exports.JsonPaymentRepository = JsonPaymentRepository;
