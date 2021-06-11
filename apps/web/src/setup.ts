import { merge } from 'lodash';
import * as search from '@vdtn359/news-search';
import IORedis from 'ioredis';
import { logging } from '@vdtn359/news-core';
import * as Sentry from '@sentry/node';
import { Logger } from 'winston';
import { env } from '@vdtn359/news-utils';

const configMap = {
	default: {
		es: {
			host: 'http://localhost:9200',
			username: process.env.ES_USERNAME || '',
			password: process.env.ES_PASSWORD || '',
		},
		db: {
			clientEmail:
				'firebase-adminsdk-wh38a@vdtn359-news-dev.iam.gserviceaccount.com',
			projectId: 'vdtn359-news-dev',
			privateKey: process.env.FIREBASE_PRIVATE_KEY,
		},
		url: 'http://localhost:3000',
		redis: {
			host: 'localhost',
			password: '',
			port: 6379,
		},
		sentry: {
			dsn: process.env.SENTRY_DSN,
		},
		logging: {
			level: 'debug',
			logzToken: process.env.LOGZ_TOKEN,
		},
		email: {
			apiKey: process.env.SENDGRID_API_KEY,
			supportEmail: 'help@vdtn359.com',
			adminEmail: 'admin@vdtn359.com',
		},
		auth: {
			clientId: 'FMJ8feFNpDs6gK4GpKWeol0EUNQpNlWh',
			domain: 'vdtn359-news.au.auth0.com',
			clientSecret: process.env.AUTH0_SECRET,
			cookieSecret: process.env.COOKIE_SECRET,
		},
	},
	production: {
		url: 'https://www.vdtn359.com',
		db: {
			clientEmail:
				'firebase-adminsdk-9k17b@vdtn359-news-prod.iam.gserviceaccount.com',
			projectId: 'vdtn359-news-prod',
			privateKey: process.env.FIREBASE_PRIVATE_KEY,
		},
		redis: {
			host: 'redis-16850.c89.us-east-1-3.ec2.cloud.redislabs.com',
			port: 16850,
			password: process.env.REDIS_PASSWORD,
		},
		es: {
			host: 'http://do.vdtn359.com:9999',
		},
	},
};

export const config = merge(
	{},
	configMap.default,
	configMap[process.env.NODE_ENV] || {}
);

export const logger: Logger = logging.createLogger(
	'web',
	config.logging?.level,
	{
		logzToken: config.logging?.logzToken,
	}
);

Sentry.init({
	dsn: config.sentry?.dsn,
	environment: process.env.NODE_CONFIG_ENV,
	release: process.env.SENTRY_RELEASE,
	beforeSend(event) {
		if (env.isDevelopment()) {
			return null;
		}
		return event;
	},
});

export { Sentry };

export const es = search.connectToEs({
	node: config.es?.host,
	auth: {
		username: config.es?.username,
		password: config.es?.password,
	},
});

export const redis = new IORedis({
	host: config.redis.host,
	port: config.redis.port,
	password: config.redis.password,
	lazyConnect: true,
});
