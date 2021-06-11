import { stringQuery } from 'src/api/parse';

export const FIELDS = [
	'id',
	'pubDate',
	'category',
	'image',
	'url',
	'title',
	'description',
	'slug',
	'ratings',
	'numViews',
	'numComments',
];

export function parseFields(hits) {
	return hits.map((hit) => {
		return {
			score: hit._score,
			sort: hit.sort,
			...hit._source,
		};
	});
}

export function parseSuggestions(suggestion) {
	if (!suggestion?.length) {
		return [];
	}
	return suggestion[0].options?.map((option) => option.text);
}

export function parseJsonQuery(query, field) {
	if (!query[field]) {
		return undefined;
	}
	try {
		return JSON.parse(stringQuery(query[field]));
	} catch {
		return undefined;
	}
}
