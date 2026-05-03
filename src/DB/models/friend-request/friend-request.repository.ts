import { IRequest } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { RequestModel } from "./friend-request.model";

export class RequestRepository extends AbstractDBRepository<IRequest> {
  constructor() {
    super(RequestModel);
  }
}
