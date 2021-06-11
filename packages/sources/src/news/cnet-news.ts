import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import * as cheerio from 'cheerio';
import { getCleanedHTML, resolveLazyLoadedImage } from 'src/news/utils';
import { axios } from './utils';

export class CnetNews extends DefaultNews {
	static url = 'www.cnet.com';

	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	getImage(element: cheerio.Cheerio): string | undefined {
		const image = element.find('media\\:thumbnail');
		return image.length ? image.attr('url')! : undefined;
	}

	static async extractUrl(url: string) {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = cheerio.load(newsPage);
		let storyBody = $('#article-body');
		storyBody.find('figure > a > svg').parent().remove();
		const toRemove = [
			'[data-video-playlist]',
			'[section="shortcodeGallery"]',
			'footer',
			'.playerControls',
			'[data-component="lazyloadElement"]',
		];
		toRemove.forEach((section) => {
			storyBody.find(section).remove();
		});
		storyBody = resolveLazyLoadedImage($, storyBody);
		const storyContent = cheerio.html(storyBody);
		return getCleanedHTML(storyContent);
	}
}
