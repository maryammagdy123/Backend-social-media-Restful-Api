"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostListResponseGQLType = exports.PostTypeGQL = void 0;
const graphql_1 = require("graphql");
const post_enums_gql_types_1 = require("./post.enums.gql.types");
exports.PostTypeGQL = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: {
        _id: {
            type: graphql_1.GraphQLID,
        },
        content: {
            type: graphql_1.GraphQLString,
        },
        attachments: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
        },
        commentsCount: {
            type: graphql_1.GraphQLInt,
        },
        reactionsCount: {
            type: graphql_1.GraphQLInt,
        },
        sharesCount: {
            type: graphql_1.GraphQLInt,
        },
        commentPrivacy: {
            type: post_enums_gql_types_1.CommentPrivacyGQLEnumType,
        },
        createdAt: {
            type: graphql_1.GraphQLString,
        },
    },
});
exports.PostListResponseGQLType = new graphql_1.GraphQLObjectType({
    name: "PostListResponse",
    fields: {
        message: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    }
});
