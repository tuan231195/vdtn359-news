import { getRawText } from 'src/news/utils';
import { TechRepublicNews } from 'src/news';

describe.skip('#extractNews', () => {
	it('should strip style and css and data attributes', async () => {
		expect(
			await TechRepublicNews.extractUrl(
				'https://www.techrepublic.com/article/pandemic-could-shift-tech-support-industry-to-telecommuting/#ftag=RSS56d97e7'
			)
		).toMatchSnapshot();
	});
});
