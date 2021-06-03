import './transformer';
import IORedis from 'ioredis';
import { from, interval, Observable } from 'rxjs';
import { concatMap, filter, flatMap } from 'rxjs/operators';

export type Redis = RedisWrapper & IORedis.Redis;

export class RedisWrapper {
	constructor(private readonly redis: IORedis.Redis) {}

	readStream({
		group,
		consumer,
		stream,
	}: {
		group: string;
		consumer: string;
		stream: string;
	}): Observable<any> {
		let lastId: any = 0;
		return interval(500).pipe(
			concatMap(async () => {
				const result = await this.redis.xreadgroup(
					'GROUP',
					group,
					consumer,
					'COUNT',
					100,
					'BLOCK',
					500,
					'STREAMS',
					stream,
					lastId
				);
				const items: any[] = (Object.values(result || {})[0] ||
					[]) as any;
				if (!items?.length) {
					if (!lastId) {
						lastId = '>';
					}
					return;
				}
				const itemIds = items.map((item) => item.id);
				await this.redis.xack(stream, group, ...itemIds);
				return items;
			}),
			filter((item) => !!item),
			flatMap((items: any) => from(items))
		);
	}
}
