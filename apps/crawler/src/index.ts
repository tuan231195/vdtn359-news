import 'source-map-support/register';
import { fetchNews } from 'src/crawler';
import { NewsPersister } from 'src/persister';
import { mergeMap } from 'rxjs/operators';
import { Sentry, logger } from 'src/setup';
import { env, func } from '@vdtn359/news-utils';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	DB,
} from '@vdtn359/news-schema';
import config from 'config';

if (env.isDevelopment()) {
	handler(null, {}, func.noop);
}

export function handler(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	const db: DB = connectDBUsingConfig(config);
	const redis = connectRedisUsingConfig(config);
	const persister = new NewsPersister(db, redis);
	fetchNews()
		.pipe(mergeMap((newsDtos) => persister.saveNews(newsDtos)))
		.subscribe({
			complete: async () => {
				logger.info('Completed');
				await persister.cleanup();
				callback(null);
			},
			error: (e) => {
				logger.error('Failed to crawl news: ', e);
				Sentry.captureException(e);
				callback(e);
			},
		});
}
