import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
@Global()
@Module({
    providers : [ 
        {
            provide : 'REDIS_CLIENT',
            useFactory : async () => {
                const redis = Redis;
            const client = new redis(process.env.REDIS_URL!);
             client.on("error",(error)=> {
                console.log(error);
            })
            return client
            },
        }, RedisService
    ],
    exports : [RedisService],
})
export class RedisModule {}
