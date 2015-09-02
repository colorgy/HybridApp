import { handleActions } from 'redux-actions';

export default handleActions({
  LOGIN: (state, action) => {
    return {
      isLogin: true
    };
  },
  LOGOUT: (state, action) => {
    return {
      isLogin: false
    };
  },
}, { isLogin: false });
