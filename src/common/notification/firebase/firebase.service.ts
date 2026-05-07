import { INotificationProvider } from "../notification.interface";
import admin from "firebase-admin";

class FirebasePushNotificationProvider implements INotificationProvider {
  private client: admin.app.App;
  constructor(config: any) {
    // Initialize Firebase Admin SDK
    this.client = admin.initializeApp({
      credential: admin.credential.cert(config),
    });
  }
  async send(
    token: string,
    data: { title: string; body: string },
  ): Promise<void> {
    this.client.messaging().send({
      token,
      data
    });
  }
}

export default FirebasePushNotificationProvider;
