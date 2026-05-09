"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePrivacy = exports.CommentPrivacy = void 0;
var CommentPrivacy;
(function (CommentPrivacy) {
    CommentPrivacy["PUBLIC"] = "public";
    CommentPrivacy["FRIENDS_ONLY"] = "friends_only";
    CommentPrivacy["DISABLED"] = "disabled";
})(CommentPrivacy || (exports.CommentPrivacy = CommentPrivacy = {}));
var ProfilePrivacy;
(function (ProfilePrivacy) {
    ProfilePrivacy[ProfilePrivacy["PUBLIC"] = 0] = "PUBLIC";
    ProfilePrivacy[ProfilePrivacy["PROTECTED"] = 1] = "PROTECTED";
})(ProfilePrivacy || (exports.ProfilePrivacy = ProfilePrivacy = {}));
