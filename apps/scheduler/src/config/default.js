module.exports = {
	db: {
		clientEmail:
			'firebase-adminsdk-wh38a@vdtn359-news-dev.iam.gserviceaccount.com',
		projectId: 'vdtn359-news-dev',
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	},
	es: {
		host: 'http://localhost:9200',
		username: process.env.ES_USERNAME || '',
		password: process.env.ES_PASSWORD || '',
	},
	redis: {
		host: 'localhost',
		password: '',
		port: 6379,
	},
	logging: {
		level: 'debug',
		logzToken: process.env.LOGZ_TOKEN || '',
	},
};
