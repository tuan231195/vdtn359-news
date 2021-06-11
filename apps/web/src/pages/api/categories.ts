import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { getHandler } from 'src/api/handler';
const handler = getHandler();
handler.get(request);

export default handler;

const categoriesCacheKey = 'vn:categories';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const cachedResult = await redis.get(categoriesCacheKey);
	if (cachedResult) {
		return res.json(JSON.parse(cachedResult));
	}
	const {
		body: {
			aggregations: {
				categories: { buckets },
			},
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			size: 0,
			aggs: {
				categories: {
					terms: { field: 'category' },
				},
			},
		},
	});

	const result = buckets.map((bucket) => ({
		category: bucket.key,
		count: bucket.doc_count,
	}));

	await redis.set(categoriesCacheKey, JSON.stringify(result), 'EX', 60);

	res.json(result);
}
