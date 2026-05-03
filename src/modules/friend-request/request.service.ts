import { Types } from "mongoose";
import { RequestRepository } from "../../DB/models/friend-request";
import { ConflictError } from "../../common/exceptions";

class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  public sendRequest = async (
    userId: Types.ObjectId, //sender (logged user)
    receiverId: Types.ObjectId, //req params
  ) => {
    //TODO check if blocked user
    //TODO check if already on friends list
    //check if already sent a request (sender) , if already received an request (receiver)
    const request = await this.requestRepository.findOne({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });
    if (request)
      throw new ConflictError(
        "cannot send request, already there is a request !",
      );
    // else send a new request
    return this.requestRepository.create({
      sender: userId,
      receiver: receiverId,
    });
  };
}
export default new RequestService(new RequestRepository());
