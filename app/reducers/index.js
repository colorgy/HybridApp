import { combineReducers } from 'redux';

import appUser from './appUser';
import appTab from './appTab';
import appPage from './appPage';

export default combineReducers({
  appUser,
  appTab,
  appPage
});
