import { IAuthRedisProvider } from "./redis/redis.interface";

export interface ICacheProvider extends IAuthRedisProvider {
  get<T>(key: string): Promise<T | string | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string | string[]): Promise<number>;
  clear(): Promise<string | null>;
  /**
   * @param key =>> userId::FCM :[FCM-Token-1,FCM-Token-2,....]
   * @param value =>> FCM-Token
   */
  addToSet(key: string, value: string): Promise<void>;
  sMembers(key: string): Promise<string[]>;
  sRem(key: string, member: string): Promise<number>;
  sIsMember(key: string, member: string): Promise<number>;
}
