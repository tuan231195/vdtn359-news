module.exports = {
	development: {
		username: 'vdtn359',
		password: 'password',
		database: 'news',
		host: '127.0.0.1',
		port: 5432,
		dialect: 'postgres',
	},
	test: {
		username: 'postgres',
		password: 'password',
		database: 'news',
		host: '127.0.0.1',
		port: 5432,
		dialect: 'postgres',
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: 'news',
		host: process.env.DB_HOSTNAME,
		port: 5432,
		dialect: 'postgres',
	},
};
