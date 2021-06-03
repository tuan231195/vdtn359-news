export function isProduction(env = process.env.NODE_ENV || 'development') {
	return env === 'production';
}

export function isDevelopment(env = process.env.NODE_ENV || 'development') {
	return env === 'development';
}

export function isTesting(env = process.env.NODE_ENV || 'development') {
	return env === 'test';
}

export function isBrowser() {
	return typeof window !== 'undefined';
}
