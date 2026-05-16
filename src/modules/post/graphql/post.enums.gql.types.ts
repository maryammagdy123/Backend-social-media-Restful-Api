import { GraphQLEnumType } from "graphql";
import { CommentPrivacy } from "../../../common";

export const CommentPrivacyGQLEnumType = new GraphQLEnumType({
  name: "CommentPrivacyGQLEnum",
  values: {
    PUBLIC: {
      value: CommentPrivacy.PUBLIC,
    },
    DISABLED: {
      value: CommentPrivacy.DISABLED,
    },
    FRIENDS: {
      value: CommentPrivacy.FRIENDS_ONLY,
    },
  },
});
