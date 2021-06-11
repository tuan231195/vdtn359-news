import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { FIELDS, parseFields } from 'src/utils/search/fields';
import { getHandler } from 'src/api/handler';

const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			size: 5,
			query: {
				bool: {
					should: [
						{
							more_like_this: {
								fields: ['title', 'description', 'body'],
								like: [
									{
										_index: NEWS_INDEX,
										_id: req.query.id,
									},
								],
							},
						},
					],
					must_not: [
						{
							ids: {
								values: [req.query.id],
							},
						},
					],
				},
			},
			_source: FIELDS,
		},
	});

	const newsDtos = parseFields(hits);
	return res.json(newsDtos);
}
