const baseConfig = require('../../jest.config.base');

module.exports = {
	...baseConfig(__dirname),
	displayName: 'news-web',
	testEnvironment: 'jsdom',
};
