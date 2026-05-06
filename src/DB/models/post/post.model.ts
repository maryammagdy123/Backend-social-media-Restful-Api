import { model, Schema } from "mongoose";
import { PostDocument } from "../../../common/types/post.types";
import { CommentPrivacy } from "../../../common";


export const schema = new Schema<PostDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    attachments: [String],
    commentsCount: {
      type: Number,
      default: 0,
    },
    reactionsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    commentPrivacy:{
      type:String,
      enum:CommentPrivacy,
      default:CommentPrivacy.PUBLIC //by default commenting on post is allowed
    }
  },
  {
    timestamps: true,
  },
);

//TODO: DELETE POST AND ITS COMMENTS (REPLIE)
// schema.pre("findOneAndDelete", async function () {
//   const doc = await this.model.findOne(this.getFilter());



//   // delete all comments + replies
//   await CommentModel.deleteMany({ postId: doc._id });

// });
export const PostModel = model("Post", schema);
