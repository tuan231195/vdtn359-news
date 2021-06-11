import { es, logger, redis } from 'src/setup';
import { bufferTime } from 'rxjs/operators';
import { NEWS_STATS_GROUP, NEWS_STATS_STREAM } from '@vdtn359/news-schema';
import { NEWS_INDEX, NEWS_STAT_INDEX } from '@vdtn359/news-search';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';
import { worker as w } from '@vdtn359/news-core';

export async function processStream(consumer) {
	redis
		.readStream({
			group: NEWS_STATS_GROUP,
			stream: NEWS_STATS_STREAM,
			consumer,
		})
		.pipe(bufferTime(100, null, 100))
		.subscribe(esSync);
}

async function esSync(newsStats = []) {
	if (!newsStats?.length) {
		return;
	}
	const bulk = [];
	for (const newsStatPayload of newsStats) {
		const newsStat: NewsStatDto = JSON.parse(newsStatPayload.data.payload);
		switch (newsStat.type) {
			case ACTION_TYPE.VIEW: {
				const arr = indexView(newsStat);
				bulk.push(...arr);
				break;
			}
			case ACTION_TYPE.SEARCH: {
				const arr = indexSearch(newsStat);
				bulk.push(...arr);
				break;
			}
			case ACTION_TYPE.RATE: {
				const arr = indexRating(newsStat);
				bulk.push(...arr);
				break;
			}
			case ACTION_TYPE.COMMENT: {
				const arr = indexComment(newsStat);
				bulk.push(...arr);
				break;
			}
			case ACTION_TYPE.DELETE_COMMENT: {
				const arr = indexDeleteComment(newsStat);
				bulk.push(...arr);
				break;
			}
		}
	}
	logger.debug('Messages: ', { messages: newsStats });
	try {
		await es.bulk({
			body: bulk,
		});
	} catch (e) {
		w.error(logger, 'Failed to index', e);
	}
}

function indexView(newsStat: NewsStatDto) {
	const returnArr = [];

	returnArr.push({
		create: {
			_index: NEWS_STAT_INDEX,
		},
	});
	returnArr.push({
		id: newsStat.docIds[0],
		time: newsStat.time,
		type: newsStat.type,
	});
	returnArr.push({
		update: {
			_index: NEWS_INDEX,
			_id: newsStat.docIds[0],
		},
	});
	returnArr.push({
		script: {
			inline: `ctx._source.numViews++`,
			lang: 'painless',
		},
	});

	return returnArr;
}

function indexComment(newsStat: NewsStatDto) {
	const returnArr = [];

	returnArr.push({
		create: {
			_index: NEWS_STAT_INDEX,
		},
	});
	returnArr.push({
		id: newsStat.docIds[0],
		time: newsStat.time,
		type: newsStat.type,
	});
	returnArr.push({
		update: {
			_index: NEWS_INDEX,
			_id: newsStat.docIds[0],
		},
	});
	returnArr.push({
		script: {
			inline: `
	if (ctx._source.numComments == null) {
		ctx._source.numComments = 0;
	}
	ctx._source.numComments++;			
`,
			lang: 'painless',
		},
	});

	return returnArr;
}

function indexDeleteComment(newsStat: NewsStatDto) {
	const returnArr = [];

	returnArr.push({
		update: {
			_index: NEWS_INDEX,
			_id: newsStat.docIds[0],
		},
	});
	returnArr.push({
		script: {
			inline: `
	if (ctx._source.numComments > 0) {
		ctx._source.numComments--;
	}			
`,
			lang: 'painless',
		},
	});

	return returnArr;
}

function indexSearch(newsStat: NewsStatDto) {
	const returnArr = [];

	for (const docId of newsStat.docIds) {
		returnArr.push({
			create: {
				_index: NEWS_STAT_INDEX,
			},
		});
		returnArr.push({
			id: docId,
			time: newsStat.time,
			term: newsStat.meta?.term,
			type: newsStat.type,
		});

		returnArr.push({
			update: {
				_index: NEWS_INDEX,
				_id: docId,
			},
		});
		returnArr.push({
			script: {
				inline: 'ctx._source.numSearches += 1',
				lang: 'painless',
			},
		});
	}

	return returnArr;
}

function indexRating(newsStat: NewsStatDto) {
	const returnArr = [];

	returnArr.push({
		create: {
			_index: NEWS_STAT_INDEX,
		},
	});
	returnArr.push({
		id: newsStat.docIds[0],
		time: newsStat.time,
		term: newsStat.meta?.term,
		type: newsStat.type,
	});

	returnArr.push({
		update: {
			_index: NEWS_INDEX,
			_id: newsStat.docIds[0],
		},
	});
	returnArr.push({
		script: {
			inline: `
				def newNumRatings = params.oldRating > 0 && ctx._source.numRatings > 0 ? ctx._source.numRatings : ctx._source.numRatings + 1;
				ctx._source.ratings = (ctx._source.ratings * ctx._source.numRatings - params.oldRating + params.rating) * 1.0 / newNumRatings; 
				ctx._source.numRatings = newNumRatings;
			`,
			lang: 'painless',
			params: {
				rating: newsStat.meta?.rating || 1,
				oldRating: newsStat.meta?.oldRating || 0,
			},
		},
	});

	return returnArr;
}

process.once('unhandledRejection', (e) => {
	w.error(logger, e);
});
