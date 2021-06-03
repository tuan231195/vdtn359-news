import util from 'util';
import { func, proxy as proxyHelper } from '@vdtn359/news-utils';

const CALLBACKS = ['cb', 'callback', 'callback_', 'done'];

export function promisifyAll(module, test = defaultTest) {
	const proxy = new Proxy(module, {
		get(target: any, property: string | number | symbol): any {
			if (
				!test({ module: target, property }) ||
				typeof target[property] !== 'function'
			) {
				return proxyHelper.getProperty(target, property, proxy);
			}
			return util.promisify(target[property].bind(target));
		},
	});
	return proxy;
}

function defaultTest({ module, property }) {
	const method = module[property];
	if (typeof method !== 'function') {
		return false;
	}

	const args = func.getArguments(method);
	return args && CALLBACKS.includes(args[args.length - 1]);
}
