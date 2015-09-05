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
      isLogin: false,  // this should be set to true only until APP_USER_INITIAL_DATA_UPDATE_DONE
      accessToken: action.payload
    };
  },

  APP_USER_INITIAL_DATA_UPDATE_DONE: (state, action) => {
    return {
      ...state,
      isLogin: true
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
