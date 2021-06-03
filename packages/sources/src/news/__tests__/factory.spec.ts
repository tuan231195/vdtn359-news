import { getRawText } from 'src/news/utils';
import { extractUrl } from 'src/news/factory';

describe.skip('#extractUrl', () => {
	it('parse news urls correctly', async () => {
		const news = getRawText(
			await extractUrl(
				'https://www.news.com.au/travel/travel-advice/coronavirus-in-australia-mandatory-quarantine-in-hotels-for-anyone-returning-from-overseas/news-story/353e68837a888122a223d53bb2e4cf03'
			)
		);
		expect(news).toMatchSnapshot();
	});
});
