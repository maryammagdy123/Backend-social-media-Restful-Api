import { postService, PostService } from "../post.service";

export class PostResolver {
  constructor(private readonly postService:PostService) {}

  postList = async (parent: unknown, args: any, context: any) => {
  
    return {message:"done"}
  };
}
export const postResolver = new PostResolver(postService);
