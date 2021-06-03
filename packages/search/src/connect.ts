import { Client, ClientOptions } from '@elastic/elasticsearch';
import { Elasticsearch, ElasticsearchWrapper } from 'src/es';
import { proxy } from '@vdtn359/news-utils';

export function connectToEs(options: ClientOptions): Elasticsearch {
	const client = new Client(options);
	const es = new ElasticsearchWrapper(client);
	return proxy.wrap(es, client);
}

export function connectToEsUsingConfig(config) {
	return connectToEs({
		node: config.get('es.host'),
		auth: {
			username: config.get('es.username'),
			password: config.get('es.password'),
		},
	});
}
