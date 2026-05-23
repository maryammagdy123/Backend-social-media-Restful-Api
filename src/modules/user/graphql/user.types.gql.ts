// here define the types for the user module

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import { PostTypeGQL } from "../../post";
import {
  GenderEnumGQLType,
  ProfilePrivacyEnumGQLType,
  ProviderEnumGQLType,
  UserRoleEnumGQLType,
} from "./user.enums.gql.types";

export const UserTypeGQL = new GraphQLObjectType({
  name: "User",

  fields: {
    _id: {
      type: GraphQLID,
    },

    username: {
      type: GraphQLString,
    },

    email: {
      type: GraphQLString,
    },

    provider: {
      type: ProviderEnumGQLType,
    },

    bio: {
      type: GraphQLString,
    },

    coverPhotos: {
      type: GraphQLString,
    },

    DOB: {
      type: GraphQLString,
    },

    gender: {
      type: GenderEnumGQLType,
    },

    profilePicture: {
      type: GraphQLString,
    },

    role: {
      type: UserRoleEnumGQLType,
    },

    isConfirmed: {
      type: GraphQLBoolean,
    },

    profilePrivacy: {
      type: ProfilePrivacyEnumGQLType,
    },

    createdAt: {
      type: GraphQLString,
    },

    updatedAt: {
      type: GraphQLString,
    },
  },
});
export const UserProfileStatisticsTypeGQL = new GraphQLObjectType({
  name: "ProfileStatisticsType",
  fields: {
    commentsCount: {
      type: GraphQLInt,
    },
    postsCount: { type: GraphQLInt },
    friendsRequestsCount: { type: GraphQLInt },
    friendsCount: { type: GraphQLInt },
    likesCount: { type: GraphQLInt },
  
  },
});
export const ProfileResponseType = new GraphQLNonNull(
  new GraphQLObjectType({
    name: "ProfileResponse",

    fields: {
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
      userProfile: {
        type: UserTypeGQL,
      },

      posts: {
        type: new GraphQLList(PostTypeGQL),
      },

      friends: {
        type: new GraphQLList(UserTypeGQL),
      },

      statistics: {
        type: UserProfileStatisticsTypeGQL,
      },
    },
  }),
);
