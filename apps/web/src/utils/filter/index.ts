import { CATEGORY } from '@vdtn359/news-models';
import { filterCategories } from 'src/utils/categories';

export function getFilterFromUrl(filter): SearchFilter {
	try {
		const parsedFilter = JSON.parse(decodeURIComponent(filter));
		return {
			...parsedFilter,
			search: (parsedFilter.search || '').trim(),
			categories: filterCategories(parsedFilter.categories || []),
		};
	} catch {
		return {
			search: '',
		};
	}
}

export function toQueryString(filter) {
	return encodeURIComponent(JSON.stringify(filter));
}

export interface SearchFilter {
	search: string;
	categories?: CATEGORY[];
	searchAfter?: any[];
}
