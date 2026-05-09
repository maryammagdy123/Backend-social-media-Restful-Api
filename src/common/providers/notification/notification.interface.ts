export interface INotificationProvider {
  // token like fcm (firebase cloud messaging)
  send(token: string, data: { title: string; body: string }): Promise<void>;
}
