// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop: (arg: any) => any = function (...args) {
	//do nothing
};

export const nothing = function () {
	//do nothing
};

export const wrapDecorator = function (fn) {
	if (fn) {
		return fn;
	}
	return () => noop;
};
