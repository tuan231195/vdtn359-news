import ReactGA from 'react-ga';
import { isDevelopment } from 'src/utils/env';

export const initGA = () => {
	// eslint-disable-next-line no-console
	console.info('Tracking initialized');
	ReactGA.initialize('UA-129291894-3', {
		debug: isDevelopment(),
	});
};
export const logPageView = () => {
	ReactGA.set({ page: window.location.pathname });
	ReactGA.pageview(window.location.pathname);
};
export const logEvent = ({
	category = '',
	action = '',
	label,
	value = undefined,
}) => {
	if (category && action) {
		ReactGA.event({ category, action, label, value });
	}
};
export const logException = (description = '', fatal = false) => {
	if (description) {
		ReactGA.exception({ description, fatal });
	}
};
