import { Types } from "mongoose";

export interface IAuthRedisProvider {
  //all logged in user'sessions set
  allSessionsSetKey(userId: Types.ObjectId): string;

  //user session (per device) key
  sessionKey(userId: Types.ObjectId, sessionId: string):string;

  otpKey(email: string, purpose: string):string;
  checkKeyExistence(key: string): Promise<number>;
  ensureTTL(key: string, minTTL: number): Promise<number>;

  saveSessions(
    userId: Types.ObjectId,
    sessionId: string,
    refreshToken: string,
  ): Promise<void>;

  
  keys(userId: Types.ObjectId): Promise<string[]>;
  key(email: string): string;
}
