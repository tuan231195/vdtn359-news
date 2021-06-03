import IORedis from 'ioredis';
import { Redis, RedisWrapper } from 'src/redis';
import { proxy } from '@vdtn359/news-utils';

export function connectRedis(connectOptions: IORedis.RedisOptions): Redis {
	const redis = new IORedis(connectOptions);
	const redisWrapper = new RedisWrapper(redis);
	return proxy.wrap(redisWrapper, redis);
}

export function connectRedisUsingConfig(config) {
	return connectRedis({
		password: config.get('redis.password'),
		host: config.get('redis.host'),
		port: config.get('redis.port'),
	});
}
