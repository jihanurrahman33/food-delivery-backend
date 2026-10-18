"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSafeUser = toSafeUser;
function toSafeUser(user) {
    const { passwordHash, ...safe } = user;
    return safe;
}
