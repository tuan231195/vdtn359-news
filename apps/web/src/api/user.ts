import { NextApiRequest, NextApiResponse } from 'next';
import auth0 from 'src/auth/config';

export async function user(req: NextApiRequest, res: NextApiResponse, next) {
	const session = await auth0.getSession(req);
	(req as any).user = session?.user;
	if (session?.user) {
		await auth0.touch(req, res);
	}
	next();
}
