import { NextApiRequest, NextApiResponse } from 'next';
import { getHandler } from 'src/api/handler';
import { promise } from '@vdtn359/news-core';
import { es, redis } from 'src/setup';
import createError from 'http-errors';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { parseFields } from 'src/utils/search/fields';
import { buildMatchAll } from 'src/utils/search/query';
import RSS from 'rss';
import { isValidCategory } from 'src/utils/categories';
import { stringQuery } from 'src/api/parse';
import { str } from '@vdtn359/news-utils';

const handler = getHandler();
handler.get(request);

export default handler;

const cachedKeyPrefix = 'rss:';

async function request(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Content-Type', 'text/xml');
	let category = stringQuery(req.query.category);
	if (category === 'all') {
		category = undefined;
	}
	if (category && !isValidCategory(category)) {
		throw new createError.BadRequest('Not a valid category');
	}
	const redisKey = `${cachedKeyPrefix}${category ? category : 'all'}`;
	const cachedValue = await redis.getBuffer(redisKey);
	if (cachedValue) {
		return res.send(await promise.zlib.gunzip(cachedValue));
	}
	const feed = new RSS({
		title: "Tuan's news",
		description: 'A news website',
		webMaster: 'Tuan Nguyen',
		language: 'en',
		copywright: '2020 Tuan Nguyen',
		pubDate: new Date().toISOString(),
		ttl: 300,
		categories: category ? [str.ucfirst(category)] : [],
	});
	const newsList = await fetchContentFromAPI(category);

	for (const news of newsList) {
		feed.item({
			title: news.title,
			description: news.description,
			guid: news.id,
			categories: category ? [str.ucfirst(category)] : [],
			date: new Date(news.pubDate).toISOString(),
			url: news.url,
			custom_elements: [
				{
					image: news.image,
				},
			],
		});
	}
	const xml = feed.xml();
	const zippedOutput = await promise.zlib.gzip(Buffer.from(xml), {
		level: 9,
	});
	await redis.set(redisKey, zippedOutput, 'EX', 300);
	res.send(xml);
}

async function fetchContentFromAPI(category?: string) {
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		size: 10,
		body: {
			_source: [
				'title',
				'description',
				'id',
				'url',
				'pubDate',
				'category',
				'image',
			],
			...buildMatchAll(category),
		},
	});
	return parseFields(hits);
}
