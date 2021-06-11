module.exports = {
	db: {
		clientEmail:
			'firebase-adminsdk-wh38a@vdtn359-news-dev.iam.gserviceaccount.com',
		projectId: 'vdtn359-news-dev',
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	},
	sentry: {
		dsn: process.env.SENTRY_REPORTING_DSN,
	},
	redis: {
		host: 'localhost',
		password: '',
		port: 6379,
	},
	es: {
		host: 'http://localhost:9200',
		username: process.env.ES_USERNAME || '',
		password: process.env.ES_PASSWORD || '',
	},
	logging: {
		level: 'debug',
		logzToken: process.env.LOGZ_TOKEN || '',
	},
};
