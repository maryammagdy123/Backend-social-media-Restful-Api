"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResolver = exports.PostResolver = void 0;
const post_service_1 = require("../post.service");
class PostResolver {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    postList = async (parent, args, context) => {
        return { message: "done" };
    };
}
exports.PostResolver = PostResolver;
exports.postResolver = new PostResolver(post_service_1.postService);
