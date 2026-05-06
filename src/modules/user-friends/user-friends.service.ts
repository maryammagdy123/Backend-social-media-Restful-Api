import { Types } from "mongoose";
import { ConflictError } from "../../common/exceptions";
import { UserFriendRepository } from "../../DB";

class FriendsService {
  constructor(private readonly userFriendRepository: UserFriendRepository) {}

  public unfriend = async (
    userId: Types.ObjectId,
    friendId: Types.ObjectId,
  ) => {
    //check if there a friendship between the two users
    //FIXME using findOneAndDelete
    const friendship = await this.userFriendRepository.findOne({
      $or: [
        { user: userId, friend: friendId },
        { user: friendId, friend: userId },
      ],
    });
    if (!friendship)
      throw new ConflictError("you are not friends with this user");
    //dont allow user to unfriend himself
    if (userId.toString() === friendId.toString())
      throw new ConflictError("you cannot unfriend yourself");
    //delete the friendship
    return await this.userFriendRepository.deleteOne({ _id: friendship._id });
  };

  //todo
  public block = async () => {};
}
export default new FriendsService(new UserFriendRepository());
