import { CATEGORY } from '@vdtn359/news-models';
import { SemanticICONS } from 'semantic-ui-react';

export const categoryMap = new Map<
	CATEGORY,
	{ icon: SemanticICONS; url: string }
>([
	[CATEGORY.TECHNOLOGY, { icon: 'computer', url: '/categories/technology' }],
	[CATEGORY.SPORT, { icon: 'soccer', url: '/categories/sport' }],
	[CATEGORY.NATIONAL, { icon: 'flag', url: '/categories/national' }],
	[CATEGORY.WORLD, { icon: 'world', url: '/categories/world' }],
	[
		CATEGORY.LIFESTYLE,
		{ icon: 'clock outline', url: '/categories/lifestyle' },
	],
	[CATEGORY.TRAVEL, { icon: 'travel', url: '/categories/travel' }],
	[
		CATEGORY.ENTERTAINMENT,
		{ icon: 'game', url: '/categories/entertainment' },
	],
	[
		CATEGORY.BUSINESS,
		{ icon: 'handshake outline', url: '/categories/business' },
	],
]);

export function filterCategories(categories) {
	return categories
		.map((category) => category.toUpperCase())
		.filter((category) => categoryMap.has(category));
}

export function isValidCategory(category) {
	return categoryMap.has(category.toUpperCase());
}
