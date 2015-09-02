import ClientOAuth2 from 'client-oauth2';
import colorgyAPI from './colorgyAPI';

const baseURL = 'https://colorgy.io';

var colorgyOAuth2 = new ClientOAuth2({
  clientId: null,
  clientSecret: null,
  accessTokenUri: `${baseURL}/oauth/token`,
  authorizationUri: `${baseURL}/oauth/authorize`,
  authorizationGrants: ['credentials'],
  scopes: ['public', 'email', 'account', 'identity', 'info', 'write', 'notifications', 'notifications:send', 'api', 'api:write', 'offline_access']
})

colorgyOAuth2.baseURL = baseURL;

if (window) window.colorgyOAuth2 = colorgyOAuth2;

export default colorgyOAuth2;
