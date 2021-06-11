import { NextApiRequest, NextApiResponse } from 'next';
import { getHandler } from 'src/api/handler';
import { SitemapStream, streamToPromise, EnumChangefreq } from 'sitemap';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { parseFields } from 'src/utils/search/fields';
import { categoryMap } from 'src/utils/categories';
import { subDays, startOfDay } from 'date-fns';
import { isDevelopment } from 'src/utils/env';
import { buildMatchAll } from 'src/utils/search/query';
const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Content-Type', 'text/xml');
	const stories = await fetchContentFromAPI();

	const protocol = isDevelopment() ? 'http' : 'https';
	const smStream = new SitemapStream({
		hostname: `${protocol}://${req.headers.host}`,
	});
	for (const story of stories) {
		smStream.write({
			url: `/news/${story.slug}`,
			lastmod: new Date(story.pubDate),
		});
	}
	const pages = [
		'/',
		'/contact',
		'/hot-news',
		...Object.keys(categoryMap).map(
			(category) => `/categories/${category.toLowerCase()}`
		),
	];
	for (const page of pages) {
		smStream.write({
			url: page,
			lastmod: startOfDay(subDays(new Date(), 1)),
			changefreq: EnumChangefreq.DAILY,
		});
	}
	smStream.end();
	const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
	res.write(sitemap);
	res.end();
}

async function fetchContentFromAPI() {
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		size: 30,
		body: {
			_source: ['slug', 'id', 'pubDate'],
			...buildMatchAll(),
		},
	});
	return parseFields(hits);
}
