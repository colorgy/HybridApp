import { createSelector } from 'reselect';

const appUserIsLoginSelector = state => ({ isLogin: state.appUser.isLogin });

export default appUserIsLoginSelector;
