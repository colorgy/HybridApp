import { handleActions } from 'redux-actions';

var initialState = {
  loggingIn: false,
  organizationDataMissing: false
};

var defaultState = {
  ...initialState,
  isLogin: false
};

export default handleActions({

  APP_USER_INITIALIZE: (state, action) => {
    return {
      ...state,
      ...initialState
    };
  },

  LOGIN: (state, action) => {
    return {
      loggingIn: true
    };
  },

  LOGGING_IN: (state, action) => {
    return {
      ...state,
      loggingIn: true,
      errorCode: null
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    return {
      isLogin: false,  // this should be set to true only until APP_USER_INITIAL_DATA_UPDATE_DONE
      loggingIn: true,
      accessToken: action.payload
    };
  },

  APP_USER_INITIAL_DATA_UPDATE_DONE: (state, action) => {
    return {
      ...state,
      isLogin: true,
      loggingIn: false
    };
  },

  APP_USER_ORGANIZATION_DATA_MISSING: (state, action) => {
    return {
      ...state,
      organizationDataMissing: true
    };
  },

  APP_USER_LOGIN_ORGANIZATIONS_LOAD: (state, action) => {
    return {
      ...state,
      loginOrganizations: action.payload
    };
  },

  APP_USER_LOGIN_DEPARTMENTS_LOAD: (state, action) => {
    return {
      ...state,
      loginDepartments: action.payload
    };
  },

  APP_USER_LOGIN_SET_ORGANIZATION: (state, action) => {
    var { orgCode, depCode, year } = action.payload;

    return {
      ...state,
      possible_organization_code: orgCode,
      possible_department_code: depCode,
      possible_started_year: year,
      organizationDataMissing: false
    };
  },

  LOGIN_FAILED: (state, action) => {
    return {
      isLogin: false,
      errorCode: action.payload.error
    };
  },

  LOGOUT: (state, action) => {
    return {
      isLogin: false
    };
  },

  REFRESH_ACCESS_TOKEN: (state, action) => {
    return state;
  },

  ACCESS_TOKEN_REFRESHED: (state, action) => {
    return {
      ...state,
      accessToken: action.payload,
      accessTokenRefreshing: false,
      accessTokenRefreshedAt: Date.now()
    };
  },

  UPDATE_APP_USER_DATA: (state, action) => {
    return {
      ...state,
      ...action.payload
    };
  },

  SAVE_APP_USER_IMAGE: (state, action) => {
    return {
      ...state,
      [action.payload.name]: action.payload.image
    };
  }
}, defaultState);
