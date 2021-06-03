const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = (dirname) => {
	const { compilerOptions } = require(`${dirname}/tsconfig.json`);
	const paths = Object.entries(compilerOptions.paths).reduce(
		(currentObject, [key, value]) => {
			if (key.startsWith('@')) {
				return currentObject;
			}
			return {
				...currentObject,
				[key]: value,
			};
		},
		{}
	);
	return {
		roots: ['<rootDir>/src'],
		clearMocks: true,
		preset: 'ts-jest',
		moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
		testURL: 'http://localhost',
		moduleNameMapper: pathsToModuleNameMapper(paths, {
			prefix: `${dirname}/`,
		}),
		globals: {
			'ts-jest': {
				diagnostics: false,
				tsconfig: `${dirname}/tsconfig.json`,
			},
		},
	};
};
