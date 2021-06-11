import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';
import { NewsDto } from '@vdtn359/news-models';
import {
	TrackingService,
	TrackingType,
} from 'src/utils/tracking/tracking.service';
import { logEvent } from 'src/utils/tracking/analytics';

export type NewsSearchDto = NewsDto & { score: number; sort: any[] };

@Service()
export class NewsService {
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService,
		@Inject(() => TrackingService)
		private readonly trackingService: TrackingService
	) {}

	get(slug: string, params) {
		return this.apiService
			.api()
			.get(`/news/${slug}`, {
				params,
			})
			.then(({ data }) => data)
			.catch((e) => {
				if (e.response?.status === 404) {
					return null;
				}
				throw e;
			});
	}

	suggestSimilar(id: string): Promise<NewsDto[]> {
		return this.apiService
			.api()
			.get(`/news/suggest/${id}`)
			.then(({ data }) => data)
			.catch(() => []);
	}

	fetchNews(
		filter: { searchAfter?: any[]; categories?: string[] } = {}
	): Promise<NewsSearchDto[]> {
		return this.apiService
			.api()
			.get('/news', {
				params: {
					categories: filter.categories,
					searchAfter: filter.searchAfter
						? JSON.stringify(filter.searchAfter)
						: undefined,
				},
			})
			.then(({ data }) => data);
	}

	searchNews(
		filter: {
			search?: string;
			size?: number;
			inline?: boolean;
			categories?: string[];
			searchAfter?: any[];
		} = {}
	): Promise<{
		items: NewsSearchDto[];
		suggestions: string[];
		terms: string[];
		total: number;
	}> {
		return this.apiService
			.api()
			.get('/search', {
				params: {
					categories: filter.categories,
					size: filter.size,
					inline: filter.inline,
					searchAfter: filter.searchAfter
						? JSON.stringify(filter.searchAfter)
						: undefined,
					search: filter.search,
				},
			})
			.then(({ data }) => data);
	}

	fetchCategories() {
		return this.apiService
			.api()
			.get('/categories')
			.then(({ data }) => data);
	}

	fetchHotTerms() {
		return this.apiService
			.api()
			.get('/hot-terms')
			.then(({ data }) => data);
	}

	fetchHotNews() {
		return this.apiService
			.api()
			.get('/hot-news')
			.then(({ data }) => data);
	}

	fetchRecommendation({ size = 5 } = {}) {
		return this.apiService
			.api()
			.get('/recommendation', {
				params: { size },
			})
			.then(({ data }) => data);
	}

	rating({ id, rating, oldRating }) {
		if (rating >= 3.5) {
			this.trackingService.track({
				id,
			});
		} else if (rating <= 2) {
			void this.trackingService.track({
				id,
				type: TrackingType.UNLIKEID,
			});
		}
		logEvent({
			value: rating,
			category: 'news',
			action: 'rating',
			label: id,
		});
		return this.apiService
			.api()
			.post('/rating', {
				id,
				rating,
				oldRating,
			})
			.then(({ data }) => data);
	}

	async addComment({ newsId, content }: { newsId: string; content: string }) {
		return this.apiService
			.api()
			.post('/comments', {
				newsId,
				content,
			})
			.then(({ data }) => data);
	}

	async getComments(newsId: string) {
		return this.apiService
			.api()
			.get('/comments', {
				params: {
					newsId,
				},
			})
			.then(({ data }) => data);
	}

	deleteComment(commentId: string) {
		return this.apiService
			.api()
			.delete(`/comments/${commentId}`)
			.then(({ data }) => data);
	}
}
