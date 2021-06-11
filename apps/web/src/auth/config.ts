import { config } from '../setup';
import { initAuth0 } from '@vdtn359/nextjs-auth0';

export const settings = {
	domain: config.auth.domain,
	clientId: config.auth.clientId,
	clientSecret: config.auth.clientSecret,
	scope: 'openid email profile',
	redirectUri: `${config.url}/api/auth/callback`,
	postLogoutRedirectUri: config.url,
	session: {
		cookieName: '_news_login',
		cookieSecret: config.auth.cookieSecret,
		cookieLifetime: 60 * 60 * 72,
		storeAccessToken: true,
		storeRefreshToken: true,
	},
	oidcClient: {
		httpTimeout: 2500,
		clockTolerance: 10000,
	},
};

export default initAuth0(settings);
