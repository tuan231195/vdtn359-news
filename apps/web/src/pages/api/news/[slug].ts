import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import createError from 'http-errors';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';
import { getHandler } from 'src/api/handler';
import { stringQuery } from 'src/api/parse';

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
			query: {
				term: {
					slug: req.query.slug,
				},
			},
		},
	});

	const document = hits[0] && hits[0]._source;

	if (!document) {
		throw new createError.NotFound();
	}

	captureView(document.id);
	const referrer = stringQuery(req.query.referrer);
	if (referrer) {
		captureSearch(document.id, referrer);
	}

	return res.json(document);
}

function captureView(id) {
	const indexDoc: NewsStatDto = {
		docIds: [id],
		time: new Date(),
		type: ACTION_TYPE.VIEW,
	};
	redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
}

function captureSearch(id: string, search: string) {
	const indexDoc: NewsStatDto = {
		docIds: [id],
		time: new Date(),
		meta: {
			term: search,
		},
		type: ACTION_TYPE.SEARCH,
	};
	redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
}
