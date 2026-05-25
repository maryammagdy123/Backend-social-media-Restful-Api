"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendProfileArgsType = void 0;
const graphql_1 = require("graphql");
exports.FriendProfileArgsType = new graphql_1.GraphQLInputObjectType({
    name: "FriendProfileArgs",
    fields: {
        page: { type: graphql_1.GraphQLInt },
        limit: { type: graphql_1.GraphQLInt },
        search: { type: graphql_1.GraphQLString },
        profileOwnerID: { type: graphql_1.GraphQLString },
    },
});
