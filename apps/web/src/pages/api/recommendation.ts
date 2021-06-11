import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { FIELDS, parseFields, parseJsonQuery } from 'src/utils/search/fields';
import { intQuery } from 'src/api/parse';
import { getModifierFunctions } from 'src/utils/search/query';
import getHotNews from './hot-news';
import { getHandler } from 'src/api/handler';

const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	const size = intQuery(req.query.size, 5);
	req.query.size = size.toString();
	const likes = parseJsonQuery(req.cookies, 'likes') || [];
	if (!likes.length) {
		return getHotNews(req, res);
	}
	const likeQuery = likes
		.filter((like) => !like.startsWith('unlike'))
		.map((like) => {
			const [type, docOrTerm] = like.split(':');
			if (type === 'id') {
				return {
					_index: NEWS_INDEX,
					_id: docOrTerm,
				};
			} else {
				return docOrTerm;
			}
		});
	const unlikeQuery = likes
		.filter((like) => like.startsWith('unlike'))
		.map((like) => {
			const [, docOrTerm] = like.split(':');
			return {
				_index: NEWS_INDEX,
				_id: docOrTerm,
			};
		});
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			size,
			query: {
				function_score: {
					query: {
						bool: {
							should: [
								{
									more_like_this: {
										fields: [
											'title',
											'description',
											'body',
										],
										like: likeQuery,
										unlike: unlikeQuery,
									},
								},
							],
						},
					},
					functions: [
						...getModifierFunctions(),
						{
							random_score: {},
							weight: 15,
						},
					],
					score_mode: 'sum',
					boost_mode: 'sum',
				},
			},
			_source: FIELDS,
		},
	});

	if (!hits.length) {
		return getHotNews(req, res);
	}

	const newsDtos = parseFields(hits);
	return res.json(newsDtos);
}
