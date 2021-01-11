import { initAuth0 } from '@auth0/nextjs-auth0';

const getDomain = () => {
	if (process.env['STATIC_DOMAIN']) {
		return 'https://' + process.env['STATIC_DOMAIN'];
	}
	return 'http://localhost:3000';
};

function getServerSetting(environmentVariable: string, defaultValue?: string) {
	if (typeof window === 'undefined' && process.env[environmentVariable]) {
		return process.env[environmentVariable];
	}

	return defaultValue || '';
}

export default initAuth0({
	clientId: getServerSetting('AUTH0_CLIENT_ID'),
	clientSecret: getServerSetting('AUTH0_CLIENT_SECRET'),
	scope: 'openid profile email',
	domain: getServerSetting('AUTH0_DOMAIN'),
	redirectUri: getDomain() + '/api/callback',
	postLogoutRedirectUri: getDomain() + '/logout',
	session: {
		cookieSecret: getServerSetting('SESSION_COOKIE_SECRET'),
		cookieLifetime: 7200,
		storeIdToken: false,
		storeRefreshToken: false,
		storeAccessToken: false,
	},
});
