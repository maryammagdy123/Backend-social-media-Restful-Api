//define args

import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
} from "graphql";

export const FriendProfileArgsType = new GraphQLInputObjectType({
  name: "FriendProfileArgs",
  fields: {
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    search: { type: GraphQLString },
    profileOwnerID: { type: GraphQLString },
  },
});
