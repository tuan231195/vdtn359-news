module.exports = {
	coverageDirectory: './coverage',
	collectCoverageFrom: [
		'**/src/**/*.ts',
		'**/src/**/*.tsx',
		'!**/__tests__/**',
		'!**/test/**',
		'!**/node_modules/**',
	],
	//change this to allow more better coverage testing
	coverageThreshold: {
		global: {
			statements: 0,
			branches: 0,
			functions: 0,
			lines: 0,
		},
	},
	projects: ['<rootDir>/packages/*/jest.config.js'],
};
