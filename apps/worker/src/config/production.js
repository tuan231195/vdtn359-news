module.exports = {
	db: {
		clientEmail:
			'firebase-adminsdk-zer3e@vdtn359-news-prod.iam.gserviceaccount.com',
		projectId: 'vdtn359-news-prod',
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	},
	sentry: {
		dsn: process.env.SENTRY_REPORTING_DSN,
	},
	redis: {
		host: 'redis-16850.c89.us-east-1-3.ec2.cloud.redislabs.com',
		port: 16850,
		password: process.env.REDIS_PASSWORD,
	},
	es: {
		host: 'http://do.vdtn359.com:9999',
		username: process.env.ES_USERNAME || '',
		password: process.env.ES_PASSWORD || '',
	},
	logging: {
		level: 'debug',
		logzToken: process.env.LOGZ_TOKEN || '',
	},
};
