import { NewsDto } from '@vdtn359/news-models';
import { DB, NEWS_COLLECTION } from 'src/db';
import { subDays } from 'date-fns';
import { chunk } from 'lodash';
import { BaseDao } from 'src/daos/base-dao.interface';

export class NewsDao extends BaseDao<NewsDto> {
	constructor(db: DB) {
		super(NEWS_COLLECTION, db);
	}

	async removeOldNews() {
		const snapshots = await this.db
			.collection(NEWS_COLLECTION)
			.where('pubDate', '<', subDays(new Date(), 7))
			.get();

		const chunks: any[] = chunk(Array.from(snapshots.docs), 100);
		for (const chunk of chunks) {
			const batch = this.db.batch();
			for (const doc of chunk) {
				batch.delete(doc.ref);
			}
			await batch.commit();
		}
		return snapshots.size;
	}
}
