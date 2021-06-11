require('dotenv').config();
process.env.NODE_CONFIG_DIR = __dirname + '/config/';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_ENV =
	process.env.NODE_CONFIG_ENV || process.env.NODE_ENV;
import config from 'config';
import { connectRedisUsingConfig } from '@vdtn359/news-schema';
import { connectDBUsingConfig, DB, NewsDao } from '@vdtn359/news-schema';
import { logging } from '@vdtn359/news-core';
import { Logger } from 'winston';
import { connectToEsUsingConfig, Elasticsearch } from '@vdtn359/news-search';

export const db: DB = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);
export const newsDao = new NewsDao(db);
export const es: Elasticsearch = connectToEsUsingConfig(config);
export const logger: Logger = logging.createLogger(
	'sheduler',
	config.get('logging.level'),
	{
		logzToken: config.get('logging.logzToken'),
	}
);

export { config };
