import 'source-map-support/register';
import { es, logger, newsDao, redis } from 'src/setup';
import { env } from '@vdtn359/news-utils';
import { NEWS_INDEX, NEWS_STAT_INDEX } from '@vdtn359/news-search';

if (env.isDevelopment()) {
	handler();
}
export async function handler() {
	await Promise.all([deleteFromDb(), deleteFromEs(), deleteFromRedis()]);
}

async function deleteFromRedis() {
	await redis.xtrim(NEWS_INDEX, 'maxlen', '~', 5000);
	await redis.disconnect();
}

async function deleteFromDb() {
	const deletedNews = await newsDao.removeOldNews();
	logger.info(`Deleted ${deletedNews} news from db`);
}
async function deleteFromEs() {
	const [deletedNews, deletedNewsStat] = await Promise.all([
		es.removeOldDocs(NEWS_INDEX, 'pubDate'),
		es.removeOldDocs(NEWS_STAT_INDEX, 'time'),
	]);

	logger.info(`Deleted ${deletedNews} news from es`);
	logger.info(`Deleted ${deletedNewsStat} news stats from es`);

	await es.close();
}
