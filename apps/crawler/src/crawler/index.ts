import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import Bottleneck from 'bottleneck';
import { Observable, Subject } from 'rxjs';
import {
	AuNews,
	CnetNews,
	SmhNews,
	TechRepublicNews,
} from '@vdtn359/news-sources';

const newsSources = [
	new AuNews(
		CATEGORY.NATIONAL,
		'https://www.news.com.au/content-feeds/latest-news-national'
	),
	new AuNews(
		CATEGORY.WORLD,
		'https://www.news.com.au/content-feeds/latest-news-world'
	),
	new AuNews(
		CATEGORY.LIFESTYLE,
		'https://www.news.com.au/content-feeds/latest-news-lifestyle'
	),
	new AuNews(
		CATEGORY.TRAVEL,
		'https://www.news.com.au/content-feeds/latest-news-travel'
	),
	new AuNews(
		CATEGORY.ENTERTAINMENT,
		'https://www.news.com.au/content-feeds/latest-news-entertainment'
	),
	new AuNews(
		CATEGORY.TECHNOLOGY,
		'https://www.news.com.au/content-feeds/latest-news-technology'
	),
	new AuNews(
		CATEGORY.BUSINESS,
		'https://www.news.com.au/content-feeds/latest-news-finance'
	),
	new AuNews(
		CATEGORY.SPORT,
		'https://www.news.com.au/content-feeds/latest-news-sport'
	),
	new SmhNews(CATEGORY.NATIONAL, 'https://www.smh.com.au/rss/national.xml'),
	new SmhNews(CATEGORY.SPORT, 'https://www.smh.com.au/rss/sport.xml'),
	new SmhNews(CATEGORY.LIFESTYLE, 'https://www.smh.com.au/rss/culture.xml'),
	new SmhNews(
		CATEGORY.LIFESTYLE,
		'https://www.smh.com.au/rss/environment.xml'
	),
	new SmhNews(CATEGORY.BUSINESS, 'https://www.smh.com.au/rss/business.xml'),
	new SmhNews(CATEGORY.WORLD, 'https://www.smh.com.au/rss/world.xml'),
	new SmhNews(
		CATEGORY.NATIONAL,
		'https://www.smh.com.au/rss/politics/federal.xml'
	),
	new SmhNews(
		CATEGORY.NATIONAL,
		'https://www.smh.com.au/rss/national/nsw.xml'
	),
	new TechRepublicNews(
		CATEGORY.TECHNOLOGY,
		'https://www.techrepublic.com/rssfeeds/articles/'
	),
	new CnetNews(CATEGORY.TECHNOLOGY, 'https://www.cnet.com/rss/all/'),
];

const limiter = new Bottleneck({
	maxConcurrent: 5,
	minTime: 100,
});

export function fetchNews(): Observable<NewsDto[]> {
	const subject = new Subject<NewsDto[]>();
	void Promise.all(
		newsSources.map((newSource) => {
			return limiter
				.schedule(() => newSource.extractFeeds())
				.then((news) => {
					subject.next(news);
				});
		})
	).then(() => subject.complete());
	return subject;
}
