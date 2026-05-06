import { Types } from "mongoose";
import { ConflictError } from "../../common/exceptions";
import { UserFriendRepository } from "../../DB";
import { BlockRepository } from "../../DB/models/block/block.repository";

class FriendsService {
  constructor(
    private readonly userFriendRepository: UserFriendRepository,
    private readonly blockRepository: BlockRepository,
  ) {}

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
  public block = async (friendId: Types.ObjectId, userId: Types.ObjectId) => {
    //check if user is trying to block himself
    if (userId.toString() === friendId.toString())
      throw new ConflictError("you cannot block yourself");
    //check if the user is already blocked
    const isBlocked = await this.blockRepository.findOne({
      user: friendId,
      blockedBy: userId,
    });
    if (isBlocked) throw new ConflictError("this user is already blocked");
    //check if there a friendship between the two users
    const isFriend = await this.userFriendRepository.findOne({
      $or: [
        { user: userId, friend: friendId },
        { user: friendId, friend: userId },
      ],
    });
    if (isFriend) {
      //delete the friendship
      await this.userFriendRepository.deleteOne({ _id: isFriend._id });
    }
    //block the user
    return await this.blockRepository.create({
      user: friendId,
      blockedBy: userId,
    });
  };
}
export default new FriendsService(
  new UserFriendRepository(),
  new BlockRepository(),
);
