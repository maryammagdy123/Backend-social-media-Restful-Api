"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentPrivacyGQLEnumType = void 0;
const graphql_1 = require("graphql");
const common_1 = require("../../../common");
exports.CommentPrivacyGQLEnumType = new graphql_1.GraphQLEnumType({
    name: "CommentPrivacyGQLEnum",
    values: {
        PUBLIC: {
            value: common_1.CommentPrivacy.PUBLIC,
        },
        DISABLED: {
            value: common_1.CommentPrivacy.DISABLED,
        },
        FRIENDS: {
            value: common_1.CommentPrivacy.FRIENDS_ONLY,
        },
    },
});
