import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) { }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await this.redisClient.set(key, stringValue, 'EX', ttl);
        } else {
            await this.redisClient.set(key, stringValue);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redisClient.get(key);
        if (!value) return null;
        return JSON.parse(value) as T;
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    onModuleDestroy() {
        this.redisClient.disconnect();
    }
}
