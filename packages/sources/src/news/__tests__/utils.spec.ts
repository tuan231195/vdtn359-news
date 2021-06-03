import { getCleanedHTML, getRawText, getThumbnailUrl } from 'src/news/utils';
import { AuNews, TechRepublicNews } from 'src/news';

describe('#getCleanedHtml', () => {
	it('should strip style and css', () => {
		expect(
			getCleanedHTML(
				'<div class="test" style="align-content: center">Hello</div>'
			)
		).toEqual('<div>Hello</div>');
	});

	it('should strip data attributes', () => {
		expect(getCleanedHTML('<div data-test="test">Hello</div>')).toEqual(
			'<div>Hello</div>'
		);
	});
});

describe('#getThumbnailUrl', () => {
	it('should return the first image', async () => {
		expect(
			getThumbnailUrl(
				`<p><img src="http://image1"/><p/><img src="http://image2"/></p>`
			)
		).toEqual('http://image1');
	});
});

describe('#getRawText', () => {
	it('should return raw text', async () => {
		const source = '<div><div>Text</div><p>Hello</p></div>';
		expect(getRawText(source)).toEqual('Text\n' + 'Hello');
	});

	it.skip('should process long text', async () => {
		const source = await AuNews.extractUrl(
			'https://www.news.com.au/travel/travel-advice/coronavirus-in-australia-mandatory-quarantine-in-hotels-for-anyone-returning-from-overseas/news-story/353e68837a888122a223d53bb2e4cf03'
		);
		expect(getRawText(source)).toMatchSnapshot();
	});
});
