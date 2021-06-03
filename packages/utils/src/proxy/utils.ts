export function wrap<W extends object, B>(wrapper: W, base: B): W & B {
	const proxy = new Proxy(wrapper, {
		get(target, property) {
			if (property in target) {
				return getProperty(target, property, proxy);
			}

			return getProperty(base, property, proxy);
		},
	});
	return proxy;
}

export function getProperty(object, property, proxy) {
	if (typeof object[property] === 'function' && !object[property].proxy) {
		const oldFunction = object[property];
		object[property] = function (...args) {
			const value = oldFunction.apply(object, args);
			return value === object ? proxy : value;
		};

		(object[property] as any).proxy = true;
	}
	return object[property];
}
