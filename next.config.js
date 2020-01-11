// next.config.js
require("dotenv").config();

const withCSS = require("@zeit/next-css");
module.exports = withCSS({
	env: {
		MONGODB_URI: process.env.MONGODB_URI
	}
});
