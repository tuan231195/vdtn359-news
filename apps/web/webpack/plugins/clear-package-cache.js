'use strict';

const fs = require('fs');
function deleteCache(path) {
	try {
		delete require.cache[fs.realpathSync(path)];
	} catch (e) {
		if (e.code !== 'ENOENT') throw e;
	} finally {
		delete require.cache[path];
	}
}

class ClearPackageCachePlugin {
	constructor(packagePath) {
		this.packagePath = packagePath;
	}
	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync(
			'ClearPackageCachePlugin',
			(compilation, callback) => {
				for (const key of Object.keys(require.cache)) {
					if (key.startsWith(this.packagePath)) {
						deleteCache(key);
					}
				}
				callback();
			}
		);
	}
}
exports.ClearPackageCachePlugin = ClearPackageCachePlugin;
