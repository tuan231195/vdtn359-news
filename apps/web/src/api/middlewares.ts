import { logger } from 'src/setup';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

const logStream = {
	write: function (message) {
		logger.info(message);
	},
};

export const loggingMiddleware: any = morgan(
	function (tokens, req, res) {
		return [
			'',
			`Method: ${tokens.method(req, res)}`,
			`URL: ${tokens.url(req, res)}`,
			`Status: ${tokens.status(req, res)}`,
			`Content-Length: ${tokens.res(req, res, 'content-length')}`,
			`Response-Time: ${tokens['response-time'](req, res)} ms`,
			`IP: ${tokens['remote-addr'](req, res)}`,
			`User-Agent: ${tokens['user-agent'](req, res)}`,
		].join('\n');
	},
	{
		skip: function (req, res) {
			if (process.env.HTTP_DEBUG) {
				return false;
			}
			return res.statusCode < 400;
		},
		stream: logStream,
	}
);

export const helmetMiddleware = helmet();
export const corsMiddleware = cors();
