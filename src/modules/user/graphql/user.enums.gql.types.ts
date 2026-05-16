import { GraphQLEnumType } from "graphql";
import {
  GenderEnum,
  ProfilePrivacy,
  ProviderEnum,
  RoleEnum,
} from "../../../common";

export const GenderEnumGQLType = new GraphQLEnumType({
  name: "GenderGQLEnum",
  values: {
    Male: { value: GenderEnum.male },
    Female: { value: GenderEnum.female },
  },
});
export const UserRoleEnumGQLType = new GraphQLEnumType({
  name: "UserRoleGQLEnum",
  values: {
    User: { value: RoleEnum.user },
    Admin: { value: RoleEnum.admin },
  },
});

export const ProfilePrivacyEnumGQLType = new GraphQLEnumType({
  name: "ProfilePrivacyGQLEnum",
  values: {
    Public: { value: ProfilePrivacy.PUBLIC },
    Protected: { value: ProfilePrivacy.PROTECTED },
  },
});

export const ProviderEnumGQLType = new GraphQLEnumType({
  name: "ProviderGQLEnum",
  values: {
    System: { value: ProviderEnum.system },
    Google: { value: ProviderEnum.google },
  },
});
