"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonChatMessageRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonChatMessageRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('chat_messages', dataDir);
    }
    async findByOrderId(orderId) {
        const list = await this.store.filter((m) => m.orderId === orderId);
        return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    async create(message) {
        return this.store.insert(message);
    }
}
exports.JsonChatMessageRepository = JsonChatMessageRepository;
