import { getRawText } from 'src/news/utils';
import { SmhNews } from 'src/news';

describe.skip('#extractNews', () => {
	it('should strip style and css and data attributes', async () => {
		expect(
			await SmhNews.extractUrl(
				'https://www.smh.com.au/national/queensland/queensland-election-updates-live-latest-on-the-council-election-and-byelections-20200328-p54eul.html'
			)
		).toMatchSnapshot();
	});
});
