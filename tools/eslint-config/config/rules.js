module.exports = {
	'@typescript-eslint/explicit-function-return-type': 'off',
	'@typescript-eslint/no-var-requires': 'off',
	'@typescript-eslint/no-use-before-define': 'off',
	'@typescript-eslint/no-explicit-any': 'off',
	'@typescript-eslint/no-non-null-assertion': 'off',
	'@typescript-eslint/ban-ts-ignore': 'off',
	'@typescript-eslint/typedef': 'off',
	'@typescript-eslint/explicit-member-accessibility': 'off',
	'@typescript-eslint/no-floating-promises': 'off',
	'@typescript-eslint/no-parameter-properties': 'off',
	'react/prop-types': 'off',
	'react/jsx-no-bind': 'off',
	'@rushstack/typedef-var': 'off',
	'no-console': 'error',
	'no-void': 'off',
	'@typescript-eslint/naming-convention': [
		'error',
		{
			selector: 'default',
			format: ['camelCase'],
		},
		{
			selector: 'function',
			format: ['camelCase', 'PascalCase'],
		},
		{
			selector: 'variable',
			format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
		},
		{
			selector: 'parameter',
			format: ['camelCase', 'PascalCase'],
			leadingUnderscore: 'allow',
		},
		{
			selector: 'enumMember',
			format: ['UPPER_CASE'],
		},
		{
			selector: 'memberLike',
			modifiers: ['private'],
			format: ['camelCase'],
			leadingUnderscore: 'allow',
		},
		{
			selector: 'typeLike',
			format: ['PascalCase'],
		},
		{
			selector: 'property',
			format: null,
		},
	],
};
