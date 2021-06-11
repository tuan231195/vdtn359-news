require('dotenv').config();
process.env.NODE_CONFIG_DIR = __dirname + '/config/';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_ENV =
	process.env.NODE_CONFIG_ENV || process.env.NODE_ENV;
import * as Sentry from '@sentry/node';
import { env } from '@vdtn359/news-utils';
import * as search from '@vdtn359/news-search';
import config from 'config';
import findup from 'find-up';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	DB,
	NEWS_GROUP,
	NEWS_STATS_GROUP,
	NEWS_STATS_STREAM,
	NEWS_STREAM,
	NewsDao,
} from '@vdtn359/news-schema';
const packageJson = require(findup.sync('package.json'));

Sentry.init({
	dsn: config.get('sentry.dsn'),
	environment: process.env.NODE_CONFIG_ENV,
	release: packageJson.version,
	beforeSend(event) {
		if (env.isDevelopment()) {
			return null;
		}
		return event;
	},
});
import { logging } from '@vdtn359/news-core';
import { Logger } from 'winston';

export const db: DB = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);
export const es = search.connectToEsUsingConfig(config);
export const logger: Logger = logging.createLogger(
	'worker',
	config.get('logging.level'),
	{
		logzToken: config.get('logging.logzToken'),
	}
);
export const newsDao = new NewsDao(db);

export async function setupRedis() {
	try {
		await Promise.all([
			setupRedisStream(NEWS_STREAM, NEWS_GROUP),
			setupRedisStream(NEWS_STATS_STREAM, NEWS_STATS_GROUP),
		]);
	} catch (e) {
		logger.error('Failed to setup redis: ', e);
	}
}

export async function setupRedisStream(stream, group) {
	const streamExists = await redis.exists(stream);
	const extraArgs = streamExists ? [] : ['MKSTREAM'];
	try {
		await redis.xgroup('CREATE', stream, group, 0, ...extraArgs);
	} catch (e) {
		if (e.message !== 'BUSYGROUP Consumer Group name already exists') {
			throw e;
		}
	}
}

export async function setupEs() {
	try {
		return await search.setup(es);
	} catch (e) {
		logger.error('Failed to setup elasticsearch: ', e);
	}
}
export { config };
