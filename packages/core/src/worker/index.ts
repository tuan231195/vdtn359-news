export const spawn = (file: string, wkOpts) => {
	const { Worker } = require('worker_threads');
	wkOpts.eval = true;
	if (!wkOpts.workerData) {
		wkOpts.workerData = {};
	}
	wkOpts.workerData.__filename = file;
	return new Worker(
		`
            const wk = require('worker_threads');
            const path = require('path');
            let file = wk.workerData.__filename;
            if (file.endsWith('.ts')) {
            	process.env.TS_NODE_TRANSPILE_ONLY = true;
            	process.env.TS_NODE_TYPE_CHECK = false;
            	require('ts-node').register();
            	require('tsconfig-paths').register({
            		baseUrl: '.',
  					paths: {
  						"src/*": ["./src/*"]
  					}
            	});
            }
            require(file);
        `,
		wkOpts
	);
};

export function error(logger, ...args) {
	logging(logger, 'error', ...args);
}
export function warn(logger, ...args) {
	logging(logger, 'warn', ...args);
}
export function info(logger, ...args) {
	logging(logger, 'info', ...args);
}

export function logging(logger, type, ...args) {
	const { isMainThread } = require('worker_threads');
	if (isMainThread) {
		logger[type](...args);
	} else {
		logger[type](`[${process.env.WORKER_ID}] - ${args[0]}`);
	}
}
