import { CnetNews } from 'src/news/cnet-news';
import { AuNews } from 'src/news/au-news';
import { TechRepublicNews } from 'src/news/tech-republic-news';
import { SmhNews } from 'src/news/smh-news';
import { keyBy } from 'lodash';
import urlParser from 'url';

export const availableSources = [AuNews, CnetNews, TechRepublicNews, SmhNews];
const sourceMap = keyBy(availableSources, 'url');

export function extractUrl(url) {
	const parsedUrl = urlParser.parse(url);
	const host: any = parsedUrl.hostname;
	const source = sourceMap[host];
	if (!source) {
		return;
	}
	return source.extractUrl(url);
}
