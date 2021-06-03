import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import { axios, getCleanedHTML, resolveLazyLoadedImage } from 'src/news/utils';
import Cheerio from 'cheerio';
import { arr } from '@vdtn359/news-utils';

export class SmhNews extends DefaultNews {
	static url = 'www.smh.com.au';

	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	static async extractUrl(url: string) {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const contentSelectors = [
			'#content > div > div > article > div > div:nth-child(1) > div:nth-child(2)',
			'#content > div > article > section > div',
			'#content > div > article',
		];
		let articleBody = arr.findMap(
			contentSelectors,
			(selector) => $(selector),
			(element) => !!element?.length
		);
		if (!articleBody?.length) {
			return '';
		}
		const toRemove = ['#endOfArticle', '.noPrint', '[preload=metadata]'];
		toRemove.forEach((section) => {
			articleBody.find(section).remove();
		});
		articleBody = resolveLazyLoadedImage($, articleBody);
		const storyContent = Cheerio.html(articleBody);
		return getCleanedHTML(storyContent);
	}
}
