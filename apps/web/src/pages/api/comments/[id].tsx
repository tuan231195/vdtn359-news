import { NextApiResponse } from 'next';
import { Container } from 'typedi';
import createError from 'http-errors';
import { ApiRequest, getHandler } from 'src/api/handler';
import { CommentService } from 'src/services/news/comment.service';
import { authenticated } from 'src/api/authenticated';
import { stringQuery } from 'src/api/parse';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';
import { redis } from 'src/setup';

const handler = getHandler();
handler.use(authenticated);
handler.delete(deleteRequest);

export default handler;

async function deleteRequest(req: ApiRequest, res: NextApiResponse) {
    const id = stringQuery(req.query.id);
    if (!id) {
        throw new createError.BadRequest('Comment id is required');
    }
    const commentService = Container.get(CommentService);
    const comment = await commentService.get(id);
    if (!comment) {
        throw new createError.NotFound('Comment not found');
    }
    await commentService.deleteComment(id);
    const indexDoc: NewsStatDto = {
        docIds: [comment.newsId],
        time: new Date(),
        type: ACTION_TYPE.DELETE_COMMENT,
    };
    redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
    res.json({ message: 'ok' });
}
