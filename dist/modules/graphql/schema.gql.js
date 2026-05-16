"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const type_1 = require("graphql/type");
const user_1 = require("../user");
const post_1 = require("../post");
const query = new type_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...user_1.userGQLSchema.registerQuery(),
        ...post_1.postGQLSchema.registerQuery(),
    },
});
exports.schema = new type_1.GraphQLSchema({ query });
