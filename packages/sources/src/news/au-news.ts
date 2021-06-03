import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import { axios, resolveLazyLoadedImage } from './utils';
import Cheerio from 'cheerio';
import { getCleanedHTML } from 'src/news/utils';
import { arr } from '@vdtn359/news-utils';

export class AuNews extends DefaultNews {
	static url = 'www.news.com.au';

	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	static async extractUrl(url: string): Promise<string> {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const contentSelectors = ['.story-content', '.story-body'];
		let article = arr.findMap(
			contentSelectors,
			(selector) => $(selector),
			(element) => !!element?.length
		);
		article = resolveLazyLoadedImage($, article);
		const storyContent = Cheerio.html(article);
		return getCleanedHTML(storyContent);
	}
}
