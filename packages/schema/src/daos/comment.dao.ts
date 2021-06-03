import { CommentInputDto } from '@vdtn359/news-models';
import { COMMENTS_COLLECTION, DB } from 'src/db';
import { BaseDao } from 'src/daos/base-dao.interface';

export class CommentDao extends BaseDao<CommentInputDto> {
	constructor(db: DB) {
		super(COMMENTS_COLLECTION, db);
	}
}
