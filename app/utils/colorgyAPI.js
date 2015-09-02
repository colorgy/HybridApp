import fetch from 'isomorphic-fetch';
import async from 'async';
import colorgyOAuth2 from './colorgyOAuth2';
import store from '../store';
import { refreshAccessToken, accessTokenRefreshed, logout } from '../actions/appUserActions';

const baseURL = colorgyOAuth2.baseURL;

function getAccessToken() {
  var appUser = store.getState().appUser;
  var accessToken = appUser && appUser.accessToken && colorgyOAuth2.createToken(appUser.accessToken);
  return accessToken;
}

// get the access token (and automatically refresh if expired), returns an promise
function requestAccessToken() {
  return new Promise( (resolve, reject) => {
    var appUser = store.getState().appUser;
    var accessToken = appUser && appUser.accessToken && colorgyOAuth2.createToken(appUser.accessToken);

    // fail if there isn't an access token
    if (!accessToken) {
      console.error('colorgyAPI.requestAccessToken: Error: cannot find access token.');
      reject();

    // if the access token is going to expire
    } else if (parseInt((accessToken.expires.getTime() - (new Date()).getTime()) / 1000) < 60) {
      console.log('colorgyAPI.requestAccessToken: Access token expired, refreshing...');
      store.dispatch(refreshAccessToken());

      accessToken.refresh().then( token => {
        store.dispatch(accessTokenRefreshed({
          access_token: token.accessToken,
          token_type: token.tokenType,
          expires_in: parseInt((token.expires.getTime() - (new Date).getTime())/1000) - 10,
          refresh_token: token.refreshToken,
          scope: null,
          created_at: null
        }));
        resolve(accessToken);
      }).catch( e => {
        console.error('colorgyAPI.requestAccessToken: Error: Access token refreshing faild.', e);
        appUser = store.getState().appUser;
        accessToken = appUser && appUser.accessToken && colorgyOAuth2.createToken(appUser.accessToken);
        resolve(accessToken);
      });

    // or just return the token
    } else {
      resolve(accessToken);
    }
  });
}

function colorgyRequest(request) {
  if (request.url) {
    if (!request.url.match(/^http/)) {
      request.url = `${baseURL}/api/v1${request.url}`
    }
  }

  var getAccessToken = requestAccessToken();
  var sendRequest = getAccessToken.then( (accessToken) => accessToken.request(request) );
  return sendRequest;
}

var colorgyAPI = {
  baseURL: baseURL,
  request: colorgyRequest,
  getAccessToken: getAccessToken,
  requestAccessToken: requestAccessToken
};

if (window) window.colorgyAPI = colorgyAPI;

export default colorgyAPI;
