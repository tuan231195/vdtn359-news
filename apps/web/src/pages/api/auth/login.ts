import { NextApiRequest, NextApiResponse } from 'next';
import { getHandler } from 'src/api/handler';
import auth0 from 'src/auth/config';

const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	await auth0.handleLogin(req, res);
}
