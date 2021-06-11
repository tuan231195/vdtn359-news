import { NewsDto } from '@vdtn359/news-models';
import { DB, NEWS_STREAM, NewsDao, Redis } from '@vdtn359/news-schema';
import { process } from '@vdtn359/news-utils';

export class NewsPersister {
	private readonly newsDao: NewsDao;

	constructor(private readonly db: DB, private readonly redis: Redis) {
		this.newsDao = new NewsDao(db);
	}

	async saveNews(newsDtos: NewsDto[]) {
		const batcher = process.batch(newsDtos, 10);
		await batcher(async (dtos) => {
			await this.saveDb(dtos);
			await this.saveRedis(dtos);
		});
	}

	async cleanup() {
		await this.redis.disconnect();
	}

	private async saveDb(dtos: NewsDto[]) {
		await this.newsDao.save(dtos);
	}

	private async saveRedis(dtos: NewsDto[]) {
		const pipeline = this.redis.pipeline();
		for (const newsDto of dtos) {
			pipeline.xadd(NEWS_STREAM, '*', 'id', newsDto.id);
		}
		await pipeline.exec();
	}
}
