import { chunk } from 'lodash';

export function batch<T>(items: T[], batchSize: number) {
	const batches = chunk(items, batchSize);
	return async (processor: (batch: T[], batchIndex: number) => void) => {
		let count = 0;
		for (const batch of batches) {
			await processor(batch, count++);
		}
	};
}
