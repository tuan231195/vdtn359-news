import { Inject } from 'typedi';
import { orderBy } from 'lodash';
import { cookies } from 'src/utils/cookie';

export enum TrackingType {
	ID = 'id',
	TERM = 'term',
	UNLIKEID = 'unlike',
}

export class TrackingService {
	constructor(@Inject('db') private readonly dbPromise) {}

	async track({
		id,
		time = new Date(),
		type = TrackingType.ID,
	}: {
		id: string;
		time?: Date;
		type?: TrackingType;
	}) {
		const db = await this.dbPromise;
		const item = await db.put('likes', {
			id: `${type}:${id}`,
			time,
		});

		const allValues = await db.getAll('likes');
		const toRemove = orderBy(allValues, ['time'], 'desc').slice(10);
		await Promise.all(
			toRemove.map(({ id }) => {
				delete allValues[id];
				return db.delete('likes', id);
			})
		);
		cookies.set(
			'likes',
			allValues.map((value) => value.id),
			{ expires: 365 }
		);
		return item;
	}
}
