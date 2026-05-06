"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockModel = void 0;
const mongoose_1 = require("mongoose");
const blockSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    blockedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
exports.BlockModel = (0, mongoose_1.model)("Block", blockSchema);
