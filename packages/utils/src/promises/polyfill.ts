export const all = async (obj) => {
	if (obj && !obj[Symbol.iterator]) {
		const entries = Object.entries(obj);
		const result = await Promise.all(entries.map((entry) => entry[1]));
		return entries.reduce((currentResult, [key], index) => {
			currentResult[key] = result[index];
			return currentResult;
		}, {});
	}
	return Promise.all(obj);
};
