module.exports = (dirname) => {
	return {
		roots: ['<rootDir>/src'],
		clearMocks: true,
		preset: 'ts-jest',
		moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
		testURL: 'http://localhost',
		moduleNameMapper: {
			'src/(.*)': '<rootDir>/src/$1',
		},
		globals: {
			'ts-jest': {
				diagnostics: false,
				tsconfig: `${dirname}/tsconfig.json`,
			},
		},
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
	};
};
