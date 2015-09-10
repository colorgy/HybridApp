import { handleActions } from 'redux-actions';

var defaultState = {};

export default handleActions({
  APP_PAGE_NAVIGATE: (state, action) => {
    var key = action.payload.key;
    var path = action.payload.path;

    var history = state[`${key}History`] || ['/'];
    var newHistory = history.slice(0);

    newHistory.push(path);

    return {
      ...state,
      [`${key}History`]: newHistory
    };
  },

  APP_PAGE_BACK: (state, action) => {
    var key = action.payload.key;

    var history = state[`${key}History`] || ['/'];
    var newHistory = history.slice(0);

    if (newHistory.length > 1) newHistory.pop();

    return {
      ...state,
      [`${key}History`]: newHistory
    };
  },

  LOGOUT: (state, action) => {
    return defaultState;
  }
}, defaultState);
