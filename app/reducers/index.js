import { combineReducers } from 'redux';

import appUser from './appUser';
import appTab from './appTab';

export default combineReducers({
  appUser,
  appTab
});
