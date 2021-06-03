/* eslint-disable @typescript-eslint/camelcase */
export const mappings = {
	properties: {
		id: { type: 'keyword' },
		title: {
			type: 'text',
			analyzer: 'fulltext',
			fields: {
				trigram: {
					type: 'text',
					analyzer: 'trigram',
				},
				reverse: {
					type: 'text',
					analyzer: 'reverse',
				},
			},
		},
		description: {
			type: 'text',
			analyzer: 'fulltext',
		},
		body: {
			type: 'text',
			analyzer: 'html',
		},
		slug: {
			type: 'keyword',
		},
		category: {
			type: 'keyword',
		},
		image: {
			type: 'text',
			index: false,
		},
		pubDate: { type: 'date' },
		numViews: {
			type: 'integer',
		},
		numComments: {
			type: 'integer',
			null_value: 0,
		},
		numSearches: {
			type: 'integer',
			null_value: 0,
		},
		ratings: {
			type: 'float',
		},
		numRatings: {
			type: 'integer',
			null_value: 0,
		},
		feed: {
			type: 'keyword',
		},
		url: {
			type: 'text',
			index: false,
		},
	},
};
