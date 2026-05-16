import { GraphQLObjectType, GraphQLSchema } from "graphql/type";
import { userGQLSchema } from "../user";
import { postGQLSchema } from "../post";

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...userGQLSchema.registerQuery(),
    ...postGQLSchema.registerQuery(),
  },
});
//define GraphQL schema
export let schema = new GraphQLSchema({ query });
