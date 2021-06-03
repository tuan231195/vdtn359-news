import { getRawText } from 'src/news/utils';
import { AuNews } from 'src/news';

describe.skip('#extractNews', () => {
	it('should strip style and css and data attributes', async () => {
		expect(
			await AuNews.extractUrl(
				'https://www.news.com.au/travel/travel-advice/coronavirus-in-australia-mandatory-quarantine-in-hotels-for-anyone-returning-from-overseas/news-story/353e68837a888122a223d53bb2e4cf03'
			)
		).toMatchSnapshot();
	});
});
