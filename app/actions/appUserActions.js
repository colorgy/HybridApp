import fetch from 'isomorphic-fetch';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';
import tableDatabase from '../databases/tableDatabase';
import organizationDatabase from '../databases/organizationDatabase';

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

export const initialize = createAction('APP_USER_INITIALIZE');

export const loggingIn = createAction('LOGGING_IN');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const appUserInitialDataUpdateDone = createAction('APP_USER_INITIAL_DATA_UPDATE_DONE');
export const appUserOrganizationDataMissing = createAction('APP_USER_ORGANIZATION_DATA_MISSING');
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
      dispatch(loginFailed({ error: 'request_error' }));
    });
};

export const updateAppUserData = createAction('UPDATE_APP_USER_DATA');

export const syncAppUserData = (initial = false) => dispatch => {
  colorgyAPI.request({'url': '/me'}).then( response => {
    dispatch(updateAppUserData(response.body));
    dispatch(downloadAppUserImage({ url: response.body.avatar_url, name: 'avatar' }));
    dispatch(downloadAppUserImage({ url: response.body.cover_photo_blur_url, name: 'coverPhoto' }));
    if (initial) {
      if (response.body.possible_organization_code) {
        dispatch(appUserInitialDataUpdateDone());
      } else {
        dispatch(doAppUserOrganizationDataMissing());
      }
    }
    if (window.analytics) analytics.setUserId(response.body.id);
    if (window.ga) ga('set', '&uid', response.body.id);
  })
    .catch( reason => {
      console.error(reason);
      if (initial) dispatch(loginFailed({ error: 'request_error' }));
    });
};

export const organizationsLoad = createAction('APP_USER_LOGIN_ORGANIZATIONS_LOAD');

export const doAppUserOrganizationDataMissing = () => dispatch => {
  organizationDatabase.getOrganizations().then( organizations => {
    dispatch(organizationsLoad(organizations));
    dispatch(appUserOrganizationDataMissing());

  }).catch( reason => {
    console.error(reason);
    dispatch(loginFailed({ error: 'request_error' }));
  });
};

export const departmentsLoad = createAction('APP_USER_LOGIN_DEPARTMENTS_LOAD');

export const doLoadDepartments = (orgCode) => dispatch => {
  organizationDatabase.getDepartments(orgCode).then( departments => {
    dispatch(departmentsLoad(departments));

  }).catch( reason => {
    console.error(reason);
    dispatch(loginFailed({ error: 'request_error' }));
  });
};

export const setOrganization = createAction('APP_USER_LOGIN_SET_ORGANIZATION');

export const doSetOrganization = (data) => dispatch => {
  var { orgCode, depCode, year } = data;

  var sendData = { unconfirmed_organization_code: orgCode, unconfirmed_department_code: depCode, unconfirmed_started_year: year };
  colorgyAPI.request({ method: 'PATCH', url: '/me', json: true, body: { user: sendData } });

  dispatch(setOrganization(data));
  dispatch(appUserInitialDataUpdateDone());
};

export const saveAppUserImage = createAction('SAVE_APP_USER_IMAGE');

export const downloadAppUserImage = payload => dispatch => {
  convertImgToBase64URL(payload.url, (base64Image) => {
    dispatch(saveAppUserImage({ name: payload.name, image: base64Image }));
  });
};

export const doLogout = payload => dispatch => {
  dispatch(logout());
  courseDatabase.reset();
  tableDatabase.reset();
  if (window.analytics) analytics.setUserId(null);
  if (window.ga) ga('set', '&uid', null);
};

export const logout = createAction('LOGOUT');
