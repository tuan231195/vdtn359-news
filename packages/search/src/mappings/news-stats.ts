export const mappings = {
	properties: {
		id: { type: 'keyword' },
		term: {
			type: 'text',
			store: true,
			analyzer: 'fulltext',
			fielddata: true,
		},
		action: {
			type: 'keyword',
			index: false,
		},
		time: { type: 'date' },
	},
};
