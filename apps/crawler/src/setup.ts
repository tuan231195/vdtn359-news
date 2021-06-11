require('dotenv').config();
process.env.NODE_CONFIG_DIR = __dirname + '/config/';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_ENV =
	process.env.NODE_CONFIG_ENV || process.env.NODE_ENV;

import { env } from '@vdtn359/news-utils';
import config from 'config';
import * as Sentry from '@sentry/node';
import findup from 'find-up';
import { logging } from '@vdtn359/news-core';
import { Logger } from 'winston';

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

export { Sentry };

export const logger: Logger = logging.createLogger(
	'crawler',
	config.get('logging.level'),
	{
		logzToken: config.get('logging.logzToken'),
	}
);

export { config };
