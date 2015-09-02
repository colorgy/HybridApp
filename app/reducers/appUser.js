import { handleActions } from 'redux-actions';

export default handleActions({
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
      isLogin: true,
      accessToken: action.payload
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
}, { isLogin: false });
