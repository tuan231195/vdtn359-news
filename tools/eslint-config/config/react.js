require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = (root) => ({
	extends: [
		'@rushstack/eslint-config/profile/web-app',
		'@rushstack/eslint-config/mixins/react',
		'plugin:prettier/recommended',
		'prettier',
	],
	parserOptions: { tsconfigRootDir: root, ecmaVersion: 12 },
	rules: require('./rules'),
	settings: {
		react: {
			version: '16',
		},
	},
});
