import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from "graphql";
import { CommentPrivacyGQLEnumType } from "./post.enums.gql.types";

export const PostTypeGQL = new GraphQLObjectType({
  name: "Post",

  fields: {
    _id: {
      type: GraphQLID,
    },

    content: {
      type: GraphQLString,
    },

    attachments: {
      type: new GraphQLList(GraphQLString),
    },

    commentsCount: {
      type: GraphQLInt,
    },

    reactionsCount: {
      type: GraphQLInt,
    },

    sharesCount: {
      type: GraphQLInt,
    },

    commentPrivacy: {
      type: CommentPrivacyGQLEnumType,
    },

    createdAt: {
      type: GraphQLString,
    },
  },
});


export const PostListResponseGQLType =new GraphQLObjectType({
  name:"PostListResponse",
  fields:{
    message:{type:new GraphQLNonNull(GraphQLString)},
    
  }
})