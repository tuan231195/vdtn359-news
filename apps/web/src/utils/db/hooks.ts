import { useContainer } from 'src/utils/container/context';
import { IDBPDatabase } from 'idb';
import { useState, useEffect } from 'react';
import { NewsDB } from 'src/utils/db/store';

export function useDb<T = NewsDB>(): Promise<IDBPDatabase<T>> {
	const container = useContainer();
	return container.has('db') ? container.get('db') : null;
}

export function useQuery<T = NewsDB>(
	queryFn: (db: IDBPDatabase<T>) => any,
	dependencies = []
) {
	const [result, setResult] = useState(null);
	const dbPromise = useDb<T>();
	useEffect(() => {
		void (async () => {
			const db = await dbPromise;
			setResult(await queryFn(db));
		})();
	}, [dependencies]);
	return result;
}
