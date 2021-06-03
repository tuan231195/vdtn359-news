/* eslint-disable @typescript-eslint/camelcase */
export const analysis = {
	analyzer: {
		html: {
			type: 'custom',
			char_filter: ['html_strip'],
			filter: ['lowercase', 'stop'],
			tokenizer: 'standard',
		},
		fulltext: {
			type: 'custom',
			tokenizer: 'standard',
			filter: ['lowercase', 'stop'],
		},
		trigram: {
			type: 'custom',
			tokenizer: 'standard',
			filter: ['lowercase', 'shingle'],
		},
		reverse: {
			type: 'custom',
			tokenizer: 'standard',
			filter: ['lowercase', 'reverse'],
		},
	},
	filter: {
		shingle: {
			type: 'shingle',
			min_shingle_size: 2,
			max_shingle_size: 3,
		},
	},
};
