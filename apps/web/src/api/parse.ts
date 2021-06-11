export function stringQuery(queryParams: string | string[]): string {
	if (Array.isArray(queryParams)) {
		return queryParams[0];
	} else {
		return queryParams;
	}
}

export function intQuery(
	queryParams: string | string[],
	defaultValue?: any
): number {
	const str = stringQuery(queryParams);
	return !str || isNaN(str as any) ? defaultValue : parseInt(str, 10);
}

export function arrayQuery(queryParams: string | string[]): string[] {
	if (Array.isArray(queryParams)) {
		return queryParams;
	} else if (queryParams) {
		return [queryParams];
	}
}
