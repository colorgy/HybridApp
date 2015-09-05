import { handleActions } from 'redux-actions';

var defaultState = { appTabIndex: 0 };

export default handleActions({
  APP_TAB_CHANGE: (state, action) => {
    return {
      appTabIndex: action.payload
    };
  },

  LOGOUT: (state, action) => {
    return defaultState;
  }
}, defaultState);
