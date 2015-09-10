import { combineReducers } from 'redux';

import appUser from './appUser';
import appTab from './appTab';
import pageRouter from './pageRouter';
import table from './table';

export default combineReducers({
  appUser,
  appTab,
  pageRouter,
  table
});
