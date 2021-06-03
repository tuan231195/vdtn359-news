/* eslint-disable @typescript-eslint/camelcase */
import { Elasticsearch } from 'src/es';
import { mappings as newsMappings } from 'src/mappings/news';
import { mappings as newsStatsMappings } from 'src/mappings/news-stats';
import { analysis } from 'src/analyser';

export const NEWS_INDEX = 'news';
export const NEWS_STAT_INDEX = 'news_stats';

export async function setup(elasticsearch: Elasticsearch) {
	await Promise.all([
		setupNewsIndex(elasticsearch),
		setupNewsStatIndex(elasticsearch),
	]);
}

async function setupNewsIndex(elasticsearch: Elasticsearch) {
	if (!(await elasticsearch.hasIndex(NEWS_INDEX))) {
		await elasticsearch.createIndex(NEWS_INDEX, {
			settings: {
				analysis: analysis,
			},
			mappings: newsMappings,
		});
	} else {
		await elasticsearch.indices.putMapping({
			index: NEWS_INDEX,
			body: newsMappings,
		});
	}
}

async function setupNewsStatIndex(elasticsearch: Elasticsearch) {
	if (!(await elasticsearch.hasIndex(NEWS_STAT_INDEX))) {
		await elasticsearch.createIndex(NEWS_STAT_INDEX, {
			settings: {
				analysis: analysis,
			},
			mappings: newsStatsMappings,
		});
	} else {
		await elasticsearch.indices.putMapping({
			index: NEWS_STAT_INDEX,
			body: newsStatsMappings,
		});
	}
}
