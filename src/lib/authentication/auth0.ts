import { initAuth0 } from "@auth0/nextjs-auth0";

const getDomain = () => {
  if (process.env["STATIC_DOMAIN"]) {
    return "https://" + process.env["STATIC_DOMAIN"];
  }
  return "http://localhost:3000";
};

function getServerSetting(
  environmentVariable: string,
  defaultValue?: string
): string {
  if (typeof window === "undefined" && process.env[environmentVariable]) {
    return process.env[environmentVariable] as string;
  }

  return defaultValue ?? "";
}

export default initAuth0({
  clientId: getServerSetting("AUTH0_CLIENT_ID"),
  clientSecret: getServerSetting("AUTH0_CLIENT_SECRET"),
  scope:
    "openid profile email read:current_user update:current_user_metadata offline_access",
  domain: getServerSetting("AUTH0_DOMAIN"),
  redirectUri: getDomain() + "/api/callback",
  postLogoutRedirectUri: getDomain() + "/",
  audience: "https://nlp-basics.eu.auth0.com/api/v2/",
  session: {
    cookieSecret: getServerSetting("SESSION_COOKIE_SECRET"),
    cookieLifetime: 7200,
    storeIdToken: true,
    storeRefreshToken: true,
    storeAccessToken: true,
  },
});
