import { DBSchema, openDB } from 'idb';

export interface NewsDB extends DBSchema {
	ratings: {
		value: {
			id: string;
			rating: number;
			time: Date;
		};
		key: string;
	};
	likes: {
		value: {
			id: string;
			time: Date;
		};
		key: string;
	};
}

export async function initDB() {
	return openDB<NewsDB>('new-db', 1, {
		upgrade(db) {
			db.createObjectStore('ratings', {
				keyPath: 'id',
			});

			db.createObjectStore('likes', {
				keyPath: 'id',
			});
		},
	});
}
