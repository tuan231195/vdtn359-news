import { AxiosError } from 'axios';
import { logException } from 'src/utils/tracking/analytics';

export function captureException({
	message = '',
	error,
}: {
	message?: string;
	error: Error;
}) {
	if (!error) {
		error = new Error('Unknown exception');
	}
	let meta = undefined;
	if (!message) {
		if ((error as any).response) {
			const axiosError: AxiosError = error as any;
			message = `Request with url ${axiosError.request.path} failed with error ${axiosError.response.status}`;
			meta = axiosError.response.data;
		} else {
			message = error.message;
			meta = error;
		}
	}

	if (typeof window !== 'undefined') {
		import('src/browser').then(({ Sentry, LogRocket }) => {
			Sentry.captureException(error);
			LogRocket.captureException(error);
			logException(error.message, true);
		});
	} else {
		import('src/setup').then(({ Sentry, logger }) => {
			Sentry.captureException(error);
			logger.error(message, meta);
		});
	}
}
