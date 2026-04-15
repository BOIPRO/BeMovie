import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private redis: Redis) { }
    async set(key: string, value: string, ttl: number = 600) {
        try {
            const data = typeof value === 'string' ? value : JSON.stringify(value);
            const result = await this.redis.set(key, data, "EX", ttl)
            return result
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
}