import fetch from 'isomorphic-fetch';
import async from 'async';
import colorgyOAuth2 from './colorgyOAuth2';
import store from '../store';
import { refreshAccessToken, accessTokenRefreshed, logout } from '../actions/appUserActions';

const baseURL = colorgyOAuth2.baseURL;
var colorgyAPI = {
  requestQueneLength: 0,
  accessTokenRefreshing: false
};

function getAccessToken() {
  var appUser = store.getState().appUser;
  var accessToken = appUser && appUser.accessToken && colorgyOAuth2.createToken(appUser.accessToken);
  return accessToken;
}

// get the access token (and automatically refresh if expired), returns an promise
function requestAccessToken(forceRefresh = false) {
  return new Promise( (resolve, reject) => {
    var appUser = store.getState().appUser;
    var accessToken = appUser && appUser.accessToken && colorgyOAuth2.createToken(appUser.accessToken);

    // fail if there isn't an access token
    if (!accessToken) {
      console.error('colorgyAPI.requestAccessToken: Error: cannot find access token.');
      reject();

    // if the access token is going to expire
    } else if ((forceRefresh || parseInt((accessToken.expires.getTime() - (new Date()).getTime()) / 1000) < 600 && colorgyAPI.requestQueneLength <= 1 || parseInt((accessToken.expires.getTime() - (new Date()).getTime()) / 1000) < 120) && !colorgyAPI.accessTokenRefreshing) {
      console.log('colorgyAPI.requestAccessToken: Access token expired, refreshing...');
      colorgyAPI.accessTokenRefreshing = true;
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
        colorgyAPI.accessTokenRefreshing = false;
        resolve(accessToken);
      }).catch( e => {
        console.error('colorgyAPI.requestAccessToken: Error: Access token refreshing faild.', e);
        colorgyAPI.accessTokenRefreshing = false;
        if (e.body && e.body.error == 'invalid_grant') {
          reject(e.body);
        } else {
          appUser = store.getState().appUser;
          accessToken = appUser && appUser.accessToken && colorgyOAuth2.createToken(appUser.accessToken);
          resolve(accessToken);
        }
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

  var sendRequest = requestAccessToken().then( (accessToken) => {
    colorgyAPI.requestQueneLength += 1;
    return accessToken.request(request);
  }).then( (respond) => {
    if (respond.status == 401) {
      console.warn('colorgyAPI.request: 401: retrying');
      return requestAccessToken().then(
        (accessToken) => accessToken.request(request)
      ).then( (respond) => {
        if (respond.status == 401) {
          console.warn('colorgyAPI.request: double 401: retrying with force access token refresh');
          return requestAccessToken(true).then( (accessToken) => {
            colorgyAPI.requestQueneLength -= 1;
            return accessToken.request(request);
          }, (error) => {
            colorgyAPI.requestQueneLength -= 1;
            console.error('Access Token Refresh Faild, Authentication Lost!');
          });
        } else {
          colorgyAPI.requestQueneLength -= 1;
          return respond;
        }
      });
    } else {
      colorgyAPI.requestQueneLength -= 1;
      return respond;
    }
  }).catch( (error) => {
    console.warn('colorgyAPI.request: retrying');
    return requestAccessToken().then( (accessToken) => {
      colorgyAPI.requestQueneLength -= 1;
      return accessToken.request(request);
    }, (error) => {
      colorgyAPI.requestQueneLength -= 1;
      console.error('Access Token Refresh Faild, Authentication Lost!');
    });
  }).catch( (error) => {
    colorgyAPI.requestQueneLength -= 1;
    throw error;
  });

  return sendRequest;
}

colorgyAPI = {
  ...colorgyAPI,
  baseURL: baseURL,
  request: colorgyRequest,
  getAccessToken: getAccessToken,
  requestAccessToken: requestAccessToken
};

if (window) window.colorgyAPI = colorgyAPI;

export default colorgyAPI;
