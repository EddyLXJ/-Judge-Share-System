interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'isWhWosh16Dn4lt3Cgn5ZA9xCLiIwrFR',
  domain: 'cs-503.auth0.com',
  callbackURL: 'http://localhost:3000'
};
