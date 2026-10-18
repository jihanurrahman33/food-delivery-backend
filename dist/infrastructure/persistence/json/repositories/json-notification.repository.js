"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNotificationRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonNotificationRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('notifications', dataDir);
    }
    async findByUserId(userId) {
        const list = await this.store.filter((n) => n.userId === userId);
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async create(notification) {
        return this.store.insert(notification);
    }
    async markAllRead(userId) {
        const all = await this.store.readAll();
        let modified = false;
        for (let i = 0; i < all.length; i++) {
            if (all[i].userId === userId && !all[i].isRead) {
                all[i].isRead = true;
                modified = true;
            }
        }
        if (modified) {
            await this.store.writeAll(all);
        }
    }
}
exports.JsonNotificationRepository = JsonNotificationRepository;
