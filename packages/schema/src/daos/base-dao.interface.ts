import { DB } from 'src/db';
import { Dao } from 'src/daos/dao.interface';

export class BaseDao<T> implements Dao<T> {
	constructor(
		private readonly collection: string,
		protected readonly db: DB
	) {}

	save(dtos: T[]) {
		return this.db.save(this.collection, dtos);
	}

	get(id: string): Promise<T> {
		return this.db.get(this.collection, id);
	}

	saveOne(dto): Promise<T> {
		return this.db.saveOne(this.collection, dto);
	}

	async findByIds(itemIds: string[]): Promise<T[]> {
		return this.db.findByIds(this.collection, itemIds);
	}

	query(
		where: any,
		orderBy?: { path: string; direction: 'desc' | 'asc' }
	): Promise<T[]> {
		return this.db.query(this.collection, where, orderBy);
	}

	delete(id: string): Promise<void> {
		return this.db.delete(this.collection, id);
	}
}
