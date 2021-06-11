import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import * as Sentry from '@sentry/browser';
import { isDevelopment } from 'src/utils/env';

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_CONFIG_ENV,
	release: process.env.SENTRY_RELEASE,
	beforeSend(event) {
		if (isDevelopment()) {
			return null;
		}
		return event;
	},
});

if (!isDevelopment()) {
	LogRocket.init('vdtn359/vdtn359-news');
	setupLogRocketReact(LogRocket);

	LogRocket.getSessionURL((sessionURL) => {
		Sentry.configureScope((scope) => {
			scope.setExtra('sessionURL', sessionURL);
		});
	});
}

export { Sentry, LogRocket };
