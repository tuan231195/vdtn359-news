import createError from 'http-errors';

export async function authenticated(req, res, next) {
	if (!req.user) {
		throw new createError.Unauthorized('Not authorised');
	}
	next();
}
