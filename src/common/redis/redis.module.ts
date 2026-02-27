import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from '@/common/redis/redis.service';

@Global()
@Module({})
export class RedisModule {
    static register(): DynamicModule {
        return {
            module: RedisModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: 'REDIS_CLIENT',
                    useFactory: (configService: ConfigService) => {
                        return new Redis({
                            host: configService.getOrThrow<string>('REDIS_HOST'),
                            port: configService.getOrThrow<number>('REDIS_PORT'),
                            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
                        });
                    },
                    inject: [ConfigService],
                },
                RedisService,
            ],
            exports: ['REDIS_CLIENT', RedisService],
        };
    }
}
