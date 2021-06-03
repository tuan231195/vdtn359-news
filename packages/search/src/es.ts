import { Client } from '@elastic/elasticsearch';
import { flatMap } from 'lodash';
import { subDays } from 'date-fns';
import { NEWS_INDEX } from 'src/setup';

export type Elasticsearch = ElasticsearchWrapper & Client;
export class ElasticsearchWrapper {
	constructor(private readonly client: Client) {}

	async createIndex(index: string, body) {
		try {
			await this.client.indices.create({
				index,
				body,
			});
		} catch (e) {
			if (e.message !== 'resource_already_exists_exception') {
				throw e;
			}
		}
	}

	async hasIndex(index: string) {
		const { body: exists } = await this.client.indices.exists({
			index,
		});
		return exists;
	}

	async hasDocument(index: string, documentId: string) {
		const { body: exists } = await this.client.exists({
			index,
			id: documentId,
		});
		return exists;
	}

	async bulkSync(index: string, documents) {
		return this.client.bulk({
			body: flatMap(
				documents.map((document) => {
					const indexType = document.indexType;
					delete document.indexType;
					if (indexType === 'index') {
						return [
							{
								create: { _index: index, _id: document.id },
							},
							document,
						];
					} else {
						return [
							{
								update: { _index: index, _id: document.id },
							},
							// eslint-disable-next-line @typescript-eslint/camelcase
							{ doc: document, doc_as_upsert: true },
						];
					}
				})
			),
		});
	}
	async removeOldDocs(index: string, dateField: string) {
		const result = await this.client.deleteByQuery({
			index,
			body: {
				query: {
					range: {
						[dateField]: {
							lt: subDays(new Date(), 7),
						},
					},
				},
			},
		});
		return result.body.deleted;
	}

	async existsDocument(index: string, id: string) {
		const { body } = await this.client.exists({
			index,
			id,
		});

		return body;
	}
}
