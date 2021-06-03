import { CnetNews, getRawText } from 'src/news';

describe.skip('#extractNews', () => {
	it('should strip style and css and data attributes', async () => {
		expect(
			await CnetNews.extractUrl(
				'https://www.cnet.com/news/every-livestream-concerts-coronavirus-shutdown'
			)
		).toMatchSnapshot();
	});
});
