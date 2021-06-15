const { linkBinsOfPackages } = require('@pnpm/link-bins');
const path = require('path');
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

function warn(msg) {
	console.warn(msg);
}

async function link() {
	await linkBinsOfPackages(
		[
			{
				manifest: packageJson,
				location: path.resolve(__dirname, '..'),
			},
		],
		path.resolve(__dirname, '..', 'node_modules/.bin'),
		{ warn }
	);
}

link();
