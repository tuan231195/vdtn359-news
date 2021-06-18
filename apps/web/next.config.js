require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const withPWA = require('next-pwa');
const crypto = require('crypto');
const packageJson = require('./package.json');
const FontAwesomeMinifyPlugin = require('font-awesome-minify-plugin');
const {
	ClearPackageCachePlugin,
} = require('./webpack/plugins/clear-package-cache');
const fg = require('fast-glob');
const fs = require('fs');
process.env.SENTRY_RELEASE = packageJson.version;
const withPlugins = require('next-compose-plugins');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_ENV =
	process.env.NODE_CONFIG_ENV || process.env.NODE_ENV;
const supportedLocales = ['en'];
const isDevelopment = process.env.NODE_ENV === 'development';
const runtimeCaching = require('./cache');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const nextConfig = withPlugins([
	[
		(nextConfig) => {
			return Object.assign({}, nextConfig, {
				onDemandEntries: {
					// period (in ms) where the server will keep pages in the buffer
					maxInactiveAge: 250 * 1000,
					// number of pages that should be kept simultaneously without being disposed
					pagesBufferLength: 10,
				},
				compress: true,
				webpack: (config, options) => {
					config.resolve.symlinks = true;
					if (!process.env.LOCAL) {
						config.externals = config.externals || [];
						config.externals.push({
							'aws-sdk': 'aws-sdk',
						});
					}

					if (options.isServer) {
						config.module.rules.push({
							test: /^(idb)$/,
							use: 'null-loader',
						});
					}

					config.module.rules.push({
						test: /^(worker_threads)$/,
						use: 'null-loader',
					});

					const originalEntry = config.entry;
					config.entry = async () => {
						let entries = await originalEntry();

						if (options.isServer) {
							entries = injectPolyfill(
								entries,
								path.resolve('src', 'server-polyfill.ts')
							);
						} else {
							entries['main.js'] = injectPolyfill(
								entries['main.js'],
								path.resolve('src', 'client-polyfill.ts')
							);
						}
						return entries;
					};

					config.plugins.push(
						new webpack.ContextReplacementPlugin(
							/date-fns[\/\\]/,
							new RegExp(
								`[/\\\\\](${supportedLocales.join(
									'|'
								)})[/\\\\\]`
							)
						)
					);

					if (!isDevelopment && process.env.SOURCEMAP) {
						config.devtool = 'source-map';
						const { SENTRY_DSN } = process.env;

						for (const plugin of config.plugins) {
							if (plugin.constructor.name === 'UglifyJsPlugin') {
								plugin.options.sourceMap = true;
								break;
							}
						}

						if (
							config.optimization &&
							config.optimization.minimizer
						) {
							for (const plugin of config.optimization
								.minimizer) {
								if (
									plugin.constructor.name === 'TerserPlugin'
								) {
									plugin.options.sourceMap = true;
									break;
								}
							}
						}

						if (SENTRY_DSN) {
							config.plugins.push(
								new SentryWebpackPlugin({
									include: '.next',
									ignore: ['node_modules'],
									urlPrefix: '~/_next',
								})
							);
						}
					}

					config.resolve.alias = {
						...config.resolve.alias,
						src: path.resolve(__dirname, 'src'),
					};

					if (isDevelopment) {
						const packagePath = path.resolve(
							'..',
							'..',
							'packages'
						);
						const dependencies = [
							'utils',
							'core',
							'models',
							'schema',
							'search',
						].map((dependency) =>
							path.resolve(packagePath, dependency, 'dist')
						);

						config.plugins.push(
							new ExtraWatchWebpackPlugin({
								dirs: dependencies,
							})
						);
						config.plugins.push(
							new ClearPackageCachePlugin(packagePath)
						);
					}

					config.plugins.push(
						new webpack.EnvironmentPlugin([
							'NODE_ENV',
							'NODE_CONFIG_ENV',
							'LOGZ_TOKEN',
							'ES_PASSWORD',
							'ES_USERNAME',
							'REDIS_PASSWORD',
							'SENDGRID_API_KEY',
							'FIREBASE_PRIVATE_KEY',
							'SENTRY_RELEASE',
							'COOKIE_SECRET',
							'AUTH0_SECRET',
							'SENTRY_DSN',
						])
					);

					if (!options.isServer) {
						config.plugins.push(
							new FontAwesomeMinifyPlugin({
								srcDir: path.resolve('src'),
							})
						);
					}

					if (typeof nextConfig.webpack === 'function') {
						return nextConfig.webpack(config, options);
					}

					return config;
				},
			});
		},
	],
	[
		withPWA,
		{
			pwa: {
				dest: 'public',
				sw: 'service-worker.js',
				disable: process.env.NODE_ENV === 'development',
				runtimeCaching,
				additionalManifestEntries: this.disable
					? []
					: fg
							.sync(
								[
									'**/*',
									'!service-worker.js',
									'!workbox-*.js',
									'!workbox-*.js.map',
									'!worker-*.js',
									'!worker-*.js.map',
								],
								{ dot: true, cwd: 'public' }
							)
							.map((file) => ({
								url: `/${file}`,
								revision: getRevision(`public/${file}`),
							})),
			},
		},
	],
]);

module.exports = nextConfig;

function injectPolyfill(entry, polyfillFile) {
	if (!entry) {
		return entry;
	}
	if (typeof entry === 'string') {
		return [polyfillFile, entry];
	}
	if (Array.isArray(entry) && !entry.includes(polyfillFile)) {
		return [polyfillFile, ...entry];
	}

	if (typeof entry === 'object') {
		return Object.keys(entry).reduce((currentMap, entryName) => {
			return {
				...currentMap,
				[entryName]: injectPolyfill(entry[entryName], polyfillFile),
			};
		}, {});
	}
	return entry;
}

function getRevision(file) {
	return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
}
