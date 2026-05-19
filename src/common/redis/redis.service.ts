import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}
    async set(key: string, value: string, ttl: number = 600) {
        try {
            const data = typeof value === 'string' ? value : JSON.stringify(value);
           await this.redis.set(key, data, "EX", ttl)
        } catch (error) {
           console.error(`[Redis Error] Set key ${key} failed:`, error);
        return null;
        }
    }
    async get(key: string) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
           console.error(`[Redis Error] get key ${key} failed:`, error);
           return null;
        }
    }
    async del(key: string) {
        try {
            await this.redis.del(key);
        } catch (error) {
           console.error(`[Redis Error] delete key ${key} failed:`, error);
        }
    }
}