import * as PostGQLTypes from "./post.types.gql";
import * as PostGQLArgs from "./post.args.gql";
import { postResolver, PostResolver } from "./post.resolver";
export class PostGQLSchema {
  constructor(private readonly postResolver: PostResolver) {}

  registerQuery() {
    return {
      postList: {
        type: PostGQLTypes.PostListResponseGQLType,
        description: "This query returns a list of posts.",
        args: PostGQLArgs.postList,
        resolve: this.postResolver.postList,
      },
    };
  }
}

export const postGQLSchema = new PostGQLSchema(postResolver);
