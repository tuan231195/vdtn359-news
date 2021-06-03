export function findMap(
	arr,
	mapFunction: Function,
	predicate: (element) => boolean = (element) => !!element
) {
	for (const element of arr) {
		const mappedElement = mapFunction(element);
		if (predicate(mappedElement)) {
			return mappedElement;
		}
	}
	return null;
}
