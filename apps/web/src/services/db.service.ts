import 'reflect-metadata';
import { Service } from 'typedi';
import { config } from 'src/setup';
import { connectDB, DB } from '@vdtn359/news-schema';

@Service()
export class DbService {
	private readonly db: DB;
	constructor() {
		this.db = connectDB({
			clientEmail: config.db.clientEmail,
			privateKey: config.db.privateKey,
			projectId: config.db.projectId,
		});
	}

	getDB() {
		return this.db;
	}
}
