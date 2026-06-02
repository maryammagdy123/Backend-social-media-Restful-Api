import { IBlock } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { BlockModel } from "./block.model";

export class BlockRepository extends AbstractDBRepository<IBlock> {
  constructor() {
    super(BlockModel);
  }
}
export const blockRepo = new BlockRepository();