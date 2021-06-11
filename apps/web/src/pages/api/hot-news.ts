import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { buildCommonQuery } from 'src/utils/search/query';
import { FIELDS, parseFields } from 'src/utils/search/fields';
import { getHandler } from 'src/api/handler';
import { intQuery } from 'src/api/parse';
const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	const size = intQuery(req.query.size, 20);
	const commonNews = await search(size);
	res.json(commonNews);
}

async function search(size = 20) {
	const results = await es.search({
		index: NEWS_INDEX,
		body: {
			track_scores: true,
			size,
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
			],
			query: buildCommonQuery(),
			_source: FIELDS,
		},
	});
	const {
		body: {
			hits: { hits },
		},
	} = results;

	return parseFields(hits) || [];
}
