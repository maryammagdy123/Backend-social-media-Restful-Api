"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileResponseType = exports.UserTypeGQL = void 0;
const graphql_1 = require("graphql");
const post_1 = require("../../post");
const user_enums_gql_types_1 = require("./user.enums.gql.types");
exports.UserTypeGQL = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: {
        _id: {
            type: graphql_1.GraphQLID,
        },
        username: {
            type: graphql_1.GraphQLString,
        },
        email: {
            type: graphql_1.GraphQLString,
        },
        provider: {
            type: user_enums_gql_types_1.ProviderEnumGQLType,
        },
        bio: {
            type: graphql_1.GraphQLString,
        },
        coverPhotos: {
            type: graphql_1.GraphQLString,
        },
        DOB: {
            type: graphql_1.GraphQLString,
        },
        gender: {
            type: user_enums_gql_types_1.GenderEnumGQLType,
        },
        profilePicture: {
            type: graphql_1.GraphQLString,
        },
        role: {
            type: user_enums_gql_types_1.UserRoleEnumGQLType,
        },
        isConfirmed: {
            type: graphql_1.GraphQLBoolean,
        },
        profilePrivacy: {
            type: user_enums_gql_types_1.ProfilePrivacyEnumGQLType,
        },
        createdAt: {
            type: graphql_1.GraphQLString,
        },
        updatedAt: {
            type: graphql_1.GraphQLString,
        },
    },
});
exports.ProfileResponseType = new graphql_1.GraphQLNonNull(new graphql_1.GraphQLObjectType({
    name: "ProfileResponse",
    fields: {
        message: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
        userProfile: {
            type: exports.UserTypeGQL,
        },
        posts: {
            type: new graphql_1.GraphQLList(post_1.PostTypeGQL),
        },
        friends: {
            type: new graphql_1.GraphQLList(exports.UserTypeGQL),
        },
    },
}));
