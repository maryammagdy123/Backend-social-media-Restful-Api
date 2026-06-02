"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockRepo = exports.BlockRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const block_model_1 = require("./block.model");
class BlockRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(block_model_1.BlockModel);
    }
}
exports.BlockRepository = BlockRepository;
exports.blockRepo = new BlockRepository();
