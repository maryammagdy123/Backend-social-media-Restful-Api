import path from "node:path";
import FirebasePushNotificationProvider from "./firebase.service";
import * as fs from "node:fs";
const config = JSON.parse(fs.readFileSync(
  path.resolve(
    __dirname,
    "../../../config/social-media-app-be-firebase-adminsdk-fbsvc-429a98cb2b.json",
  ),
) as unknown as string);
export const firebasePushNotificationProvider =
  new FirebasePushNotificationProvider(config);
