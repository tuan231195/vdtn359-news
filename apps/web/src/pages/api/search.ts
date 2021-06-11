import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { buildEsQuery, buildSuggester } from 'src/utils/search/query';
import {
	FIELDS,
	parseFields,
	parseJsonQuery,
	parseSuggestions,
} from 'src/utils/search/fields';
import { intQuery, stringQuery } from 'src/api/parse';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';
import { getHandler } from 'src/api/handler';

const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	const [searchResults, termsResult] = await Promise.all([
		search(req.query),
		significantTerms(req.query),
	]);

	res.json({
		...termsResult,
		...searchResults,
	});
}

async function search(query) {
	const searchAfter = parseJsonQuery(query, 'searchAfter');
	const searchQuery = stringQuery(query.search);
	const size = intQuery(query.size);
	const results = await es.search({
		index: NEWS_INDEX,
		body: {
			track_scores: true,
			size,
			search_after: searchAfter,
			suggest: buildSuggester(query),
			sort: [
				{
					_score: {
						order: 'desc',
					},
				},
				{
					pubDate: {
						order: 'desc',
					},
				},
				{
					id: {
						order: 'desc',
					},
				},
			],
			query: buildEsQuery(query),
			_source: FIELDS,
		},
	});
	const {
		body: {
			hits: {
				total: { value: total },
				hits,
			},
		},
	} = results;

	const suggestions = parseSuggestions(results.body.suggest?.suggests);

	const newsDtos = parseFields(hits) || [];
	if (searchQuery?.trim() && !query.inline && !searchAfter) {
		const topSearch = newsDtos.slice(0, 3);
		if (topSearch.length) {
			const indexDoc: NewsStatDto = {
				docIds: topSearch.map((search) => search.id),
				time: new Date(),
				meta: {
					term: searchQuery,
				},
				type: ACTION_TYPE.SEARCH,
			};
			redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
		}
	}

	return {
		suggestions,
		items: newsDtos,
		total,
	};
}

async function significantTerms(query) {
	if (!query.search) {
		return {
			terms: [],
		};
	}
	const results = await es.search({
		index: NEWS_INDEX,
		body: {
			query: buildEsQuery(query),
			aggregations: {
				search: {
					sampler: {
						shard_size: 100,
					},
					aggregations: {
						keywords: {
							significant_text: {
								field: 'body',
							},
						},
					},
				},
			},
		},
	});
	let terms = [];
	if (results) {
		const searchQuery = stringQuery(query.search);
		terms =
			results.body.aggregations?.search?.keywords?.buckets?.map(
				(bucket) => bucket.key
			) || [];
		terms = terms.filter(
			(term) => term.toLowerCase() !== searchQuery.toLowerCase()
		);
	}
	return {
		terms,
	};
}
