import { handleActions } from 'redux-actions';

export default handleActions({
  APP_TAB_CHANGE: (state, action) => {
    return {
      appTabIndex: action.payload
    };
  }
}, { appTabIndex: 0 });
