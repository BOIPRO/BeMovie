import Redis from 'ioredis';
export declare class RedisService {
    private redis;
    constructor(redis: Redis);
    set(key: string, value: string, ttl?: number): Promise<null | undefined>;
    get(key: string): Promise<any>;
    del(key: string): Promise<void>;
}
