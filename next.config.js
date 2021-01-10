// next.config.js
require('dotenv').config();

const withCSS = require('@zeit/next-css');
module.exports = withCSS({
	env: {
		MONGODB_URI: process.env.MONGODB_URI,
		ACCESS_KEY: process.env.ACCESS_KEY,
		SECRET_KEY: process.env.SECRET_KEY,
		REGION: process.env.REGION,
		BUCKET_NAME: process.env.BUCKET_NAME,
		AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
		AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
		AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
		SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
	},
});
