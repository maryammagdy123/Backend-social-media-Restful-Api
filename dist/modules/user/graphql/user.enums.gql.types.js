"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderEnumGQLType = exports.ProfilePrivacyEnumGQLType = exports.UserRoleEnumGQLType = exports.GenderEnumGQLType = void 0;
const graphql_1 = require("graphql");
const common_1 = require("../../../common");
exports.GenderEnumGQLType = new graphql_1.GraphQLEnumType({
    name: "GenderGQLEnum",
    values: {
        Male: { value: common_1.GenderEnum.male },
        Female: { value: common_1.GenderEnum.female },
    },
});
exports.UserRoleEnumGQLType = new graphql_1.GraphQLEnumType({
    name: "UserRoleGQLEnum",
    values: {
        User: { value: common_1.RoleEnum.user },
        Admin: { value: common_1.RoleEnum.admin },
    },
});
exports.ProfilePrivacyEnumGQLType = new graphql_1.GraphQLEnumType({
    name: "ProfilePrivacyGQLEnum",
    values: {
        Public: { value: common_1.ProfilePrivacy.PUBLIC },
        Protected: { value: common_1.ProfilePrivacy.PROTECTED },
    },
});
exports.ProviderEnumGQLType = new graphql_1.GraphQLEnumType({
    name: "ProviderGQLEnum",
    values: {
        System: { value: common_1.ProviderEnum.system },
        Google: { value: common_1.ProviderEnum.google },
    },
});
