import nextConnect from '@vdtn359/next-connect';
import { errorLogger } from 'src/api/logging';
import { NextApiRequest } from 'next';
import {
	corsMiddleware,
	helmetMiddleware,
	loggingMiddleware,
} from 'src/api/middlewares';
import { user } from 'src/api/user';

export function getHandler() {
	const handler = nextConnect({ onError: errorLogger });
	handler.use(helmetMiddleware);
	handler.use(corsMiddleware);
	handler.use(loggingMiddleware);
	handler.use(user);
	return handler;
}

export type ApiRequest = NextApiRequest & { user: any };
