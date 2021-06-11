export function findMap(
	arr,
	mapFunction: (element: any) => any,
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
