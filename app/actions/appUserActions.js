import fetch from 'isomorphic-fetch';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';

import { createAction } from 'redux-actions';

function convertImgToBase64URL(url, callback, outputFormat){
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'), dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
    canvas = null;
  };
  img.src = url;
}

export const loggingIn = createAction('LOGGING_IN');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const appUserInitialDataUpdateDone = createAction('APP_USER_INITIAL_DATA_UPDATE_DONE');
export const loginFailed = createAction('LOGIN_FAILED');

export const refreshAccessToken = createAction('REFRESH_ACCESS_TOKEN');
export const accessTokenRefreshed = createAction('ACCESS_TOKEN_REFRESHED');

export const doLogin = userCredentials => dispatch => {
  dispatch(loggingIn());

  let scopeString = 'public%20email%20account%20identity%20info%20write%20notifications%20notifications:send%20api%20api:write%20offline_access';

  return fetch(`${colorgyAPI.baseURL}/oauth/token?scope=${scopeString}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'password',
      username: userCredentials.username,
      password: userCredentials.password
    })
  })
    .then(req => req.json())
    .then(json => {
      if (json.access_token) {
        dispatch(loginSuccess(json));
        dispatch(syncAppUserData(true));
      } else {
        dispatch(loginFailed(json));
      }
    })
    .catch(reason => {
      dispatch(loginFailed(reason));
    });
};

export const updateAppUserData = createAction('UPDATE_APP_USER_DATA');

export const syncAppUserData = (initial = false) => dispatch => {
  colorgyAPI.request({'url': '/me'}).then( response => {
    dispatch(updateAppUserData(response.body));
    dispatch(downloadAppUserImage({ url: response.body.avatar_url, name: 'avatar' }));
    dispatch(downloadAppUserImage({ url: response.body.cover_photo_blur_url, name: 'coverPhoto' }));
    dispatch(appUserInitialDataUpdateDone());
  });
};

export const saveAppUserImage = createAction('SAVE_APP_USER_IMAGE');

export const downloadAppUserImage = payload => dispatch => {
  convertImgToBase64URL(payload.url, (base64Image) => {
    dispatch(saveAppUserImage({ name: payload.name, image: base64Image }));
  })
}

export const doLogout = payload => dispatch => {
  dispatch(logout());
  courseDatabase.reset();
}

export const logout = createAction('LOGOUT');
