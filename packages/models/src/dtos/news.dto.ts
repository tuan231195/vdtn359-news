export enum CATEGORY {
	SPORT = 'SPORT',
	NATIONAL = 'NATIONAL',
	WORLD = 'WORLD',
	LIFESTYLE = 'LIFESTYLE',
	TRAVEL = 'TRAVEL',
	ENTERTAINMENT = 'ENTERTAINMENT',
	TECHNOLOGY = 'TECHNOLOGY',
	BUSINESS = 'BUSINESS',
}
export class NewsDto {
	id: string;
	category: CATEGORY;
	numViews?: number;
	numComments?: number;
	ratings?: number;
	url: string;
	slug: string;
	image?: string;
	title: string;
	pubDate: Date;
	description: string;
	feed?: string;
	body?: string;
}

export function getSlug(url) {
	const parsedUrl = new URL(url);
	return parsedUrl.pathname.substr(1).replace(/\/$/, '').replace(/\//g, '-');
}
