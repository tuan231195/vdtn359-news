export enum ACTION_TYPE {
	SEARCH = 'search',
	RATE = 'rate',
	VIEW = 'view',
	COMMENT = 'comment',
	DELETE_COMMENT = 'delete_comment',
}

export class NewsStatDto {
	type: ACTION_TYPE;
	docIds: string[];
	time: Date;
	meta?: {
		term?: string;
		rating?: number;
		oldRating?: number;
	} = {};
}
